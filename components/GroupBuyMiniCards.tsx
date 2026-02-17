'use client';

import React from 'react';

interface MiniCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  isHot?: boolean;
}

function MiniCard({ label, value, subValue, isHot }: MiniCardProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-3 rounded-xl border ${
      isHot ? 'bg-red-50 border-red-100 shadow-sm animate-pulse' : 'bg-white border-gray-100'
    }`}>
      <div className="flex items-baseline gap-0.5">
        <span className={`text-xl font-black ${isHot ? 'text-red-600' : 'text-gray-900'}`}>{value}</span>
        {subValue && <span className={`text-[10px] font-bold ${isHot ? 'text-red-500' : 'text-gray-400'} uppercase ml-0.5`}>{subValue}</span>}
      </div>
      <span className={`text-[10px] font-bold tracking-wider uppercase text-center mt-1 ${isHot ? 'text-red-400' : 'text-gray-400'}`}>
        {label}
      </span>
    </div>
  );
}

interface GroupBuyMiniCardsProps {
  participants: number;
  progress: number;
}

export default function GroupBuyMiniCards({ participants, progress }: GroupBuyMiniCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 w-full">

      <MiniCard 
        label="участников" 
        value={participants} 
      />
      <MiniCard 
        label="собрано" 
        value={progress} 
        subValue="%" 
      />
    </div>
  );
}
