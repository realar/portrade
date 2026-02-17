'use client';

import { useMockData, GroupBuyStatus } from '@/context/MockDataContext';
import { notFound, useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Package, User, Clock, CheckCircle, Truck, FileText, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import Price from '@/components/Price';
import { useState, useMemo } from 'react';

export default function GroupBuyManagementPage() {
  const params = useParams();
  const router = useRouter();
  const { groupBuys, products, orders, factories, suppliers, updateGroupBuyStatus, user } = useMockData();
  const [isUpdating, setIsUpdating] = useState(false);

  const idParam = params?.id;
  const gbId = idParam ? parseInt(Array.isArray(idParam) ? idParam[0] : idParam) : null;

  const groupBuy = groupBuys.find(g => g.id === gbId);
  const factory = groupBuy ? factories.find(f => f.id === groupBuy.factoryId) : null;
  const supplier = factory ? suppliers.find(s => s.id === factory.supplierId) : null;
  const gbProducts = groupBuy ? products.filter(p => groupBuy.productIds.includes(p.id)) : [];
  
  const participants = useMemo(() => {
    if (!gbId) return [];
    return orders.filter(o => o.groupBuyId === gbId);
  }, [orders, gbId]);

  const totalCollected = participants.reduce((sum, order) => sum + order.total, 0);
  const uniqueBuyers = new Set(participants.map(p => p.userId)).size;
  const progressPercent = groupBuy ? Math.min(Math.round((groupBuy.currentQuantity / groupBuy.targetQuantity) * 100), 100) : 0;

  if (!groupBuy) {
    return notFound();
  }

  if (user?.role === 'buyer') {
     return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h1 className="text-xl font-bold mb-2">Доступ запрещен</h1>
                <p className="text-gray-500 mb-6">Эта страница доступна только для поставщиков.</p>
                <Link href="/dashboard" className="text-primary-600 hover:underline">Вернуться в кабинет</Link>
            </div>
        </div>
     );
  }

  const handleStatusChange = (newStatus: GroupBuyStatus) => {
      setIsUpdating(true);
      setTimeout(() => {
          updateGroupBuyStatus(groupBuy.id, newStatus);
          setIsUpdating(false);
      }, 800);
  };

  const statusOptions: { value: GroupBuyStatus; label: string; color: string }[] = [
      { value: 'open', label: 'Сбор открыт', color: 'bg-blue-100 text-blue-700' },
      { value: 'closed', label: 'Сбор завершен', color: 'bg-purple-100 text-purple-700' },
      { value: 'awaiting_payment', label: 'Ожидание оплаты', color: 'bg-yellow-100 text-yellow-700' },
      { value: 'paid', label: 'Оплачено', color: 'bg-green-100 text-green-700' },
      { value: 'shipping', label: 'Отгружено', color: 'bg-indigo-100 text-indigo-700' },
      { value: 'customs', label: 'Таможня', color: 'bg-orange-100 text-orange-700' },
      { value: 'delivered', label: 'Доставлено', color: 'bg-emerald-100 text-emerald-700' },
  ];

  const avgPrice = gbProducts.length > 0 ? gbProducts.reduce((s, p) => s + p.price, 0) / gbProducts.length : 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
                <ArrowLeft className="w-5 h-5 text-gray-500" />
            </button>
            <div>
                 <h1 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    {factory?.name || `Сбор #${groupBuy.id}`}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusOptions.find(o => o.value === groupBuy.status)?.color}`}>
                        {statusOptions.find(o => o.value === groupBuy.status)?.label}
                    </span>
                 </h1>
                 <p className="text-sm text-gray-500">{supplier?.name} · Управление и статистика</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <Link href={`/group-buy/${groupBuy.id}`} className="text-sm font-medium text-primary-600 hover:text-primary-700">
                Страница закупки
             </Link>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          
          {/* Status Control */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div>
                     <h2 className="text-lg font-semibold text-gray-900 mb-1">Статус сбора</h2>
                     <p className="text-sm text-gray-500">Измените статус для уведомления участников</p>
                 </div>
                 <div className="flex items-center gap-3">
                     <select 
                        value={groupBuy.status}
                        onChange={(e) => handleStatusChange(e.target.value as GroupBuyStatus)}
                        disabled={isUpdating}
                        className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm bg-gray-50 border"
                     >
                        {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                     </select>
                     {isUpdating && <div className="text-sm text-gray-500 animate-pulse">Обновление...</div>}
                 </div>
             </div>
             
             <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">Прогресс выполнения</span>
                    <span className="text-gray-500">{groupBuy.currentQuantity} из {groupBuy.targetQuantity} шт. ({progressPercent}%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-500 ${progressPercent >= 100 ? 'bg-green-500' : 'bg-primary-500'}`}
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
                <div className="text-xs text-gray-500 mt-1">Макс. объём: {groupBuy.maxVolume} шт.</div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Products + Participants */}
              <div className="lg:col-span-2 space-y-6">
                {/* Products in group buy */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-4">Товары в закупке ({gbProducts.length})</h3>
                  <div className="space-y-3">
                    {gbProducts.map(product => (
                      <div key={product.id} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                        <div className="w-12 h-12 bg-white rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <Link href={`/product/${product.id}`} className="font-medium text-gray-900 hover:text-primary-600 text-sm">{product.name}</Link>
                          <div className="text-xs text-gray-500"><Price amount={product.price} /> / шт.</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Participants */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Участники сбора ({participants.length})</h3>
                    <button className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        Выгрузить список
                    </button>
                  </div>
                  
                  {participants.length > 0 ? (
                      <div className="overflow-x-auto">
                          <table className="w-full text-sm text-left">
                              <thead className="bg-gray-50 text-gray-500 font-medium">
                                  <tr>
                                      <th className="py-3 px-4">ID Заказа</th>
                                      <th className="py-3 px-4">Покупатель</th>
                                      <th className="py-3 px-4">Товары</th>
                                      <th className="py-3 px-4">Сумма</th>
                                      <th className="py-3 px-4">Дата</th>
                                      <th className="py-3 px-4">Статус</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                  {participants.map(order => (
                                      <tr key={order.id} className="group hover:bg-gray-50">
                                          <td className="py-3 px-4 font-medium text-gray-900 text-xs">{order.id.slice(-8)}</td>
                                          <td className="py-3 px-4 text-gray-600">
                                              <div className="flex items-center gap-2">
                                                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                                                      <User className="w-3 h-3" />
                                                  </div>
                                                  {order.userId}
                                              </div>
                                          </td>
                                          <td className="py-3 px-4 text-gray-600">
                                            {order.items.map(item => {
                                              const p = products.find(prod => prod.id === item.productId);
                                              return <div key={item.productId} className="text-xs">{p?.name || `#${item.productId}`} × {item.quantity}</div>;
                                            })}
                                          </td>
                                          <td className="py-3 px-4 font-medium text-gray-900">
                                              <Price amount={order.total} />
                                          </td>
                                          <td className="py-3 px-4 text-gray-500 text-xs">{new Date(order.date).toLocaleDateString('ru')}</td>
                                          <td className="py-3 px-4">
                                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                  Активен
                                              </span>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  ) : (
                      <div className="text-center py-8 text-gray-500 bg-gray-50">
                          Пока нет участников
                      </div>
                  )}
                </div>
              </div>

              {/* Stats Sidebar */}
              <div className="space-y-6">
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                      <h3 className="font-semibold text-gray-900 mb-4">Финансы</h3>
                      <div className="space-y-4">
                          <div>
                              <div className="text-sm text-gray-500 mb-1">Собрано средств</div>
                              <div className="text-2xl font-bold text-gray-900">
                                  <Price amount={totalCollected} />
                              </div>
                          </div>
                          <div className="pt-4 border-t border-gray-100">
                              <div className="text-sm text-gray-500 mb-1">Ожидаемая выручка</div>
                              <div className="text-lg font-medium text-gray-900">
                                  <Price amount={groupBuy.targetQuantity * avgPrice} />
                              </div>
                              <div className="text-xs text-green-600 mt-1">
                                  Осталось собрать: <Price amount={Math.max(0, (groupBuy.targetQuantity * avgPrice) - totalCollected)} />
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                      <h3 className="font-semibold text-gray-900 mb-4">Детали</h3>
                      <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                              <span className="text-gray-500">Дата начала</span>
                              <span className="text-gray-900">{groupBuy.startDate}</span>
                          </div>
                          <div className="flex justify-between">
                              <span className="text-gray-500">Дедлайн</span>
                              <span className="text-gray-900">{groupBuy.deadline}</span>
                          </div>
                          <div className="flex justify-between">
                              <span className="text-gray-500">Участников</span>
                              <span className="text-gray-900">{uniqueBuyers}</span>
                          </div>
                          <div className="flex justify-between">
                              <span className="text-gray-500">Минималка</span>
                              <span className="text-gray-900">{groupBuy.targetQuantity} шт.</span>
                          </div>
                          <div className="flex justify-between">
                              <span className="text-gray-500">Макс. объём</span>
                              <span className="text-gray-900">{groupBuy.maxVolume} шт.</span>
                          </div>
                      </div>
                  </div>
                  
                  {groupBuy.status === 'open' && (
                      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
                          <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
                          <div>
                              <h4 className="font-medium text-blue-900 text-sm">Сбор активен</h4>
                              <p className="text-xs text-blue-700 mt-1">
                                  Не забудьте обновить статус после закрытия.
                              </p>
                          </div>
                      </div>
                  )}
              </div>
          </div>
      </main>
    </div>
  );
}
