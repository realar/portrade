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
  const { products, importProducts, groupBuys, updateProduct } = useMockData();
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
    // Simulate Excel parsing delay
    setTimeout(() => {
        importProducts([
            { id: Date.now(), name: 'Новый Товар (Импорт)', category: 'Электроника', price: 5000, currency: 'RUB', stock: 100, factoryId: 'f1', minOrder: 10 },
            { id: Date.now() + 1, name: 'Аксессуар (Импорт)', category: 'Электроника', price: 1500, currency: 'RUB', stock: 500, factoryId: 'f1', minOrder: 20 },
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

      {/* Active Group Buys */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Активные сборы</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Лот</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Товар</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Прогресс сбора</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Дедлайн</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {groupBuys.map((gb) => {
                 // In a real app, filter by supplier's products. 
                 // Here we show all for simulation visibility or assume all mock products belong to this supplier.
                 const product = products.find(p => p.id === gb.productId);
                 const progress = Math.min(Math.round((gb.currentQuantity / gb.targetQuantity) * 100), 100);
                 
                 return (
                  <tr 
                      key={gb.id} 
                      onClick={() => router.push(`/dashboard/group-buy/${gb.id}`)}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="py-4 px-6 font-medium text-gray-900">
                        #{gb.id}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {product ? (
                        <Link 
                            href={`/product/${product.id}`} 
                            onClick={(e) => e.stopPropagation()}
                            className="hover:text-primary-600 transition-colors font-medium"
                        >
                          {product.name}
                        </Link>
                      ) : 'Unknown'}
                    </td>
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
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Цена</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Остаток</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Статус</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-900">
                    <Link href={`/product/${product.id}`} className="hover:text-primary-600 transition-colors">
                      {product.name}
                    </Link>
                  </td>
                  <td className="py-4 px-6 text-gray-600"><Price amount={product.price} /></td>
                  <td className="py-4 px-6 text-gray-600">{product.stock} шт.</td>
                  <td className="py-4 px-6">
                    {product.stock > 50 && <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">Активен</span>}
                    {product.stock <= 50 && product.stock > 0 && <span className="text-xs font-medium bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full flex items-center w-fit gap-1"><AlertCircle className="w-3 h-3"/> Мало</span>}
                    {product.stock === 0 && <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-1 rounded-full">Нет в наличии</span>}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={() => setEditingProduct(product)}
                      className="text-gray-400 hover:text-gray-600 font-medium text-sm"
                    >
                      Изменить
                    </button>
                  </td>
                </tr>
              ))}
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
