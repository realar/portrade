import GroupBuyStatus from './GroupBuyStatus';
import Price from './Price';

interface Spec {
  name: string;
  value: string;
}

interface ProductInfoProps {
  category: string;
  name: string;
  price: number;
  description?: string;
  specs?: Spec[];
  groupBuy?: {
    participants: number;
    target: number;
    timeLeft: string;
    progress: number;
    currentQuantity?: number;
  };
  onGroupBuyAction?: () => void;
}

export default function ProductInfo({ category, name, price, description, specs, groupBuy, onGroupBuyAction }: ProductInfoProps) {
  return (
    <div className="flex flex-col">
      <span className="text-primary-500 font-medium mb-2">{category}</span>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{name}</h1>
      <Price amount={price} className="text-2xl font-bold text-gray-900 mb-6" />
      
      <p className="text-gray-600 mb-6 leading-relaxed">
        {description}
      </p>

      {specs && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Характеристики</h3>
          <div className="space-y-2">
            {specs.map((spec, index) => (
              <div key={index} className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">{spec.name}</span>
                <span className="font-medium text-gray-900">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {groupBuy && <GroupBuyStatus {...groupBuy} onAction={onGroupBuyAction} />}
    </div>
  );
}
