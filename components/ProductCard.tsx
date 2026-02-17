'use client';

import { useState, MouseEvent } from 'react';
import Link from 'next/link';
import { Flame, Truck, BarChart2 } from 'lucide-react';
import AddToCartButton from './AddToCartButton';
import { formatPriceValue } from './Price';

interface ProductCardProps {
  id: number;
  category: string;
  name: string;
  price: number;
  tieredPricing?: { price: number; minQty: number; maxQty: number }[];
  timeLeft?: string;
  image?: string;
  images?: string[];
  isLastChance?: boolean;
  groupBuyId?: number;
}

export default function ProductCard({ id, category, name, price, tieredPricing, timeLeft, image, images, isLastChance, groupBuyId }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
   const [imageError, setImageError] = useState(false);
   
   // Use images array if available, otherwise fallback to single image
   const imageList = images && images.length > 0 ? images : (image ? [image] : []);
   const currentImage = imageList[currentImageIndex] || imageList[0];
   
   // Function to handle image error
   const handleImageError = () => {
     setImageError(true);
   };
 
   // Reset error state when current image changes
   if (currentImageIndex !== 0 && imageError) {
       setImageError(false);
   }

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (imageList.length <= 1) return;
    
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    
    // Calculate index based on horizontal position
    // Divide width into equal segments for each image
    const segmentWidth = width / imageList.length;
    const index = Math.floor(x / segmentWidth);
    
    // Ensure index is within bounds
    const safeIndex = Math.max(0, Math.min(index, imageList.length - 1));
    
    setCurrentImageIndex(safeIndex);
  };

  const handleMouseLeave = () => {
    setCurrentImageIndex(0); // Reset to main image on leave
    setImageError(false); // Reset error state
  };

  // Calculate display price
  const displayPrice = tieredPricing && tieredPricing.length > 0 
    ? Math.min(...tieredPricing.map(t => t.price)) 
    : price;
  
  // Calculate potential discount (mock logic for now, or based on tiered pricing)
  // Let's assume max price in tiered pricing is "base" price, or just add a mock discount for visual
  const basePrice = tieredPricing && tieredPricing.length > 0 ? Math.max(...tieredPricing.map(t => t.price)) * 1.2 : price * 1.15;
  const discount = Math.round((1 - displayPrice / basePrice) * 100);

  return (
    <div 
      className="flex flex-col group h-full bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-transparent relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
        <Link href={`/product/${id}`} className="block w-full h-full"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
           {!imageError && currentImage ? (
              <img 
                src={currentImage} 
                alt={name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                onError={handleImageError}
              />
           ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <img src="/images/product-placeholder.png" alt="No image" className="w-2/3 h-2/3 object-contain opacity-50" />
              </div>
           )}
        </Link>
         
        {/* Simple indicator dots if multiple images */}
        {imageList.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 px-4">
            {imageList.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1 rounded-full shadow-sm transition-all duration-300 ${idx === currentImageIndex ? 'w-full bg-gray-800' : 'w-full bg-gray-300/50'}`}
              />
            ))}
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10 items-start">
            {discount > 0 && (
                <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">
                    Можно дешевле до -{discount}%
                </span>
            )}
             {timeLeft && (
               <div className="bg-white/95 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold text-gray-800 shadow-sm flex items-center gap-1">
                 {isLastChance && <Flame className="w-3 h-3 text-red-500 fill-red-500" />}
                 {timeLeft}
               </div>
             )}
        </div>

        <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur rounded-full text-gray-400 hover:text-red-500 hover:bg-white transition-colors opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
        </button>

         {/* Compare Button Overlay */}
         <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <button className="bg-gray-800/80 backdrop-blur-md text-white text-xs font-medium py-2 px-4 rounded-full flex items-center gap-2 hover:bg-gray-900 transition-colors shadow-lg whitespace-nowrap">
                <BarChart2 className="w-3.5 h-3.5" />
                Сравнить цены
            </button>
         </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <Link href={`/product/${id}`} className="group-hover:text-primary-600 transition-colors">
             <h3 className="font-medium text-gray-900 leading-snug line-clamp-2 mb-2 min-h-[2.5rem] text-[15px]">
              {name}
            </h3>
        </Link>
        
        <div className="text-xs text-gray-400 mb-3">{category}</div>
        
        <div className="text-xs text-gray-500 mb-1">1 шт в упаковке</div>

        <div className="mt-auto pt-2">
            <div className="flex items-baseline gap-1.5 mb-4">
            <span className="text-2xl font-bold text-gray-900">{formatPriceValue(displayPrice)}</span>
            <span className="text-sm font-medium text-gray-500"><span className="font-sans">₽</span>/шт</span>
            </div>

            <div className="w-full">
                 {groupBuyId ? (
                    <AddToCartButton productId={id} groupBuyId={groupBuyId} fullWidth={true} />
                 ) : (
                    <button 
                        className="w-full h-10 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center font-semibold text-sm transition-colors shadow-sm active:scale-95 duration-100"
                    >
                        В корзину
                    </button>
                 )}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2 items-start text-xs text-gray-500">
                <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2 py-1 rounded inline-flex font-medium">
                    <Truck className="w-3 h-3 fill-current" /> <span className="text-sm text-blue-700">Доставка через неделю</span>
                </div>
                <span className="text-sm">Всего <span className="text-gray-900 font-medium">1 предложение</span></span>
            </div>
        </div>
      </div>
    </div>
  );
}
