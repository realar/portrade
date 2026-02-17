'use client';

import Link from 'next/link';
import { ArrowRight, Users } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface FactoryCardProps {
  id: string;
  name: string;
  brands: string[];
  supplierName: string;
  image?: string;
  groupBuyProgress?: number;
  groupBuyDeadline?: string;
  productCount: number;
}

export default function FactoryCard({ id, name, brands, supplierName, image, groupBuyProgress, groupBuyDeadline, productCount }: FactoryCardProps) {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    if (groupBuyDeadline) {
      const msPerDay = 1000 * 60 * 60 * 24;
      const days = Math.max(0, Math.ceil((new Date(groupBuyDeadline).getTime() - Date.now()) / msPerDay));
      setDaysLeft(days);
    }
  }, [groupBuyDeadline]);

  const [imageError, setImageError] = useState(false);

  return (
    <Link href={`/factory/${id}`} className="flex flex-col h-full group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300">
      {/* Image */}
      <div className="aspect-[16/9] bg-gray-100 relative overflow-hidden">
        {!imageError && image ? (
          <Image 
            src={image} 
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <div className="relative w-1/2 h-1/2">
               <Image 
                 src="/images/product-placeholder.png" 
                 alt="No image" 
                 fill
                 className="object-contain opacity-50" 
               />
            </div>
          </div>
        )}
        {/* Brands badges */}
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          {brands.map(brand => (
            <span key={brand} className="bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-800 px-2.5 py-1 rounded-full shadow-sm">
              {brand}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="text-xs text-gray-500 mb-1">{supplierName}</div>
        <h3 className="font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">{name}</h3>

        {groupBuyProgress !== undefined && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                Активная закупка
              </span>
              {daysLeft !== null && (
                <span className={daysLeft <= 3 ? 'text-red-500 font-medium' : ''}>
                  {daysLeft > 0 ? `${daysLeft} дн.` : 'Завершается'}
                </span>
              )}
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${groupBuyProgress >= 80 ? 'bg-orange-500' : 'bg-primary-500'}`}
                style={{ width: `${Math.min(groupBuyProgress, 100)}%` }}
              />
            </div>
            <div className="text-xs text-gray-400 mt-1">{groupBuyProgress}% собрано</div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{productCount} товар{productCount > 4 ? 'ов' : productCount > 1 ? 'а' : ''}</span>
          <span className="text-primary-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
            Перейти <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
