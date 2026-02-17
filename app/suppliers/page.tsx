import { readCatalog } from '@/app/actions/catalog';
import Header from '@/components/Header';
import Breadcrumbs from '@/components/Breadcrumbs';
import ClientSupplierList from '@/components/ClientSupplierList';

export const dynamic = 'force-dynamic';

export default async function SuppliersPage() {
  const catalog = await readCatalog();

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />
      <main className="max-w-[1400px] mx-auto py-12 px-6 md:px-12">
        <Breadcrumbs 
             items={[
                 { label: 'Каталог', href: '/catalog' },
                 { label: 'Поставщики' }
             ]}
             className="mb-8"
        />
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Поставщики</h1>
        
        <ClientSupplierList initialSuppliers={catalog.suppliers} />
      </main>
    </div>
  );
}
