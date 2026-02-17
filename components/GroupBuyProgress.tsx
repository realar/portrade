'use client';

import React from 'react';

interface GroupBuyProgressProps {
  progress: number;
  isHot?: boolean;
}

export default function GroupBuyProgress({ progress, isHot }: GroupBuyProgressProps) {
  const safeProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <div className="w-full">
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner relative">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-out relative ${
            isHot 
              ? 'bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 bg-[length:200%_100%] animate-shimmer shadow-[0_0_10px_rgba(239,68,68,0.5)]' 
              : 'bg-[#5B47B8]'
          }`}
          style={{ width: `${safeProgress}%` }}
        >
          {isHot && (
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
        .animate-shimmer {
          animation: shimmer 2s linear infinite;
        }
      `}</style>
    </div>
  );
}
