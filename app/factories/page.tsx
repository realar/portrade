import { readCatalog } from '@/app/actions/catalog';
import Header from '@/components/Header';
import FactoryCard from '@/components/FactoryCard';
import Breadcrumbs from '@/components/Breadcrumbs';

export const dynamic = 'force-dynamic';

export default async function FactoriesPage() {
  const catalog = await readCatalog();

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />
      <main className="max-w-[1400px] mx-auto py-12 px-6 md:px-12">
        <Breadcrumbs items={[{ label: 'Фабрики' }]} className="mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Фабрики</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalog.factories.map((factory) => {
             const supplier = catalog.suppliers.find(s => s.id === factory.supplierId);
             const products = catalog.products.filter(p => p.factoryId === factory.id);
             const gb = catalog.groupBuys.find(g => g.factoryId === factory.id && g.status === 'open');
             const progress = gb ? Math.min(Math.round((gb.currentQuantity / gb.targetQuantity) * 100), 100) : undefined;
             
             return (
              <div key={factory.id} className="h-full">
                <FactoryCard
                  id={factory.id}
                  name={factory.name}
                  brands={factory.brands}
                  supplierName={supplier?.name || 'Поставщик'}
                  image={factory.image}
                  groupBuyProgress={progress}
                  groupBuyDeadline={gb?.deadline}
                  productCount={products.length}
                />
              </div>
             );
          })}
        </div>
      </main>
    </div>
  );
}
