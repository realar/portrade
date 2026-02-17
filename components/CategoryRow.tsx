'use client';

import Link from 'next/link';
import { Category } from '@/app/actions/catalog';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryRowProps {
  categories: Category[];
}

export default function CategoryRow({ categories }: CategoryRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = 300;
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  if (!categories || categories.length === 0) return null;

  return (
    <div className="relative group">
      {/* Scroll Buttons */}
      <button 
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/80 backdrop-blur rounded-full shadow-md flex items-center justify-center text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white disabled:opacity-0"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <button 
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/80 backdrop-blur rounded-full shadow-md flex items-center justify-center text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white disabled:opacity-0"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div 
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 pt-2 px-1 scrollbar-hide snap-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category) => (
          <Link 
            key={category.id} 
            href={`/catalog/${category.id}`}
            className="flex flex-col items-center gap-2 group/item min-w-[80px] snap-start cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-transparent group-hover/item:border-primary-200 transition-all">
               {category.image ? (
                   <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
               ) : (
                   <div className="w-8 h-8 rounded-full bg-primary-100" />
               )}
            </div>
            <span className="text-xs font-medium text-gray-700 text-center line-clamp-2 max-w-[90px] group-hover/item:text-primary-600 transition-colors">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
