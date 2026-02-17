'use server';

import fs from 'fs/promises';
import path from 'path';
import { GroupBuy, Order, Product, GroupBuyStatus, Supplier, Factory } from '@/context/MockDataContext';

import { Pool } from 'pg';

const DEFAULT_CATALOG_PATH = path.join(process.cwd(), 'data', 'catalog.json');
const CATALOG_PATH = process.env.DATA_FILE_PATH || DEFAULT_CATALOG_PATH;

const pool = process.env.DATABASE_URL 
  ? new Pool({ 
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    }) 
  : null;

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface Banner {
  id: number;
  title: string;
  subtitle: string;
  buttonText: string;
  image: string;
  bgColor: string;
  link: string;
}

export interface CatalogData {
  categories: Category[];
  banners: Banner[];
  suppliers: Supplier[];
  factories: Factory[];
  products: Product[];
  groupBuys: GroupBuy[];
  orders: Order[];
}

// Database Helper
async function getCatalogFromDB(): Promise<CatalogData | null> {
  if (!pool) return null;
  try {
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
    return null;
  }
}

async function saveCatalogToDB(data: CatalogData) {
  if (!pool) return;
  try {
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
  if (pool) {
    const dbData = await getCatalogFromDB();
    if (dbData) return dbData;
    console.log("Database empty. Seeding from local file...");
  }

  try {
    if (process.env.DATA_FILE_PATH) {
      try {
        await fs.access(CATALOG_PATH);
      } catch {
        console.log(`Seeding catalog from ${DEFAULT_CATALOG_PATH} to ${CATALOG_PATH}`);
        await fs.mkdir(path.dirname(CATALOG_PATH), { recursive: true });
        await fs.copyFile(DEFAULT_CATALOG_PATH, CATALOG_PATH);
      }
    }

    const data = await fs.readFile(CATALOG_PATH, 'utf-8');
    const parsedData = JSON.parse(data);

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
  if (pool) {
    await saveCatalogToDB(data);
  }

  try {
    await fs.writeFile(CATALOG_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving local catalog:', error);
    if (!pool) {
      throw new Error('Failed to save catalog data');
    }
  }
}

export async function createOrder(order: Order): Promise<void> {
  const data = await readCatalog();
  data.orders.push(order);
  
  const gbIndex = data.groupBuys.findIndex(g => g.id === order.groupBuyId);
  if (gbIndex !== -1) {
    const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
    data.groupBuys[gbIndex].currentQuantity += totalQuantity;
    
    // Auto-close if maxVolume reached
    if (data.groupBuys[gbIndex].currentQuantity >= data.groupBuys[gbIndex].maxVolume) {
      data.groupBuys[gbIndex].status = 'closed';
    }
  }
  
  await saveCatalog(data);
}

export async function updateGroupBuyStatusAction(id: number, status: string): Promise<void> {
  const data = await readCatalog();
  const gbIndex = data.groupBuys.findIndex(g => g.id === id);
  if (gbIndex !== -1) {
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
}

export async function updateGroupBuyAction(groupBuy: GroupBuy): Promise<void> {
  const data = await readCatalog();
  const index = data.groupBuys.findIndex(gb => gb.id === groupBuy.id);
  if (index !== -1) {
    data.groupBuys[index] = groupBuy;
    await saveCatalog(data);
  }
}
