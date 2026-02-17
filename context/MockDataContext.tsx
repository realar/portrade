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

export interface Supplier {
  id: string;
  name: string;
  logo?: string;
  description: string;
  rating: number;
  completedDeals: number;
  country: string;
  reviewsCount?: number;
  followersCount?: number;
  registrationDate?: string;
  totalOrders?: number;
  skuCount?: number;
  lastSeen?: string;
  ratingHistory?: { month: string; rating: number }[];
  ratingBreakdown?: { stars: number; count: number }[];
}

export interface Factory {
  id: string;
  supplierId: string;
  name: string;
  description: string;
  image?: string;
  categories: string[];
  brands: string[];
  country?: string;
  city?: string;
  foundedYear?: number;
  employeesCount?: number;
  areaSqm?: number;
  annualTurnover?: string;
  mainProducts?: string[];
  certificates?: string[];
  rating?: number;
  reviewsCount?: number;
  responseRate?: number;
  moq?: string;
  leadTime?: string;
  images_gallery?: string[];
  followersCount?: number;
}

export interface Product {
  id: number;
  factoryId: string;
  name: string;
  category: string;
  price: number;
  currency?: string;
  stock?: number;
  images?: string[];
  minOrder?: number;
  tags?: string[];
  description?: string;
  specs?: { name: string; value: string }[];
  tieredPricing?: { minQty: number; maxQty: number; price: number }[];
  rating?: number;
  reviewsCount?: number;
  boughtCount?: number;
  shipping?: {
    country: string;
    city: string;
    method: string;
    leadTime: string;
  };
  minGroupBuyTarget?: number;
}

export type GroupBuyStatus = 'open' | 'closed' | 'awaiting_payment' | 'paid' | 'shipping' | 'customs' | 'delivered';

export interface GroupBuy {
  id: number;
  factoryId: string;
  productIds: number[];
  targetQuantity: number;
  maxVolume: number;
  currentQuantity: number;
  status: GroupBuyStatus;
  startDate: string;
  deadline: string;
  minDurationWeeks: number;
  autoExtendWeeks: number;
  title?: string;
  image?: string;
  description?: string;
  orgFee?: number;
  minAmount?: number;
  collectionDate?: string;
  deliveryDate?: string;
  viewsCount?: number;
}

export interface OrderItem {
  productId: number;
  quantity: number;
}

export interface Order {
  id: string;
  groupBuyId: number;
  userId: string;
  items: OrderItem[];
  total: number;
  date: string;
  status: 'active' | 'confirmed' | 'delivered';
}

export interface CartItem {
  productId: number;
  groupBuyId: number;
  quantity: number;
}

// --- Context ---

interface MockDataContextType {
  user: User | null;
  organization: Organization | null;
  suppliers: Supplier[];
  factories: Factory[];
  products: Product[];
  groupBuys: GroupBuy[];
  orders: Order[];
  cart: CartItem[];
  loading: boolean;
  
  // Actions
  loginAs: (role: UserRole) => void;
  addToCart: (productId: number, groupBuyId: number, quantity: number) => void;
  removeFromCart: (productId: number, groupBuyId: number) => void;
  updateCartQuantity: (productId: number, groupBuyId: number, quantity: number) => void;
  confirmCartGroupBuy: (groupBuyId: number) => Promise<void>;
  importProducts: (products: Product[]) => void;
  updateGroupBuyStatus: (id: number, status: GroupBuyStatus) => void;
  createGroupBuy: (data: Partial<GroupBuy>) => Promise<GroupBuy>;
  updateProduct: (product: Product) => void;
}

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

export function MockDataProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>({ id: 'u1', name: 'Иван Петров', role: 'buyer', orgId: 'o1' });
  const [organization, setOrganization] = useState<Organization | null>({ 
    id: 'o1', name: 'ООО "Вектор"', inn: '7700000000', type: 'buyer', balance: 0 
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [factories, setFactories] = useState<Factory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [groupBuys, setGroupBuys] = useState<GroupBuy[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { readCatalog } = await import('@/app/actions/catalog');
        const data = await readCatalog();
        setSuppliers(data.suppliers || []);
        setFactories(data.factories || []);
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

  // --- Cart Actions ---
  const addToCart = useCallback((productId: number, groupBuyId: number, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId && item.groupBuyId === groupBuyId);
      if (existing) {
        return prev.map(item => 
          item.productId === productId && item.groupBuyId === groupBuyId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId, groupBuyId, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number, groupBuyId: number) => {
    setCart(prev => prev.filter(item => !(item.productId === productId && item.groupBuyId === groupBuyId)));
  }, []);

  const updateCartQuantity = useCallback((productId: number, groupBuyId: number, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => !(item.productId === productId && item.groupBuyId === groupBuyId)));
      return;
    }
    setCart(prev => prev.map(item => 
      item.productId === productId && item.groupBuyId === groupBuyId
        ? { ...item, quantity }
        : item
    ));
  }, []);

  const confirmCartGroupBuy = useCallback(async (groupBuyId: number) => {
    if (!user) return;
    
    const cartItems = cart.filter(item => item.groupBuyId === groupBuyId);
    if (cartItems.length === 0) return;

    const gb = groupBuys.find(g => g.id === groupBuyId);
    if (!gb) return;

    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const orderItems: OrderItem[] = cartItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity
    }));

    const totalPrice = cartItems.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      groupBuyId,
      userId: user.id,
      items: orderItems,
      total: totalPrice,
      date: new Date().toISOString(),
      status: 'active'
    };

    const newQuantity = gb.currentQuantity + totalQuantity;
    const isComplete = newQuantity >= gb.maxVolume;
    const updatedGb: GroupBuy = {
      ...gb,
      currentQuantity: newQuantity,
      status: isComplete ? 'closed' : gb.status
    };

    // Optimistic updates
    setOrders(prev => [newOrder, ...prev]);
    setGroupBuys(prev => prev.map(g => g.id === groupBuyId ? updatedGb : g));
    setCart(prev => prev.filter(item => item.groupBuyId !== groupBuyId));

    // Server sync
    try {
      const { createOrder, updateGroupBuyAction } = await import('@/app/actions/catalog');
      await Promise.all([
        createOrder(newOrder),
        updateGroupBuyAction(updatedGb)
      ]);
    } catch (err) {
      console.error("Failed to sync order:", err);
    }
  }, [user, cart, groupBuys, products]);

  const importProducts = useCallback((newProducts: Product[]) => {
    setProducts(prev => [...prev, ...newProducts]);
  }, []);

  const updateGroupBuyStatus = useCallback(async (id: number, status: GroupBuyStatus) => {
    setGroupBuys(prev => prev.map(gb => gb.id === id ? { ...gb, status } : gb));
    try {
      const { updateGroupBuyStatusAction } = await import('@/app/actions/catalog');
      await updateGroupBuyStatusAction(id, status);
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  }, []);
  
  const createGroupBuy = useCallback(async (data: Partial<GroupBuy>) => {
    const newId = Math.max(...groupBuys.map(g => g.id), 0) + 1;
    const now = new Date();
    const deadline = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 2 weeks
    const newGb: GroupBuy = {
      id: newId,
      factoryId: data.factoryId || '',
      productIds: data.productIds || [],
      targetQuantity: data.targetQuantity || 100,
      maxVolume: data.maxVolume || 150,
      currentQuantity: 0,
      status: 'open',
      startDate: now.toISOString().split('T')[0],
      deadline: data.deadline || deadline.toISOString().split('T')[0],
      minDurationWeeks: 2,
      autoExtendWeeks: 1
    };
    
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
    user, organization, suppliers, factories, products, groupBuys, orders, cart, loading,
    loginAs, addToCart, removeFromCart, updateCartQuantity, confirmCartGroupBuy,
    importProducts, updateGroupBuyStatus, createGroupBuy, updateProduct
  }), [user, organization, suppliers, factories, products, groupBuys, orders, cart, loading,
    loginAs, addToCart, removeFromCart, updateCartQuantity, confirmCartGroupBuy,
    importProducts, updateGroupBuyStatus, createGroupBuy, updateProduct]);

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
