import { Star, Eye, ShieldCheck } from 'lucide-react';
import AddToCartButton from './AddToCartButton';
import ProductTieredPricing from './ProductTieredPricing';
import CountdownTimer from './CountdownTimer';

import GroupBuyMiniCards from './GroupBuyMiniCards';

interface Spec {
  name: string;
  value: string;
}

interface Tier {
  minQty: number;
  maxQty: number;
  price: number;
}

interface ProductInfoProps {
  productId: number;
  groupBuyId?: number;
  category: string;
  name: string;
  price: number;
  description?: string;
  specs?: Spec[];
  tieredPricing?: Tier[];
  rating?: number;
  reviewsCount?: number;
  boughtCount?: number;
  shipping?: {
    country: string;
    city: string;
    method: string;
    leadTime: string;
  };
  groupBuy?: {
    id: number;
    title?: string;
    participants: number;
    target: number;
    timeLeft: string;
    progress: number;
    currentQuantity?: number;
    orgFee?: number;
    minAmount?: number;
    deadline?: string;
    collectionDate?: string;
    deliveryDate?: string;
    isHot?: boolean;
  };
}

export default function ProductInfo({ 
  productId, 
  groupBuyId, 
  name,
  price,
  tieredPricing,
  rating,
  groupBuy 
}: ProductInfoProps) {
  const isHot = groupBuy?.isHot || false;

  return (
    <div className="flex flex-col max-w-xl">
      {/* Header: Title & Rating */}
      <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">{name}</h1>
      <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
        <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < Math.floor(rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
            ))}
        </div>
        <span className="text-gray-300">|</span>
        <span className="text-gray-400">Артикул: {productId}</span>
      </div>

      {/* Pricing Section (Tiered) - MOVED UP */}
      <div className="mb-8">
        {tieredPricing && tieredPricing.length > 0 ? (
            <ProductTieredPricing tiers={tieredPricing} currentQuantity={groupBuy?.currentQuantity} />
        ) : (
            <div className="text-3xl font-bold text-gray-900">{price} <span className="font-sans">₽</span></div>
        )}
      </div>

      {/* Countdown Timer */}
      {groupBuy && groupBuy.deadline && (
         <CountdownTimer targetDate={groupBuy.deadline} />
      )}

      {/* Action Flags */}
      <div className="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-wider text-gray-400 mb-8 border-b border-gray-50 pb-6">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-gray-300" />
            <span>Просмотров: 1240</span>
          </div>
          <div className="flex items-center gap-2 text-green-600">
            <ShieldCheck className="w-4 h-4" />
            <span>Защита покупателя</span>
          </div>
      </div>

      {/* Group Buy Stats Grid */}
      {groupBuy && (
        <div className="bg-[#FBFAFF] rounded-2xl border border-[#EEEBFF] p-6 mb-8">
            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Орг сбор</span>
                <span className="font-black text-gray-900">{groupBuy.orgFee}%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Собрано</span>
                <span className="font-black text-[#5B47B8]">{groupBuy.progress}%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Минималка</span>
                <span className="font-black text-gray-900">{groupBuy.minAmount?.toLocaleString()} <span className="font-sans">₽</span></span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">До</span>
                <span className="font-black text-gray-900">15.02.2026</span>
              </div>
              <div className="flex justify-between items-center text-sm col-span-2 pt-2 border-t border-gray-100">
                <span className="text-gray-500">Доставка</span>
                <span className="font-black text-gray-900">05.03.2026</span>
              </div>
            </div>
        </div>
      )}
      
      {/* Mini Cards & Main CTA */}
      {groupBuy && (
        <div className="flex flex-col gap-6">
            <GroupBuyMiniCards 
              participants={groupBuy.participants} 
              progress={groupBuy.progress}
            />
            
            <AddToCartButton 
              productId={productId} 
              groupBuyId={groupBuyId} 
              fullWidth={true} 
              className={`h-14 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg transition-all ${
                isHot 
                ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-orange-200' 
                : 'bg-[#5B47B8] hover:bg-[#4C3B9E] text-white'
              }`} 
              label={isHot ? "🔥 Горящая закупка" : "Присоединиться"}
            />
        </div>
      )}
    </div>
  );
}
