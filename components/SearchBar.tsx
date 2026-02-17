'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Package, Factory, Store, Loader } from 'lucide-react';
import Link from 'next/link';
import { useMockData } from '@/context/MockDataContext';

export default function SearchBar() {
  const { products, factories, suppliers, loading } = useMockData();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter items based on query
  const filteredProducts = query.length >= 2 
    ? products.filter(p => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 3) 
    : [];
    
  const filteredFactories = query.length >= 2 
    ? factories.filter(f => f.name.toLowerCase().includes(query.toLowerCase())).slice(0, 2) 
    : [];
    
  const filteredSuppliers = query.length >= 2 
    ? suppliers.filter(s => s.name.toLowerCase().includes(query.toLowerCase())).slice(0, 2) 
    : [];
    
  const hasResults = filteredProducts.length > 0 || filteredFactories.length > 0 || filteredSuppliers.length > 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    // For now, if user hits enter, maybe go to catalog with search param?
    // Or just open the dropdown if closed.
    if (!isOpen && hasResults) {
        setIsOpen(true);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-2xl">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative flex items-center">
            <Search className="absolute left-3 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => query.length >= 2 && setIsOpen(true)}
              placeholder="Поиск товаров, фабрик, поставщиков..."
              className="w-full pl-10 pr-10 py-2.5 bg-gray-100 hover:bg-gray-50 focus:bg-white border border-transparent focus:border-primary-500 rounded-xl outline-none transition-all duration-200 text-gray-900 placeholder:text-gray-500"
            />
            {query && (
              <button 
                type="button" 
                onClick={clearSearch}
                className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
        </div>
      </form>

      {/* Dropdown Results */}
      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-[60]">
           {loading ? (
             <div className="p-4 text-center text-gray-500 flex items-center justify-center gap-2">
               <Loader className="w-4 h-4 animate-spin" /> Загрузка...
             </div>
           ) : hasResults ? (
             <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                
                {/* Factories */}
                {filteredFactories.length > 0 && (
                  <div className="py-2">
                    <div className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Фабрики</div>
                    {filteredFactories.map(factory => (
                      <Link 
                        key={factory.id} 
                        href={`/factory/${factory.id}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors group"
                      >
                         <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <Factory className="w-4 h-4" />
                         </div>
                         <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate group-hover:text-primary-600 transition-colors">{factory.name}</div>
                            <div className="text-xs text-gray-500 truncate">{factory.description}</div>
                         </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Suppliers */}
                {filteredSuppliers.length > 0 && (
                  <div className="border-t border-gray-50 py-2">
                    <div className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Поставщики</div>
                    {filteredSuppliers.map(supplier => (
                      <Link 
                        key={supplier.id} 
                        href={`/supplier/${supplier.id}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors group"
                      >
                         <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                            <Store className="w-4 h-4" />
                         </div>
                         <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate group-hover:text-primary-600 transition-colors">{supplier.name}</div>
                            <div className="text-xs text-gray-500 truncate">{supplier.country}</div>
                         </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Products */}
                {filteredProducts.length > 0 && (
                  <div className="border-t border-gray-50 py-2">
                    <div className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Товары</div>
                    {filteredProducts.map(product => (
                      <Link 
                        key={product.id} 
                        href={`/product/${product.id}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors group"
                      >
                         <div className="w-8 h-8 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                            {product.images && product.images[0] ? (
                               <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                               <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <Package className="w-4 h-4" />
                               </div>
                            )}
                         </div>
                         <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate group-hover:text-primary-600 transition-colors">{product.name}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-2">
                               <span className="font-medium text-gray-900">{product.price.toLocaleString()} <span className="font-sans">₽</span></span>
                               <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                               <span className="truncate">{product.category}</span>
                            </div>
                         </div>
                      </Link>
                    ))}
                  </div>
                )}
                
             </div>
           ) : (
             <div className="p-8 text-center text-gray-500">
               <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
               <p>По запросу &quot;{query}&quot; ничего не найдено</p>
             </div>
           )}
        </div>
      )}
    </div>
  );
}
