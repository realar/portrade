'use client';

import { useState, MouseEvent } from 'react';
import Link from 'next/link';
import Price from './Price';

interface ProductCardProps {
  id: number;
  category: string;
  name: string;
  price: number;
  timeLeft?: string;
  image?: string;
  images?: string[];
}

export default function ProductCard({ id, category, name, price, timeLeft, image, images }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Use images array if available, otherwise fallback to single image
  const imageList = images && images.length > 0 ? images : (image ? [image] : []);
  const currentImage = imageList[currentImageIndex] || imageList[0];

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
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
  };

  return (
    <Link href={`/product/${id}`} className="flex flex-col group cursor-pointer transition-all">
      <div 
        className="aspect-square bg-gray-100 rounded-lg mb-3 relative overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
         {currentImage ? (
            <img src={currentImage} alt={name} className="w-full h-full object-cover transition-transform duration-300" />
         ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
         )}
         
         {/* Simple indicator dots if multiple images */}
         {imageList.length > 1 && (
           <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
             {imageList.map((_, idx) => (
               <div 
                 key={idx} 
                 className={`h-1.5 rounded-full shadow-sm transition-all ${idx === currentImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
               />
             ))}
           </div>
         )}

         {timeLeft && (
           <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-md text-xs font-medium text-gray-800 shadow-sm z-10">
             Осталось: {timeLeft}
           </div>
         )}
      </div>
      <div className="text-xs text-gray-500 mb-1">{category}</div>
      <div className="font-medium text-gray-900 mb-1 group-hover:text-primary-600 transition-colors duration-200">{name}</div>
      <Price amount={price} className="font-bold text-gray-900" />
    </Link>
  );
}
