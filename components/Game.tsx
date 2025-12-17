import React, { useEffect, useRef, useState } from 'react';
import { Joystick } from './Joystick';
import { GameState, Entity, Skin, Difficulty, GameResult, ActiveExtras, PlayerProgress } from '../types';
import { CANVAS_WIDTH, CANVAS_HEIGHT, PLAYER_SPEED, DIFFICULTY_CONFIG, FIRE_WIDTH, FIRE_HEIGHT, SECRETS_CONFIG } from '../constants';
import { Button } from './Button';
import { Sparkles, Skull, Timer, Pause, Play, Home, BookOpen, ArrowRight } from 'lucide-react';

interface GameProps {
  currentSkin: Skin;
  setGameState: (state: GameState) => void;
  onGameEnd: (result: GameResult) => void;
  settings: { difficulty: Difficulty };
  restartKey: number; 
  onRestart: () => void;
  activeExtras: ActiveExtras;
  progress: PlayerProgress;
}

export const Game: React.FC<GameProps> = ({ 
  currentSkin, 
  setGameState, 
  onGameEnd, 
  settings,
  restartKey,
  onRestart,
  activeExtras,
  progress
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Game Logic State Refs (Mutable, no re-render)
  const scoreRef = useRef(0);
  const gameOverRef = useRef(false);
  const victoryRef = useRef(false);
  const hackerTimeRef = useRef(0); 
  const maxHackerTimeRef = useRef(0);
  const totalSurvivalTimeRef = useRef(0);
  const decorationRef = useRef<Entity[]>([]);
  
  // Secret Detection State
  const secretTimerRef = useRef(0); 
  const foundSecretRef = useRef<number | null>(null);

  // Entities Refs
  const playerRef = useRef<Entity>({ 
    id: 'player', 
    x: CANVAS_WIDTH / 2, 
    y: CANVAS_HEIGHT / 2, 
    width: 30, 
    height: 30, 
    vx: 0, 
    vy: 0, 
    color: '#000',
    type: 'player' 
  });
  
  const enemiesRef = useRef<Entity[]>([]);
  const sproutsRef = useRef<Entity[]>([]);
  const frameRef = useRef(0);
  const inputRef = useRef({ x: 0, y: 0 });
  const loopRef = useRef<number>();

  // UI State (Triggers re-render)
  const [scoreUI, setScoreUI] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);
  const [secretFound, setSecretFound] = useState(false); // New State for Secret Screen
  const [foundSecretId, setFoundSecretId] = useState<number | null>(null);
  const [hackerTimerUI, setHackerTimerUI] = useState(0);
  const [paused, setPaused] = useState(false);

  // Keep latest props in refs to avoid useEffect dependency resets
  const progressRef = useRef(progress);
  const pausedRef = useRef(paused);

  // Update refs when props/state change
  useEffect(() => { progressRef.current = progress; }, [progress]);
  useEffect(() => { pausedRef.current = paused; }, [paused]);

  const difficultyConfig = DIFFICULTY_CONFIG[settings.difficulty];
  const WIN_SCORE = difficultyConfig.winScore;

  // Helpers
  const isInfinite = activeExtras.infinite;
  const isMutant = activeExtras.mutant;
  const isFuegorin = activeExtras.fuegorin;

  const spawnEnemy = () => {
    const x = Math.random() * (CANVAS_WIDTH - FIRE_WIDTH);
    const y = Math.random() * (CANVAS_HEIGHT - FIRE_HEIGHT);
    const p = playerRef.current;
    const distToPlayer = Math.sqrt(Math.pow(x - p.x, 2) + Math.pow(y - p.y, 2));
    if (distToPlayer < 150) return;

    enemiesRef.current.push({
      id: Math.random().toString(),
      x, y, 
      width: FIRE_WIDTH, 
      height: FIRE_HEIGHT, 
      vx: 0, vy: 0,
      color: isFuegorin ? '#3b82f6' : '#ef4444', 
      type: 'enemy'
    });
  };

  const spawnSprout = (type: 'sprout' | 'mutant' = 'sprout') => {
    const width = type === 'mutant' ? 35 : 25;
    sproutsRef.current.push({
      id: Math.random().toString(),
      x: Math.random() * (CANVAS_WIDTH - 40) + 20,
      y: Math.random() * (CANVAS_HEIGHT - 40) + 20,
      width: width,
      height: width,
      vx: 0, vy: 0,
      color: type === 'mutant' ? '#a855f7' : (isFuegorin ? '#57534e' : '#a3e635'),
      type: type
    });
  };

  const generateScenario = () => {
    const decorations: Entity[] = [];
    
    if (isFuegorin) {
        // --- SCENARIO FUEGORIN (Volcanic/Burnt) ---
        
        // 1. Cracks / Lava veins (Floor details)
        for (let i = 0; i < 15; i++) {
            decorations.push({
                id: `crack-${i}`,
                x: Math.random() * CANVAS_WIDTH,
                y: Math.random() * CANVAS_HEIGHT,
                width: 20 + Math.random() * 40,
                height: 2 + Math.random() * 4,
                vx: 0, vy: 0,
                color: '#7f1d1d', // Dark Red
                type: 'decoration',
                variant: 'crack',
                rotation: Math.random() * Math.PI
            });
        }

        // 2. Embers / Ash (Small particles)
        for (let i = 0; i < 40; i++) {
            decorations.push({
                id: `ash-${i}`,
                x: Math.random() * CANVAS_WIDTH,
                y: Math.random() * CANVAS_HEIGHT,
                width: 3 + Math.random() * 5,
                height: 3 + Math.random() * 5,
                vx: 0, vy: 0,
                color: Math.random() > 0.7 ? '#fb923c' : '#44403c', // Orange (ember) or Gray (ash)
                type: 'decoration',
                variant: 'ash',
                rotation: 0
            });
        }

        // 3. Burnt Trees / Rocks (Obstacles look)
        for (let i = 0; i < 12; i++) {
            decorations.push({
                id: `stump-${i}`,
                x: Math.random() * CANVAS_WIDTH,
                y: Math.random() * CANVAS_HEIGHT,
                width: 30 + Math.random() * 40,
                height: 30 + Math.random() * 40,
                vx: 0, vy: 0,
                color: '#1c1917', // Almost black
                type: 'decoration',
                variant: 'stump',
                rotation: Math.random() * 0.5 - 0.25
            });
        }

    } else {
        // --- SCENARIO NORMAL (Forest) ---

        // 1. Grass patches
        for (let i = 0; i < 50; i++) {
            decorations.push({
                id: `grass-${i}`,
                x: Math.random() * CANVAS_WIDTH,
                y: Math.random() * CANVAS_HEIGHT,
                width: 4 + Math.random() * 6,
                height: 4 + Math.random() * 8,
                vx: 0, vy: 0,
                color: '#166534', // Green-700
                type: 'decoration',
                variant: 'grass',
                rotation: Math.random() * 0.4 - 0.2
            });
        }

        // 2. Flowers
        const flowerColors = ['#f472b6', '#fbbf24', '#c084fc', '#ffffff'];
        for (let i = 0; i < 20; i++) {
            decorations.push({
                id: `flower-${i}`,
                x: Math.random() * CANVAS_WIDTH,
                y: Math.random() * CANVAS_HEIGHT,
                width: 6,
                height: 6,
                vx: 0, vy: 0,
                color: flowerColors[Math.floor(Math.random() * flowerColors.length)],
                type: 'decoration',
                variant: 'flower',
                rotation: 0
            });
        }

        // 3. Rocks
        for (let i = 0; i < 8; i++) {
            decorations.push({
                id: `rock-${i}`,
                x: Math.random() * CANVAS_WIDTH,
                y: Math.random() * CANVAS_HEIGHT,
                width: 20 + Math.random() * 20,
                height: 15 + Math.random() * 15,
                vx: 0, vy: 0,
                color: '#57534e', // Stone-600
                type: 'decoration',
                variant: 'rock',
                rotation: Math.random() * Math.PI * 2
            });
        }

        // 4. Large Trees
        for (let i = 0; i < 15; i++) {
            decorations.push({
                id: `tree-${i}`,
                x: Math.random() * CANVAS_WIDTH,
                y: Math.random() * CANVAS_HEIGHT,
                width: 50 + Math.random() * 50,
                height: 50 + Math.random() * 50,
                vx: 0, vy: 0,
                color: Math.random() > 0.5 ? '#14532d' : '#064e3b', // Dark greens
                type: 'decoration',
                variant: 'tree',
                rotation: 0
            });
        }
    }

    decorationRef.current = decorations;
  };

  // Main Game Loop Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- INITIALIZATION ---
    playerRef.current.x = CANVAS_WIDTH / 2;
    playerRef.current.y = CANVAS_HEIGHT / 2;
    playerRef.current.color = isFuegorin ? '#f97316' : currentSkin.color;

    enemiesRef.current = [];
    sproutsRef.current = [];
    decorationRef.current = [];
    
    generateScenario();
    spawnSprout(); 
    
    scoreRef.current = 0;
    gameOverRef.current = false;
    victoryRef.current = false;
    foundSecretRef.current = null;
    hackerTimeRef.current = 0;
    maxHackerTimeRef.current = 0;
    totalSurvivalTimeRef.current = 0; 
    secretTimerRef.current = 0;

    setScoreUI(0);
    setGameOver(false);
    setVictory(false);
    setSecretFound(false);
    setHackerTimerUI(0);

    const loop = () => {
      // 1. Check Pause Ref
      if (pausedRef.current) {
         loopRef.current = requestAnimationFrame(loop);
         return; 
      }

      // 2. Game Over / Victory / Secret Check
      if (gameOverRef.current || victoryRef.current || foundSecretRef.current !== null) {
          return;
      }

      totalSurvivalTimeRef.current += 1/60; 
      frameRef.current++;

      // 3. Update Player
      const p = playerRef.current;
      p.x += inputRef.current.x * PLAYER_SPEED;
      p.y += inputRef.current.y * PLAYER_SPEED;
      p.x = Math.max(0, Math.min(CANVAS_WIDTH - p.width, p.x));
      p.y = Math.max(0, Math.min(CANVAS_HEIGHT - p.height, p.y));

      // 4. Secret Logic
      if (!isFuegorin && settings.difficulty !== 'extreme' && settings.difficulty !== 'hacker') {
          let isInSecretZone = false;
          let currentSecretId = -1;
          const px = p.x / CANVAS_WIDTH;
          const py = p.y / CANVAS_HEIGHT;
          const currentUnlocked = progressRef.current.unlockedStoryParts; 

          SECRETS_CONFIG.forEach(secret => {
             if (secret.difficulty === settings.difficulty && !currentUnlocked.includes(secret.id)) {
                 const xMatch = (secret.xMin ? px >= secret.xMin : true) && (secret.xMax ? px <= secret.xMax : true);
                 const yMatch = (secret.yMin ? py >= secret.yMin : true) && (secret.yMax ? py <= secret.yMax : true);
                 if (xMatch && yMatch) {
                     isInSecretZone = true;
                     currentSecretId = secret.id;
                 }
             }
          });

          if (isInSecretZone) {
              secretTimerRef.current += 1/60;
              // Detect secret found (2 seconds in zone)
              if (secretTimerRef.current > 2.0 && !foundSecretRef.current) {
                  foundSecretRef.current = currentSecretId;
                  
                  // CRITICAL FIX: Trigger onGameEnd immediately to save the secret
                  onGameEnd({ 
                    won: false, // Not a game win, but a discovery
                    score: scoreRef.current, 
                    hackerSurvivalTime: maxHackerTimeRef.current,
                    totalSurvivalTime: totalSurvivalTimeRef.current,
                    unlockedSecret: currentSecretId
                  });

                  // Update UI
                  setFoundSecretId(currentSecretId);
                  setSecretFound(true);
                  return; // Stop the loop
              }
          } else {
              secretTimerRef.current = 0;
          }
      }

      // 5. Extras Logic
      if (settings.difficulty === 'hacker') {
        hackerTimeRef.current += 1/60; 
        if (hackerTimeRef.current > maxHackerTimeRef.current) maxHackerTimeRef.current = hackerTimeRef.current;
        if (frameRef.current % 60 === 0) setHackerTimerUI(Math.floor(hackerTimeRef.current));
      }

      if (isMutant && frameRef.current % 60 === 0) {
          if (Math.random() < 0.07) spawnSprout('mutant');
      }

      // 6. Spawn Logic
      if (frameRef.current % difficultyConfig.spawnRate === 0) spawnEnemy();
      // Increase max sprouts from 3 to 6 as requested
      if (sproutsRef.current.filter(s => s.type === 'sprout').length < 6 && frameRef.current % 60 === 0) spawnSprout('sprout');

      // 7. Collision: Enemy
      for (const e of enemiesRef.current) {
        if (
          p.x < e.x + e.width - 10 &&
          p.x + p.width > e.x + 10 &&
          p.y < e.y + e.height - 10 &&
          p.y + p.height > e.y + 10
        ) {
          gameOverRef.current = true;
          setGameOver(true); // Show UI
          onGameEnd({ 
            won: false, 
            score: scoreRef.current, 
            hackerSurvivalTime: maxHackerTimeRef.current,
            totalSurvivalTime: totalSurvivalTimeRef.current 
          });
          return;
        }
      }

      // 8. Collision: Sprouts
      sproutsRef.current = sproutsRef.current.filter(s => {
        const dx = (p.x + p.width/2) - (s.x + s.width/2);
        const dy = (p.y + p.height/2) - (s.y + s.height/2);
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 40) { 
          const points = s.type === 'mutant' ? 4 : 1;
          scoreRef.current += points;
          setScoreUI(scoreRef.current);
          
          if (settings.difficulty === 'hacker') hackerTimeRef.current = 0;

          if (!isInfinite && scoreRef.current >= WIN_SCORE) {
             victoryRef.current = true;
             setVictory(true); // Show UI
             onGameEnd({ 
               won: true, 
               score: scoreRef.current, 
               hackerSurvivalTime: maxHackerTimeRef.current,
               totalSurvivalTime: totalSurvivalTimeRef.current 
             });
          }
          return false;
        }
        return true;
      });

      // --- DRAWING ---
      ctx.fillStyle = isFuegorin ? '#1c1917' : '#022c22';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Decorations with Detail
      decorationRef.current.forEach(d => {
         ctx.save();
         // Handle Rotation
         const cx = d.x + d.width/2;
         const cy = d.y + d.height/2;
         ctx.translate(cx, cy);
         if (d.rotation) ctx.rotate(d.rotation);
         ctx.translate(-cx, -cy);

         ctx.fillStyle = d.color;

         if (d.variant === 'grass') {
             ctx.fillRect(d.x, d.y, d.width, d.height);
         } else if (d.variant === 'flower') {
             ctx.beginPath();
             ctx.arc(cx, cy, d.width/2, 0, Math.PI * 2);
             ctx.fill();
         } else if (d.variant === 'rock') {
             ctx.beginPath();
             ctx.moveTo(d.x, d.y + d.height);
             ctx.lineTo(d.x + d.width/2, d.y);
             ctx.lineTo(d.x + d.width, d.y + d.height * 0.7);
             ctx.lineTo(d.x + d.width * 0.2, d.y + d.height);
             ctx.fill();
         } else if (d.variant === 'crack') {
             ctx.globalAlpha = 0.6;
             ctx.fillRect(d.x, d.y, d.width, d.height);
         } else if (d.variant === 'ash') {
             ctx.fillRect(d.x, d.y, d.width, d.height);
         } else if (d.variant === 'stump') {
             ctx.fillRect(d.x, d.y, d.width, d.height);
             ctx.fillStyle = '#0c0a09'; // Dark top for stump
             ctx.fillRect(d.x + 4, d.y + 4, d.width - 8, d.height - 8);
         } else {
             // Fallback for basic trees/circles
             ctx.beginPath();
             if (isFuegorin) {
                 ctx.fillRect(d.x, d.y, d.width/4, d.height);
             } else {
                 ctx.arc(cx, cy, d.width / 2, 0, Math.PI * 2);
                 ctx.fill();
             }
         }
         ctx.restore();
      });

      // Grid Overlay (subtle)
      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      ctx.lineWidth = 1;
      for(let i=0; i<CANVAS_WIDTH; i+=50) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, CANVAS_HEIGHT); ctx.stroke(); }
      for(let i=0; i<CANVAS_HEIGHT; i+=50) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(CANVAS_WIDTH, i); ctx.stroke(); }

      // Sprouts
      sproutsRef.current.forEach(s => {
        ctx.fillStyle = s.color;
        ctx.beginPath();
        if (isFuegorin && s.type === 'sprout') {
            ctx.moveTo(s.x + s.width/2, s.y);
            ctx.lineTo(s.x + s.width, s.y + s.height/2);
            ctx.lineTo(s.x + s.width/2, s.y + s.height);
            ctx.lineTo(s.x, s.y + s.height/2);
        } else {
            ctx.arc(s.x + s.width/2, s.y + s.height/2, s.width/2, 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.strokeStyle = s.color;
        ctx.globalAlpha = 0.3;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      // Enemies
      enemiesRef.current.forEach(e => {
        ctx.fillStyle = e.color;
        ctx.beginPath();
        if (isFuegorin) {
           // Water drop shape for 'Fuegorin' enemies (which are water drops in inverted mode)
           ctx.beginPath();
           ctx.arc(e.x + e.width/2, e.y + e.height - e.width/2, e.width/2, 0, Math.PI, false);
           ctx.lineTo(e.x + e.width/2, e.y);
           ctx.fill();
        } else {
           // Fire shape
           ctx.moveTo(e.x, e.y + e.height);
           ctx.lineTo(e.x + e.width / 2, e.y);
           ctx.lineTo(e.x + e.width, e.y + e.height);
        }
        ctx.fill();
      });

      // Player
      if (currentSkin.id === 'bolivia') {
          ctx.fillStyle = currentSkin.secondaryColor; 
          ctx.beginPath();
          const hullY = p.y + p.height - 5;
          ctx.arc(p.x + p.width/2, hullY, p.width, 0, Math.PI, false);
          ctx.fill();

          ctx.fillStyle = p.color; 
          ctx.beginPath();
          ctx.arc(p.x + p.width/2, hullY - 5, p.width/2, 0, Math.PI * 2);
          ctx.fill();
      } else {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x + p.width/2, p.y + p.height/2, p.width/2, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = 'rgba(255,255,255,0.3)';
          ctx.beginPath();
          ctx.arc(p.x + p.width/2, p.y + p.height/2, p.width/4, 0, Math.PI * 2);
          ctx.fill();
      }

      loopRef.current = requestAnimationFrame(loop);
    };

    // Start Loop
    loopRef.current = requestAnimationFrame(loop);

    return () => {
      if (loopRef.current) cancelAnimationFrame(loopRef.current);
    };
  }, []); 

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="w-full h-full object-cover touch-none z-0"
      />
      
      {/* UI Overlay */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none z-30">
        <div className="flex flex-col gap-2 pointer-events-auto">
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <span className={`w-3 h-3 rounded-full ${isFuegorin ? 'bg-orange-500' : 'bg-green-500'} animate-pulse`}></span>
                <span className="font-bold text-xl">{scoreUI} / {isInfinite ? '∞' : WIN_SCORE}</span>
            </div>
            {settings.difficulty === 'hacker' && (
                <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-purple-500/50">
                    <Timer size={16} className="text-purple-400" />
                    <span className="font-mono text-lg text-purple-300">{hackerTimerUI}s</span>
                </div>
            )}
        </div>
        
        {/* Hide Pause Button on Special Screens */}
        {!secretFound && (
            <button 
            className="pointer-events-auto p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white active:scale-95 transition-all"
            onClick={() => setPaused(!paused)}
            >
            {paused ? <Play size={24} fill="currentColor" /> : <Pause size={24} fill="currentColor" />}
            </button>
        )}
      </div>

      {/* Secret Found Screen (New) */}
      {secretFound && (
        <div className="absolute inset-0 bg-yellow-900/90 backdrop-blur-lg flex flex-col items-center justify-center z-50 p-8 animate-in zoom-in-95 duration-500">
           <BookOpen size={80} className="text-yellow-400 mb-6 animate-bounce" />
           <h2 className="text-4xl font-black mb-2 text-center uppercase tracking-tighter text-white">
               ¡Secreto Desbloqueado!
           </h2>
           <p className="text-yellow-200 mb-8 text-center font-bold text-lg">
               Has encontrado la Parte #{foundSecretId} de la Historia.
           </p>

           <div className="flex flex-col gap-4 w-full max-w-xs">
               <Button onClick={() => setGameState(GameState.EXTRAS)} className="flex items-center justify-center gap-2 py-4 bg-yellow-600 hover:bg-yellow-500 border-yellow-800 text-white">
                   <BookOpen size={24} /> Leer en Extras
               </Button>
               <Button variant="secondary" onClick={() => setGameState(GameState.MENU)} className="flex items-center justify-center gap-2">
                   <Home size={20} /> Menú Principal
               </Button>
           </div>
        </div>
      )}

      {/* Paused Overlay */}
      {paused && !gameOver && !victory && !secretFound && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-40">
           <h2 className="text-4xl font-black mb-8 tracking-widest uppercase">Pausa</h2>
           <div className="flex flex-col gap-4 w-64">
               <Button onClick={() => setPaused(false)} className="flex items-center justify-center gap-2">
                   <Play size={20} /> Continuar
               </Button>
               <Button variant="danger" onClick={() => setGameState(GameState.MENU)} className="flex items-center justify-center gap-2">
                   <Home size={20} /> Volver al Menú
               </Button>
           </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameOver && (
        <div className="absolute inset-0 bg-red-900/90 backdrop-blur-md flex flex-col items-center justify-center z-50 p-8 animate-in zoom-in-95 duration-300">
           <Skull size={80} className="text-white mb-4 animate-bounce" />
           <h2 className="text-5xl font-black mb-2 text-center uppercase tracking-tighter">
               {isFuegorin ? 'Apagado' : 'Quemado'}
           </h2>
           <p className="text-white/80 mb-8 text-center font-mono">
               Has sobrevivido {Math.floor(totalSurvivalTimeRef.current)} segundos
           </p>

           <div className="flex flex-col gap-4 w-full max-w-xs">
               <Button onClick={onRestart} className="flex items-center justify-center gap-2 py-4 text-xl">
                   <Play size={24} /> Reintentar
               </Button>
               <Button variant="secondary" onClick={() => setGameState(GameState.MENU)} className="flex items-center justify-center gap-2">
                   <Home size={20} /> Menú Principal
               </Button>
           </div>
        </div>
      )}

      {/* Victory Screen */}
      {victory && (
        <div className="absolute inset-0 bg-green-900/90 backdrop-blur-md flex flex-col items-center justify-center z-50 p-8 animate-in zoom-in-95 duration-300">
           <Sparkles size={80} className="text-yellow-400 mb-4 animate-spin-slow" />
           <h2 className="text-5xl font-black mb-2 text-center uppercase tracking-tighter">
               ¡Victoria!
           </h2>
           <p className="text-white/80 mb-8 text-center">
               El bosque comienza a sanar gracias a ti.
           </p>

           <div className="flex flex-col gap-4 w-full max-w-xs">
               <Button onClick={() => setGameState(GameState.LEVEL_SELECT)} className="flex items-center justify-center gap-2 py-4 text-xl">
                   <Play size={24} /> Siguiente Nivel
               </Button>
               <Button variant="secondary" onClick={() => setGameState(GameState.MENU)} className="flex items-center justify-center gap-2">
                   <Home size={20} /> Menú Principal
               </Button>
           </div>
        </div>
      )}

      {/* Controls */}
      {!gameOver && !victory && !paused && !secretFound && (
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 pointer-events-auto z-20">
            <Joystick onMove={(x, y) => inputRef.current = { x, y }} />
          </div>
      )}
    </div>
  );
};