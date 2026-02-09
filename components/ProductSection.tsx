import ProductCard from './ProductCard';

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
}

export default function ProductSection({ title, products }: ProductSectionProps) {
  return (
    <section className="w-full px-6 md:px-12 py-8">
      <h2 className="text-xl font-semibold mb-6 text-gray-900">{title}</h2>
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
          />
        ))}
      </div>
    </section>
  );
}
