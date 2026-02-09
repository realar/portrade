'use client';

import { useMockData } from '@/context/MockDataContext';
import { Package, Truck, Clock, CheckCircle, FileText, Building2, MapPin } from 'lucide-react';
import Price from '@/components/Price';
import Link from 'next/link';

export default function BuyerView() {
  const { user, organization, orders, groupBuys, products, loading } = useMockData();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const getStatus = (status: string) => {
    switch(status) {
      case 'delivered': return { text: 'Доставлен', icon: CheckCircle, class: 'bg-green-100 text-green-700' };
      case 'shipping': return { text: 'В пути', icon: Truck, class: 'bg-blue-100 text-blue-700' };
      case 'active': return { text: 'Активен', icon: Clock, class: 'bg-yellow-100 text-yellow-700' };
      default: return { text: 'Неизвестно', icon: Package, class: 'bg-gray-100 text-gray-700' };
    }
  };

  const myOrders = orders.filter(o => o.userId === user?.id);

  return (
    <div className="space-y-8">
      {/* Organization Profile (FNS Simulation) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-gray-400" />
            Профиль организации
          </h2>
          <span className="text-xs font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-100">
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
               <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
               {organization?.address || "г. Москва, ул. Ленина, д. 1, офис 101 (Данные из ЕГРЮЛ)"}
             </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Мои закупки</h2>
          <div className="text-sm text-gray-500">Активных заказов: <span className="font-medium text-gray-900">{myOrders.length}</span></div>
        </div>

        {myOrders.length > 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">№ Заказа</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Дата</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Товар</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Сумма</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Статус</th>
                    <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">Документы</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {myOrders.map((order) => {
                    const status = getStatus(order.status);
                    const StatusIcon = status.icon;
                    const gb = groupBuys.find(g => g.id === order.groupBuyId);
                    const product = gb ? products.find(p => p.id === gb.productId) : null;
                    
                    return (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 font-medium text-gray-900">{order.id}</td>
                        <td className="py-4 px-6 text-gray-600">{order.date}</td>
                        <td className="py-4 px-6 text-gray-900">
                           <Link href={`/product/${product?.id}`} className="font-medium hover:text-primary-600 transition-colors">
                              {product?.name || `Лот #${order.groupBuyId}`}
                           </Link>
                           <div className="text-xs text-gray-500">{order.quantity} шт.</div>
                        </td>
                        <td className="py-4 px-6 font-medium text-gray-900">
                           <Price amount={order.total} />
                        </td>
                        <td className="py-4 px-6">
                            <div className="flex flex-col gap-1">
                                <span className={`inline-flex w-fit items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.class}`}>
                                    <StatusIcon className="w-3.5 h-3.5" />
                                    {status.text}
                                </span>
                                {gb && (
                                    <div className="text-xs text-gray-400 pl-1">
                                        Сбор: {Math.round((gb.currentQuantity / gb.targetQuantity) * 100)}%
                                    </div>
                                )}
                            </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                           <button 
                             onClick={() => {
                                // Dynamic import or use the function if imported
                                import('@/utils/invoiceGenerator').then(({ generateInvoicePDF }) => {
                                   const doc = generateInvoicePDF(order, product, organization);
                                   // Open preview in new tab
                                   const pdfBlob = doc.output('blob');
                                   const url = URL.createObjectURL(pdfBlob);
                                   window.open(url, '_blank');
                                   // Ideally we would also trigger download or let user download from preview
                                   // But user asked for "preview AND download". Browser PDF viewer handles both.
                                });
                             }}
                             className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
                           >
                             <FileText className="w-4 h-4" />
                             Инвойс
                           </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-gray-500">История заказов пуста</p>
          </div>
        )}
      </div>
    </div>
  );
}
