'use client';

import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { useMockData } from '@/context/MockDataContext';
import { Clock, Star, Package, MapPin, Calendar, Users, Building2, Award, Zap, ShieldCheck, TrendingUp, Box, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function FactoryPage() {
  const params = useParams();
  const router = useRouter();
  const factoryId = params.id as string;
  const { factories, suppliers, products, groupBuys, loading } = useMockData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  const factory = factories.find(f => f.id === factoryId);
  if (!factory) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-[1400px] mx-auto py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Фабрика не найдена</h1>
          <button onClick={() => router.back()} className="text-primary-600 hover:underline">Вернуться назад</button>
        </div>
      </div>
    );
  }

  const supplier = suppliers.find(s => s.id === factory.supplierId);
  const factoryProducts = products.filter(p => p.factoryId === factoryId);
  const activeGB = groupBuys.find(g => g.factoryId === factoryId && g.status === 'open');
  const progress = activeGB ? Math.min(Math.round((activeGB.currentQuantity / activeGB.targetQuantity) * 100), 100) : 0;
  
  // Calculate days left safely
  const deadline = activeGB ? new Date(activeGB.deadline) : null;
  const now = new Date();
  const diffTime = deadline ? deadline.getTime() - now.getTime() : 0;
  const daysLeft = activeGB ? Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24))) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-[1400px] mx-auto pb-20 pt-8 px-6 md:px-12">
        <Breadcrumbs 
            items={[
                { label: 'Каталог', href: '/catalog' },
                { label: 'Поставщики', href: '/suppliers' },
                { label: supplier?.name || 'Поставщик', href: supplier ? `/supplier/${supplier.id}` : '#' },
                { label: factory.name }
            ]}
            className="mb-6"
        />

        {/* Factory Profile & Indicators */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Image & Quick Stats */}
            <div className="space-y-6">
              <div className="aspect-[16/10] bg-gray-100 rounded-2xl overflow-hidden relative group">
                {factory.image ? (
                  <img src={factory.image} alt={factory.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Package className="w-16 h-16 text-gray-300" /></div>
                )}
                {/* Overlay with rating */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-bold text-gray-900">{factory.rating || 4.5}</span>
                  <span className="text-gray-500 text-sm">({factory.reviewsCount || 10} отзывов)</span>
                </div>
              </div>
              
              {/* Mini Gallery */}
              {factory.images_gallery && (
                 <div className="grid grid-cols-4 gap-4">
                   {factory.images_gallery.slice(0, 4).map((img, idx) => (
                     <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                        <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                     </div>
                   ))}
                 </div>
              )}
            </div>

            {/* Right: Detailed Indicators */}
            <div>
              <div className="mb-6">
                 <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{factory.name}</h1>
                    <ShieldCheck className="w-6 h-6 text-primary-500" />
                 </div>
                 
                 <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                    {factory.city && (
                        <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {factory.city}, {factory.country}</span>
                    )}
                    {factory.foundedYear && (
                        <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Основана в {factory.foundedYear}</span>
                    )}
                 </div>

                 <p className="text-gray-600 leading-relaxed mb-6">{factory.description}</p>
                 
                 {factory.mainProducts && factory.mainProducts.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {factory.mainProducts.map(prod => (
                        <span key={prod} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md font-medium">#{prod}</span>
                      ))}
                    </div>
                 )}

                 {supplier && (
                  <Link href={`/supplier/${supplier.id}`} className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium bg-primary-50 px-4 py-2 rounded-lg transition-colors">
                    Поставщик: {supplier.name} <ArrowLeft className="w-3 h-3 rotate-180" />
                  </Link>
                 )}
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Показатели фабрики</h3>
                <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                   <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary-600 shadow-sm shrink-0">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Сотрудников</div>
                        <div className="font-semibold text-gray-900">{factory.employeesCount || '—'}</div>
                      </div>
                   </div>
                   
                   <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary-600 shadow-sm shrink-0">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Площадь</div>
                        <div className="font-semibold text-gray-900">{factory.areaSqm ? `${factory.areaSqm} м²` : '—'}</div>
                      </div>
                   </div>

                   <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary-600 shadow-sm shrink-0">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Оборот / год</div>
                        <div className="font-semibold text-gray-900">{factory.annualTurnover || '—'}</div>
                      </div>
                   </div>
                   
                   <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary-600 shadow-sm shrink-0">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Подписчиков</div>
                        <div className="font-semibold text-gray-900">{factory.followersCount || '0'}</div>
                      </div>
                   </div>

                   <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary-600 shadow-sm shrink-0">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Response Rate</div>
                        <div className="font-semibold text-gray-900">{factory.responseRate ? `${factory.responseRate}%` : '—'}</div>
                      </div>
                   </div>

                   <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary-600 shadow-sm shrink-0">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Lead Time</div>
                        <div className="font-semibold text-gray-900">{factory.leadTime || '—'}</div>
                      </div>
                   </div>

                   <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary-600 shadow-sm shrink-0">
                        <Box className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">MOQ</div>
                        <div className="font-semibold text-gray-900">{factory.moq || '—'}</div>
                      </div>
                   </div>
                </div>

                {factory.certificates && factory.certificates.length > 0 && (
                   <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="text-xs text-gray-500 uppercase tracking-wide mb-3">Сертификаты</div>
                      <div className="flex flex-wrap gap-2">
                        {factory.certificates.map(cert => (
                            <span key={cert} className="inline-flex items-center gap-1.5 bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-700 border border-gray-200 shadow-sm">
                                <Award className="w-3 h-3 text-primary-500" /> {cert}
                            </span>
                        ))}
                      </div>
                   </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ACTIVE GROUP BUY BANNER */}
        {activeGB && (
          <Link 
            href={`/group-buy/${activeGB.id}`}
            className="block bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden mb-12 transform hover:scale-[1.01] transition-all duration-300 hover:shadow-xl group"
          >
             <div className="flex flex-col md:flex-row">
                <div className="bg-primary-600 p-6 md:p-8 text-white flex flex-col justify-center items-start md:w-1/3 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                   <div className="relative z-10">
                      <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-4 border border-white/10">
                         <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                         АКТИВНЫЙ СБОР
                      </div>
                      <h2 className="text-2xl font-bold mb-2">Присоединяйтесь к закупке!</h2>
                      <p className="text-primary-100 mb-6 text-sm">Успейте заказать товары по оптовой цене до закрытия сбора.</p>
                      
                      <div className="flex items-center gap-4 text-sm font-medium">
                         <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {daysLeft > 0 ? `Осталось ${daysLeft} дн.` : 'Завершается сегодня'}
                         </div>
                         <div className="w-px h-4 bg-white/30"></div>
                         <div>
                            Цель: {activeGB.targetQuantity} шт.
                         </div>
                      </div>
                   </div>
                </div>

                <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                    <div className="flex items-center justify-between mb-4">
                       <span className="text-gray-600 font-medium group-hover:text-primary-600 transition-colors">Прогресс сбора</span>
                       <span className="text-2xl font-bold text-primary-600">{activeGB.currentQuantity} / {activeGB.targetQuantity}</span>
                    </div>
                    
                    <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden mb-6">
                       <div 
                         className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full relative"
                         style={{ width: `${progress}%` }}
                       >
                         <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-[shimmer_2s_infinite]"></div>
                       </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                       <div className="flex -space-x-2">
                          {[1,2,3,4].map(i => (
                             <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-500">
                                {String.fromCharCode(64 + i)}
                             </div>
                          ))}
                          <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-500">
                             +{Math.max(0, (activeGB.currentQuantity || 0) - 4)}
                          </div>
                       </div>
                       <span className="text-sm text-gray-400 group-hover:text-primary-600 transition-colors">Участников закупки →</span>
                    </div>
                </div>
             </div>
          </Link>
        )}

        {/* Products */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Товары фабрики</h2>
        {factoryProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {factoryProducts.map(product => (
              <div key={product.id} className="h-full">
                <ProductCard
                  id={product.id}
                  category={product.category}
                  name={product.name}
                  price={product.price}
                  images={product.images}
                  groupBuyId={activeGB?.id}
                  timeLeft={activeGB ? (daysLeft > 0 ? `${daysLeft} дн.` : 'Завершается') : undefined}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500">Товары появятся скоро</p>
          </div>
        )}
      </main>
    </div>
  );
}
