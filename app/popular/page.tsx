import Header from '@/components/Header';
import ProductSection from '@/components/ProductSection';
import { readCatalog } from '@/app/actions/catalog';
import { Product } from '@/context/MockDataContext';

interface EnrichedProduct extends Product {
    groupBuy?: {
        participants: number;
        target: number;
        timeLeft: string;
        progress: number;
    }
}

// Disable caching to show real-time group buy updates
export const dynamic = 'force-dynamic';

export default async function PopularPage() {
  const catalog = await readCatalog();
  
  // Helper: Check if group buy is in last 10% (by quantity remaining)
  const isLastChance = (gb: { currentQuantity: number; targetQuantity: number }): boolean => {
      const remaining = gb.targetQuantity - gb.currentQuantity;
      const percentRemaining = remaining / gb.targetQuantity;
      return percentRemaining < 0.1 && percentRemaining > 0;
  };

  // Combine product data with group buy info for display
  const enrichProducts = (products: Product[]): EnrichedProduct[] => {
      return products.map(p => {
          const gb = catalog.groupBuys.find((g) => g.productId === p.id && g.status === 'open');
          if (gb) {
              const remaining = gb.targetQuantity - gb.currentQuantity;
              return {
                  ...p,
                  timeLeft: remaining > 0 ? `${remaining} шт` : undefined,
                  isLastChance: isLastChance(gb),
                  groupBuy: {
                      participants: Math.floor(gb.currentQuantity / 10 + 50),
                      target: gb.targetQuantity,
                      timeLeft: gb.deadline,
                      progress: Math.min(Math.round((gb.currentQuantity / gb.targetQuantity) * 100), 100)
                  }
              };
          }
          return { ...p, timeLeft: undefined, isLastChance: false };
      });
  };

  // Get last chance products
  const lastChanceRaw = catalog.products.filter((p) => {
      const gb = catalog.groupBuys.find((g) => g.productId === p.id && g.status === 'open');
      return gb && isLastChance(gb);
  });
  
  // Popular products: ALL products except those in last chance
  const popularRaw = catalog.products.filter((p) => 
      !lastChanceRaw.some(lc => lc.id === p.id)
  );

  const popularProducts = enrichProducts(popularRaw);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-[1400px] mx-auto pb-20">
        <div className="px-6 md:px-12 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Популярные товары</h1>
          <p className="text-gray-600">Все товары из нашего каталога</p>
        </div>
        
        <ProductSection 
          title="" 
          products={popularProducts} 
        />
      </main>
    </div>
  );
}
