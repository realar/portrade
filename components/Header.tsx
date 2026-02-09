import Image from "next/image";
import Link from 'next/link';
import { User } from 'lucide-react';
import catalog from '@/data/catalog.json';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 max-w-[1400px] mx-auto bg-white py-4 px-6 md:px-12 flex items-center justify-between">
      <div className="flex items-center">
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="Portrade Logo"
            width={150}
            height={40}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>
      </div>

      <nav className="hidden md:flex items-center gap-8 text-gray-800 font-medium">
        <div className="relative group py-4">
          <Link href="/catalog" className="hover:text-primary-500 transition-colors flex items-center gap-1 group-hover:text-primary-500">
            Каталог
          </Link>
          <div className="absolute top-full left-0 w-64 bg-white shadow-xl rounded-lg py-2 border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
             {catalog.categories.map((category) => (
               <Link 
                 key={category.id} 
                 href={`/catalog/${category.id}`} 
                 className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600"
               >
                 {category.name}
               </Link>
             ))}
          </div>
        </div>
        <Link href="#" className="hover:text-primary-500 transition-colors">
          О нас
        </Link>
        <Link href="#" className="hover:text-primary-500 transition-colors">
          Оплата и доставка
        </Link>
      </nav>

      <div className="flex items-center">
        <Link href="/dashboard" className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <User className="w-6 h-6" />
        </Link>
      </div>
    </header>
  );
}
