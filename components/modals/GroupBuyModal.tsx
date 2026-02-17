'use client';

import { useState, useEffect } from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';

interface GroupBuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'join';
  productName: string;
  price: number;
  minOrder: number;
  target: number; // Total target for the group buy
  currentCollected: number;
  onConfirm: (quantity: number) => void;
}

export default function GroupBuyModal({
  isOpen,
  onClose,
  mode,
  productName,
  price,
  minOrder,
  target,
  currentCollected,
  onConfirm
}: GroupBuyModalProps) {
  const [quantity, setQuantity] = useState(minOrder);
  
  // Reset quantity when modal opens - handled by parent key or simple init if not cached. 
  // Actually, let's keep it simple: if isOpen changes to true, we *could* reset, but let's trust the user or parent to handle "key".
  // To be safe and satisfy lint:
  useEffect(() => {
    if (isOpen) {
        setQuantity(minOrder);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const remaining = Math.max(0, target - currentCollected);
  const step = Math.max(1, Math.floor(target * 0.1)); // 10% of target

  const handleIncrement = () => {
    setQuantity(prev => Math.min(prev + step, remaining + (mode === 'create' ? 0 : 0))); // Logic: can order more than remaining? Usually yes, but let's soft cap for "completing" logic
  };

  const handleDecrement = () => {
    setQuantity(prev => Math.max(minOrder, prev - step));
  };

  const handleTakeAll = () => {
      setQuantity(remaining);
  };

  const handleConfirm = () => {
      onConfirm(quantity);
      onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-xl transform transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold mb-1">
            {mode === 'create' ? 'Создание складчины' : 'Участие в складчине'}
          </h2>
          <p className="text-primary-100 text-sm">{productName}</p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Цель сбора:</span>
              <span className="font-medium text-gray-900">{target} шт.</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-4">
              <span>Уже собрано:</span>
              <span className="font-medium text-primary-600">{currentCollected} шт.</span>
            </div>
            
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div 
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((currentCollected / target) * 100, 100)}%` }}
              />
            </div>
             <p className="text-xs text-gray-400 mt-2 text-right">Осталось: {remaining} шт.</p>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Ваше количество (мин. {minOrder} шт.)
            </label>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={handleDecrement}
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 active:scale-95 transition-all"
              >
                <Minus className="w-4 h-4" />
              </button>
              
              <input 
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(0, Number(e.target.value)))}
                className="flex-1 text-center font-bold text-xl h-10 border-b-2 border-primary-100 focus:border-primary-500 outline-none transition-colors text-gray-900"
              />

              <button 
                onClick={handleIncrement}
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex justify-end">
               <button 
                onClick={handleTakeAll}
                className="text-xs text-primary-600 hover:text-primary-700 font-medium hover:underline"
               >
                 Забрать весь остаток ({remaining} шт.)
               </button>
            </div>
          </div>

          {/* SImmary */}
          <div className="mt-8 bg-gray-50 rounded-xl p-4 flex items-center justify-between">
             <span className="text-gray-600">Итого к оплате:</span>
             <span className="text-lg font-bold text-gray-900">
               {(quantity * price).toLocaleString('ru-RU')} <span className="font-sans">₽</span>
             </span>
          </div>
          
          <button 
            onClick={handleConfirm}
            className="w-full mt-6 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-primary-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            {mode === 'create' ? 'Открыть сбор' : 'Подтвердить участие'}
          </button>

        </div>
      </div>
    </div>
  );
}
