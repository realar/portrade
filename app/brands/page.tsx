import { readCatalog } from '@/app/actions/catalog';
import Header from '@/components/Header';
import { Factory, Package } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

export const dynamic = 'force-dynamic';

export default async function BrandsPage() {
  const catalog = await readCatalog();
  const brands = Array.from(new Set(catalog.factories.flatMap(f => f.brands || []))).sort();

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />
      <main className="max-w-[1400px] mx-auto py-12 px-6 md:px-12">
        <Breadcrumbs items={[{ label: 'Бренды' }]} className="mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Бренды</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {brands.map((brand) => {
            const factories = catalog.factories.filter(f => f.brands.includes(brand));
            const factoryIds = factories.map(f => f.id);
            const products = catalog.products.filter(p => factoryIds.includes(p.factoryId));
            
            return (
              <div key={brand} className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all group flex flex-col items-center text-center">
                 <div className="w-16 h-16 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-xl font-bold">{brand.charAt(0).toUpperCase()}</span>
                 </div>
                 <h3 className="font-bold text-gray-900 text-lg mb-2">{brand}</h3>
                 <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Factory className="w-4 h-4" /> {factories.length}</span>
                    <span className="flex items-center gap-1"><Package className="w-4 h-4" /> {products.length}</span>
                 </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
