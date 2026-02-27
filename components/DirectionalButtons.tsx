import React, { useState, useEffect, useCallback } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface DirectionalButtonsProps {
  onMove: (x: number, y: number) => void;
}

export const DirectionalButtons: React.FC<DirectionalButtonsProps> = ({ onMove }) => {
  const [pressed, setPressed] = useState({
    up: false,
    down: false,
    left: false,
    right: false
  });

  // Calculate vector whenever pressed state changes
  useEffect(() => {
    let x = 0;
    let y = 0;

    if (pressed.left) x -= 1;
    if (pressed.right) x += 1;
    if (pressed.up) y -= 1;
    if (pressed.down) y += 1;

    // Normalize diagonal movement
    if (x !== 0 && y !== 0) {
      const length = Math.sqrt(x * x + y * y);
      x /= length;
      y /= length;
    }

    onMove(x, y);
  }, [pressed, onMove]);

  const handleTouchStart = (dir: keyof typeof pressed) => (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent scroll/zoom
    setPressed(prev => ({ ...prev, [dir]: true }));
  };

  const handleTouchEnd = (dir: keyof typeof pressed) => (e: React.TouchEvent) => {
    e.preventDefault();
    setPressed(prev => ({ ...prev, [dir]: false }));
  };

  const btnClass = "w-16 h-16 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border-2 border-white/30 active:bg-white/40 active:scale-95 transition-all shadow-lg touch-none";

  return (
    <div className="relative w-48 h-48 touch-none">
       {/* UP */}
       <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
         <div 
            className={btnClass}
            onTouchStart={handleTouchStart('up')}
            onTouchEnd={handleTouchEnd('up')}
         >
            <ArrowUp size={32} />
         </div>
       </div>

       {/* DOWN */}
       <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
         <div 
            className={btnClass}
            onTouchStart={handleTouchStart('down')}
            onTouchEnd={handleTouchEnd('down')}
         >
            <ArrowDown size={32} />
         </div>
       </div>

       {/* LEFT */}
       <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
         <div 
            className={btnClass}
            onTouchStart={handleTouchStart('left')}
            onTouchEnd={handleTouchEnd('left')}
         >
            <ArrowLeft size={32} />
         </div>
       </div>

       {/* RIGHT */}
       <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
         <div 
            className={btnClass}
            onTouchStart={handleTouchStart('right')}
            onTouchEnd={handleTouchEnd('right')}
         >
            <ArrowRight size={32} />
         </div>
       </div>
    </div>
  );
};