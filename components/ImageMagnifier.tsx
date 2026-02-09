'use client';

import React, { useState, MouseEvent } from 'react';

interface ImageMagnifierProps {
  src: string;
  alt?: string;
}

export default function ImageMagnifier({ src, alt }: ImageMagnifierProps) {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = () => {
    setShowMagnifier(true);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    
    // Calculate percentage position of cursor inside the element
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setPosition({ x, y });
  };

  return (
    <div 
      className="relative w-full h-full overflow-hidden cursor-crosshair"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* Original Image - always rendered to maintain layout/aspect ratio if needed, 
          though parent handles aspect-square. 
          We hide it visually when magnifier is active to prevent ghosting, 
          or just toggle opacity. 
      */}
      <img 
        src={src} 
        alt={alt} 
        className={`w-full h-full object-contain md:object-cover transition-opacity duration-200 ${showMagnifier ? 'opacity-0' : 'opacity-100'}`} 
      />
      
      {/* Magnified Layer */}
      {showMagnifier && (
        <div 
            className="absolute inset-0 pointer-events-none"
            style={{
                backgroundImage: `url(${src})`,
                backgroundPosition: `${position.x}% ${position.y}%`,
                backgroundSize: '200%', // 2x Zoom level
                backgroundRepeat: 'no-repeat'
            }}
        />
      )}
    </div>
  );
}
