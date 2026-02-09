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
    }
}

export default async function Home() {
  const catalog = await readCatalog();
  
  // Combine product data with group buy info for display
  const enrichProducts = (products: Product[]): EnrichedProduct[] => {
      return products.map(p => {
          const gb = catalog.groupBuys.find((g) => g.productId === p.id);
          if (gb) {
              return {
                  ...p,
                  timeLeft: gb.deadline, // Map deadline to timeLeft for ProductCard
                  groupBuy: {
                      participants: Math.floor(gb.currentQuantity / 10 + 50), // Simulation
                      target: gb.targetQuantity,
                      timeLeft: gb.deadline, // Simplification
                      progress: Math.min(Math.round((gb.currentQuantity / gb.targetQuantity) * 100), 100)
                  }
              };
          }
          return p;
      });
  };

  // Filter based on tags or IDs (fallback to ID ranges if tags missing from script)
  const popularRaw = catalog.products.filter((p) => p.tags?.includes('popular') || p.id < 200);
  const lastChanceRaw = catalog.products.filter((p) => p.tags?.includes('last_chance') || p.id >= 200);

  const popularProducts = enrichProducts(popularRaw);
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

        <ProductSection title="Популярные товары" products={popularProducts} />
        <ProductSection title="Последний шанс" products={lastChanceProducts} />
      </main>
    </div>
  );
}
