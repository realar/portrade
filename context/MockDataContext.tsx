'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';

// --- Types ---

export type UserRole = 'buyer' | 'supplier' | 'admin';

export interface Organization {
  id: string;
  name: string;
  inn: string;
  kpp?: string;
  address?: string;
  type: 'buyer' | 'supplier';
  balance: number;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  orgId?: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  currency: string;
  stock: number;
  factoryId: string;
  images?: string[];
  minOrder: number;
  tags?: string[]; // Added tags for filtering
  description?: string;
  specs?: { name: string; value: string }[];
  minGroupBuyTarget?: number;
}

export interface Factory {
  id: string;
  name: string;
  supplierId: string;
}

export type GroupBuyStatus = 'open' | 'closed' | 'awaiting_payment' | 'paid' | 'shipping' | 'customs' | 'delivered';

export interface GroupBuy {
  id: number;
  productId: number;
  targetQuantity: number;
  currentQuantity: number;
  status: GroupBuyStatus;
  deadline: string;
  price: number; // Price might be lower in bulk
}

export interface Order {
  id: string;
  groupBuyId: number;
  userId: string;
  quantity: number;
  total: number;
  date: string;
  status: 'active' | 'confirmed' | 'delivered'; // Simplified for user view
}

// --- Context ---

interface MockDataContextType {
  user: User | null;
  organization: Organization | null;
  products: Product[];
  groupBuys: GroupBuy[];
  orders: Order[];
  loading: boolean;
  
  // Actions
  loginAs: (role: UserRole) => void;
  joinGroupBuy: (groupBuyOrId: number | GroupBuy, quantity: number) => Promise<void>;
  importProducts: (products: Product[]) => void;
  updateGroupBuyStatus: (id: number, status: GroupBuyStatus) => void;
  createGroupBuy: (data: Partial<GroupBuy>) => Promise<GroupBuy>;
  updateProduct: (product: Product) => void;
}

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

export function MockDataProvider({ children }: { children: ReactNode }) {
  // Current session state
  const [user, setUser] = useState<User | null>({ id: 'u1', name: 'Иван Петров', role: 'buyer', orgId: 'o1' });
  const [organization, setOrganization] = useState<Organization | null>({ 
    id: 'o1', name: 'ООО "Вектор"', inn: '7700000000', type: 'buyer', balance: 0 
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [groupBuys, setGroupBuys] = useState<GroupBuy[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Load initial data from server
  useEffect(() => {
    const loadData = async () => {
      try {
        // dynamic import to avoid server-side issues if this runs in a weird context, 
        // though strictly 'use client' means this runs in browser. 
        // We need to call the server action.
        const { readCatalog } = await import('@/app/actions/catalog');
        const data = await readCatalog();
        setProducts(data.products || []);
        setGroupBuys(data.groupBuys || []);
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Failed to load catalog:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Wrap actions in useCallback to ensure referential stability
  const loginAs = useCallback((role: UserRole) => {
    if (role === 'buyer') {
      setUser({ id: 'u1', name: 'Иван Петров', role: 'buyer', orgId: 'o1' });
      setOrganization({ id: 'o1', name: 'ООО "Вектор"', inn: '7700000000', type: 'buyer', balance: 0 });
    } else if (role === 'supplier') {
      setUser({ id: 'u2', name: 'Chen Wei', role: 'supplier', orgId: 'o2' });
      setOrganization({ id: 'o2', name: 'Shenzhen Tech Ltd', inn: '', type: 'supplier', balance: 0 });
    } else {
      setUser({ id: 'u3', name: 'Admin', role: 'admin' });
      setOrganization(null);
    }
  }, []);

  const joinGroupBuy = useCallback(async (groupBuyOrId: number | GroupBuy, quantity: number) => {
    if (!user) return;
    
    let gb: GroupBuy | undefined;
    if (typeof groupBuyOrId === 'number') {
        gb = groupBuys.find(g => g.id === groupBuyOrId);
    } else {
        gb = groupBuyOrId;
    }

    if (!gb) return;

    const groupBuyId = gb.id;

    const newQuantity = gb.currentQuantity + quantity;
    const isComplete = newQuantity >= gb.targetQuantity;
    
    // Prepare updated GB
    const updatedGb: GroupBuy = { 
        ...gb, 
        currentQuantity: newQuantity,
        status: isComplete ? 'closed' : gb.status // Or 'awaiting_payment'
    };

    // Optimistic update
    const newOrder: Order = {
        id: `ord-${Date.now()}`,
        groupBuyId,
        userId: user.id,
        quantity,
        total: quantity * gb.price,
        date: new Date().toISOString(),
        status: 'active'
    };
    
    
    setOrders(prev => [newOrder, ...prev]);
    setGroupBuys(prev => prev.map(g => g.id === groupBuyId ? updatedGb : g));

    // Server update
    try {
        const { createOrder, updateGroupBuyAction } = await import('@/app/actions/catalog');
        
        await Promise.all([
            createOrder(newOrder),
            updateGroupBuyAction(updatedGb)
        ]);
        
    } catch (err) {
        console.error("Failed to sync group buy/order:", err);
    }
  }, [user, groupBuys]);

  const importProducts = useCallback((newProducts: Product[]) => {
    setProducts(prev => [...prev, ...newProducts]);
    // TODO: persist imported products
  }, []);

  const updateGroupBuyStatus = useCallback(async (id: number, status: GroupBuyStatus) => {
    // Optimistic
    setGroupBuys(prev => prev.map(gb => gb.id === id ? { ...gb, status } : gb));
    
    // Server
    try {
        const { updateGroupBuyStatusAction } = await import('@/app/actions/catalog');
        await updateGroupBuyStatusAction(id, status);
    } catch (err) {
        console.error("Failed to update status:", err);
    }
  }, []);
  
  const createGroupBuy = useCallback(async (data: Partial<GroupBuy>) => {
      const newId = Math.max(...groupBuys.map(g => g.id), 0) + 1;
      const newGb = {
          id: newId,
          productId: data.productId!,
          targetQuantity: data.targetQuantity || 100,
          currentQuantity: 0,
          status: 'open',
          deadline: data.deadline || '2024-12-31',
          price: data.price || 0
      } as GroupBuy;
      
      setGroupBuys(prev => [...prev, newGb]);
      
      try {
          const { createGroupBuyAction } = await import('@/app/actions/catalog');
          await createGroupBuyAction(newGb);
      } catch (err) {
          console.error("Failed to create group buy:", err);
      }
      return newGb;
  }, [groupBuys]);

  const updateProduct = useCallback(async (updatedProduct: Product) => {
      setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      
      try {
          const { updateProductAction } = await import('@/app/actions/catalog');
          await updateProductAction(updatedProduct);
      } catch (err) {
          console.error("Failed to update product:", err);
      }
  }, []);

  const value = useMemo(() => ({
      user, organization, products, groupBuys, orders, loading,
      loginAs, joinGroupBuy, importProducts, updateGroupBuyStatus, createGroupBuy, updateProduct
  }), [user, organization, products, groupBuys, orders, loading, loginAs, joinGroupBuy, importProducts, updateGroupBuyStatus, createGroupBuy, updateProduct]);

  return (
    <MockDataContext.Provider value={value}>
      {children}
    </MockDataContext.Provider>
  );
}

export function useMockData() {
  const context = useContext(MockDataContext);
  if (context === undefined) {
    throw new Error('useMockData must be used within a MockDataProvider');
  }
  return context;
}
