'use client';

import Header from '@/components/Header';
import Price from '@/components/Price';
import { useMockData } from '@/context/MockDataContext';
import { ShoppingCart, Trash2, Plus, Minus, Clock, ArrowRight, Package, Truck, Wallet, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { cart, products, groupBuys, factories, suppliers, updateCartQuantity, removeFromCart, confirmCartGroupBuy } = useMockData();

  // Group cart items by groupBuyId
  const groupedCart = cart.reduce((acc, item) => {
    if (!acc[item.groupBuyId]) acc[item.groupBuyId] = [];
    acc[item.groupBuyId].push(item);
    return acc;
  }, {} as Record<number, typeof cart>);

  const getGroupBuyInfo = (groupBuyId: number) => {
    const gb = groupBuys.find(g => g.id === groupBuyId);
    if (!gb) return null;
    const factory = factories.find(f => f.id === gb.factoryId);
    const supplier = factory ? suppliers.find(s => s.id === factory.supplierId) : null;
    const daysLeft = Math.max(0, Math.ceil((new Date(gb.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
    const progress = Math.min(Math.round((gb.currentQuantity / gb.targetQuantity) * 100), 100);
    return { gb, factory, supplier, daysLeft, progress };
  };

  const getGroupTotal = (items: typeof cart) => {
    return items.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const handleConfirm = async (groupBuyId: number) => {
    await confirmCartGroupBuy(groupBuyId);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-[1400px] mx-auto py-20 px-6 md:px-12">
          <div className="text-center">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Корзина пуста</h1>
            <p className="text-gray-500 mb-6">Добавьте товары из активных закупок</p>
            <Link href="/catalog" className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors">
              Перейти в каталог <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-[1400px] mx-auto py-10 px-6 md:px-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Корзина</h1>
          <p className="text-gray-500">{totalItems} товар{totalItems > 4 ? 'ов' : totalItems > 1 ? 'а' : ''} в {Object.keys(groupedCart).length} закупк{Object.keys(groupedCart).length > 1 ? 'ах' : 'е'}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items grouped by group buy */}
          <div className="lg:col-span-2 space-y-6">
            {Object.entries(groupedCart).map(([gbIdStr, items]) => {
              const gbId = Number(gbIdStr);
              const info = getGroupBuyInfo(gbId);
              if (!info) return null;
              const groupTotal = getGroupTotal(items);

              return (
                <div key={gbId} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  {/* Group buy header */}
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <Link href={`/group-buy/${gbId}`} className="font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                          {info.factory?.name || `Закупка #${gbId}`}
                        </Link>
                        <div className="text-xs text-gray-500 mt-0.5">{info.supplier?.name}</div>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span className={`font-medium ${info.daysLeft <= 3 ? 'text-red-600' : 'text-gray-600'}`}>
                          {info.daysLeft > 0 ? `${info.daysLeft} дн.` : 'Завершается!'}
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-500 rounded-full" style={{ width: `${info.progress}%` }} />
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Собрано: {info.progress}%</div>
                  </div>

                  {/* Min Order Warning */}
                  {groupTotal < (info.gb.minAmount || 20000) && (
                    <div className="bg-red-50 px-6 py-3 flex items-center gap-3 text-sm text-gray-800 border-b border-red-100">
                        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                        <span>
                            Для минимального заказа добавьте товар на сумму <span className="font-semibold"><Price amount={(info.gb.minAmount || 20000) - groupTotal} /></span>
                        </span>
                    </div>
                  )}

                  {/* Info Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 px-6 py-4 bg-white border-b border-gray-100">
                      {/* Min Order Card */}
                      <div className={`p-4 rounded-xl border flex flex-row items-center text-left gap-4 ${
                          groupTotal < (info.gb.minAmount || 20000) ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'
                      }`}>
                          <ShoppingCart className={`w-8 h-8 ${
                              groupTotal < (info.gb.minAmount || 20000) ? 'text-red-500' : 'text-green-600'
                          }`} />
                          <div className={`text-sm font-medium ${
                              groupTotal < (info.gb.minAmount || 20000) ? 'text-red-600' : 'text-green-700'
                          }`}>
                              Минимальный заказ<br/>
                              от <Price amount={info.gb.minAmount || 20000} />
                          </div>
                      </div>

                      {/* Date Card */}
                      <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex flex-row items-center text-left gap-4">
                          <Clock className="w-8 h-8 text-green-600" />
                          <div className="text-sm font-medium text-gray-900">
                              {new Date(info.gb.deadline).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}<br/>
                              <span className="text-gray-500 font-normal">(При оформлении до 01:00)</span>
                          </div>
                      </div>

                      {/* Delivery Card */}
                      <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex flex-row items-center text-left gap-4">
                           <Truck className="w-8 h-8 text-green-600" />
                           <div className="text-sm font-medium text-gray-900">
                               Доставка<br/>
                               <span className="text-green-600">через неделю</span>
                           </div>
                      </div>

                      {/* Payment Card */}
                      <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex flex-row items-center text-left gap-4">
                           <Wallet className="w-8 h-8 text-green-600" />
                           <div className="text-sm font-medium text-gray-900">
                               Безналичный расчет
                           </div>
                      </div>
                  </div>

                  {/* Items */}
                  <div className="divide-y divide-gray-50">
                    {items.map(item => {
                      const product = products.find(p => p.id === item.productId);
                      if (!product) return null;

                      return (
                        <div key={item.productId} className="flex items-center gap-4 px-6 py-4">
                          {/* Thumbnail */}
                          <Link href={`/product/${product.id}`} className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                            {product.images?.[0] ? (
                              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center"><Package className="w-6 h-6 text-gray-300" /></div>
                            )}
                          </Link>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <Link href={`/product/${product.id}`} className="font-medium text-gray-900 hover:text-primary-600 transition-colors text-sm truncate block">
                              {product.name}
                            </Link>
                            <div className="text-xs text-gray-500 mt-0.5"><Price amount={product.price} /> / шт.</div>
                          </div>

                          {/* Quantity */}
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => updateCartQuantity(item.productId, item.groupBuyId, item.quantity - 1)}
                              className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-10 text-center font-medium text-sm">{item.quantity}</span>
                            <button 
                              onClick={() => updateCartQuantity(item.productId, item.groupBuyId, item.quantity + 1)}
                              className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Subtotal */}
                          <div className="text-right w-24 flex-shrink-0">
                            <div className="font-semibold text-sm"><Price amount={product.price * item.quantity} /></div>
                          </div>

                          {/* Remove */}
                          <button 
                            onClick={() => removeFromCart(item.productId, item.groupBuyId)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Group buy footer */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Итого по закупке: <span className="font-semibold text-gray-900"><Price amount={groupTotal} /></span>
                    </div>
                    <button 
                      onClick={() => handleConfirm(gbId)}
                      className="bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors"
                    >
                      Оформить эту закупку
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-gray-50 rounded-2xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Итого</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Товаров:</span>
                  <span className="font-medium">{totalItems} шт.</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Закупок:</span>
                  <span className="font-medium">{Object.keys(groupedCart).length}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between text-lg">
                  <span className="font-medium text-gray-900">Сумма:</span>
                  <span className="font-bold text-gray-900"><Price amount={totalPrice} /></span>
                </div>
              </div>
              <p className="text-xs text-gray-400">Каждая закупка подтверждается и оплачивается отдельно после достижения минимального объёма.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
