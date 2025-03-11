
import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NumberControlProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  className?: string;
}

const NumberControl: React.FC<NumberControlProps> = ({
  value,
  onChange,
  min = 0,
  max = 1000,
  step = 1,
  label,
  className
}) => {
  const handleIncrease = () => {
    const newValue = Math.min(value + step, max);
    onChange(newValue);
  };

  const handleDecrease = () => {
    const newValue = Math.max(value - step, min);
    onChange(newValue);
  };

  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      {label && <div className="text-sm font-medium text-muted-foreground">{label}</div>}
      <div className="flex items-center space-x-2">
        <button 
          onClick={handleDecrease}
          disabled={value <= min}
          className="h-9 w-9 rounded-full flex items-center justify-center bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors disabled:opacity-50"
        >
          <Minus size={16} />
        </button>
        <div className="h-9 min-w-[3rem] px-2 rounded-md bg-secondary flex items-center justify-center text-sm font-medium">
          {value}
        </div>
        <button 
          onClick={handleIncrease}
          disabled={value >= max}
          className="h-9 w-9 rounded-full flex items-center justify-center bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors disabled:opacity-50"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};

export default NumberControl;
