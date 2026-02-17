import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import SubCategoryPills from './SubCategoryPills';
import ProductCard from '../ProductCard';
import { Product } from '@/context/MockDataContext';

interface Category {
  id: string;
  name: string;
  subCategories?: string[];
}

interface CatalogBlockProps {
  category: Category;
  products: Product[];
}

export default function CatalogBlock({ category, products }: CatalogBlockProps) {
  // Take first 4 products for display in this block
  const displayProducts = products.slice(0, 4);

  return (
    <section className="py-8 border-b border-gray-100 last:border-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <Link href={`/catalog/${category.id}`} className="group flex items-center gap-2 mb-2">
            <h2 className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
              {category.name}
            </h2>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
          </Link>
          {category.subCategories && (
            <SubCategoryPills categories={category.subCategories} />
          )}
        </div>
        
        <Link 
          href={`/catalog/${category.id}`}
          className="hidden md:block text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors"
        >
          Смотреть все
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayProducts.map((product: any) => (
          <div key={product.id} className="h-full">
            <ProductCard 
              id={product.id}
              name={product.name}
              price={product.price}
              category={category.name}
              images={product.images}
              tieredPricing={product.tieredPricing}
              timeLeft={product.timeLeft}
              isLastChance={product.isLastChance}
              groupBuyId={product.groupBuy?.id}
            />
          </div>
        ))}
      </div>
      
       <Link 
          href={`/catalog/${category.id}`}
          className="md:hidden mt-6 block text-center w-full py-2.5 bg-gray-50 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
        >
          Смотреть все товары категории
        </Link>
    </section>
  );
}
