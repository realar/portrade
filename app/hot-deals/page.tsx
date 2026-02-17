'use client';

import Header from '@/components/Header';
import GroupBuyCard from '@/components/GroupBuyCard';
import { useMockData } from '@/context/MockDataContext';
import { Flame } from 'lucide-react';

import Breadcrumbs from '@/components/Breadcrumbs';

export default function HotDealsPage() {
  const { groupBuys, factories, loading } = useMockData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  const hotDeals = groupBuys.filter(gb => {
    if (gb.status !== 'open') return false;
    const daysLeft = Math.ceil((new Date(gb.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const progress = Math.round((gb.currentQuantity / gb.targetQuantity) * 100);
    return daysLeft <= 3 || progress >= 80;
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-[1400px] mx-auto pb-20 pt-8 px-6 md:px-12">
        <Breadcrumbs items={[{ label: 'Горящие закупки' }]} className="mb-6" />
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Flame className="w-7 h-7 text-red-500 fill-red-500" />
            <h1 className="text-3xl font-bold text-gray-900">Горящие закупки</h1>
          </div>
          <p className="text-gray-600">Закупки, которые вот-вот завершатся. Успейте принять участие!</p>
        </div>

        {hotDeals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotDeals.map(gb => {
              const factory = factories.find(f => f.id === gb.factoryId);
              const progress = Math.min(Math.round((gb.currentQuantity / gb.targetQuantity) * 100), 100);

              return (
                <GroupBuyCard
                  key={gb.id}
                  id={gb.id}
                  title={gb.title}
                  factoryName={factory?.name || `Закупка #${gb.id}`}
                  progress={progress}
                  deadline={gb.deadline}
                  targetQuantity={gb.targetQuantity}
                  image={gb.image || factory?.image}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-2xl">
            <Flame className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Нет горящих закупок</h2>
            <p className="text-gray-500">Все закупки идут в штатном режиме. Загляните позже!</p>
          </div>
        )}
      </main>
    </div>
  );
}
