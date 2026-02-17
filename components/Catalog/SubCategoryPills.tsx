'use client';

import { cn } from "@/lib/utils";

interface SubCategoryPillsProps {
  categories: string[];
  className?: string;
  onSelect?: (category: string) => void;
  selected?: string;
}

export default function SubCategoryPills({ categories, className, onSelect, selected }: SubCategoryPillsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect?.(cat)}
          className={cn(
            "px-3 py-1.5 rounded-full text-sm font-medium transition-colors border",
            selected === cat
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
