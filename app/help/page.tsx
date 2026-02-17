import Header from '@/components/Header';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-[1400px] mx-auto py-12 px-6 md:px-12">
        <Breadcrumbs items={[{ label: 'Помощь' }]} className="mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Помощь</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
             <h3 className="font-bold text-lg mb-2">Как сделать заказ?</h3>
             <p className="text-gray-600 mb-4">Подробная инструкция по оформлению заказа на платформе.</p>
             <a href="#" className="text-primary-600 font-medium hover:underline">Читать далее →</a>
          </div>
          <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
             <h3 className="font-bold text-lg mb-2">Доставка и оплата</h3>
             <p className="text-gray-600 mb-4">Информация о способах доставки и вариантах оплаты.</p>
             <a href="#" className="text-primary-600 font-medium hover:underline">Читать далее →</a>
          </div>
          <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
             <h3 className="font-bold text-lg mb-2">Возврат товара</h3>
             <p className="text-gray-600 mb-4">Условия и порядок возврата товаров.</p>
             <a href="#" className="text-primary-600 font-medium hover:underline">Читать далее →</a>
          </div>
        </div>
      </main>
    </div>
  );
}
