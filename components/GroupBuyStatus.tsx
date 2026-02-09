import { Users, Clock } from 'lucide-react';

interface GroupBuyProps {
  participants: number;
  target: number;
  timeLeft: string;
  progress: number;
  currentQuantity?: number; // Added to distinguish items from people
  onAction?: () => void;
}

export default function GroupBuyStatus({ participants, target, timeLeft, progress, currentQuantity, onAction }: GroupBuyProps) {
  const collected = currentQuantity || participants; // Fallback for backward compatibility
  const isStarted = collected > 0;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
            {isStarted ? "Складчина активна" : "Начните складчину первым"}
        </h3>
        {isStarted && (
            <div className="flex items-center text-primary-600 bg-primary-50 px-3 py-1 rounded-full text-sm font-medium">
              <Clock className="w-4 h-4 mr-1.5" />
              {timeLeft}
            </div>
        )}
      </div>

      <div className="mb-2 flex justify-between text-sm">
        <span className="text-gray-600">Собрано: <span className="font-semibold text-gray-900">{collected} шт.</span></span>
        <span className="text-gray-500">Цель: {target} шт.</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div 
          className="bg-primary-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <button 
        onClick={onAction}
        className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <Users className="w-5 h-5" />
        {isStarted ? "Присоединиться к складчине" : "Создать складчину"}
      </button>

      {isStarted ? (
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs text-white">
                  U{i}
                </div>
              ))}
              <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-500 font-medium">
                +{Math.max(0, Math.floor(participants) - 4)}
              </div>
            </div>
            <div className="text-sm text-gray-500">
              уже участвуют
            </div>
          </div>
      ) : (
          <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
              Станьте организатором и получите лучшую цену
          </div>
      )}
    </div>
  );
}
