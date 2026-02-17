import Link from 'next/link';


interface SidebarProduct {
  id: number;
  name: string;
  price: number;
  tieredPricing?: { price: number }[];
  image: string;
  groupBuyId?: number;
}

interface ProductSidebarProps {
  organizerName: string;
  products: SidebarProduct[];
}

export default function ProductSidebar({ organizerName, products }: ProductSidebarProps) {
  if (!products || products.length === 0) return null;

  return (
    <div className="hidden lg:block w-56 shrink-0">
      <h3 className="text-sm font-medium text-gray-500 mb-4 px-1">
        Другие закупки <br />
        <span className="text-gray-900">{organizerName}</span>
      </h3>
      
      <div className="space-y-2">
        {products.map((product) => (
          <Link 
            key={product.id} 
            href={product.groupBuyId ? `/group-buy/${product.groupBuyId}` : `/product/${product.id}`}
            className="group block p-2 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
          >
            <div className="min-w-0">
               <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 group-hover:text-primary-600 transition-colors">
                  {product.name}
               </h4>
               {product.groupBuyId && (
                   <span className="inline-block px-1.5 py-0.5 rounded bg-green-50 text-green-700 text-[10px] font-medium mt-1">
                      Идет сбор
                   </span>
               )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
