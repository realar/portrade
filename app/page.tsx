import Header from '@/components/Header';
import BannerCarousel from '@/components/BannerCarousel';
import GroupBuyCard from '@/components/GroupBuyCard';
import CatalogBlock from '@/components/Catalog/CatalogBlock';
import { readCatalog } from '@/app/actions/catalog';
import { Product } from '@/context/MockDataContext';
import CategoryRow from '@/components/CategoryRow';
import Link from 'next/link';
import { Flame, ArrowRight } from 'lucide-react';

interface EnrichedProduct extends Product {
    groupBuy?: {
        id: number;
        participants: number;
        target: number;
        timeLeft: string;
        progress: number;
    };
    isLastChance?: boolean;
    timeLeft?: string;
}

export const dynamic = 'force-dynamic';

export default async function Home() {
  const catalog = await readCatalog();

  // Enrich products with group buy info for display
  const enrichProducts = (productList: Product[]): EnrichedProduct[] => {
    return productList.map(p => {
      const gb = catalog.groupBuys.find((g) => g.productIds.includes(p.id) && g.status === 'open');
      if (gb) {
        const remaining = gb.targetQuantity - gb.currentQuantity;
        const progress = Math.min(Math.round((gb.currentQuantity / gb.targetQuantity) * 100), 100);
        return {
          ...p,
          timeLeft: remaining > 0 ? `${remaining} шт` : undefined,
          isLastChance: progress >= 80,
          groupBuy: {
            id: gb.id,
            participants: Math.floor(gb.currentQuantity / 10 + 50),
            target: gb.targetQuantity,
            timeLeft: gb.deadline,
            progress
          }
        };
      }
      return { ...p, timeLeft: undefined, isLastChance: false };
    });
  };

  // Hot deals: group buys close to deadline or nearly full
  const hotDeals = catalog.groupBuys.filter(gb => {
    if (gb.status !== 'open') return false;
    const daysLeft = Math.ceil((new Date(gb.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const progress = Math.round((gb.currentQuantity / gb.targetQuantity) * 100);
    return daysLeft <= 3 || progress >= 80;
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-[1400px] mx-auto pb-20">
        {/* Promo Banners */}
        <div className="px-6 md:px-12 py-8 space-y-8">
           <CategoryRow categories={catalog.categories} />
           <BannerCarousel banners={catalog.banners} />
        </div>

        {/* Hot Deals Section */}
        {hotDeals.length > 0 && (
          <section className="px-6 md:px-12 py-8 border-b border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Flame className="w-6 h-6 text-red-500 fill-red-500" />
                <h2 className="text-2xl font-bold text-gray-900">Горящие закупки</h2>
              </div>
              <Link href="/hot-deals" className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1">
                Все горящие <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotDeals.slice(0, 3).map(gb => {
                const factory = catalog.factories.find(f => f.id === gb.factoryId);
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
                    leadTime={factory?.leadTime}
                  />
                );
              })}
            </div>
          </section>
        )}

        {/* Catalog Blocks - Saturated View */}
        <div className="px-6 md:px-12 space-y-4">
            {catalog.categories.map(category => {
                // Filter products for this category
                const categoryProducts = enrichProducts(
                    catalog.products.filter(p => p.category === category.id)
                );
                
                // Show block only if there are products
                if (categoryProducts.length === 0) return null;

                return (
                    <CatalogBlock 
                        key={category.id} 
                        category={category} 
                        products={categoryProducts} 
                    />
                );
            })}
        </div>

      </main>
    </div>
  );
}
