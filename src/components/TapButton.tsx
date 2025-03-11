
import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface TapButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isActive?: boolean;
}

const TapButton = forwardRef<HTMLButtonElement, TapButtonProps>(
  ({ className, variant = 'default', size = 'md', isActive = false, children, ...props }, ref) => {
    const baseClasses = "rounded-full font-medium flex items-center justify-center transition-all duration-300 btn-tap";
    
    const variantClasses = {
      default: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      primary: "bg-primary text-primary-foreground hover:bg-primary/90",
      outline: "border border-border bg-transparent hover:bg-secondary/50",
      ghost: "bg-transparent hover:bg-secondary/50"
    };
    
    const sizeClasses = {
      sm: "text-sm h-10 px-4",
      md: "text-base h-12 px-6",
      lg: "text-lg h-16 px-8",
      xl: "text-xl h-20 px-10"
    };
    
    const activeClasses = isActive ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "";
    
    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          activeClasses,
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

TapButton.displayName = "TapButton";

export default TapButton;
