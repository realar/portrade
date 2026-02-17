import Link from 'next/link';
import { Clock, Package, Star } from 'lucide-react';

interface GroupBuyCardProps {
  id: number;
  title?: string;
  factoryName: string;
  progress: number;
  deadline: string;
  targetQuantity: number;
  image?: string;
  rating?: number;
  reviewsCount?: number;
  leadTime?: string;
}

export default function GroupBuyCard({ 
  id, 
  title, 
  factoryName, 
  progress, 
  deadline, 
  targetQuantity, 
  image, 
  rating, 
  reviewsCount,
  leadTime
}: GroupBuyCardProps) {
  const daysLeft = Math.max(0, Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  const isHot = daysLeft <= 3 || progress >= 80;

   return (
    <Link href={`/group-buy/${id}`} className="group flex flex-col h-full bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300 relative">
      {isHot && (
        <>
           {/* CTA Overlay */}
           <div className="absolute top-3 right-3 z-10 max-w-[180px] bg-white/95 backdrop-blur-sm border border-primary-100 shadow-xl rounded-xl p-3 text-xs leading-tight animate-fade-in-up">
              <span className="block font-bold text-gray-900 mb-1">🔥 Успейте заказать!</span>
              <span className="text-gray-600 block">
                 При закрытии сбора сегодня — доставка через <span className="font-semibold text-primary-600">{leadTime || '7-10 дней'}</span>
              </span>
           </div>
        </>
      )}

      {/* Image */}
      <div className="aspect-[16/10] bg-gray-100 relative overflow-hidden shrink-0">
        {image ? (
          <img src={image} alt={title || factoryName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
            <Package className="w-10 h-10 text-primary-300" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors leading-tight">
                {title || factoryName}
            </h3>
        </div>
        
        <div className="flex items-center justify-between mb-4">
             <div className="text-xs text-gray-500 flex items-center gap-1.5">
                {factoryName}
             </div>
             {rating && (
                <div className="flex items-center gap-1 text-xs font-semibold text-gray-700 bg-gray-50 px-2 py-0.5 rounded-full">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> {rating} <span className="text-gray-400 font-normal">({reviewsCount || 0})</span>
                </div>
             )}
        </div>

        <div className="mt-auto space-y-3">
             {/* Timer */}
            <div className="flex items-center gap-1.5 text-xs">
              <Clock className={`w-3.5 h-3.5 ${isHot ? 'text-primary-500' : 'text-gray-400'}`} />
              <span className={`font-medium ${isHot ? 'text-primary-600' : 'text-gray-600'}`}>
                {daysLeft > 0 ? `Осталось ${daysLeft} дн.` : 'Завершается сегодня!'}
              </span>
              <span className="text-gray-300 mx-1">|</span>
              <span className="text-gray-500">Цель: {targetQuantity} шт.</span>
            </div>

            {/* Progress */}
            <div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-1.5">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${isHot ? 'bg-gradient-to-r from-primary-400 to-primary-600' : 'bg-primary-500'}`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-gray-400 font-medium uppercase tracking-wide">
                <span>Прогресс</span>
                <span className={progress >= 80 ? 'text-primary-600' : 'text-gray-600'}>{progress}%</span>
              </div>
            </div>
        </div>
      </div>
    </Link>
  );
}
