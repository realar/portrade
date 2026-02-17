import React from 'react';

interface Tier {
  minQty: number;
  maxQty: number;
  price: number;
}

interface ProductTieredPricingProps {
  tiers: Tier[];
  currentQuantity?: number; // For highlighting active tier in a group buy
}

export default function ProductTieredPricing({ tiers, currentQuantity }: ProductTieredPricingProps) {
  if (!tiers || tiers.length === 0) return null;

  // Sort tiers by minQty just in case
  const sortedTiers = [...tiers].sort((a, b) => a.minQty - b.minQty);

  // Determine active tier based on currentQuantity
  const activeTierIndex = currentQuantity 
    ? sortedTiers.findIndex(t => currentQuantity >= t.minQty && currentQuantity <= t.maxQty)
    : -1;

  // Use the last tier if quantity exceeds all defined ranges
  const effectiveTierIndex = (activeTierIndex === -1 && currentQuantity && currentQuantity > sortedTiers[sortedTiers.length - 1].maxQty) 
    ? sortedTiers.length - 1 
    : activeTierIndex;

  return (
    <div className="flex gap-4 mb-6 overflow-x-auto pb-2 scrollbar-hide">
      {sortedTiers.map((tier, index) => {
        const isActive = index === effectiveTierIndex;
        return (
          <div 
            key={index} 
            className={`flex flex-col min-w-[100px] ${isActive ? 'opacity-100' : 'opacity-70'} hover:opacity-100 transition-opacity`}
          >
            <div className={`text-2xl font-bold ${isActive ? 'text-primary-600' : 'text-gray-900'}`}>
              {tier.price} <span className="text-sm font-normal text-gray-500 font-sans">₽</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {tier.minQty}-{tier.maxQty} шт.
            </div>
          </div>
        );
      })}
    </div>
  );
}
