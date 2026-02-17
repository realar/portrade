'use client';

import { ArrowDownAZ, Calendar, Package, Star, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SortOption = 'date' | 'rating' | 'orders' | 'subscribers' | 'sku';

interface SupplierFiltersProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export default function SupplierFilters({ currentSort, onSortChange }: SupplierFiltersProps) {
  const options: { id: SortOption; label: string; icon: React.ReactNode }[] = [
    { id: 'date', label: 'Дате регистрации', icon: <Calendar className="w-4 h-4" /> },
    { id: 'rating', label: 'Рейтингу', icon: <Star className="w-4 h-4" /> },
    { id: 'orders', label: 'Кол-ву заказов', icon: <Users className="w-4 h-4" /> },
    { id: 'subscribers', label: 'Кол-ву подписчиков', icon: <Users className="w-4 h-4" /> },
    { id: 'sku', label: 'Кол-ву SKU', icon: <Package className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
      <div className="text-sm font-medium text-gray-500 whitespace-nowrap">Сортировать по:</div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onSortChange(option.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
              currentSort === option.id 
                ? "bg-primary-50 text-primary-600 hover:bg-primary-50" 
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            {option.label}
            {currentSort === option.id && (
              <ArrowDownAZ className="w-3 h-3 ml-1" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
