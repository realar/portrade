'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import BuyerView from '@/components/dashboard/BuyerView';
import SupplierView from '@/components/dashboard/SupplierView';
import AdminView from '@/components/dashboard/AdminView';
import { User, Store, Shield } from 'lucide-react';

import { useMockData } from '@/context/MockDataContext';

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState<'buyer' | 'supplier' | 'admin'>('buyer');
  const { loginAs } = useMockData();

  useEffect(() => {
    loginAs(viewMode);
  }, [viewMode, loginAs]);

  const handleSwitchMode = (mode: 'buyer' | 'supplier' | 'admin') => {
      setViewMode(mode);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-[1400px] mx-auto py-10 px-6 md:px-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Личный кабинет</h1>
          <p className="text-gray-500">Управляйте своими заказами и настройками</p>
        </div>

        {/* Role Switcher */}
        <div className="bg-gray-100 p-1.5 rounded-xl inline-flex mb-10 overflow-x-auto max-w-full">
          <button
            onClick={() => handleSwitchMode('buyer')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              viewMode === 'buyer' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <User className="w-4 h-4" />
            Я покупатель
          </button>
          <button
            onClick={() => handleSwitchMode('supplier')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              viewMode === 'supplier' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Store className="w-4 h-4" />
            Я поставщик
          </button>
           <button
            onClick={() => handleSwitchMode('admin')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              viewMode === 'admin' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Shield className="w-4 h-4" />
            Админ
          </button>
        </div>

        {/* Content Area */}
        <div className="animate-in fade-in duration-300">
          {viewMode === 'buyer' && <BuyerView />}
          {viewMode === 'supplier' && <SupplierView />}
          {viewMode === 'admin' && <AdminView />}
        </div>
      </main>
    </div>
  );
}
