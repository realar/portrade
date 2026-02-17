import { useState } from 'react';


interface ProductGalleryProps {
  images?: string[];
}

export default function ProductGallery({ images = [] }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Use selected image or first image from array
  const mainImage = selectedImage || (images && images.length > 0 ? images[0] : null);

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex-1 min-h-[400px] w-full bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 overflow-hidden relative">
        {mainImage ? (
            <div className="absolute inset-0">
               <img src={mainImage} className="w-full h-full object-cover" alt="Product" />
            </div>
        ) : (
            <span>No Image</span>
        )}
      </div>
      
      {images.length > 0 && (
        <div className="grid grid-cols-5 gap-3 shrink-0">
          {images.map((img, i) => (
            <div 
              key={i} 
              onClick={() => setSelectedImage(img)}
              className={`aspect-square bg-gray-50 rounded-lg border cursor-pointer transition-all overflow-hidden ${mainImage === img ? 'border-primary-500 ring-2 ring-primary-100' : 'border-transparent hover:border-gray-300'}`}
            >
               <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
