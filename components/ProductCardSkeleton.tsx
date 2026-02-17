import { Skeleton } from "@/components/ui/skeleton";

export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden border border-transparent">
      {/* Image Skeleton */}
      <Skeleton className="w-full aspect-square" />
      
      <div className="p-3 flex flex-col flex-grow space-y-3">
        {/* Category Skeleton */}
        <Skeleton className="h-3 w-1/3" />
        
        {/* Title Skeleton */}
        <div className="space-y-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        
        {/* Price Skeleton */}
        <div className="flex items-baseline gap-2 pt-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-12" />
        </div>

        {/* Button Skeleton */}
        <div className="mt-auto pt-2">
            <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
