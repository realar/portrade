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

export default async function PopularPage() {
  const catalog = await readCatalog();

  const enrichProducts = (productList: Product[]): EnrichedProduct[] => {
    return productList.map(p => {
      const gb = catalog.groupBuys.find(g => g.productIds.includes(p.id) && g.status === 'open');
      if (gb) {
        const remaining = gb.targetQuantity - gb.currentQuantity;
        return {
          ...p,
          timeLeft: remaining > 0 ? `${remaining} шт` : undefined,
          groupBuy: {
            id: gb.id,
            participants: Math.floor(gb.currentQuantity / 10 + 50),
            target: gb.targetQuantity,
            timeLeft: gb.deadline,
            progress: Math.min(Math.round((gb.currentQuantity / gb.targetQuantity) * 100), 100)
          }
        };
      }
      return { ...p, timeLeft: undefined };
    });
  };

  const popularProducts = enrichProducts(catalog.products);

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
