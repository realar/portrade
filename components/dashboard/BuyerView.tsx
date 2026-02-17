'use client';

import { useMockData } from '@/context/MockDataContext';
import { Package, Truck, Clock, CheckCircle, FileText, Building2, MapPin, ChevronRight, AlertCircle, ShoppingBag } from 'lucide-react';
import Price from '@/components/Price';
import Link from 'next/link';

export default function BuyerView() {
  const { user, organization, orders, groupBuys, products, factories, suppliers, loading } = useMockData();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  const getStatus = (status: string) => {
    switch(status) {
      case 'delivered': return { text: 'Доставлен', icon: CheckCircle, class: 'bg-green-100 text-green-700' };
      case 'shipping': return { text: 'В пути', icon: Truck, class: 'bg-blue-100 text-blue-700' };
      case 'active': return { text: 'Активен', icon: Clock, class: 'bg-yellow-100 text-yellow-700' };
      case 'paid': return { text: 'Оплачен', icon: CheckCircle, class: 'bg-emerald-100 text-emerald-700' };
      case 'awaiting_payment': return { text: 'Ожидает оплаты', icon: AlertCircle, class: 'bg-orange-100 text-orange-700' };
      default: return { text: 'Обработка', icon: Package, class: 'bg-gray-100 text-gray-700' };
    }
  };

  const myOrders = orders.filter(o => o.userId === user?.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-8 pb-12">
      {/* Organization Profile */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-gray-400" />
            Профиль организации
          </h2>
          <span className="text-xs font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-100 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Данные подтверждены по ФНС
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Название организации</label>
            <div className="text-sm font-medium text-gray-900">{organization?.name}</div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">ИНН</label>
            <div className="text-sm font-medium text-gray-900">{organization?.inn}</div>
          </div>
           {organization?.kpp && (
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">КПП</label>
              <div className="text-sm font-medium text-gray-900">{organization.kpp}</div>
            </div>
          )}
          <div className="md:col-span-3">
             <label className="block text-xs font-medium text-gray-500 mb-1">Юридический адрес</label>
             <div className="flex items-start gap-2 text-sm text-gray-900">
               <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
               {organization?.address || "г. Москва, ул. Ленина, д. 1, офис 101"}
             </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Мои закупки</h2>
          <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            Активных участий: <span className="font-bold text-gray-900">{myOrders.length}</span>
          </div>
        </div>

        {myOrders.length > 0 ? (
          <div className="space-y-6">
            {myOrders.map((order) => {
              const status = getStatus(order.status);
              const StatusIcon = status.icon;
              const gb = groupBuys.find(g => g.id === order.groupBuyId);
              const factory = gb ? factories.find(f => f.id === gb.factoryId) : null;
              const supplier = factory ? suppliers.find(s => s.id === factory.supplierId) : null;
              
              const progress = gb ? Math.round((gb.currentQuantity / gb.targetQuantity) * 100) : 0;
              const isCompleted = progress >= 100;

              return (
                <div key={order.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* Card Header */}
                  <div className="border-b border-gray-100 bg-gray-50/50 p-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-gray-400">
                        {factory?.image ? (
                          <img src={factory.image} alt={factory.name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <Building2 className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                           <h3 className="font-bold text-gray-900">
                             {factory?.name || `Закупка #${order.groupBuyId}`}
                           </h3>
                           <span className="text-gray-400 text-xs">•</span>
                           <span className="text-sm text-gray-500">{supplier?.name}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          Заказ от {new Date(order.date).toLocaleDateString('ru')} • № {order.id}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                       <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.class}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {status.text}
                       </span>
                       <button 
                         onClick={() => {
                           import('@/utils/invoiceGenerator').then(({ generateInvoicePDF }) => {
                             const firstProduct = order.items[0] ? products.find(p => p.id === order.items[0].productId) : null;
                             const doc = generateInvoicePDF(order, firstProduct, organization);
                             const pdfBlob = doc.output('blob');
                             const url = URL.createObjectURL(pdfBlob);
                             window.open(url, '_blank');
                           });
                         }}
                         className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                         title="Скачать инвойс"
                       >
                         <FileText className="w-5 h-5" />
                       </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-8">
                       {/* Left Column: Items */}
                       <div className="flex-grow space-y-4">
                          <h4 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">Состав заказа</h4>
                          <div className="space-y-3">
                            {order.items.map((item) => {
                               const product = products.find(p => p.id === item.productId);
                               return (
                                 <div key={item.productId} className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden border border-gray-200">
                                       {product?.images?.[0] ? (
                                         <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                       ) : (
                                         <ShoppingBag className="w-5 h-5 text-gray-400 m-auto mt-3.5" />
                                       )}
                                    </div>
                                    <div className="flex-grow">
                                       <Link href={`/product/${item.productId}`} className="font-medium text-gray-900 hover:text-primary-600 transition-colors line-clamp-1">
                                          {product?.name || `Товар #${item.productId}`}
                                       </Link>
                                       <div className="text-xs text-gray-500 mt-0.5">
                                          {item.quantity} шт. × <Price amount={product?.price || 0} />
                                       </div>
                                    </div>
                                    <div className="text-sm font-medium text-gray-900">
                                       <Price amount={(product?.price || 0) * item.quantity} />
                                    </div>
                                 </div>
                               );
                            })}
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                             <span className="text-sm text-gray-500 font-medium">Итого к оплате:</span>
                             <span className="text-lg font-bold text-gray-900"><Price amount={order.total} /></span>
                          </div>
                       </div>

                       {/* Right Column: Group Buy Info */}
                       <div className="lg:w-72 flex-shrink-0 bg-gray-50 rounded-xl p-5 border border-gray-100 h-fit">
                          <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                             <Clock className="w-4 h-4 text-primary-600" />
                             Статус сбора
                          </h4>
                          
                          {gb ? (
                              <div className="space-y-4">
                                 <div>
                                    <div className="flex justify-between text-xs mb-1.5">
                                       <span className="text-gray-600">Собрано</span>
                                       <span className="font-medium text-gray-900">{progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                       <div 
                                          className={`h-2 rounded-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-primary-500'}`} 
                                          style={{ width: `${Math.min(progress, 100)}%` }}
                                       ></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500 mt-1.5">
                                       <span>{gb.currentQuantity} шт.</span>
                                       <span>Цель: {gb.targetQuantity}</span>
                                    </div>
                                 </div>

                                 <div className="pt-4 border-t border-gray-200">
                                    <div className="flex justify-between items-center text-sm mb-2">
                                       <span className="text-gray-500">Дедлайн:</span>
                                       <span className="font-medium text-gray-900">{new Date(gb.deadline).toLocaleDateString('ru')}</span>
                                    </div>
                                    <Link 
                                       href={`/group-buy/${gb.id}`}
                                       className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 hover:border-primary-500 hover:text-primary-600 text-gray-700 font-medium py-2 px-4 rounded-lg text-sm transition-all"
                                    >
                                       Страница закупки
                                       <ChevronRight className="w-4 h-4" />
                                    </Link>
                                 </div>
                              </div>
                          ) : (
                              <div className="text-sm text-gray-500">Информация о сборе недоступна</div>
                          )}
                       </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center bg-gray-50 rounded-xl border border-gray-200 border-dashed">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                 <ShoppingBag className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">История заказов пуста</h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">Вы еще не участвовали ни в одной закупке. Перейдите в каталог, чтобы найти выгодные предложения.</p>
              <Link href="/catalog" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                 Перейти в каталог
              </Link>
          </div>
        )}
      </div>
    </div>
  );
}
