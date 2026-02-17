import Link from 'next/link';
import Header from '@/components/Header';
import FactoryCard from '@/components/FactoryCard';
import ProductCard from '@/components/ProductCard';
import { readCatalog, Category } from '@/app/actions/catalog';
import Breadcrumbs from '@/components/Breadcrumbs';

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export const dynamic = 'force-dynamic';

export default async function CatalogPage({ params }: PageProps) {
  const { slug } = await params;
  const categoryId = slug && slug.length > 0 ? slug[0] : null;
  
  const catalog = await readCatalog();

  const currentCategory = categoryId 
    ? catalog.categories.find((c: Category) => c.id === categoryId) 
    : null;

  // Get factories matching category
  const matchingFactories = categoryId && currentCategory
    ? catalog.factories.filter(f => f.categories.includes(currentCategory.id))
    : catalog.factories;

  // For "All" view, show products directly
  const allProducts = categoryId && currentCategory
    ? catalog.products.filter(p => p.category === currentCategory.id)
    : catalog.products;

  // Enrich products with group buy info
  const enrichedProducts = allProducts.map(p => {
    const gb = catalog.groupBuys.find(g => g.productIds.includes(p.id) && g.status === 'open');
    if (gb) {
      const remaining = gb.targetQuantity - gb.currentQuantity;
      const progress = Math.round((gb.currentQuantity / gb.targetQuantity) * 100);
      return {
        ...p,
        timeLeft: remaining > 0 ? `${remaining} шт` : undefined,
        isLastChance: progress >= 80,
        groupBuyId: gb.id,
      };
    }
    return { ...p, timeLeft: undefined, isLastChance: false, groupBuyId: undefined };
  });

  const breadcrumbsItems = currentCategory 
    ? [{ label: 'Каталог', href: '/catalog' }, { label: currentCategory.name }]
    : [{ label: 'Каталог' }];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-[1400px] mx-auto pb-20 pt-8 px-6 md:px-12">
        <Breadcrumbs items={breadcrumbsItems} className="mb-6" />
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

          {/* Content */}
          <div className="flex-1">
            {/* Factories in this category */}
            {categoryId && matchingFactories.length > 0 && (
              <div className="mb-10">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Фабрики и поставщики</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {matchingFactories.map(factory => {
                    const supplier = catalog.suppliers.find(s => s.id === factory.supplierId);
                    const gb = catalog.groupBuys.find(g => g.factoryId === factory.id && g.status === 'open');
                    const factoryProducts = catalog.products.filter(p => p.factoryId === factory.id);
                    const progress = gb ? Math.min(Math.round((gb.currentQuantity / gb.targetQuantity) * 100), 100) : undefined;

                    return (
                      <FactoryCard
                        key={factory.id}
                        id={factory.id}
                        name={factory.name}
                        brands={factory.brands}
                        supplierName={supplier?.name || 'Поставщик'}
                        image={factory.image}
                        groupBuyProgress={progress}
                        groupBuyDeadline={gb?.deadline}
                        productCount={factoryProducts.length}
                      />
                    );
                  })}
                </div>
                <div className="border-t border-gray-100 pt-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Все товары в категории</h2>
                </div>
              </div>
            )}

            {/* Product Grid */}
            {enrichedProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                 {enrichedProducts.map((product) => (
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
                     groupBuyId={product.groupBuyId}
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
