'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useMockData } from '@/context/MockDataContext';

export default function CartIcon() {
  const { cart } = useMockData();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link href="/cart" className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
      <ShoppingCart className="w-6 h-6" />
      {totalItems > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-primary-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </Link>
  );
}
