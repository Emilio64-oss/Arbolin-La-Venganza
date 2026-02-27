import React, { useEffect, useRef, useState } from 'react';
import { Joystick } from './Joystick';
import { DirectionalButtons } from './DirectionalButtons';
import { GameState, Entity, Skin, Difficulty, GameResult, ActiveExtras, PlayerProgress, GameSettings, ActivePowerUp } from '../types';
import { CANVAS_WIDTH, CANVAS_HEIGHT, PLAYER_SPEED, DIFFICULTY_CONFIG, FIRE_WIDTH, FIRE_HEIGHT, BANANA_CODES, SECRETS_CONFIG, FUEGORIN_STORY, ARBOLIN_STORY, BANANA_STORY } from '../constants';
import { Button } from './Button';
import { Sparkles, Skull, Timer, Pause, Play, Home, BookOpen, Flame, Zap, MapPin, Target, Shield, Wind } from 'lucide-react';

interface GameProps {
  currentSkin: Skin;
  setGameState: (state: GameState) => void;
  onGameEnd: (result: GameResult) => void;
  settings: GameSettings;
  restartKey: number; 
  onRestart: () => void;
  activeExtras: ActiveExtras;
  progress: PlayerProgress;
  activePowerUps: ActivePowerUp[];
}

export const Game: React.FC<GameProps> = ({ 
  currentSkin, 
  setGameState, 
  onGameEnd, 
  settings,
  restartKey,
  onRestart,
  activeExtras,
  progress,
  activePowerUps
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scoreRef = useRef(0);
  const sproutsInRunRef = useRef(0);
  const gameOverRef = useRef(false);
  const victoryRef = useRef(false);
  const totalSurvivalTimeRef = useRef(0);
  const decorationRef = useRef<Entity[]>([]);
  const secretTimerRef = useRef(0);
  const projectilesRef = useRef<Entity[]>([]);
  const lastShotTimeRef = useRef(0);
  const shieldActiveRef = useRef(activePowerUps.some(p => p.type === 'shield'));
  
  const playerRef = useRef<Entity>({ 
    id: 'player', x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2, width: 30, height: 30, vx: 0, vy: 0, color: '#000', type: 'player' 
  });
  
  const enemiesRef = useRef<Entity[]>([]);
  const sproutsRef = useRef<Entity[]>([]);
  const frameRef = useRef(0);
  const inputRef = useRef({ x: 0, y: 0 });
  const aimRef = useRef({ x: 0, y: 0 });
  const loopRef = useRef<number>(0);
  const keysPressed = useRef({ w: false, a: false, s: false, d: false });

  const [scoreUI, setScoreUI] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);
  const [paused, setPaused] = useState(false);
  const [abilityReady, setAbilityReady] = useState(false);
  
  const isBanana = activeExtras.bananaMode;
  const isFuegorin = activeExtras.fuegorin;
  const isMutant = activeExtras.mutant;
  const isInfinite = activeExtras.infinite;

  const difficultyConfig = DIFFICULTY_CONFIG[settings.difficulty];

  const hasWeapon = activePowerUps.some(p => p.type === 'rapid_fire' || p.type === 'triple_shot');
  const speedBoost = activePowerUps.some(p => p.type === 'speed') ? 1.5 : 1.0;

  // Sync with server
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(`${protocol}//${window.location.host}`);
    
    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'leaderboard') {
        // We could update a local leaderboard state here if needed
      }
    };

    return () => socket.close();
  }, []);

  const shoot = (angle?: number) => {
    const p = playerRef.current;
    const now = Date.now();
    const cooldown = activePowerUps.some(pu => pu.type === 'rapid_fire') ? 200 : 500;
    
    if (now - lastShotTimeRef.current < cooldown) return;
    lastShotTimeRef.current = now;

    const targetAngle = angle !== undefined ? angle : Math.atan2(aimRef.current.y, aimRef.current.x);
    if (aimRef.current.x === 0 && aimRef.current.y === 0 && angle === undefined) return;

    const speed = 10;
    const isTriple = activePowerUps.some(pu => pu.type === 'triple_shot');

    const angles = isTriple ? [targetAngle - 0.2, targetAngle, targetAngle + 0.2] : [targetAngle];

    angles.forEach(a => {
      projectilesRef.current.push({
        id: Math.random().toString(),
        x: p.x + p.width/2,
        y: p.y + p.height/2,
        width: 10, height: 10,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed,
        color: isFuegorin ? '#f97316' : '#a3e635',
        type: 'projectile'
      });
    });
  };

  const triggerAbility = () => {
    // Remove 10 nearest enemies
    const p = playerRef.current;
    enemiesRef.current.sort((a, b) => {
      const distA = Math.sqrt(Math.pow(a.x - p.x, 2) + Math.pow(a.y - p.y, 2));
      const distB = Math.sqrt(Math.pow(b.x - p.x, 2) + Math.pow(b.y - p.y, 2));
      return distA - distB;
    });
    
    enemiesRef.current = enemiesRef.current.slice(10);
    setAbilityReady(false);
    
    // Visual effect: Nuke
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      }
    }
  };
  
  // Estados para el secreto descubierto
  // type: 'story' | 'item'
  const [secretFound, setSecretFound] = useState<{id: number, title: string, type: 'story' | 'item'} | null>(null);

  // --- CONTROLES WASD / FLECHAS ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        const k = e.key.toLowerCase();
        if (['w', 'arrowup'].includes(k)) keysPressed.current.w = true;
        if (['a', 'arrowleft'].includes(k)) keysPressed.current.a = true;
        if (['s', 'arrowdown'].includes(k)) keysPressed.current.s = true;
        if (['d', 'arrowright'].includes(k)) keysPressed.current.d = true;
        updateInputFromKeys();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
        const k = e.key.toLowerCase();
        if (['w', 'arrowup'].includes(k)) keysPressed.current.w = false;
        if (['a', 'arrowleft'].includes(k)) keysPressed.current.a = false;
        if (['s', 'arrowdown'].includes(k)) keysPressed.current.s = false;
        if (['d', 'arrowright'].includes(k)) keysPressed.current.d = false;
        updateInputFromKeys();
    };

    const updateInputFromKeys = () => {
        let x = 0; 
        let y = 0;
        if (keysPressed.current.a) x -= 1;
        if (keysPressed.current.d) x += 1;
        if (keysPressed.current.w) y -= 1;
        if (keysPressed.current.s) y += 1;
        
        // Normalizar diagonal
        if (x !== 0 && y !== 0) {
            const len = Math.sqrt(x*x + y*y);
            x /= len;
            y /= len;
        }
        
        if (x !== 0 || y !== 0 || (keysPressed.current.w || keysPressed.current.a || keysPressed.current.s || keysPressed.current.d)) {
            inputRef.current = { x, y };
        } else if (!settings.controls.type) { 
             inputRef.current = { x: 0, y: 0 };
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
    };
  }, [settings.controls.type]);

  const spawnEnemy = () => {
    const x = Math.random() * (CANVAS_WIDTH - FIRE_WIDTH);
    const y = Math.random() * (CANVAS_HEIGHT - FIRE_HEIGHT);
    if (Math.sqrt(Math.pow(x - playerRef.current.x, 2) + Math.pow(y - playerRef.current.y, 2)) < 150) return;

    enemiesRef.current.push({
      id: Math.random().toString(),
      x, y, width: FIRE_WIDTH, height: FIRE_HEIGHT, vx: 0, vy: 0,
      color: isBanana ? '#ef4444' : (isFuegorin ? '#3b82f6' : '#ef4444'), 
      type: 'enemy'
    });
  };

  const spawnSprout = (type: 'sprout' | 'mutant' = 'sprout') => {
    const color = isBanana ? (type === 'mutant' ? '#fb7185' : '#facc15') : (type === 'mutant' ? '#a855f7' : (isFuegorin ? '#57534e' : '#a3e635'));
    sproutsRef.current.push({
      id: Math.random().toString(),
      x: Math.random() * (CANVAS_WIDTH - 40) + 20,
      y: Math.random() * (CANVAS_HEIGHT - 40) + 20,
      width: type === 'mutant' ? 35 : 25,
      height: type === 'mutant' ? 35 : 25,
      vx: 0, vy: 0, color: color, type: type
    });
  };

  const generateScenario = () => {
      const decs: Entity[] = [];
      if (isFuegorin && !isBanana) {
          for (let i = 0; i < 20; i++) {
              decs.push({
                  id: `crack-${i}`, x: Math.random() * CANVAS_WIDTH, y: Math.random() * CANVAS_HEIGHT,
                  width: 30 + Math.random() * 50, height: 4, vx: 0, vy: 0, color: '#7f1d1d',
                  type: 'decoration', variant: 'crack', rotation: Math.random() * Math.PI
              });
          }
          for (let i = 0; i < 60; i++) {
              decs.push({
                  id: `ash-${i}`, x: Math.random() * CANVAS_WIDTH, y: Math.random() * CANVAS_HEIGHT,
                  width: 6, height: 6, vx: 0, vy: 0, color: Math.random() > 0.5 ? '#fdba74' : '#444',
                  type: 'decoration', variant: 'ash'
              });
          }
      } else if (!isBanana) {
          for (let i = 0; i < 40; i++) {
              decs.push({
                  id: `grass-${i}`, x: Math.random() * CANVAS_WIDTH, y: Math.random() * CANVAS_HEIGHT,
                  width: 8, height: 12, vx: 0, vy: 0, color: '#166534',
                  type: 'decoration', variant: 'grass', rotation: Math.random() * 0.4 - 0.2
              });
          }
      }
      decorationRef.current = decs;
  };

  const getStoryTitle = (id: number) => {
    const allStories = [...FUEGORIN_STORY, ...ARBOLIN_STORY, ...BANANA_STORY];
    return allStories.find(s => s.id === id)?.title || "Historia Desconocida";
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    playerRef.current.x = CANVAS_WIDTH / 2;
    playerRef.current.y = CANVAS_HEIGHT / 2;
    
    enemiesRef.current = [];
    sproutsRef.current = [];
    generateScenario();
    spawnSprout();

    const loop = () => {
      if (paused || secretFound) { loopRef.current = requestAnimationFrame(loop); return; }
      if (gameOverRef.current || victoryRef.current) return;

      frameRef.current++;
      totalSurvivalTimeRef.current += 1/60;

      // Update Player
      const p = playerRef.current;
      p.x = Math.max(0, Math.min(CANVAS_WIDTH - p.width, p.x + inputRef.current.x * PLAYER_SPEED * speedBoost));
      p.y = Math.max(0, Math.min(CANVAS_HEIGHT - p.height, p.y + inputRef.current.y * PLAYER_SPEED * speedBoost));

      // Update Projectiles
      projectilesRef.current = projectilesRef.current.filter(pr => {
        pr.x += pr.vx;
        pr.y += pr.vy;
        
        // Collision with enemies
        let hit = false;
        enemiesRef.current = enemiesRef.current.filter(e => {
          if (Math.abs(pr.x - e.x) < 25 && Math.abs(pr.y - e.y) < 25) {
            hit = true;
            return false;
          }
          return true;
        });

        return !hit && pr.x > -50 && pr.x < CANVAS_WIDTH + 50 && pr.y > -50 && pr.y < CANVAS_HEIGHT + 50;
      });

      if (aimRef.current.x !== 0 || aimRef.current.y !== 0) {
        shoot();
      }

      // --- LOGICA DE LUGARES SECRETOS ---
      let playerInAnySecret = false;
      const pxRatio = p.x / CANVAS_WIDTH;
      const pyRatio = p.y / CANVAS_HEIGHT;

      // 1. Secretos de Historia (Arbolín/Fuegorín/etc)
      for (const secret of SECRETS_CONFIG) {
        if (secret.difficulty === settings.difficulty && !(progress.unlockedStoryParts || []).includes(secret.id)) {
            const xMatch = (secret.xMin === undefined || pxRatio >= secret.xMin) && (secret.xMax === undefined || pxRatio <= secret.xMax);
            const yMatch = (secret.yMin === undefined || pyRatio >= secret.yMin) && (secret.yMax === undefined || pyRatio <= secret.yMax);
            
            if (xMatch && yMatch) {
                playerInAnySecret = true;
                secretTimerRef.current += 1/60;
                
                if (secretTimerRef.current >= 2.0) { 
                    const title = getStoryTitle(secret.id);
                    setSecretFound({ id: secret.id, title, type: 'story' });
                    return; 
                }
            }
        }
      }

      // 2. Secretos del Modo Banana (Cáscara Sagrada / Banana Caramelizada)
      // Solo si eres FUEGORIN
      if (isFuegorin) {
          // Cáscara Sagrada: Esquina Superior Central (Norte)
          // Rango aprox: X 0.4-0.6, Y < 0.15
          if (!progress.hasSacredPeel) {
             const inPeelZone = (pxRatio >= 0.4 && pxRatio <= 0.6) && (pyRatio <= 0.15);
             if (inPeelZone) {
                 playerInAnySecret = true;
                 secretTimerRef.current += 1/60;
                 if (secretTimerRef.current >= 2.0) {
                     setSecretFound({ id: 998, title: "Cáscara Sagrada", type: 'item' });
                     return;
                 }
             }
          }

          // Banana Caramelizada: Esquina Inferior Central (Sur)
          // Rango aprox: X 0.4-0.6, Y > 0.85
          if (!progress.hasCaramelBanana) {
             const inCaramelZone = (pxRatio >= 0.4 && pxRatio <= 0.6) && (pyRatio >= 0.85);
             if (inCaramelZone) {
                 playerInAnySecret = true;
                 secretTimerRef.current += 1/60;
                 if (secretTimerRef.current >= 2.0) {
                     setSecretFound({ id: 999, title: "Banana Caramelizada", type: 'item' });
                     return;
                 }
             }
          }
      }
      
      // Reset timer if left zone
      if (!playerInAnySecret) secretTimerRef.current = 0;

      // Spawn
      if (frameRef.current % difficultyConfig.spawnRate === 0) spawnEnemy();
      if (isMutant && frameRef.current % 180 === 0) spawnSprout('mutant');
      if (sproutsRef.current.length < 4 && frameRef.current % 60 === 0) spawnSprout();

      // Collisions: Enemies
      for (const e of enemiesRef.current) {
        if (Math.abs(p.x - e.x) < 25 && Math.abs(p.y - e.y) < 30) {
          if (shieldActiveRef.current) {
            shieldActiveRef.current = false;
            enemiesRef.current = enemiesRef.current.filter(en => en.id !== e.id);
            continue;
          }
          gameOverRef.current = true;
          setGameOver(true);
          onGameEnd({ won: false, score: scoreRef.current, hackerSurvivalTime: 0, totalSurvivalTime: totalSurvivalTimeRef.current });
          
          // Submit to leaderboard if infinite
          if (isInfinite) {
            fetch('/api/leaderboard', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: settings.playerName, score: scoreRef.current, date: new Date().toISOString() })
            });
          }
          return;
        }
      }

      // Collisions: Sprouts
      sproutsRef.current = sproutsRef.current.filter(s => {
        if (Math.abs(p.x - s.x) < 30 && Math.abs(p.y - s.y) < 30) {
          scoreRef.current += (s.type === 'mutant' ? 4 : 1);
          sproutsInRunRef.current += (s.type === 'mutant' ? 4 : 1);
          
          if (sproutsInRunRef.current >= 15) {
            sproutsInRunRef.current -= 15;
            setAbilityReady(true);
          }

          setScoreUI(scoreRef.current);
          if (!isInfinite && scoreRef.current >= difficultyConfig.winScore) {
            victoryRef.current = true;
            setVictory(true);
            onGameEnd({ won: true, score: scoreRef.current, hackerSurvivalTime: 0, totalSurvivalTime: totalSurvivalTimeRef.current });
          }
          return false;
        }
        return true;
      });

      // DRAWING
      ctx.fillStyle = isBanana ? '#fef9c3' : (isFuegorin ? '#1c1917' : '#022c22');
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Banana Mode Visuals: Yellow Tint and Particles
      if (isBanana) {
        ctx.fillStyle = 'rgba(252, 211, 77, 0.1)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        // Floating banana peels
        for (let i = 0; i < 5; i++) {
          const x = (frameRef.current * 2 + i * 100) % CANVAS_WIDTH;
          const y = (frameRef.current + i * 200) % CANVAS_HEIGHT;
          ctx.fillStyle = 'rgba(254, 240, 138, 0.2)';
          ctx.beginPath();
          ctx.ellipse(x, y, 10, 5, Math.PI/4, 0, Math.PI*2);
          ctx.fill();
        }
      }

      // Effect: Secret Zone Warning
      if (playerInAnySecret) {
          const intensity = Math.min(1, secretTimerRef.current / 2.0); // 0 to 1 based on time
          const alpha = 0.1 + (Math.sin(frameRef.current * 0.2) * 0.1) + (intensity * 0.3);
          
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.lineWidth = 4 + (intensity * 4);
          ctx.strokeRect(10, 10, CANVAS_WIDTH - 20, CANVAS_HEIGHT - 20);
          
          if (frameRef.current % 30 < 15) {
             ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + intensity * 0.5})`;
             ctx.font = '24px monospace';
             ctx.fillText("???", p.x + 10, p.y - 10);
          }
      }

      decorationRef.current.forEach(d => {
          ctx.save();
          ctx.translate(d.x, d.y);
          if (d.rotation) ctx.rotate(d.rotation);
          ctx.fillStyle = d.color;
          ctx.fillRect(-d.width/2, -d.height/2, d.width, d.height);
          ctx.restore();
      });

      // Draw Codes
      if (frameRef.current % 200 > 100) {
          ctx.fillStyle = 'rgba(255,255,255,0.08)';
          ctx.font = '14px monospace';
          if (settings.difficulty === 'hard') ctx.fillText(BANANA_CODES.HARD, 50, 150);
          if (settings.difficulty === 'extreme') ctx.fillText(BANANA_CODES.EXTREME, 350, 700);
          if (settings.difficulty === 'hacker') ctx.fillText(BANANA_CODES.HACKER, 200, 450);
      }

      sproutsRef.current.forEach(s => {
          ctx.fillStyle = s.color;
          if (isBanana) {
              // Draw Basket
              ctx.fillStyle = '#78350f'; // Brown basket
              ctx.fillRect(s.x, s.y + 10, 25, 15);
              ctx.strokeStyle = '#451a03';
              ctx.lineWidth = 2;
              ctx.strokeRect(s.x, s.y + 10, 25, 15);
              // Handle
              ctx.beginPath();
              ctx.arc(s.x + 12.5, s.y + 10, 10, Math.PI, 0);
              ctx.stroke();
              // Fruits inside
              ctx.fillStyle = s.color;
              ctx.beginPath(); ctx.arc(s.x + 8, s.y + 12, 5, 0, Math.PI * 2); ctx.fill();
              ctx.beginPath(); ctx.arc(s.x + 17, s.y + 12, 5, 0, Math.PI * 2); ctx.fill();
          } else {
              // Improved Sprout Visuals
              ctx.beginPath(); ctx.arc(s.x + 12, s.y + 12, 10, 0, Math.PI * 2); ctx.fill();
              ctx.fillStyle = 'rgba(255,255,255,0.3)';
              ctx.beginPath(); ctx.arc(s.x + 8, s.y + 8, 3, 0, Math.PI * 2); ctx.fill();
              if(s.type === 'mutant') { ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke(); }
          }
      });

      projectilesRef.current.forEach(pr => {
        ctx.fillStyle = pr.color;
        ctx.beginPath(); ctx.arc(pr.x, pr.y, 5, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 10; ctx.shadowColor = pr.color;
        ctx.fill(); ctx.shadowBlur = 0;
      });

      enemiesRef.current.forEach(e => {
          if (isBanana) {
              ctx.font = '32px serif'; ctx.fillText('🔥', e.x, e.y + 32);
          } else {
              ctx.font = '32px serif'; ctx.fillText(isFuegorin ? '💧' : '🔥', e.x, e.y + 32);
          }
      });

      const px = p.x; const py = p.y;
      // Visual Improvement for Arbolín
      if (isBanana) {
          // Render Banana with Skin Colors
          ctx.fillStyle = currentSkin.color; 
          ctx.beginPath(); 
          ctx.ellipse(px + 15, py + 15, 12, 28, Math.PI / 4, 0, Math.PI * 2); 
          ctx.fill();
          
          ctx.fillStyle = currentSkin.secondaryColor; 
          ctx.fillRect(px + 22, py, 5, 8);

          // Eyes for Banana
          ctx.fillStyle = '#000';
          ctx.beginPath(); ctx.arc(px + 10, py + 12, 2, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(px + 18, py + 18, 2, 0, Math.PI * 2); ctx.fill();
      } else if (isFuegorin) {
          ctx.fillStyle = '#f97316'; ctx.beginPath(); ctx.moveTo(px + 15, py); 
          ctx.quadraticCurveTo(px + 30, py + 20, px + 15, py + 30); 
          ctx.quadraticCurveTo(px, py + 20, px + 15, py); ctx.fill();
          ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(px+15, py+20, 5, 0, Math.PI*2); ctx.fill();
      } else {
          // Improved Arbolín: Leaves, Eyes, Breathing
          const breathe = Math.sin(frameRef.current * 0.1) * 2;
          
          // Trunk
          ctx.fillStyle = '#5d4037'; ctx.fillRect(px + 10, py + 15, 10, 15);
          
          // Leaves (Main body)
          ctx.fillStyle = currentSkin.color;
          ctx.beginPath(); ctx.arc(px + 15, py + 10 + breathe, 18, 0, Math.PI * 2); ctx.fill();
          
          // Secondary Leaves
          ctx.fillStyle = currentSkin.secondaryColor;
          ctx.beginPath(); ctx.arc(px + 5, py + 5 + breathe, 10, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(px + 25, py + 5 + breathe, 10, 0, Math.PI * 2); ctx.fill();
          
          // Eyes
          ctx.fillStyle = '#000';
          ctx.beginPath(); ctx.arc(px + 10, py + 10 + breathe, 2, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(px + 20, py + 10 + breathe, 2, 0, Math.PI * 2); ctx.fill();

          // Shield Visual
          if (shieldActiveRef.current) {
            ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
            ctx.lineWidth = 3;
            ctx.beginPath(); ctx.arc(px + 15, py + 10, 25, 0, Math.PI * 2); ctx.stroke();
          }
      }

      loopRef.current = requestAnimationFrame(loop);
    };

    loopRef.current = requestAnimationFrame(loop);
    return () => { if (loopRef.current) cancelAnimationFrame(loopRef.current); };
  }, [paused, isFuegorin, isBanana, secretFound]);

  // Handle secret confirmation and exit
  const handleSecretClaim = () => {
    if (secretFound) {
      if (secretFound.type === 'item') {
          // Found Peel or Caramel
          onGameEnd({
              won: false,
              score: scoreRef.current,
              hackerSurvivalTime: 0,
              totalSurvivalTime: totalSurvivalTimeRef.current,
              foundPeel: secretFound.title === "Cáscara Sagrada",
              foundCaramel: secretFound.title === "Banana Caramelizada"
          });
          setGameState(GameState.EXTRAS); // Go to extras to see the item
      } else {
          // It was a story part
          onGameEnd({
            won: false, 
            score: scoreRef.current, 
            hackerSurvivalTime: 0, 
            totalSurvivalTime: totalSurvivalTimeRef.current,
            unlockedSecret: secretFound.id 
          });
          setGameState(GameState.STORY);
      }
    }
  };

  const controlStyle: React.CSSProperties = {
      position: 'absolute', bottom: `${settings.controls.yOffset}%`,
      opacity: settings.controls.opacity, transform: `scale(${settings.controls.scale}) translateX(-50%)`,
      left: settings.controls.side === 'center' ? '50%' : (settings.controls.side === 'left' ? '25%' : '75%')
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden focus:outline-none">
      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="w-full h-full object-cover" />
      
      <div className="absolute top-4 left-4 right-4 flex justify-between z-30 pointer-events-none">
        <div className="bg-black/60 px-5 py-2 rounded-full border border-white/20 text-xl font-black pointer-events-auto backdrop-blur-md">
            {scoreUI} <span className="text-sm opacity-50">/ {isInfinite ? '∞' : difficultyConfig.winScore}</span>
        </div>
        <button onClick={() => setPaused(!paused)} className="p-3 bg-black/60 rounded-full border border-white/20 text-white pointer-events-auto active:scale-90 transition-transform backdrop-blur-md">
            {paused ? <Play size={24} fill="currentColor" /> : <Pause size={24} fill="currentColor" />}
        </button>
      </div>

      {secretFound && (
        <div className="absolute inset-0 bg-indigo-900/95 backdrop-blur-lg flex flex-col items-center justify-center z-50 p-6 animate-in zoom-in-95 duration-500">
           <div className="bg-indigo-600 p-6 rounded-full mb-6 shadow-[0_0_50px_rgba(79,70,229,0.5)] animate-bounce">
              <BookOpen size={64} className="text-white" />
           </div>
           
           <h2 className="text-4xl font-black mb-2 text-center uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 drop-shadow-lg">
             ¡SECRETO DESCUBIERTO!
           </h2>
           
           <div className="bg-black/40 p-6 rounded-xl border border-indigo-400/30 text-center mb-8 max-w-sm w-full">
             <p className="text-indigo-200 text-sm uppercase font-bold mb-2">Has desbloqueado:</p>
             <p className="text-2xl font-black text-white italic">"{secretFound.title}"</p>
           </div>

           <div className="flex flex-col gap-3 w-full max-w-xs">
               <Button onClick={handleSecretClaim} className="flex items-center justify-center gap-2 py-4 bg-yellow-500 hover:bg-yellow-400 border-yellow-700 text-black shadow-yellow-900/50">
                   <BookOpen size={20} /> {secretFound.type === 'story' ? 'LEER HISTORIA' : 'VER OBJETOS'}
               </Button>
               <p className="text-xs text-center text-indigo-300/60 mt-2">
                 El progreso se ha guardado automáticamente.
               </p>
           </div>
        </div>
      )}

      {paused && !secretFound && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-40">
              <h2 className="text-5xl font-black mb-10 tracking-widest uppercase">Pausa</h2>
              <Button onClick={() => setPaused(false)} className="w-64 mb-4">Continuar</Button>
              <Button variant="secondary" onClick={() => setGameState(GameState.MENU)} className="w-64">Salir</Button>
          </div>
      )}

      {gameOver && (
        <div className="absolute inset-0 bg-red-900/90 flex flex-col items-center justify-center z-50 p-8 animate-in zoom-in-95 duration-300">
           <Skull size={80} className="mb-4 text-white" />
           <h2 className="text-5xl font-black mb-8 italic uppercase tracking-tighter">DERROTA</h2>
           <Button onClick={onRestart} className="w-64 mb-4">Reintentar</Button>
           <Button variant="secondary" onClick={() => setGameState(GameState.MENU)} className="w-64">Menú</Button>
        </div>
      )}

      {victory && (
        <div className="absolute inset-0 bg-green-900/90 flex flex-col items-center justify-center z-50 p-8 animate-in zoom-in-95 duration-300">
           <Sparkles size={80} className="mb-4 text-yellow-400" />
           <h2 className="text-5xl font-black mb-8 italic uppercase tracking-tighter">VICTORIA</h2>
           <Button onClick={() => setGameState(GameState.LEVEL_SELECT)} className="w-64 mb-4">Siguiente</Button>
           <Button variant="secondary" onClick={() => setGameState(GameState.MENU)} className="w-64">Menú</Button>
        </div>
      )}

      {!gameOver && !victory && !paused && !secretFound && (
          <div className="absolute inset-x-0 bottom-0 p-8 flex justify-between items-end pointer-events-none">
            <div style={{ opacity: settings.controls.opacity, transform: `scale(${settings.controls.scale})` }} className="pointer-events-auto">
              {settings.controls.type === 'joystick' ? <Joystick onMove={(x, y) => inputRef.current = { x, y }} /> : <DirectionalButtons onMove={(x, y) => inputRef.current = { x, y }} />}
            </div>

            <div className="flex flex-col items-center gap-4">
              {abilityReady && (
                <button 
                  onClick={triggerAbility}
                  className="w-16 h-16 bg-yellow-500 rounded-full border-4 border-yellow-700 shadow-lg flex items-center justify-center animate-pulse pointer-events-auto active:scale-90 transition-transform"
                >
                  <Zap size={32} className="text-black" />
                </button>
              )}
              
              {hasWeapon && (
                <div style={{ opacity: settings.controls.opacity, transform: `scale(${settings.controls.scale})` }} className="pointer-events-auto">
                  <Joystick onMove={(x, y) => aimRef.current = { x, y }} color="#ef4444" label="APUNTAR" />
                </div>
              )}
            </div>
          </div>
      )}
    </div>
  );
};