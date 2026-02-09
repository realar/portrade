import catalog from '@/data/catalog.json';
import Link from 'next/link';

export default function CategoryGrid() {
  return (
    <section className="w-full px-6 md:px-12 py-8">
      <h2 className="text-xl font-semibold mb-6 text-gray-900">Категории товаров</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {catalog.categories.map((category) => (
          <Link 
            key={category.id} 
            href={`/catalog/${category.id}`}
            className="group relative h-28 bg-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow flex items-center pl-6 justify-between cursor-pointer"
          >
             {/* Text Section */}
             <div className="flex-1 pr-6 z-10">
                <span className="font-medium text-gray-900 line-clamp-2 md:text-lg leading-tight group-hover:text-primary-600 transition-colors">
                  {category.name}
                </span>
             </div>
             
             {/* Image Section */}
             <div className="w-32 h-full relative flex-shrink-0">
               {category.image ? (
                 <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover object-left object-top mix-blend-multiply group-hover:scale-105 transition-transform duration-300" 
                 />
               ) : (
                 <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg text-xs text-gray-400">
                    No img
                 </div>
               )}
             </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
