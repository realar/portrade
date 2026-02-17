import Header from '@/components/Header';
import ProductSection from '@/components/ProductSection';
import { readCatalog } from '@/app/actions/catalog';
import { Product } from '@/context/MockDataContext';

interface EnrichedProduct extends Product {
    groupBuy?: {
        id: number;
        participants: number;
        target: number;
        timeLeft: string;
        progress: number;
    }
}

export const dynamic = 'force-dynamic';

export default async function LastChancePage() {
  const catalog = await readCatalog();

  const enrichProducts = (productList: Product[]): EnrichedProduct[] => {
    return productList.map(p => {
      const gb = catalog.groupBuys.find(g => g.productIds.includes(p.id) && g.status === 'open');
      if (gb) {
        const remaining = gb.targetQuantity - gb.currentQuantity;
        const progress = Math.round((gb.currentQuantity / gb.targetQuantity) * 100);
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

  // Last chance = products in group buys that are >= 80% full
  const lastChanceProducts = enrichProducts(
    catalog.products.filter(p => {
      const gb = catalog.groupBuys.find(g => g.productIds.includes(p.id) && g.status === 'open');
      if (!gb) return false;
      return Math.round((gb.currentQuantity / gb.targetQuantity) * 100) >= 80;
    })
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-[1400px] mx-auto pb-20">
        <div className="px-6 md:px-12 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Последний шанс</h1>
          <p className="text-gray-600">Товары из закупок, которые скоро завершатся</p>
        </div>
        
        {lastChanceProducts.length > 0 ? (
          <ProductSection 
            title="" 
            products={lastChanceProducts}
            icon="fire"
          />
        ) : (
          <div className="px-6 md:px-12 py-20 text-center">
            <p className="text-gray-500 text-lg">Нет товаров из завершающихся закупок</p>
          </div>
        )}
      </main>
    </div>
  );
}
