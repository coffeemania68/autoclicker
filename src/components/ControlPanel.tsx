
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PlayCircle, PauseCircle, Settings2, Plus, RefreshCw } from 'lucide-react';
import NumberControl from './NumberControl';
import TapButton from './TapButton';
import { cn } from '@/lib/utils';

interface ControlPanelProps {
  isRunning: boolean;
  totalClicks: number;
  interval: number;
  selectedTargetIndex: number | null;
  targetsCount: number;
  onIntervalChange: (value: number) => void;
  onStartStop: () => void;
  onReset: () => void;
  onAddTarget: () => void;
  className?: string;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isRunning,
  totalClicks,
  interval,
  selectedTargetIndex,
  targetsCount,
  onIntervalChange,
  onStartStop,
  onReset,
  onAddTarget,
  className
}) => {
  return (
    <Card className={cn("overflow-hidden transition-all duration-300 backdrop-blur-lg bg-card/90 shadow-xl border-border/50", className)}>
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <Settings2 size={20} className="text-muted-foreground" />
            Controls
          </h2>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Targets:</span> 
            <span className="font-medium">{targetsCount}</span>
            {selectedTargetIndex !== null && (
              <>
                <span className="text-muted-foreground mx-1">|</span>
                <span className="text-muted-foreground">Selected:</span> 
                <span className="font-medium">{selectedTargetIndex + 1}</span>
              </>
            )}
          </div>
        </div>
        
        <Separator />
        
        <div className="grid grid-cols-2 gap-4">
          <NumberControl
            label="Interval (ms)"
            value={interval}
            onChange={onIntervalChange}
            min={50}
            max={5000}
            step={50}
          />
          
          <div className="flex flex-col justify-end">
            <div className="h-9 flex items-center justify-center rounded-md bg-secondary text-sm">
              <span className="text-muted-foreground mr-2">Total Clicks:</span>
              <span className="font-medium">{totalClicks}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <TapButton
            variant="primary"
            className="w-full sm:flex-1"
            onClick={onStartStop}
          >
            {isRunning ? (
              <div className="flex items-center gap-2">
                <PauseCircle size={20} />
                <span>Stop</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <PlayCircle size={20} />
                <span>Start</span>
              </div>
            )}
          </TapButton>
          
          <TapButton
            variant="outline"
            className="w-full sm:flex-1"
            onClick={onAddTarget}
          >
            <div className="flex items-center gap-2">
              <Plus size={20} />
              <span>Add Target</span>
            </div>
          </TapButton>
          
          <TapButton
            variant="ghost"
            className="w-full sm:w-auto"
            onClick={onReset}
          >
            <RefreshCw size={20} />
          </TapButton>
        </div>
      </CardContent>
    </Card>
  );
};

export default ControlPanel;
