'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import { useMockData } from '@/context/MockDataContext';
import { 
  Star, Eye, ShieldCheck, 
  MessageCircle, Box 
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import Breadcrumbs from '@/components/Breadcrumbs';
import CountdownTimer from '@/components/CountdownTimer';

export default function GroupBuyPage() {
  const params = useParams();
  const router = useRouter();
  const gbId = Number(params.id);
  const { groupBuys, factories, suppliers, products, loading } = useMockData();
  const [activeTab, setActiveTab] = useState<'catalog' | 'terms' | 'news' | 'reviews' | 'questions'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const gb = groupBuys.find(g => g.id === gbId);
  const factory = factories.find(f => f.id === gb?.factoryId);
  const supplier = factory ? suppliers.find(s => s.id === factory.supplierId) : null;
  
  /* Safe filtering even if gb is undefined */
  const gbProducts = useMemo(() => {
    return gb ? products.filter(p => gb.productIds?.includes(p.id)) : [];
  }, [gb, products]);
  
  // Categories for sidebar
  const categories = useMemo(() => {
    const cats = new Set(gbProducts.map(p => p.category));
    return Array.from(cats);
  }, [gbProducts]);

  const filteredProducts = useMemo(() => {
     return selectedCategory 
        ? gbProducts.filter(p => p.category === selectedCategory)
        : gbProducts;
  }, [gbProducts, selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!gb) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-[1400px] mx-auto py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Закупка не найдена</h1>
          <button onClick={() => router.back()} className="text-primary-600 hover:underline">Вернуться назад</button>
        </div>
      </div>
    );
  }

  // Calculate stats
  const progress = Math.min(Math.round((gb.currentQuantity / gb.targetQuantity) * 100), 100);
  const deadline = new Date(gb.deadline);
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();
  const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Mock buyers count if not real
  const buyersCount = Math.floor(gb.currentQuantity / 2) + 15; 

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-green-600 bg-green-50 border-green-100';
      case 'closed': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-blue-600 bg-blue-50 border-blue-100';
    }
  };

  const getStatusText = (status: string) => {
      const map: Record<string, string> = {
          'open': 'Сбор заказов',
          'closed': 'Сбор закрыт',
          'awaiting_payment': 'Оплата',
          'shipping': 'Доставка',
          'delivered': 'Раздача'
      };
      return map[status] || status;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Breadcrumbs */}
      <main className="max-w-[1400px] mx-auto pb-20 pt-6 px-4 md:px-8 lg:px-12">
        <Breadcrumbs 
            items={[
                { label: 'Каталог', href: '/catalog' },
                { label: 'Поставщики', href: '/suppliers' },
                { label: supplier?.name || 'Поставщик', href: supplier ? `/supplier/${supplier.id}` : '#' },
                { label: factory?.name || 'Фабрика', href: factory ? `/factory/${factory.id}` : '#' },
                { label: gb.title || factory?.name || 'Закупка' }
            ]}
            className="mb-8"
        />
        
        {/* MAIN HEADER CARD */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 mb-10">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left: Image */}
                <div className="w-full lg:w-[320px] shrink-0">
                    <div className="aspect-square relative rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 group">
                        {!imageError && (gb.image || factory?.image) ? (
                            <img 
                                src={gb.image || factory?.image || ''} 
                                alt={gb.title || 'Group Buy'} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                <img src="/images/product-placeholder.png" alt="No image" className="w-2/3 h-2/3 object-contain opacity-50" />
                            </div>
                        )}
                        <div className="absolute top-3 left-3">
                             <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(gb.status)}`}>
                                 {getStatusText(gb.status)}
                             </span>
                        </div>
                    </div>
                </div>

                {/* Center: Info & Stats */}
                <div className="flex-1">
                     <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-3">
                         <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight flex-1">
                             {gb.title || factory?.name}
                         </h1>
                     </div>
                    
                    <div className="flex items-center gap-4 mb-6">
                         <div className="flex items-center gap-1">
                             {[1,2,3,4,5].map(i => (
                                 <Star key={i} className={`w-4 h-4 ${i <= Math.round(factory?.rating || 5) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`} />
                             ))}
                         </div>
                         <div className="w-px h-4 bg-gray-300"></div>
                         <div className="text-sm text-gray-500">Артикул: {gb.id}</div>
                    </div>

                    {/* Timer */}
                    <div className="mb-6">
                        <CountdownTimer targetDate={gb.deadline} />
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-500 mb-8">
                        <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            Просмотров: {gb.viewsCount || 342}
                        </div>
                        <div className="flex items-center gap-2 text-green-600">
                            <ShieldCheck className="w-4 h-4" />
                            Защита покупателя
                        </div>
                    </div>

                    {/* Detailed Stats Grid */}
                    <div className="grid grid-cols-2 gap-y-3 gap-x-8 text-sm border-t border-gray-100 pt-6">
                        <div className="flex justify-between items-center bg-gray-50 px-3 py-1.5 rounded-lg">
                            <span className="text-gray-500">Орг сбор</span>
                            <span className="font-semibold text-gray-900">{gb.orgFee || 15}%</span>
                        </div>
                        <div className="flex justify-between items-center bg-gray-50 px-3 py-1.5 rounded-lg">
                            <span className="text-gray-500">Собрано</span>
                            <span className="font-semibold text-primary-600">{progress}%</span>
                        </div>
                        <div className="flex justify-between items-center bg-gray-50 px-3 py-1.5 rounded-lg">
                            <span className="text-gray-500">Минималка</span>
                            <span className="font-semibold text-gray-900">{(gb.minAmount || 20000).toLocaleString()} <span className="font-sans">₽</span></span>
                        </div>
                        <div className="flex justify-between items-center bg-gray-50 px-3 py-1.5 rounded-lg">
                            <span className="text-gray-500">До</span>
                            <span className="font-semibold text-gray-900">{gb.collectionDate ? new Date(gb.collectionDate).toLocaleDateString() : new Date(gb.deadline).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-center bg-gray-50 px-3 py-1.5 rounded-lg col-span-2">
                            <span className="text-gray-500">Доставка</span>
                            <span className="font-semibold text-gray-900">{gb.deliveryDate ? new Date(gb.deliveryDate).toLocaleDateString() : '—'}</span>
                        </div>
                    </div>
                </div>

                {/* Right: Organizer Card */}
                <div className="w-full lg:w-[280px] shrink-0 flex flex-col gap-4">
                    <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 text-center hover:border-gray-200 transition-colors">
                        <div className="w-20 h-20 rounded-full bg-gray-200 mx-auto mb-3 overflow-hidden border-4 border-white shadow-md">
                            {supplier?.logo && (
                                <img src={supplier.logo} alt={supplier.name} className="w-full h-full object-cover" />
                            )}
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 mb-1">{supplier?.name || 'Организатор'}</h3>
                        <div className="flex items-center justify-center gap-1 mb-2">
                             {[1,2,3,4,5].map(i => (
                                 <Star key={i} className={`w-3 h-3 ${i <= Math.round(supplier?.rating || 5) ? 'fill-primary-400 text-primary-400' : 'fill-gray-200 text-gray-200'}`} />
                             ))}
                        </div>
                        <div className="text-xs text-gray-500 mb-4">{supplier?.country || 'Владивосток'}</div>
                        
                        <button className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-primary-500/30 active:scale-95">
                            Задать вопрос
                        </button>
                    </div>

                    {/* Quick Big Stats */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                             <div className="text-lg font-bold text-gray-900 leading-none mb-1">{daysLeft} д</div>
                             <div className="text-[9px] text-gray-500 uppercase font-semibold">Осталось</div>
                        </div>
                         <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                             <div className="text-lg font-bold text-gray-900 leading-none mb-1">{buyersCount}</div>
                             <div className="text-[9px] text-gray-500 uppercase font-semibold">Участников</div>
                        </div>
                         <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                             <div className="text-lg font-bold text-primary-600 leading-none mb-1">{progress}%</div>
                             <div className="text-[9px] text-primary-500 uppercase font-semibold">Собрано</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* TABS Navigation */}
        <div className="flex items-center gap-8 mb-8 border-b border-gray-200 overflow-x-auto scrollbar-hide">
            {[
                { id: 'catalog', label: 'Каталог' },
                { id: 'terms', label: 'Условия закупки' },
                { id: 'news', label: 'Новости' },
                { id: 'reviews', label: 'Отзывы' },
                { id: 'questions', label: 'Вопросы' },
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`pb-4 text-lg font-bold transition-colors whitespace-nowrap relative ${
                        activeTab === tab.id 
                        ? 'text-primary-600' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                    {tab.label}
                    {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-t-full"></div>
                    )}
                </button>
            ))}
        </div>

        {/* TAB CONTENT */}
        <div className="animate-fade-in">
            {activeTab === 'catalog' && (
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-64 shrink-0">
                         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                             <h3 className="font-bold text-xl mb-4">Категории</h3>
                             <div className="space-y-1">
                                 <button
                                    onClick={() => setSelectedCategory(null)}
                                    className={`w-full text-left py-2.5 px-3 rounded-xl text-sm transition-all ${
                                        selectedCategory === null 
                                        ? 'bg-gray-900 text-white shadow-md font-medium' 
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                 >
                                     Все товары
                                 </button>
                                 {categories.map(cat => (
                                     <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`w-full text-left py-2.5 px-3 rounded-xl text-sm transition-all ${
                                            selectedCategory === cat 
                                            ? 'bg-gray-900 text-white shadow-md font-medium' 
                                            : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                     >
                                         {cat}
                                     </button>
                                 ))}
                             </div>
                         </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredProducts.map(product => (
                                    <ProductCard
                                        key={product.id}
                                        {...product}
                                        groupBuyId={gbId}
                                        timeLeft={daysLeft > 0 ? `${daysLeft} дн.` : 'Финиш'}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                                <Box className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                <h2 className="text-lg font-semibold text-gray-900">Пусто</h2>
                                <p className="text-gray-500">В этой категории пока нет товаров</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'terms' && (
                <div className="max-w-4xl bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">О закупке</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Самая классная подборка для всей семьи! Однотонные, яркие, с рисунками и надписями. Тематические коллекции к праздникам!
                            Прямые поставки от производителя. Гарантия качества.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                             Приветствуем постоянных и новых участников! Здесь мы пытаемся собрать самые популярные, модные и современные товары по оптовым ценам.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Правила</h2>
                        <ul className="list-decimal list-inside space-y-3 text-gray-600 leading-relaxed">
                            <li>Нажимая кнопку заказать Вы соглашаетесь с правилами покупки!</li>
                            <li>Возможен пересорт по цвету (очень редко).</li>
                            <li>Прописываю приблизительную дату прихода. Заказы могут прийти немного раньше или позже.</li>
                            <li>Иногородние пункты выдачи получают позже, прибавляем доставку из Владивостока.</li>
                            <li>ПРЕТЕНЗИИ ПО БРАКУ принимаются в течение 10 дней после поступления заказа на точку.</li>
                        </ul>
                    </section>

                     <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Оплата</h2>
                        <p className="text-gray-600 mb-4">100% предоплата после стопа в течение 3х дней.</p>
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-blue-900 text-sm">
                             Оплата производится на карту Сбербанка или Тинькофф. Реквизиты будут доступны после подтверждения заказа.
                        </div>
                    </section>
                    
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Доставка</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-2">Способы получения</h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li>• Пункты выдачи заказов (ПВЗ)</li>
                                    <li>• Курьерская доставка</li>
                                    <li>• Почта России / СДЭК</li>
                                </ul>
                            </div>
                             <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-2">Сроки</h3>
                                <p className="text-sm text-gray-600">
                                    Доставка до склада: 14-20 дней.<br/>
                                    Сортировка: 2-3 дня.<br/>
                                    Выдача: с {gb.deliveryDate ? new Date(gb.deliveryDate).toLocaleDateString() : '20.02.2026'}
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            )}
            
            {['news', 'reviews', 'questions'].includes(activeTab) && (
                 <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
                     <MessageCircle className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                     <h2 className="text-xl font-bold text-gray-900 mb-2">Раздел пуст</h2>
                     <p className="text-gray-500">Здесь пока нет информации.</p>
                 </div>
            )}

        </div>
      </main>
    </div>
  );
}
