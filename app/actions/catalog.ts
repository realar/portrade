'use server';

import fs from 'fs/promises';
import path from 'path';
import { GroupBuy, Order, Product, GroupBuyStatus } from '@/context/MockDataContext';

import { Pool } from 'pg';

const DEFAULT_CATALOG_PATH = path.join(process.cwd(), 'data', 'catalog.json');
const CATALOG_PATH = process.env.DATA_FILE_PATH || DEFAULT_CATALOG_PATH;

// Postgres Connection
const pool = process.env.DATABASE_URL 
  ? new Pool({ 
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false } // Required for many hosted Postgres services (Render/Neon)
    }) 
  : null;

export interface Category {
  id: number;
  name: string;
  image: string;
}


export interface Banner {
  id: number;
    title: string;
    subtitle: string;
    buttonText: string;
    image: string;
    backgroundColor: string;
    circleColor: string;
    link: string;
}

export interface CatalogData {
  categories: Category[];
  banners: Banner[];
  products: Product[];
  groupBuys: GroupBuy[];
  orders: Order[];
}

// Database Helper
async function getCatalogFromDB(): Promise<CatalogData | null> {
  if (!pool) return null;
  try {
     // Ensure table exists
     await pool.query(`
        CREATE TABLE IF NOT EXISTS portrade_data (
            id SERIAL PRIMARY KEY,
            data JSONB NOT NULL
        );
     `);
     
     const res = await pool.query('SELECT data FROM portrade_data WHERE id = 1');
     if (res.rows.length > 0) {
       return res.rows[0].data;
     }
     return null;
  } catch (err) {
      console.error("DB Read Error:", err);
      // Fallback to null essentially means "try something else" or "init"
      return null;
  }
}

async function saveCatalogToDB(data: CatalogData) {
    if (!pool) return;
    try {
        // Upsert logic (id=1 is simpler to manage than single row constraint)
        const check = await pool.query('SELECT id FROM portrade_data WHERE id = 1');
        if (check.rows.length === 0) {
            await pool.query('INSERT INTO portrade_data (id, data) VALUES (1, $1)', [JSON.stringify(data)]);
        } else {
            await pool.query('UPDATE portrade_data SET data = $1 WHERE id = 1', [JSON.stringify(data)]);
        }
    } catch (err) {
        console.error("DB Save Error:", err);
        throw err;
    }
}

export async function readCatalog(): Promise<CatalogData> {
  // 1. Try DB if configured
  if (pool) {
      const dbData = await getCatalogFromDB();
      if (dbData) {
          return dbData;
      }
      // If DB is configured but empty (first run), we fall through to read local file as seed
      console.log("Database empty. Seeding from local file...");
  }

  // 2. Read Local File (also serves as seed source)
  try {
    // If using a custom path (Persistent Disk), check if it exists or seed it
    if (process.env.DATA_FILE_PATH) {
        try {
            await fs.access(CATALOG_PATH);
        } catch {
            // File does not exist, seed from default
            console.log(`Persistent storage mismatch. Seeding catalog from ${DEFAULT_CATALOG_PATH} to ${CATALOG_PATH}`);
            await fs.mkdir(path.dirname(CATALOG_PATH), { recursive: true });
            await fs.copyFile(DEFAULT_CATALOG_PATH, CATALOG_PATH);
        }
    }

    const data = await fs.readFile(CATALOG_PATH, 'utf-8');
    const parsedData = JSON.parse(data);

    // 3. If we just read from file BUT we have a DB connection (and it was empty), save it to DB now
    if (pool) {
        await saveCatalogToDB(parsedData);
        console.log("Seeded database from local file.");
    }
    
    return parsedData;

  } catch (error) {
    console.error('Error reading catalog:', error);
    throw new Error('Failed to read catalog data');
  }
}

export async function saveCatalog(data: CatalogData): Promise<void> {
  // 1. Save to DB if configured
  if (pool) {
      await saveCatalogToDB(data);
  }

  // 2. ALSO save to local file/disk if accessible, to keep them in sync or as backup
  // (Or if no DB, this is the only storage)
  // Note: On ephemeral file systems this write succeeds but is lost on restart.
  try {
    await fs.writeFile(CATALOG_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving local catalog:', error);
    // If we have DB, maybe local error is acceptable? 
    // If we DON'T have DB, this is critical.
    if (!pool) {
        throw new Error('Failed to save catalog data');
    }
  }
}

export async function createOrder(order: Order): Promise<void> {
  const data = await readCatalog();
  data.orders.push(order);
  
  // Update group buy current quantity
  const gbIndex = data.groupBuys.findIndex(g => g.id === order.groupBuyId);
  if (gbIndex !== -1) {
    data.groupBuys[gbIndex].currentQuantity += order.quantity;
  }
  
  await saveCatalog(data);
}

export async function updateGroupBuyStatusAction(id: number, status: string): Promise<void> {
    const data = await readCatalog();
    const gbIndex = data.groupBuys.findIndex(g => g.id === id);
    if (gbIndex !== -1) {
        // We trust the string input here or could validate it is one of the allowed values
        data.groupBuys[gbIndex].status = status as GroupBuyStatus;
        await saveCatalog(data);
    }
}

export async function createGroupBuyAction(groupBuy: GroupBuy): Promise<void> {
  const data = await readCatalog();
  data.groupBuys.push(groupBuy);
  await saveCatalog(data);
}

export async function updateProductAction(product: Product): Promise<void> {
    const data = await readCatalog();
    const index = data.products.findIndex(p => p.id === product.id);
    if (index !== -1) {
        data.products[index] = product;
        await saveCatalog(data);
    }
    if (index !== -1) {
        data.products[index] = product;
        await saveCatalog(data);
    }
}

export async function updateGroupBuyAction(groupBuy: GroupBuy): Promise<void> {
    const data = await readCatalog();
    const index = data.groupBuys.findIndex(gb => gb.id === groupBuy.id);
    if (index !== -1) {
        data.groupBuys[index] = groupBuy;
        await saveCatalog(data);
    }
}
