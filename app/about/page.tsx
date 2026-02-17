import Header from '@/components/Header';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-[1400px] mx-auto py-12 px-6 md:px-12">
        <Breadcrumbs items={[{ label: 'О нас' }]} className="mb-6" />
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">О компании</h1>
          <div className="prose prose-lg text-gray-600">
            <p className="mb-6">
              Мы создаем удобную платформу для совместных закупок товаров напрямую от производителей. 
              Наша миссия — сделать оптовые закупки доступными и прозрачными для каждого.
            </p>
            <p>
              Portrade объединяет тысячи покупателей и сотни проверенных поставщиков, обеспечивая 
              безопасность сделок и качество продукции.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
