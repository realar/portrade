import ProductCard from './ProductCard';
import { Flame } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: number;
  category: string;
  name: string;
  price: number;
  timeLeft?: string;
  images?: string[];
}

interface ProductSectionProps {
  title: string;
  products: Product[];
  icon?: 'fire';
  showAllLink?: string;
}

export default function ProductSection({ title, products, icon, showAllLink }: ProductSectionProps) {
  return (
    <section className="w-full md:px-12 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          {icon === 'fire' && <Flame className="w-5 h-5 text-primary-600 fill-primary-600" />}
          {title}
        </h2>
        {showAllLink && (
          <Link href={showAllLink} className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">
            Смотреть все →
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            category={product.category}
            name={product.name}
            price={product.price}
            timeLeft={product.timeLeft}
            image={product.images?.[0]}
            images={product.images}
            isLastChance={icon === 'fire'}
          />
        ))}
      </div>
    </section>
  );
}
