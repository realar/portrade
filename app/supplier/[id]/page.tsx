'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Header from '@/components/Header';
import { useMockData } from '@/context/MockDataContext';
import { MapPin, UserPlus, Star, MessageCircle, ShoppingBag, Info, LayoutGrid, CheckCircle, Factory } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import GroupBuyCard from '@/components/GroupBuyCard';
import ProductCard from '@/components/ProductCard';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function SupplierPage() {
  const params = useParams();
  const router = useRouter();
  const supplierId = params.id as string;
  const { suppliers, factories, groupBuys, products, loading } = useMockData();
  const [activeTab, setActiveTab] = useState<'factories' | 'purchases' | 'catalog' | 'reviews' | 'about'>('factories');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  const supplier = suppliers.find(s => s.id === supplierId);
  
  if (!supplier) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-[1400px] mx-auto py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Поставщик не найден</h1>
          <button onClick={() => router.back()} className="text-primary-600 hover:underline">Вернуться назад</button>
        </div>
      </div>
    );
  }

  // Data gathering
  const supplierFactories = factories.filter(f => f.supplierId === supplierId);
  const factoryIds = supplierFactories.map(f => f.id);
  
  const supplierGroupBuys = groupBuys.filter(gb => 
    factoryIds.includes(gb.factoryId) && gb.status === 'open'
  );

  const supplierProducts = products
    .filter(p => factoryIds.includes(p.factoryId))
    .map(product => {
       const activeGroupBuy = groupBuys.find(gb => gb.productIds?.includes(product.id) && gb.status === 'open');
       
       if (activeGroupBuy) {
           const remaining = activeGroupBuy.targetQuantity - activeGroupBuy.currentQuantity;
           const progress = Math.min(Math.round((activeGroupBuy.currentQuantity / activeGroupBuy.targetQuantity) * 100), 100);
           
           return {
               ...product,
               groupBuyId: activeGroupBuy.id,
               timeLeft: remaining > 0 ? `${remaining} шт` : undefined,
               isLastChance: progress >= 80,
           };
       }
       return product;
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-[1400px] mx-auto pb-20 pt-8 px-4 md:px-8 lg:px-12">
        <Breadcrumbs 
          items={[
            { label: 'Каталог', href: '/catalog' },
            { label: 'Поставщики', href: '/suppliers' },
            { label: supplier.name }
          ]} 
          className="mb-6"
        />

        {/* Profile Card */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden mb-8">
           <div className="bg-gradient-to-r from-violet-600 to-indigo-600 h-32 md:h-40 relative">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
           </div>
           
           <div className="px-8 pb-8">
              <div className="flex flex-col md:flex-row gap-6 md:gap-12 -mt-12">
                 {/* Left: Avatar & specific info */}
                 <div className="flex flex-col items-center md:items-start text-center md:text-left shrink-0 max-w-xs">
                    <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-md bg-white overflow-hidden mb-4 z-10">
                       {supplier.logo && <Image src={supplier.logo} alt={supplier.name} fill className="object-cover" />}
                    </div>
                    
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">{supplier.name}</h1>
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
                       <MapPin className="w-4 h-4" /> {supplier.country}
                    </div>

                    <button className="w-full py-2.5 px-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-medium shadow-lg shadow-pink-500/20 hover:shadow-pink-500/30 active:scale-95 transition-all flex items-center justify-center gap-2">
                       <UserPlus className="w-4 h-4" />
                       Подписаться
                    </button>
                 </div>

                 {/* Middle: Rating & Stats */}
                 <div className="flex-1 pt-4 md:pt-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Rating Block */}
                        <div className="bg-gray-50 rounded-2xl p-6 flex items-center justify-between">
                           <div>
                              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Рейтинг</div>
                              <div className="flex items-baseline gap-2">
                                 <span className="text-4xl font-extrabold text-gray-900">{supplier.rating}</span>
                                 <div className="flex text-yellow-500">
                                    {[1,2,3,4,5].map(i => (
                                       <Star key={i} className={`w-4 h-4 ${i <= Math.round(supplier.rating) ? 'fill-yellow-500' : 'text-gray-300 fill-gray-300'}`} />
                                    ))}
                                 </div>
                              </div>
                           </div>
                           <div className="h-12 w-px bg-gray-200 mx-4"></div>
                           <div className="text-right">
                               <div className="text-sm text-gray-900 font-semibold">{supplier.completedDeals}</div>
                               <div className="text-xs text-gray-500">сделок</div>
                           </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                           <div className="flex justify-between items-center group">
                              <span className="text-gray-500 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-pink-400"></div> Заказы</span>
                              <span className="font-semibold text-gray-900">{supplier.totalOrders || 150}</span>
                           </div>
                           <div className="flex justify-between items-center group">
                              <span className="text-gray-500 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div> Подписчики</span>
                              <span className="font-semibold text-gray-900">{supplier.followersCount || 100}</span>
                           </div>
                           <div className="flex justify-between items-center group">
                              <span className="text-gray-500 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div> Отзывы</span>
                              <span className="font-semibold text-gray-900">{supplier.reviewsCount || 10}</span>
                           </div>
                           <div className="flex justify-between items-center group">
                              <span className="text-gray-500 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div> На сайте с</span>
                              <span className="font-semibold text-gray-900">{supplier.registrationDate ? new Date(supplier.registrationDate).getFullYear() : 2024}</span>
                           </div>
                           <div className="flex justify-between items-center group">
                              <span className="text-gray-500 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-teal-400"></div> Был на сайте</span>
                              <span className="font-semibold text-gray-900">{supplier.lastSeen || 'Недавно'}</span>
                           </div>
                        </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
           {[
             { id: 'factories', label: 'Фабрики', icon: Factory },
             { id: 'purchases', label: 'Закупки', icon: ShoppingBag },
             { id: 'catalog', label: 'Каталог', icon: LayoutGrid },
             { id: 'reviews', label: 'Отзывы', icon: Star },
             { id: 'about', label: 'О поставщике', icon: Info },
           ].map(tab => {
             const Icon = tab.icon;
             return (
               <button 
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as typeof activeTab)}
                 className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id 
                    ? 'bg-gray-900 text-white shadow-md' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                 }`}
               >
                 <Icon className="w-4 h-4" />
                 {tab.label}
               </button>
             );
           })}
        </div>

        {/* Content Area */}
        <div className="animate-fade-in">
           {activeTab === 'factories' && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {supplierFactories.map(f => (
                   <Link href={`/factory/${f.id}`} key={f.id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
                      <div className="h-48 bg-gray-100 overflow-hidden relative">
                         {f.image ? (
                            <Image src={f.image} alt={f.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                         ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                               <Factory className="w-12 h-12" />
                            </div>
                         )}
                         <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-gray-900 flex items-center gap-1 shadow-sm">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            {f.rating}
                         </div>
                      </div>
                      <div className="p-5">
                         <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">{f.name}</h3>
                         <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
                            <MapPin className="w-4 h-4" /> {f.city}, {f.country}
                         </div>
                         <div className="flex items-center justify-between text-sm pt-4 border-t border-gray-50">
                            <div className="text-gray-500">{f.employeesCount} сотрудников</div>
                            <div className="text-primary-600 font-medium">Подробнее →</div>
                         </div>
                      </div>
                   </Link>
                ))}
             </div>
           )}

           {activeTab === 'purchases' && (
             <div>
                {supplierGroupBuys.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {supplierGroupBuys.map(gb => {
                           const factory = supplierFactories.find(f => f.id === gb.factoryId);
                           const progress = Math.min(Math.round((gb.currentQuantity / gb.targetQuantity) * 100), 100);
                           return (
                               <div key={gb.id} className="h-[400px]">
                                   <GroupBuyCard
                                       id={gb.id}
                                       title={gb.title || factory?.name}
                                       factoryName={factory?.name || ''}
                                       progress={progress}
                                       deadline={gb.deadline}
                                       targetQuantity={gb.targetQuantity}
                                       image={gb.image || factory?.image}
                                       rating={factory?.rating}
                                       reviewsCount={factory?.reviewsCount}
                                       leadTime={factory?.leadTime}
                                   />
                               </div>
                           );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-[2rem] border border-gray-100">
                        <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Нет активных закупок</h2>
                        <p className="text-gray-500">Поставщик пока не открыл новые сборы.</p>
                    </div>
                )}
             </div>
           )}

           {activeTab === 'catalog' && (
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {supplierProducts.map(product => (
                    <ProductCard
                        key={product.id}
                        {...product}
                    />
                ))}
             </div>
           )}
           
           {activeTab === 'about' && (
              <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-gray-100 max-w-4xl">
                 <h2 className="text-2xl font-bold text-gray-900 mb-6">О компании {supplier.name}</h2>
                 <p className="text-gray-600 leading-relaxed text-lg mb-8">{supplier.description}</p>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                       <h3 className="font-bold text-gray-900 mb-4">Наши фабрики</h3>
                       <div className="space-y-4">
                          {supplierFactories.map(f => (
                             <Link href={`/factory/${f.id}`} key={f.id} className="flex items-center gap-4 group hover:bg-gray-50 p-2 rounded-xl transition-colors">
                                <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                   {f.image && <Image src={f.image} alt={f.name} fill className="object-cover" />}
                                </div>
                                <div>
                                   <div className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{f.name}</div>
                                   <div className="text-xs text-gray-500">{f.city}, {f.country}</div>
                                </div>
                             </Link>
                          ))}
                       </div>
                    </div>
                    
                    <div>
                       <h3 className="font-bold text-gray-900 mb-4">Сертификация</h3>
                       <div className="flex flex-wrap gap-2">
                          {['ISO 9001', 'CE', 'RoHS', 'GMP'].map((c, i) => (
                             <span key={i} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-100 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> {c}
                             </span>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
           )}
           
           {activeTab === 'reviews' && (
              <div className="bg-white rounded-[2rem] p-12 text-center border border-gray-100">
                 <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                 <h2 className="text-xl font-bold text-gray-900">Раздел в разработке</h2>
                 <p className="text-gray-500">Отзывы о поставщике скоро появятся здесь.</p>
              </div>
           )}
        </div>
      </main>
    </div>
  );
}
