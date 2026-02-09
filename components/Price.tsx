import { cn } from "@/lib/utils";

interface PriceProps {
  amount: number;
  className?: string;
}

export const formatPriceValue = (amount: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function Price({ amount, className }: PriceProps) {
  return (
    <span className={cn("whitespace-nowrap inline-flex items-baseline", className)}>
      {formatPriceValue(amount)}
      <span className="ml-1 font-sans">₽</span>
    </span>
  );
}
