'use client';

import { useState } from 'react';
import { Product } from '@/context/MockDataContext';
import { X } from 'lucide-react';

interface EditProductModalProps {
  product: Product;
  onClose: () => void;
  onSave: (product: Product) => void;
}

export default function EditProductModal({ product, onClose, onSave }: EditProductModalProps) {
  const [formData, setFormData] = useState<Product>({ ...product });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' || name === 'minOrder' || name === 'minGroupBuyTarget' 
        ? Number(value) 
        : value
    }));
  };

  const handleSpecChange = (index: number, field: 'name' | 'value', value: string) => {
      const newSpecs = [...(formData.specs || [])];
      newSpecs[index] = { ...newSpecs[index], [field]: value };
      setFormData(prev => ({ ...prev, specs: newSpecs }));
  };

  const addSpec = () => {
      setFormData(prev => ({ 
          ...prev, 
          specs: [...(prev.specs || []), { name: '', value: '' }] 
      }));
  };

  const removeSpec = (index: number) => {
      setFormData(prev => ({
          ...prev,
          specs: prev.specs?.filter((_, i) => i !== index)
      }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900">Редактирование товара</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Цена (RUB)</label>
              <input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Остаток на складе</label>
              <input
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Мин. заказ (шт.)</label>
              <input
                name="minOrder"
                type="number"
                value={formData.minOrder}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Цель сбора (шт.)</label>
              <input
                name="minGroupBuyTarget"
                type="number"
                placeholder="Если пусто, X10 от мин. заказа"
                value={formData.minGroupBuyTarget || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
              />
              <p className="text-xs text-gray-500 mt-1">Минимальное кол-во для успешного завершения</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500 resize-none text-gray-900"
            />
          </div>

          <div>
             <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Характеристики</label>
                <button type="button" onClick={addSpec} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                    + Добавить
                </button>
             </div>
             <div className="space-y-3">
                 {formData.specs?.map((spec, index) => (
                     <div key={index} className="flex gap-2">
                         <input 
                            placeholder="Название"
                            value={spec.name}
                            onChange={(e) => handleSpecChange(index, 'name', e.target.value)}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                         />
                         <input 
                            placeholder="Значение"
                            value={spec.value}
                            onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                         />
                         <button type="button" onClick={() => removeSpec(index)} className="text-red-500 hover:text-red-700 px-2">
                             &times;
                         </button>
                     </div>
                 ))}
             </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
            >
              Сохранить изменения
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
