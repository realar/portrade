'use client';

// Simple bar chart using native SVG to avoid heavy dependencies like recharts
// Data structure: { month: string, rating: number }[]

interface RatingData {
  month: string;
  rating: number;
}

interface SupplierRatingChartProps {
  data: RatingData[];
  height?: number;
  className?: string;
}

export default function SupplierRatingChart({ data, height = 120, className = "" }: SupplierRatingChartProps) {
  if (!data || data.length === 0) return null;

  // Assume rating is 0-5
  const maxRating = 5;
  const padding = 20;
  const barWidth = 8; // Narrow bars
  const gap = 12; // Gap between bars
  
  // Calculate width based on data
  const width = data.length * (barWidth + gap);
  
  // Create bars
  const bars = data.map((item, index) => {
    const barHeight = (item.rating / maxRating) * (height - padding);
    const x = index * (barWidth + gap) + padding;
    const y = height - barHeight - padding; // SVG coordinates from top-left
    
    return (
      <g key={index} className="group cursor-pointer">
        {/* Bar */}
        <rect
          x={x}
          y={y}
          width={barWidth}
          height={barHeight}
          rx={4} // Rounded corners
          ry={4}
          className="fill-primary-500/50 group-hover:fill-primary-500 transition-colors duration-300"
        />
        
        {/* Month Label */}
        <text
          x={x + barWidth / 2}
          y={height - 2}
          textAnchor="middle"
          className="text-[10px] fill-gray-400 font-medium"
        >
          {item.month[0]} 
        </text>

        {/* Tooltip (simple implementation via title for now) */}
        <title>{`${item.month}: ${item.rating}`}</title>
      </g>
    );
  });

  return (
    <div className={`relative ${className}`}>
        <h4 className="text-sm font-bold text-gray-800 mb-2">Рейтинг по месяцам</h4>
        <div className="flex h-full items-end">
            {/* Y Axis Labels (0, 2.5, 5) */}
            <div className="flex flex-col justify-between h-[100px] text-[9px] text-gray-400 mr-2 py-1">
                <span>5.0</span>
                <span>4.0</span>
                <span>3.0</span>
                <span>2.0</span>
                <span>1.0</span>
            </div>
            
            {/* Chart */}
            <svg width="100%" height={height} viewBox={`0 0 ${width + padding * 2} ${height}`} className="overflow-visible">
                {/* Background Grid Lines (optional) */}
                {[0.2, 0.4, 0.6, 0.8, 1].map((p, i) => (
                    <line 
                        key={i} 
                        x1={padding} 
                        y1={(height - padding) * (1-p) + padding} 
                        x2={width + padding} 
                        y2={(height - padding) * (1-p) + padding} 
                        stroke="#f0f0f0" 
                        strokeWidth="1" 
                    />
                ))}
                {bars}
            </svg>
        </div>
    </div>
  );
}
