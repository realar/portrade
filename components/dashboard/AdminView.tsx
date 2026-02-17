'use client';

import { useMockData, GroupBuyStatus } from '@/context/MockDataContext';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminView() {
  const { groupBuys, factories, suppliers, updateGroupBuyStatus } = useMockData();
  const router = useRouter();

  const statuses: GroupBuyStatus[] = ['open', 'closed', 'awaiting_payment', 'paid', 'shipping', 'customs', 'delivered'];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
         <div>
            <h2 className="text-xl font-semibold text-gray-900">Управление платформой</h2>
            <p className="text-sm text-gray-500">Модерация сборов и управление статусами</p>
         </div>
         <div className="bg-white border border-gray-300 rounded-lg px-3 py-2 flex items-center gap-2 text-sm text-gray-500 w-64">
            <Search className="w-4 h-4" />
            <input placeholder="Поиск по ID лота..." className="outline-none" />
         </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Лот ID</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Фабрика</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Прогресс</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Текущий статус</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Управление статусом</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {groupBuys.map((gb) => {
              const factory = factories.find(f => f.id === gb.factoryId);
              const supplier = factory ? suppliers.find(s => s.id === factory.supplierId) : null;
              return (
                <tr 
                    key={gb.id} 
                    onClick={() => router.push(`/dashboard/group-buy/${gb.id}`)}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-6 font-medium text-gray-900">#{gb.id}</td>
                  <td className="py-4 px-6 text-gray-600">
                    {factory ? (
                      <div>
                        <Link 
                          href={`/factory/${factory.id}`} 
                          onClick={(e) => e.stopPropagation()}
                          className="hover:text-primary-600 transition-colors font-medium"
                        >
                          {factory.name}
                        </Link>
                        <div className="text-xs text-gray-400">{supplier?.name}</div>
                      </div>
                    ) : 'Unknown'}
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    <div className="flex items-center gap-2 text-xs">
                        <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                             <div 
                                className="h-full bg-primary-500 rounded-full" 
                                style={{ width: `${Math.min((gb.currentQuantity / gb.targetQuantity) * 100, 100)}%`}}
                             />
                        </div>
                        {gb.currentQuantity} / {gb.targetQuantity}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                      {gb.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                     <select 
                        value={gb.status}
                        onChange={(e) => updateGroupBuyStatus(gb.id, e.target.value as GroupBuyStatus)}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white border border-gray-300 rounded px-2 py-1 text-sm text-gray-700 hover:border-primary-500 cursor-pointer"
                     >
                        {statuses.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                     </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
