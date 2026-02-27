import React, { useRef, useState, useEffect, useCallback } from 'react';

interface JoystickProps {
  onMove: (x: number, y: number) => void;
  color?: string;
  label?: string;
}

export const Joystick: React.FC<JoystickProps> = ({ onMove, color = '#fff', label }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Joystick size adjusted by 35% smaller (256 * 0.65 = 166.4 -> 160)
  const CONTAINER_SIZE = 160; 
  const RADIUS = CONTAINER_SIZE / 2;
  const KNOB_SIZE = 56; 

  const handleStart = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setActive(true);
    handleMove(clientX, clientY, rect);
  }, []);

  const handleMove = useCallback((clientX: number, clientY: number, rect?: DOMRect) => {
    if (!containerRef.current && !rect) return;
    const r = rect || containerRef.current!.getBoundingClientRect();
    const centerX = r.left + r.width / 2;
    const centerY = r.top + r.height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Allow joystick to move up to 70% of radius
    const maxDistance = RADIUS * 0.7;

    let moveX = deltaX;
    let moveY = deltaY;

    if (distance > maxDistance) {
      const angle = Math.atan2(deltaY, deltaX);
      moveX = Math.cos(angle) * maxDistance;
      moveY = Math.sin(angle) * maxDistance;
    }

    setPosition({ x: moveX, y: moveY });
    
    // Normalize output between -1 and 1
    onMove(moveX / maxDistance, moveY / maxDistance);
  }, [onMove, RADIUS]);

  const handleEnd = useCallback(() => {
    setActive(false);
    setPosition({ x: 0, y: 0 });
    onMove(0, 0);
  }, [onMove]);

  // Touch handlers
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      handleStart(e.touches[0].clientX, e.touches[0].clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      // FIX: Only prevent default if the joystick is active. 
      // This allows clicks on buttons to pass through when not using the joystick.
      if (active) {
        e.preventDefault();
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (active) {
         e.preventDefault();
         handleEnd();
      }
    };

    el.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [active, handleStart, handleMove, handleEnd]);

  // Mouse handlers for desktop testing
  const onMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX, e.clientY);
  };
  
  const onMouseMove = (e: React.MouseEvent) => {
    if(active) handleMove(e.clientX, e.clientY);
  };

  const onMouseUp = () => {
    handleEnd();
  };

  return (
    <div 
      ref={containerRef}
      className="relative bg-white/5 rounded-full border-2 border-white/10 backdrop-blur-sm touch-none shadow-2xl flex items-center justify-center"
      style={{ width: CONTAINER_SIZE, height: CONTAINER_SIZE }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {label && <span className="text-[10px] font-bold opacity-30 select-none pointer-events-none">{label}</span>}
      <div 
        className={`absolute rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)] transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ${active ? 'scale-90' : ''}`}
        style={{ 
          width: KNOB_SIZE, 
          height: KNOB_SIZE,
          left: '50%', 
          top: '50%',
          backgroundColor: active ? color : `${color}cc`,
          transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`
        }}
      />
    </div>
  );
};