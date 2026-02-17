'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from 'next/link';
import { User, Flame, Menu, X, Search } from 'lucide-react';
import catalog from '@/data/catalog.json';
import CartIcon from './CartIcon';
import SearchBar from './SearchBar';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100 group">
      
      {/* Level 1: Logo, Search, Actions */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-3.5 flex items-center justify-between gap-4 md:gap-8 h-16 md:h-20 relative z-50 bg-white">
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 -ml-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/logo.svg"
            alt="Portrade Logo"
            width={120}
            height={36}
            className="h-7 md:h-8 w-auto object-contain"
            priority
          />
        </Link>

        {/* Search - Desktop */}
        <div className="flex-1 max-w-2xl mx-auto hidden md:block">
           <SearchBar />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="md:hidden">
            <button 
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 text-gray-500"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Search className="w-6 h-6" />
            </button>
          </div>

          <CartIcon />
          
          <Link 
            href="/dashboard" 
            className="hidden md:flex w-10 h-10 items-center justify-center rounded-full hover:bg-gray-50 text-gray-500 hover:text-primary-600 transition-colors"
            title="Личный кабинет"
          >
            <User className="w-6 h-6" />
          </Link>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white md:hidden pt-20 overflow-y-auto">
          <div className="px-4 py-6 space-y-6">
            
            {/* Mobile Search */}
            <div className="mb-6">
              <SearchBar />
            </div>

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col space-y-4">
              <Link href="/catalog" className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-3 flex justify-between items-center" onClick={() => setIsMobileMenuOpen(false)}>
                Каталог
                <span className="text-gray-400 text-sm">Все категории &rarr;</span>
              </Link>
              
              <div className="pl-4 space-y-3 border-l-2 border-gray-100">
                {catalog.categories.slice(0, 5).map((category) => (
                   <Link 
                     key={category.id} 
                     href={`/catalog/${category.id}`} 
                     className="block text-gray-600 hover:text-primary-600 py-1"
                     onClick={() => setIsMobileMenuOpen(false)}
                   >
                     {category.name}
                   </Link>
                ))}
                <Link href="/catalog" className="block text-primary-600 font-medium pt-1" onClick={() => setIsMobileMenuOpen(false)}>
                  Смотреть все категории
                </Link>
              </div>

              <Link href="/hot-deals" className="text-lg font-medium text-red-600 flex items-center gap-2 border-b border-gray-100 pb-3 pt-2" onClick={() => setIsMobileMenuOpen(false)}>
                 <Flame className="w-5 h-5 fill-current" />
                 Горящие закупки
              </Link>

              <Link href="/suppliers" className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-3" onClick={() => setIsMobileMenuOpen(false)}>
                Поставщики
              </Link>

              <Link href="/factories" className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-3" onClick={() => setIsMobileMenuOpen(false)}>
                Фабрики
              </Link>
              
              <Link href="/brands" className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-3" onClick={() => setIsMobileMenuOpen(false)}>
                Бренды
              </Link>

              <div className="pt-4 grid grid-cols-2 gap-4">
                 <Link href="/about" className="text-gray-600" onClick={() => setIsMobileMenuOpen(false)}>О нас</Link>
                 <Link href="/help" className="text-gray-600" onClick={() => setIsMobileMenuOpen(false)}>Помощь</Link>
                 <Link href="/dashboard" className="text-primary-600 font-medium flex items-center gap-2 col-span-2 mt-4 bg-gray-50 p-4 rounded-xl justify-center" onClick={() => setIsMobileMenuOpen(false)}>
                    <User className="w-5 h-5" />
                    Личный кабинет
                 </Link>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Level 2: Desktop Navigation */}
      <div className={`hidden md:block border-t border-gray-100 bg-white/95 backdrop-blur-sm transition-all duration-300 ease-in-out ${
          isHome 
            ? 'relative z-10' 
            : 'absolute top-[80px] left-0 w-full z-10 -translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 shadow-md'
      }`}>
         <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-12 flex items-center gap-8 overflow-x-auto whitespace-nowrap no-scrollbar text-sm font-medium text-gray-600">
            
            <div className="relative group/catalog h-full flex items-center">
              <Link href="/catalog" className="flex items-center gap-1.5 hover:text-primary-600 transition-colors h-full px-1 border-b-2 border-transparent hover:border-primary-600">
                Каталог
              </Link>
              
              {/* Dropdown for Catalog */}
              <div className="absolute top-full left-0 w-64 bg-white shadow-xl rounded-b-xl py-2 border border-gray-100 opacity-0 invisible group-hover/catalog:opacity-100 group-hover/catalog:visible transition-all duration-200 transform translate-y-2 group-hover/catalog:translate-y-0 z-40">
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

            <Link href="/hot-deals" className="flex items-center gap-1.5 hover:text-red-600 transition-colors h-full px-1 border-b-2 border-transparent hover:border-red-600">
              <Flame className="w-4 h-4 text-red-500 fill-red-500" />
              Горящие закупки
            </Link>

            <Link href="/suppliers" className="hover:text-primary-600 transition-colors h-full flex items-center px-1 border-b-2 border-transparent hover:border-primary-600">
              Поставщики
            </Link>

            <Link href="/factories" className="hover:text-primary-600 transition-colors h-full flex items-center px-1 border-b-2 border-transparent hover:border-primary-600">
              Фабрики
            </Link>

            <Link href="/brands" className="hover:text-primary-600 transition-colors h-full flex items-center px-1 border-b-2 border-transparent hover:border-primary-600">
              Бренды
            </Link>

            <Link href="/about" className="hover:text-primary-600 transition-colors h-full flex items-center px-1 border-b-2 border-transparent hover:border-primary-600 ml-auto">
              О нас
            </Link>
            <Link href="/help" className="hover:text-primary-600 transition-colors h-full flex items-center px-1 border-b-2 border-transparent hover:border-primary-600">
              Помощь
            </Link>
         </div>
      </div>
    </header>
  );
}
