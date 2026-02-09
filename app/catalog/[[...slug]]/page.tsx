import Link from 'next/link';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { readCatalog, Category } from '@/app/actions/catalog';

interface Product {
  id: number;
  category: string;
  name: string;
  price: number;
  description?: string;
  specs?: { name: string; value: string }[];
  groupBuy?: {
    participants: number;
    target: number;
    timeLeft: string;
    progress: number;
  };
  images?: string[];
  timeLeft?: string;
  isLastChance?: boolean;
}

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

// Disable caching to show real-time group buy updates
export const dynamic = 'force-dynamic';

export default async function CatalogPage({ params }: PageProps) {
  const { slug } = await params;
  const categoryId = slug && slug.length > 0 ? Number(slug[0]) : null;
  
  const catalog = await readCatalog();

  // Find category name if ID is present
  const currentCategory = categoryId 
    ? catalog.categories.find((c: Category) => c.id === categoryId) 
    : { name: "Все товары", id: null };

  // Get products from the new single source
  let products = catalog.products as Product[];
  
  // Helper: Check if group buy is in last 10% (by quantity remaining)
  const isLastChance = (gb: { currentQuantity: number; targetQuantity: number }): boolean => {
      const remaining = gb.targetQuantity - gb.currentQuantity;
      const percentRemaining = remaining / gb.targetQuantity;
      return percentRemaining < 0.1 && percentRemaining > 0;
  };

  // Enrich products with group buy info (only for open group buys)
  products = products.map(p => {
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
      // Explicitly set timeLeft to undefined for products without open group buys
      return { ...p, timeLeft: undefined, isLastChance: false };
  });

  if (categoryId) {
    // In our mock data, "category" is a string name (e.g. "Категория 1").
    // But our categories in catalog.json have IDs (e.g. 1).
    // The products' "category" field currently holds the NAME.
    // So we need to match the category ID to its name first.
    
    // Check if the current category was found
    if (currentCategory && currentCategory.id) {
       products = products.filter(p => p.category === currentCategory.name);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-[1400px] mx-auto pb-20 pt-8 px-6 md:px-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{currentCategory?.name || "Каталог"}</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
             <div className="sticky top-24 bg-gray-50 rounded-xl p-4 border border-gray-100">
               <h3 className="font-semibold text-gray-900 mb-4 px-2">Категории</h3>
               <div className="space-y-1">
                 <Link 
                   href="/catalog" 
                   className={`block px-3 py-2 rounded-lg text-sm transition-colors ${!categoryId ? 'bg-white shadow-sm text-primary-600 font-medium' : 'text-gray-600 hover:bg-white hover:text-gray-900'}`}
                 >
                   Все товары
                 </Link>
                 {catalog.categories.map((category: Category) => (
                   <Link 
                     key={category.id} 
                     href={`/catalog/${category.id}`} 
                     className={`block px-3 py-2 rounded-lg text-sm transition-colors ${categoryId === category.id ? 'bg-white shadow-sm text-primary-600 font-medium' : 'text-gray-600 hover:bg-white hover:text-gray-900'}`}
                   >
                     {category.name}
                   </Link>
                 ))}
               </div>
             </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {products.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                 {products.map((product) => (
                   <ProductCard
                     key={product.id}
                     id={product.id}
                     category={product.category}
                     name={product.name}
                     price={product.price}
                     timeLeft={product.timeLeft}
                     image={product.images?.[0]}
                     images={product.images}
                     isLastChance={product.isLastChance}
                   />
                 ))}
              </div>
            ) : (
               <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 rounded-xl">
                 <p className="text-gray-500 text-lg">В этой категории пока нет товаров</p>
                 <Link href="/catalog" className="mt-4 text-primary-600 hover:text-primary-700 font-medium">Показать все товары</Link>
               </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
