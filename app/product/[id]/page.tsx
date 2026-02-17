'use client';

import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import ProductGallery from '@/components/ProductGallery';
import ProductInfo from '@/components/ProductInfo';
import ProductSection from '@/components/ProductSection';
import ProductSidebar from '@/components/ProductSidebar';
import { useMockData } from '@/context/MockDataContext';
import { ChevronRight } from 'lucide-react';
import { useEffect } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const { products, groupBuys, factories, suppliers, loading } = useMockData();
  
  const product = products.find(p => p.id === id);
  // Find active group buy specifically for this product
  const gb = product 
    ? groupBuys.find(g => g.productIds?.includes(product.id) && g.status === 'open')
    : undefined;

  const factory = factories.find(f => f.id === product?.factoryId);
  const supplier = factory ? suppliers.find(s => s.id === factory.supplierId) : null;

  const suggestedProducts = gb 
    ? products.filter(p => gb.productIds?.includes(p.id) && p.id !== id)
    : products.filter(p => p.category === product?.category && p.id !== id).slice(0, 4);

  // Get other ACTIVE GROUP BUYS for sidebar (from same supplier)
  const sidebarGroupBuys = product && factories && supplier
    ? groupBuys
        .filter(g => {
           // Must be open
           if (g.status !== 'open') return false;
           // Must be different group buy (if current product is in one)
           if (gb && g.id === gb.id) return false;
           
           // Must be from same supplier (via factory)
           const gbFactory = factories.find(f => f.id === g.factoryId);
           return gbFactory?.supplierId === supplier.id;
        })
        .slice(0, 4)
        .map(g => {
           // Get main product of the group buy
           const mainProduct = products.find(p => p.id === g.productIds?.[0]);
           return mainProduct ? {
              id: mainProduct.id,
              name: g.title || mainProduct.name, // Use GB title if available
              price: mainProduct.price,
              tieredPricing: mainProduct.tieredPricing,
              image: g.image || mainProduct.images?.[0] || '',
              groupBuyId: g.id
           } : null;
        })
        .filter((item): item is NonNullable<typeof item> => item !== null)
    : [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
    </div>
  );

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-[1400px] mx-auto py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Товар не найден</h1>
          <button onClick={() => router.back()} className="text-primary-600 hover:underline">Вернуться назад</button>
        </div>
      </div>
    );
  }

  // Find the active group buy for this product's factory


  const calculateTimeLeft = (dateStr: string) => {
    const deadline = new Date(dateStr);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} дн.` : 'Завершен';
  };

  const daysLeftNum = gb ? Math.ceil((new Date(gb.deadline).getTime() - (new Date()).getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const progressPercent = gb ? Math.min(Math.round((gb.currentQuantity / gb.targetQuantity) * 100), 100) : 0;
  const isHot = daysLeftNum <= 3 || progressPercent >= 80;

  const displayProduct = {
    ...product,
    groupBuy: gb ? {
      id: gb.id,
      title: gb.title,
      participants: Math.floor(gb.currentQuantity / 10 + 50),
      target: gb.targetQuantity,
      timeLeft: calculateTimeLeft(gb.deadline),
      progress: progressPercent,
      currentQuantity: gb.currentQuantity,
      orgFee: gb.orgFee || 10,
      minAmount: gb.minAmount || 50000,
      deadline: gb.deadline,
      collectionDate: gb.collectionDate || '15.02.2026',
      deliveryDate: gb.deliveryDate || '05.03.2026',
      isHot
    } : undefined
  };

  const formattedSuggested = suggestedProducts.map(p => {
    const pGb = groupBuys.find(g => g.productIds?.includes(p.id) && g.status === 'open');
    return {
      ...p,
      groupBuy: pGb ? {
        id: pGb.id,
        participants: 0,
        target: pGb.targetQuantity,
        timeLeft: pGb.deadline,
        progress: Math.min(Math.round((pGb.currentQuantity / pGb.targetQuantity) * 100), 100)
      } : undefined
    };
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-[1400px] mx-auto pb-20 pt-8">
        <div className="px-6 md:px-12 mb-6">
            <Breadcrumbs 
                items={[
                    { label: 'Каталог', href: '/catalog' },
                    { label: 'Поставщики', href: '/suppliers' },
                    { label: supplier?.name || 'Поставщик', href: supplier ? `/supplier/${supplier.id}` : '#' },
                    { label: factory?.name || 'Фабрика', href: factory ? `/factory/${factory.id}` : '#' },
                    ...(gb ? [{ label: gb.title || 'Закупка', href: `/group-buy/${gb.id}` }] : []),
                    { label: product.name }
                ]}
            />
        </div>


        {/* Main Content Area: 3 Columns */}
        {/* Main Content Area: 3 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 px-6 md:px-12">
          {/* Left: Gallery */}
          <div className={`${sidebarGroupBuys.length > 0 ? 'lg:col-span-5' : 'lg:col-span-7'}`}>
             <ProductGallery images={displayProduct.images || []} />
          </div>

          {/* Center: Info */}
          <div className={`${sidebarGroupBuys.length > 0 ? 'lg:col-span-4' : 'lg:col-span-5'}`}>
            <ProductInfo 
              productId={displayProduct.id}
              groupBuyId={gb?.id}
              category={displayProduct.category}
              name={displayProduct.name}
              price={displayProduct.price}
              description={displayProduct.description}
              specs={displayProduct.specs}
              tieredPricing={displayProduct.tieredPricing}
              rating={displayProduct.rating}
              reviewsCount={displayProduct.reviewsCount}
              boughtCount={displayProduct.boughtCount}
              shipping={displayProduct.shipping}
              groupBuy={displayProduct.groupBuy}
            />
          </div>

          {/* Right: Sidebar */}
          {sidebarGroupBuys.length > 0 && (
              <div className="lg:col-span-3 hidden lg:block border-l border-gray-100 pl-6">
                 <ProductSidebar 
                     organizerName={supplier?.name || 'Организатора'}
                     products={sidebarGroupBuys}
                 />
              </div>
          )}
        </div>

        {/* Bottom Section: Photos & Description */}
        <div className="px-6 md:px-12 mb-16">
            {/* Customer Photos */}
            <div className="mb-12">
               <h2 className="text-lg font-bold text-gray-900 mb-6">Фотографии покупателей</h2>
               <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {/* Mock customer photos */}
                  {[1,2,3,4,5,6].map((i) => (
                     <div key={i} className="w-32 h-32 shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity">
                        <img 
                           src={`https://source.unsplash.com/random/200x200?product&sig=${i}`} 
                           alt={`Customer photo ${i}`}
                           className="w-full h-full object-cover" 
                        />
                     </div>
                  ))}
                  <div className="w-12 flex items-center justify-center shrink-0">
                     <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                     </button>
                  </div>
               </div>
            </div>

            {/* Description & Composition Tabs */}
            <div className="max-w-4xl">
               <h2 className="text-2xl font-bold text-gray-900 mb-6">Описание</h2>
               <div className="prose prose-sm md:prose-base text-gray-600 leading-relaxed mb-8">
                  {product.description}
                  <p className="mt-4">
                     Батончик из молочного шоколада Baby Fox, созданный специально для детей. Молочный шоколад с обволакивающим сливочным вкусом. Щедрая порция цельного сухого молока, добавленная в начинку, дарит батончику нежную молочную ноту. Батончик Babyfox - 100% натуральный состав. Рецептура батончика BabyFox разработана специально для детей чтобы
                  </p>
               </div>

               <h2 className="text-2xl font-bold text-gray-900 mb-6">Состав</h2>
               <p className="text-sm text-gray-600 leading-relaxed max-w-2xl mb-8">
                  Соль, сахар, жир кондитерский, молочный жир, молочный шоколад, пальмовое масло рафинированное дезодорированное, молоко обезжиренное сухое, ароматизатор натуральный, возможно содержание следов арахиса, сухое цельное молоко, соевый лецитин.
               </p>

               <h2 className="text-2xl font-bold text-gray-900 mb-6">Характеристики</h2>
               <div className="max-w-xl">
                  {product.specs?.map((spec, i) => (
                     <div key={i} className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">{spec.name}</span>
                        <span className="font-medium text-gray-900">{spec.value}</span>
                     </div>
                  ))}
                  {/* Mock additional specs if empty */}
                  {(!product.specs || product.specs.length === 0) && (
                     <p className="text-gray-400 italic">Характеристики не указаны</p>
                  )}
                  <p className="text-xs text-gray-400 mt-6 leading-relaxed">
                     Информация о технических характеристиках, комплекте поставки, стране изготовления и внешнем виде товара носит справочный характер и основывается на последних доступных сведениях от производителя.
                  </p>
               </div>
            </div>
        </div>

        <ProductSection 
          title={formattedSuggested.length > 0 && gb ? "Товары из этого сбора" : "Похожие товары"} 
          products={formattedSuggested} 
        />
      </main>
    </div>
  );
}
