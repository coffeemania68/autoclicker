
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import ClickerTarget from '@/components/ClickerTarget';
import ControlPanel from '@/components/ControlPanel';

interface Target {
  position: { x: number; y: number };
}

const AutoClicker = () => {
  const [targets, setTargets] = useState<Target[]>([]);
  const [selectedTargetIndex, setSelectedTargetIndex] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [interval, setInterval] = useState(500);
  const [totalClicks, setTotalClicks] = useState(0);
  const [isPanelMinimized, setIsPanelMinimized] = useState(false);
  
  const clickTimerRef = useRef<number | null>(null);
  const workAreaRef = useRef<HTMLDivElement>(null);
  const currentTargetIndexRef = useRef(0);
  
  // Function to simulate a click at a specific position
  const simulateClick = useCallback((x: number, y: number) => {
    // Create and append the ripple element
    const ripple = document.createElement('div');
    ripple.className = 'absolute w-8 h-8 rounded-full bg-primary/20 z-50 pointer-events-none';
    ripple.style.left = `${x - 16}px`;
    ripple.style.top = `${y - 16}px`;
    document.body.appendChild(ripple);
    
    // Animate the ripple
    ripple.animate(
      [
        { transform: 'scale(0)', opacity: '0.8' },
        { transform: 'scale(2)', opacity: '0' }
      ],
      {
        duration: 600,
        easing: 'ease-out'
      }
    );
    
    // Remove the ripple after animation
    setTimeout(() => {
      document.body.removeChild(ripple);
    }, 600);
    
    // Increment the total clicks
    setTotalClicks(prev => prev + 1);
  }, []);
  
  // Function to start the clicking sequence
  const startClicking = useCallback(() => {
    if (!targets.length) {
      toast.error('Please add at least one target first');
      setIsRunning(false);
      return;
    }
    
    if (clickTimerRef.current) {
      clearInterval(clickTimerRef.current);
    }
    
    clickTimerRef.current = window.setInterval(() => {
      const targetIndex = currentTargetIndexRef.current;
      const target = targets[targetIndex];
      
      if (target) {
        simulateClick(target.position.x, target.position.y);
        
        // Move to the next target
        currentTargetIndexRef.current = (targetIndex + 1) % targets.length;
      }
    }, interval);
  }, [interval, targets, simulateClick]);
  
  // Start/stop the clicking sequence
  useEffect(() => {
    if (isRunning) {
      startClicking();
      toast.success('Auto clicker started');
    } else if (clickTimerRef.current) {
      clearInterval(clickTimerRef.current);
      clickTimerRef.current = null;
      toast.info('Auto clicker stopped');
    }
    
    return () => {
      if (clickTimerRef.current) {
        clearInterval(clickTimerRef.current);
      }
    };
  }, [isRunning, startClicking]);
  
  // Add a new target
  const handleAddTarget = () => {
    if (!workAreaRef.current) return;
    
    const rect = workAreaRef.current.getBoundingClientRect();
    const newPosition = {
      x: rect.width / 2,
      y: rect.height / 2
    };
    
    setTargets(prev => [...prev, { position: newPosition }]);
    setSelectedTargetIndex(targets.length);
    
    toast.success('New target added!');
  };
  
  // Move a target
  const handleMoveTarget = (index: number, newPosition: { x: number; y: number }) => {
    setTargets(prev => prev.map((target, i) => 
      i === index ? { ...target, position: newPosition } : target
    ));
  };
  
  // Delete a target
  const handleDeleteTarget = (index: number) => {
    setTargets(prev => prev.filter((_, i) => i !== index));
    setSelectedTargetIndex(null);
    toast.success('Target removed');
  };
  
  // Reset all settings
  const handleReset = () => {
    setIsRunning(false);
    setTargets([]);
    setSelectedTargetIndex(null);
    setTotalClicks(0);
    currentTargetIndexRef.current = 0;
    
    if (clickTimerRef.current) {
      clearInterval(clickTimerRef.current);
      clickTimerRef.current = null;
    }
    
    toast.success('All settings reset');
  };
  
  // Handle click on the work area
  const handleWorkAreaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only handle direct clicks on the work area, not on targets
    if ((e.target as HTMLElement).closest('.target-area')) return;
    
    const rect = workAreaRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const newPosition = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    setTargets(prev => [...prev, { position: newPosition }]);
    setSelectedTargetIndex(targets.length);
  };
  
  return (
    <div className="relative w-full h-screen overflow-hidden bg-background flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-between border-b border-border/50 backdrop-blur-md bg-background/80 z-10">
        <h1 className="text-xl font-semibold">Thumb Tapper</h1>
        <button 
          className="text-sm flex items-center gap-1 px-3 py-1 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
          onClick={() => setIsPanelMinimized(prev => !prev)}
        >
          {isPanelMinimized ? 'Show Controls' : 'Hide Controls'}
        </button>
      </header>
      
      {/* Work Area */}
      <div 
        ref={workAreaRef}
        className="relative flex-1 overflow-hidden"
        onClick={handleWorkAreaClick}
      >
        {targets.map((target, index) => (
          <ClickerTarget
            key={index}
            index={index}
            position={target.position}
            isActive={selectedTargetIndex === index}
            onMove={handleMoveTarget}
            onSelect={setSelectedTargetIndex}
            onDelete={handleDeleteTarget}
          />
        ))}
      </div>
      
      {/* Control Panel */}
      <div 
        className={`fixed bottom-0 left-0 right-0 transition-transform duration-300 z-20 p-4 ${
          isPanelMinimized ? 'translate-y-[calc(100%-3rem)]' : 'translate-y-0'
        }`}
      >
        {/* Drag Handle */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-6 bg-card rounded-t-xl flex items-center justify-center cursor-pointer border-t border-x border-border/50"
          onClick={() => setIsPanelMinimized(prev => !prev)}
        >
          <div className="w-6 h-1 bg-muted-foreground/30 rounded-full" />
        </div>
        
        <ControlPanel
          isRunning={isRunning}
          totalClicks={totalClicks}
          interval={interval}
          selectedTargetIndex={selectedTargetIndex}
          targetsCount={targets.length}
          onIntervalChange={setInterval}
          onStartStop={() => setIsRunning(prev => !prev)}
          onReset={handleReset}
          onAddTarget={handleAddTarget}
        />
      </div>
    </div>
  );
};

export default AutoClicker;
