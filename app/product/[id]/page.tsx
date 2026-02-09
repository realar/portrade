'use client';

import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import ProductGallery from '@/components/ProductGallery';
import ProductInfo from '@/components/ProductInfo';
import ProductSection from '@/components/ProductSection';
import { useMockData } from '@/context/MockDataContext';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

// Define a union type for our product sources
interface CombinedProduct {
  id: number;
  category: string; 
  name: string;
  price: number;
  images?: string[];
  description?: string;
  specs?: { name: string; value: string }[];
  groupBuy?: {
    participants: number;
    target: number;
    timeLeft: string;
    progress: number;
    currentQuantity?: number;
  };
}

import GroupBuyModal from '@/components/modals/GroupBuyModal';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const { products: mockProducts, groupBuys, loading, createGroupBuy, joinGroupBuy, user } = useMockData();
  const [isGroupBuyModalOpen, setIsGroupBuyModalOpen] = useState(false);
  const [gbModalMode, setGbModalMode] = useState<'create' | 'join'>('create');
  
  // Derive suggested products directly
  const suggestedProducts = mockProducts.filter(p => p.id !== id).slice(0, 4);

  // Find product in context
  const mockProduct = mockProducts.find(p => p.id === id);

  // Helper to calc time left
  const calculateTimeLeft = (dateStr: string) => {
    const deadline = new Date(dateStr);
    const now = new Date(); 
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} дн.` : 'Завершен';
  };

  useEffect(() => {
      // Scroll to top on id change
      window.scrollTo(0, 0);
  }, [id]);

  if (loading) return (
      <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
  );

  if (!mockProduct) {
      return (
        <div className="min-h-screen bg-white">
            <Header />
            <div className="max-w-[1400px] mx-auto py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Товар не найден</h1>
                <button onClick={() => router.back()} className="text-primary-600 hover:underline">Вернуться назад</button>
            </div>
        </div>
      );
  }

  // Check group buy
  const gb = groupBuys.find(g => g.productId === mockProduct.id);

  const handleGroupBuyAction = () => {
    if (!user) {
        alert("Пожалуйста, войдите в систему");
        return;
    }

    if (gb) {
        setGbModalMode('join');
    } else {
        setGbModalMode('create');
    }
    setIsGroupBuyModalOpen(true);
  };

  const handleModalConfirm = async (quantity: number) => {
      if (gbModalMode === 'join' && gb) {
          await joinGroupBuy(gb.id, quantity);
          alert(`Вы успешно присоединились к сбору! (Кол-во: ${quantity})`);
      } else {
          const newGb = await createGroupBuy({
            productId: mockProduct.id,
            targetQuantity: mockProduct.minGroupBuyTarget || (mockProduct.minOrder || 10) * 10,
            price: mockProduct.price,
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          });
          if (newGb) {
              await joinGroupBuy(newGb, quantity);
              alert(`Сбор успешно открыт и оформлен заказ! (Кол-во: ${quantity})`);
          }
      }
      setIsGroupBuyModalOpen(false);
  };

  const displayProduct: CombinedProduct = {
     id: mockProduct.id,
     category: 'Электроника', // TODO: Fetch category logic better
     name: mockProduct.name,
     price: mockProduct.price,
     images: mockProduct.images || [],
     description: mockProduct.description || "Описание товара из системы " + (gb ? "(Активный сбор)" : ""),
     specs: mockProduct.specs || [
         { name: "Валюта", value: mockProduct.currency },
         { name: "Мин. заказ", value: `${mockProduct.minOrder} шт.` },
         { name: "Остаток", value: `${mockProduct.stock} шт.` }
     ],
     groupBuy: gb ? {
         participants: Math.floor(gb.currentQuantity / 10 + 50),
         target: gb.targetQuantity,
         timeLeft: calculateTimeLeft(gb.deadline),
         progress: Math.min(Math.round((gb.currentQuantity / gb.targetQuantity) * 100), 100),
         currentQuantity: gb.currentQuantity
     } : {
         participants: 0,
         target: mockProduct.minGroupBuyTarget || (mockProduct.minOrder || 10) * 10,
         timeLeft: '30 дн.',
         progress: 0,
         currentQuantity: 0
     }
  };

  // Prepare suggested products for display
  const formattedSuggested = suggestedProducts.map(p => {
      const pGb = groupBuys.find(g => g.productId === p.id);
      return {
          ...p,
          groupBuy: pGb ? {
             participants: 0,
             target: pGb.targetQuantity,
             timeLeft: pGb.deadline,
             progress: Math.min(Math.round((pGb.currentQuantity / pGb.targetQuantity) * 100), 100)
          } : undefined
      };
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-[1400px] mx-auto pb-20 pt-8 px-6 md:px-12">
        
        <button 
          onClick={() => router.back()} 
          className="group inline-flex items-center text-gray-500 hover:text-gray-900 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Назад</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <ProductGallery images={displayProduct.images} />
          <ProductInfo 
            category={displayProduct.category}
            name={displayProduct.name}
            price={displayProduct.price}
            description={displayProduct.description}
            specs={displayProduct.specs}
            groupBuy={displayProduct.groupBuy}
            onGroupBuyAction={handleGroupBuyAction}
          />
        </div>

        <ProductSection title="Похожие товары" products={formattedSuggested} />

        <GroupBuyModal 
            isOpen={isGroupBuyModalOpen}
            onClose={() => setIsGroupBuyModalOpen(false)}
            mode={gbModalMode}
            productName={mockProduct.name}
            price={mockProduct.price}
            minOrder={mockProduct.minOrder || 1}
            target={gb ? gb.targetQuantity : (mockProduct.minGroupBuyTarget || (mockProduct.minOrder || 10) * 10)}
            currentCollected={gb ? gb.currentQuantity : 0}
            onConfirm={handleModalConfirm}
        />

      </main>
    </div>
  );
}
