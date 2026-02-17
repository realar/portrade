'use client';

import { useMockData } from '@/context/MockDataContext';
import { TrendingUp, Users, Package, AlertCircle, Upload, Plus } from 'lucide-react';
import Price from '@/components/Price';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import EditProductModal from '@/components/modals/EditProductModal';
import { Product } from '@/context/MockDataContext';

export default function SupplierView() {
  const { products, importProducts, groupBuys, factories, updateProduct } = useMockData();
  const [isImporting, setIsImporting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const router = useRouter();

  const stats = [
    { label: 'Продажи за месяц', value: <Price amount={145200} />, change: '+12%', icon: TrendingUp, class: 'bg-green-50 text-green-600' },
    { label: 'Активные товары', value: products.length, change: '+0', icon: Package, class: 'bg-blue-50 text-blue-600' },
    { label: 'Новые клиенты', value: '18', change: '+5', icon: Users, class: 'bg-purple-50 text-purple-600' },
  ];

  const handleImport = () => {
    setIsImporting(true);
    setTimeout(() => {
      importProducts([
        { id: Date.now(), name: 'Новый Товар (Импорт)', category: 'Электроника', price: 5000, factoryId: 'fac-1' },
        { id: Date.now() + 1, name: 'Аксессуар (Импорт)', category: 'Электроника', price: 1500, factoryId: 'fac-1' },
      ]);
      setIsImporting(false);
    }, 1500);
  };

  const handleSaveProduct = (updatedProduct: Product) => {
    updateProduct(updatedProduct);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${stat.class}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">{stat.change}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Factories */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Мои фабрики</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {factories.map(factory => {
            const activeGB = groupBuys.find(g => g.factoryId === factory.id && g.status === 'open');
            const factoryProducts = products.filter(p => p.factoryId === factory.id);
            const progress = activeGB ? Math.min(Math.round((activeGB.currentQuantity / activeGB.targetQuantity) * 100), 100) : 0;
            return (
              <Link key={factory.id} href={`/factory/${factory.id}`} className="bg-white p-5 rounded-xl border border-gray-200 hover:border-primary-200 hover:shadow-sm transition-all">
                <h3 className="font-semibold text-gray-900 mb-1">{factory.name}</h3>
                <p className="text-xs text-gray-500 mb-3">Товаров: {factoryProducts.length} · Бренды: {(factory.brands || []).join(', ')}</p>
                {activeGB && (
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Закупка #{activeGB.id}</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-500 rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Active Group Buys */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Активные сборы</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Лот</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Фабрика</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Прогресс сбора</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Дедлайн</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {groupBuys.map((gb) => {
                const factory = factories.find(f => f.id === gb.factoryId);
                const progress = Math.min(Math.round((gb.currentQuantity / gb.targetQuantity) * 100), 100);
                
                return (
                  <tr 
                    key={gb.id} 
                    onClick={() => router.push(`/group-buy/${gb.id}`)}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="py-4 px-6 font-medium text-gray-900">#{gb.id}</td>
                    <td className="py-4 px-6 text-gray-600">{factory?.name || 'Unknown'}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden w-24">
                          <div 
                            className={`h-full rounded-full ${progress >= 100 ? 'bg-green-500' : 'bg-primary-500'}`} 
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-700">{progress}%</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{gb.currentQuantity} из {gb.targetQuantity} шт.</div>
                    </td>
                    <td className="py-4 px-6 text-gray-600 text-sm">{gb.deadline}</td>
                    <td className="py-4 px-6">
                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                          ${gb.status === 'open' ? 'bg-blue-50 text-blue-700' : ''}
                          ${gb.status === 'closed' ? 'bg-purple-50 text-purple-700' : ''}
                          ${['shipping', 'delivered'].includes(gb.status) ? 'bg-green-50 text-green-700' : ''}
                       `}>
                          {gb.status === 'open' ? 'Идет сбор' : gb.status}
                       </span>
                    </td>
                  </tr>
                );
              })}
              {groupBuys.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">Нет активных сборов</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Products List */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Мои товары</h2>
          <div className="flex gap-3">
             <button 
                onClick={handleImport}
                disabled={isImporting}
                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
             >
                <Upload className="w-4 h-4" />
                {isImporting ? 'Загрузка...' : 'Импорт из Excel'}
             </button>
             <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Добавить товар
             </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Название</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Фабрика</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Цена</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => {
                const factory = factories.find(f => f.id === product.factoryId);
                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 font-medium text-gray-900">
                      <Link href={`/product/${product.id}`} className="hover:text-primary-600 transition-colors">
                        {product.name}
                      </Link>
                    </td>
                    <td className="py-4 px-6 text-gray-600 text-sm">{factory?.name || '-'}</td>
                    <td className="py-4 px-6 text-gray-600"><Price amount={product.price} /></td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => setEditingProduct(product)}
                        className="text-gray-400 hover:text-gray-600 font-medium text-sm"
                      >
                        Изменить
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {editingProduct && (
        <EditProductModal 
          product={editingProduct} 
          onClose={() => setEditingProduct(null)} 
          onSave={handleSaveProduct} 
        />
      )}
    </div>
  );
}
