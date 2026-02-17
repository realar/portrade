'use client';

import { MouseEvent } from 'react';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { useMockData } from '@/context/MockDataContext';

interface AddToCartButtonProps {
  productId: number;
  groupBuyId?: number;
  className?: string;
  fullWidth?: boolean;
  label?: string;
}

export default function AddToCartButton({ productId, groupBuyId, className = '', fullWidth = false, label }: AddToCartButtonProps) {
  const { cart, addToCart, removeFromCart, updateCartQuantity } = useMockData();
  
  const cartItem = groupBuyId ? cart.find(item => item.productId === productId && item.groupBuyId === groupBuyId) : null;
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (groupBuyId) {
      addToCart(productId, groupBuyId, 1);
    }
  };

  const handleIncrease = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (groupBuyId) {
      addToCart(productId, groupBuyId, 1);
    }
  };

  const handleDecrease = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (groupBuyId && quantity > 0) {
      if (quantity > 1) {
        updateCartQuantity(productId, groupBuyId, quantity - 1);
      } else {
        removeFromCart(productId, groupBuyId);
      }
    }
  };

  if (!groupBuyId) {
      return (
        <button className={`bg-gray-100 text-gray-400 cursor-not-allowed rounded-lg py-2 px-4 font-medium flex items-center justify-center gap-2 ${fullWidth ? 'w-full' : ''} ${className}`}>
           Подробнее
        </button>
      );
  }

  if (quantity > 0) {
    return (
      <div className={`flex items-center justify-between bg-primary-600 text-white rounded-lg shadow-md px-1 ${fullWidth ? 'w-full' : 'w-full max-w-[160px]'} h-10 ${className}`}>
         <button 
           onClick={handleDecrease}
           className="w-10 h-full flex items-center justify-center hover:bg-white/20 rounded-md transition-colors"
         >
           <Minus className="w-5 h-5" />
         </button>
         <span className="font-bold text-sm">{quantity} шт</span>
         <button 
           onClick={handleIncrease}
           className="w-10 h-full flex items-center justify-center hover:bg-white/20 rounded-md transition-colors"
         >
           <Plus className="w-5 h-5" />
         </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleAddToCart}
      className={`bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-200 shadow-sm active:scale-95 h-10 ${fullWidth ? 'w-full' : 'w-full'} ${className}`}
    >
      {!label && <ShoppingCart className="w-5 h-5" />} {label || 'В корзину'}
    </button>
  );
}
