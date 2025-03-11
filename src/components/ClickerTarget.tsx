
import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClickerTargetProps {
  index: number;
  position: { x: number, y: number };
  isActive: boolean;
  onMove: (index: number, position: { x: number, y: number }) => void;
  onSelect: (index: number) => void;
  onDelete: (index: number) => void;
}

const ClickerTarget: React.FC<ClickerTargetProps> = ({ 
  index, 
  position, 
  isActive, 
  onMove, 
  onSelect,
  onDelete 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);
  const dragStartPosition = useRef({ x: 0, y: 0 });
  
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsDragging(true);
    
    // Get client coordinates for either touch or mouse event
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    dragStartPosition.current = { 
      x: clientX - position.x, 
      y: clientY - position.y 
    };
    
    onSelect(index);
  };

  useEffect(() => {
    if (!isDragging) return;
    
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      
      // Get client coordinates for either touch or mouse event
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      
      const newPosition = {
        x: clientX - dragStartPosition.current.x,
        y: clientY - dragStartPosition.current.y
      };
      
      onMove(index, newPosition);
    };
    
    const handleEnd = () => {
      setIsDragging(false);
    };
    
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchend', handleEnd);
    
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, index, onMove]);
  
  return (
    <div 
      ref={targetRef}
      className={cn(
        "absolute flex items-center justify-center w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full",
        "border-2 shadow-md transition-all duration-200",
        isActive 
          ? "border-primary bg-primary/10 shadow-primary/20" 
          : "border-secondary bg-background/80 shadow-secondary/10",
        isDragging ? "scale-110" : "scale-100"
      )}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        touchAction: 'none'
      }}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(index);
      }}
    >
      <div className="text-lg font-semibold animate-pulse-light">
        {index + 1}
      </div>
      
      {isActive && (
        <button
          className="absolute -top-1 -right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(index);
          }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default ClickerTarget;
