import Header from '@/components/Header';
import Hero from '@/components/Hero';
import CategoryGrid from '@/components/CategoryGrid';
import ProductSection from '@/components/ProductSection';
import BannerCarousel from '@/components/BannerCarousel';
import { readCatalog } from '@/app/actions/catalog';
import { Product } from '@/context/MockDataContext';

interface EnrichedProduct extends Product {
    groupBuy?: {
        participants: number;
        target: number;
        timeLeft: string;
        progress: number;
    };
    isLastChance?: boolean;
}

// Disable caching to show real-time group buy updates
export const dynamic = 'force-dynamic';

export default async function Home() {
  const catalog = await readCatalog();
  
  // Helper: Check if group buy is in last 10% (by quantity remaining)
  const isLastChance = (gb: { currentQuantity: number; targetQuantity: number }): boolean => {
      const remaining = gb.targetQuantity - gb.currentQuantity;
      const percentRemaining = remaining / gb.targetQuantity;
      return percentRemaining < 0.1 && percentRemaining > 0; // Less than 10% remaining, but not complete
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

  // Auto-detect last chance products (open group buys with <10% quantity left)
  const lastChanceRaw = catalog.products.filter((p) => {
      const gb = catalog.groupBuys.find((g) => g.productId === p.id && g.status === 'open');
      return gb && isLastChance(gb);
  });
  
  // Popular products: ALL products except those in last chance
  const popularRaw = catalog.products.filter((p) => 
      !lastChanceRaw.some(lc => lc.id === p.id)
  );

  const popularProducts = enrichProducts(popularRaw).slice(0, 4); // Show only 4 items (one row)
  const lastChanceProducts = enrichProducts(lastChanceRaw);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-[1400px] mx-auto pb-20">
        {/* Promo Banners Section */}
        <div className="px-6 md:px-12 py-8">
           <BannerCarousel banners={catalog.banners} />
        </div>
        <CategoryGrid />

        <ProductSection 
          title="Последний шанс" 
          products={lastChanceProducts} 
          icon="fire" 
          showAllLink="/last-chance"
        />
        <ProductSection 
          title="Популярные товары" 
          products={popularProducts}
          showAllLink="/popular"
        />
      </main>
    </div>
  );
}
