import Link from 'next/link';
import { Store, Star, MapPin } from 'lucide-react';


interface SupplierCardProps {
  id: string;
  name: string;
  logo?: string;
  description: string;
  rating: number;
  completedDeals: number;
  country: string;
  // Extended props
  skuCount?: number;
  reviewsCount?: number;
  followersCount?: number;
  totalOrders?: number;
  registrationDate?: string;
  lastSeen?: string;
  ratingHistory?: { month: string; rating: number }[];
  ratingBreakdown?: { stars: number; count: number }[];
}

export default function SupplierCard({ 
    id, name, logo, rating, country,
    skuCount = 0,
    reviewsCount = 0,
    followersCount = 0,
    totalOrders = 0,
    registrationDate,
    lastSeen,
    ratingHistory = [],
    ratingBreakdown = []
}: SupplierCardProps) {
  
  // Helper to standardise date display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    // If it's just a year-month like '2020-09-15', return as is or minimal format
    return dateString;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 relative group/card">
      <Link href={`/supplier/${id}`} className="absolute inset-0 z-0" aria-label={`View ${name}`} />
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 relative z-10 pointer-events-none">
        
        {/* Column 1: Supplier Identity (4 cols) */}
        <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left border-b md:border-b-0 md:border-r border-gray-100 pb-6 md:pb-0 md:pr-6 pointer-events-auto">
            <div className="group block mb-4 cursor-pointer">
                <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 mx-auto md:mx-0 relative">
                    {logo ? (
                    <img src={logo} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                    <Store className="w-10 h-10 text-gray-300" />
                    )}
                </div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">{name}</h3>
            <div className="text-sm text-gray-500 flex items-center gap-1 mb-4 justify-center md:justify-start">
               <MapPin className="w-3.5 h-3.5" /> {country}
            </div>

            <button className="w-full mt-auto bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 px-4 rounded-full text-sm transition-colors shadow-sm shadow-primary-500/30 relative z-20">
                ПОДПИСАТЬСЯ
            </button>
        </div>

        {/* Column 2: Rating Stats (4 cols) */}
        <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-gray-100 pb-6 md:pb-0 md:pr-6 md:pl-2">
            <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-white bg-primary-500 px-1.5 py-0.5 rounded">РЕЙТИНГ</span>
            </div>
            
            <div className="mb-4 text-center md:text-left">
                <div className="text-5xl font-bold text-gray-800 leading-tight">{rating.toFixed(1)}</div>
                <div className="flex items-center gap-1 justify-center md:justify-start mt-1">
                    {[1,2,3,4,5].map(star => (
                        <Star 
                            key={star} 
                            className={`w-4 h-4 ${star <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} 
                        />
                    ))}
                    <span className="text-gray-300 ml-1 hover:text-gray-400 transition-colors cursor-pointer">☆</span>
                </div>
            </div>

            {/* Rating Breakdown Bars */}
            <div className="space-y-1.5">
                {[5, 4, 3, 2, 1].map((stars) => {
                    const count = ratingBreakdown.find(r => r.stars === stars)?.count || 0;
                    // Mock total for percentage calculation
                    const totalRatings = ratingBreakdown.reduce((sum, r) => sum + r.count, 0) || 1; 
                    const percent = (count / totalRatings) * 100;
                    
                    return (
                        <div key={stars} className="flex items-center gap-2 text-xs">
                             <div className="flex gap-0.5 min-w-[50px]">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-2.5 h-2.5 ${i < stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                                ))}
                             </div>
                             <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                 <div className="h-full bg-primary-500 rounded-full" style={{ width: `${percent}%` }}></div>
                             </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Column 3: Key Indicators (4 cols) */}
        <div className="md:col-span-4 md:pl-2 flex flex-col justify-center">
            <h4 className="font-bold text-gray-800 mb-4">Показатели</h4>
            <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                        <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                        Заказы
                    </div>
                    <span className="font-medium text-gray-900">{totalOrders}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                         <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                        Подписчики
                    </div>
                    <span className="font-medium text-gray-900">{followersCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                         <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                        Отзывы
                    </div>
                    <span className="font-medium text-gray-900">{reviewsCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                         <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                        Кол-во SKU
                    </div>
                    <span className="font-medium text-gray-900">{skuCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-4 pt-4 border-t border-dashed border-gray-200">
                    <div className="flex items-center gap-2 text-gray-500">
                         <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                        Регистрация
                    </div>
                    <span className="font-medium text-gray-500 text-xs">{formatDate(registrationDate)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                         <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                        Был на сайте
                    </div>
                    <span className="font-medium text-gray-500 text-xs">{lastSeen || '-'}</span>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
