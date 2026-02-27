import React, { useState, useEffect, useMemo } from 'react';
import { GameState, Skin, GameSettings, Difficulty, PlayerProgress, Achievement, GameResult, ActiveExtras, PowerUp, ActivePowerUp } from './types';
import { AVAILABLE_SKINS, BANANA_CODES, POWER_UPS } from './constants';
import { MainMenu } from './components/MainMenu';
import { Game } from './components/Game';
import { Skins } from './components/Skins';
import { Settings } from './components/Settings';
import { Achievements } from './components/Achievements';
import { LevelSelector } from './components/LevelSelector';
import { Extras } from './components/Extras';
import { Story } from './components/Story';
import { Shop } from './components/Shop';
import { Leaderboard } from './components/Leaderboard';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [progress, setProgress] = useState<PlayerProgress>(() => {
    const saved = localStorage.getItem('arbolin_progress_v5');
    // Migración de datos antiguos o inicialización
    const defaultProgress = {
      totalSprouts: 0, totalLosses: 0, totalAshes: 0, totalBaskets: 0, completedDifficulties: [], unlockedSkins: ['default'],
      maxHackerSurvival: 0, maxTotalSurvivalTime: 0, unlockedStoryParts: [], fuegorinLosses: 0, bananaLosses: 0,
      hasSacredPeel: false, hasCaramelBanana: false, unlockedBananaMode: false,
      redeemedCodes: [] 
    };
    if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultProgress, ...parsed };
    }
    return defaultProgress;
  });

  const [settings, setSettings] = useState<GameSettings>(() => {
    const saved = localStorage.getItem('arbolin_settings');
    const def = { soundEnabled: true, difficulty: 'easy', playerName: 'Jugador', controls: { type: 'joystick', scale: 1.0, opacity: 0.8, side: 'center', yOffset: 15, xOffset: 0 } };
    return saved ? { ...def, ...JSON.parse(saved) } : def;
  });

  const [activeExtras, setActiveExtras] = useState<ActiveExtras>({ mutant: false, infinite: false, fuegorin: false, bananaMode: false });
  const [activePowerUps, setActivePowerUps] = useState<ActivePowerUp[]>([]);
  const [showShop, setShowShop] = useState(false);
  const [restartKey, setRestartKey] = useState(0);

  useEffect(() => localStorage.setItem('arbolin_progress_v5', JSON.stringify(progress)), [progress]);
  useEffect(() => localStorage.setItem('arbolin_settings', JSON.stringify(settings)), [settings]);

  // Derive Achievements safely
  const achievementsList: Achievement[] = useMemo(() => {
    const base = [
      {
        id: 'sprouts_50',
        title: 'Recolector Dorado',
        description: 'Consigue 50 brotes en total.',
        skinRewardId: 'golden',
        isUnlocked: progress.unlockedSkins.includes('golden'),
        currentProgress: progress.totalSprouts,
        target: 50
      },
      {
        id: 'hacker_master',
        title: 'Maestro del Código',
        description: 'Completa la dificultad Hacker.',
        skinRewardId: 'glitch',
        isUnlocked: progress.unlockedSkins.includes('glitch'),
        currentProgress: progress.completedDifficulties.includes('hacker') ? 1 : 0,
        target: 1
      },
      {
        id: 'fuegorin_story',
        title: 'Buscador de Historias',
        description: 'Encuentra las 5 partes de la historia de Fuegorín.',
        skinRewardId: 'magma',
        isUnlocked: [1,2,3,4,5].every(id => (progress.unlockedStoryParts || []).includes(id)),
        currentProgress: (progress.unlockedStoryParts || []).filter(id => id <= 5).length,
        target: 5
      },
      {
        id: 'peruano_skin',
        title: 'Resiliencia Inca',
        description: 'Pierde 50 veces para desbloquear esta skin especial.',
        skinRewardId: 'peruano',
        isUnlocked: progress.unlockedSkins.includes('peruano'),
        currentProgress: progress.totalLosses,
        target: 50
      }
    ];

    if (activeExtras.bananaMode) {
      return [
        ...base,
        {
          id: 'baskets_50',
          title: 'Recolector Frutal',
          description: 'Consigue 50 canastas.',
          skinRewardId: 'banana_split',
          isUnlocked: progress.unlockedSkins.includes('banana_split'),
          currentProgress: progress.totalBaskets,
          target: 50
        },
        {
          id: 'banana_hacker',
          title: 'Hacker de Potasio',
          description: 'Completa Hacker en modo Banana.',
          skinRewardId: 'banana_mecha',
          isUnlocked: progress.unlockedSkins.includes('banana_mecha'),
          currentProgress: (progress.completedDifficulties || []).includes('hacker') ? 1 : 0, // Simplified check
          target: 1
        },
        {
          id: 'banana_losses',
          title: 'Resbalón Eterno',
          description: 'Pierde 25 veces en modo Banana.',
          skinRewardId: 'banana_rotten',
          isUnlocked: progress.unlockedSkins.includes('banana_rotten'),
          currentProgress: progress.bananaLosses || 0,
          target: 25
        }
      ];
    }
    return base;
  }, [progress, activeExtras.bananaMode]);

  // Función para canjear códigos manualmente
  const handleRedeemCode = (inputCode: string): boolean => {
    const code = inputCode.toUpperCase().trim();
    const validCodes = Object.values(BANANA_CODES);
    
    // Caso especial: Código Maestro "UNLOCKEDALL"
    if (code === BANANA_CODES.CHEAT) {
        setProgress(prev => {
            const allSkins = AVAILABLE_SKINS.map(s => s.id);
            const allStoryParts = Array.from({ length: 20 }, (_, i) => i + 1);
            const allDiffs: Difficulty[] = ['easy', 'normal', 'hard', 'extreme', 'hacker'];
            
            return {
                ...prev,
                totalSprouts: Math.max(prev.totalSprouts, 999),
                completedDifficulties: allDiffs,
                unlockedSkins: allSkins,
                unlockedStoryParts: allStoryParts,
                unlockedBananaMode: true,
                hasSacredPeel: true,
                hasCaramelBanana: true,
                redeemedCodes: [...(prev.redeemedCodes || []), ...validCodes]
            };
        });
        return true;
    }
    
    if (validCodes.includes(code)) {
        // Verificar si ya fue canjeado
        const redeemed = progress.redeemedCodes || [];
        if (redeemed.includes(code)) return true; // Ya canjeado, retornamos true como "éxito" (sin cambios)

        setProgress(prev => {
            const newRedeemed = [...(prev.redeemedCodes || []), code];
            
            // Verificar si tenemos los 3 códigos para desbloquear Modo Banana
            const hasAllCodes = validCodes.every(c => newRedeemed.includes(c));
            let unlockedBanana = prev.unlockedBananaMode;
            let newSkins = [...prev.unlockedSkins];

            if (hasAllCodes && !unlockedBanana) {
                unlockedBanana = true;
                if (!newSkins.includes('banana_hero')) newSkins.push('banana_hero');
            }

            return {
                ...prev,
                redeemedCodes: newRedeemed,
                unlockedBananaMode: unlockedBanana,
                unlockedSkins: newSkins
            };
        });
        return true;
    }
    return false;
  };

  const handleStartGame = () => {
    setShowShop(true);
  };

  const handleBuyPowerUp = (pu: PowerUp) => {
    const isFuegorin = activeExtras.fuegorin;
    const isBanana = activeExtras.bananaMode;
    
    let currency = progress.totalSprouts;
    let currencyKey: keyof PlayerProgress = 'totalSprouts';

    if (isFuegorin) {
      currency = progress.totalAshes;
      currencyKey = 'totalAshes';
    } else if (isBanana) {
      currency = progress.totalBaskets;
      currencyKey = 'totalBaskets';
    }
    
    if (currency >= pu.cost) {
      setProgress(prev => ({
        ...prev,
        [currencyKey]: currency - pu.cost
      }));
      setActivePowerUps(prev => [...prev, { type: pu.id, duration: 999, active: true }]);
    }
  };

  const handleGameEnd = (result: GameResult) => {
    setProgress(prev => {
      let newSkins = [...prev.unlockedSkins];
      const isFuegorin = activeExtras.fuegorin;
      const isBanana = activeExtras.bananaMode;

      const newTotalSprouts = (isFuegorin || isBanana) ? prev.totalSprouts : prev.totalSprouts + result.score;
      const newTotalAshes = isFuegorin ? prev.totalAshes + result.score : prev.totalAshes;
      const newTotalBaskets = isBanana ? prev.totalBaskets + result.score : prev.totalBaskets;
      
      let newTotalLosses = prev.totalLosses;
      let newFuegorinLosses = prev.fuegorinLosses || 0;
      let newBananaLosses = prev.bananaLosses || 0;

      if (!result.won) {
        if (isFuegorin) newFuegorinLosses++;
        else if (isBanana) newBananaLosses++;
        else newTotalLosses++;
      }
      
      let newUnlockedStoryParts = [...(prev.unlockedStoryParts || [])];
      if (result.unlockedSecret && !newUnlockedStoryParts.includes(result.unlockedSecret)) {
          newUnlockedStoryParts.push(result.unlockedSecret);
      }
      
      const newPeel = prev.hasSacredPeel || result.foundPeel;
      const newCaramel = prev.hasCaramelBanana || result.foundCaramel;

      const diffs = [...prev.completedDifficulties];
      if (result.won && !activeExtras.infinite) {
          if (!diffs.includes(settings.difficulty)) {
            diffs.push(settings.difficulty);
          }
          if (settings.difficulty === 'hacker') {
            if (isBanana && !newSkins.includes('banana_mecha')) newSkins.push('banana_mecha');
            if (!isBanana && !isFuegorin && !newSkins.includes('glitch')) newSkins.push('glitch');
          }
      }

      if (newTotalSprouts >= 50 && !newSkins.includes('golden')) newSkins.push('golden');
      if (newTotalLosses >= 50 && !newSkins.includes('peruano')) newSkins.push('peruano');
      if (newTotalBaskets >= 50 && !newSkins.includes('banana_split')) newSkins.push('banana_split');
      if (newBananaLosses >= 25 && !newSkins.includes('banana_rotten')) newSkins.push('banana_rotten');
      if ([1,2,3,4,5].every(id => newUnlockedStoryParts.includes(id)) && !newSkins.includes('magma')) newSkins.push('magma');

      return { 
        ...prev, 
        totalSprouts: newTotalSprouts, 
        totalAshes: newTotalAshes,
        totalBaskets: newTotalBaskets,
        totalLosses: newTotalLosses, 
        fuegorinLosses: newFuegorinLosses,
        bananaLosses: newBananaLosses,
        completedDifficulties: diffs,
        unlockedSkins: newSkins, 
        unlockedStoryParts: newUnlockedStoryParts, 
        hasSacredPeel: newPeel, 
        hasCaramelBanana: newCaramel 
      };
    });
    setActivePowerUps([]); // Clear power-ups after game
  };

  const currentSkinId = localStorage.getItem('arbolin_current_skin') || 'default';
  const currentSkin = AVAILABLE_SKINS.find(s => s.id === currentSkinId) || AVAILABLE_SKINS[0];

  return (
    <div className="w-full h-dvh bg-black overflow-hidden select-none">
      {gameState === GameState.MENU && <MainMenu setGameState={setGameState} totalSprouts={progress.totalSprouts} totalAshes={progress.totalAshes} totalBaskets={progress.totalBaskets} activeExtras={activeExtras} />}
      {gameState === GameState.LEVEL_SELECT && <LevelSelector setGameState={setGameState} setSettings={setSettings} completedDifficulties={progress.completedDifficulties} onStart={handleStartGame} />}
      
      {gameState === GameState.PLAYING && (
        <>
          <Game 
            key={restartKey} 
            currentSkin={currentSkin} 
            setGameState={setGameState} 
            onGameEnd={handleGameEnd} 
            settings={settings} 
            restartKey={restartKey} 
            onRestart={() => { setActivePowerUps([]); setRestartKey(k => k+1); setShowShop(true); }} 
            activeExtras={activeExtras} 
            progress={progress} 
            activePowerUps={activePowerUps}
          />
          {showShop && (
            <Shop 
              progress={progress} 
              onBuy={handleBuyPowerUp} 
              onClose={() => setShowShop(false)} 
              isFuegorin={activeExtras.fuegorin} 
              selectedPowerUps={activePowerUps.map(p => p.type)}
            />
          )}
        </>
      )}

      {gameState === GameState.SKINS && <Skins setGameState={setGameState} currentSkin={currentSkin} setCurrentSkin={(s) => { localStorage.setItem('arbolin_current_skin', s.id); setRestartKey(k => k+1); }} unlockedSkins={progress.unlockedSkins} activeExtras={activeExtras} />}
      {/* Pasamos onRedeemCode a Settings */}
      {gameState === GameState.SETTINGS && <Settings setGameState={setGameState} settings={settings} setSettings={setSettings} onRedeemCode={handleRedeemCode} />}
      {gameState === GameState.ACHIEVEMENTS && <Achievements setGameState={setGameState} achievements={achievementsList} activeExtras={activeExtras} />}
      {gameState === GameState.EXTRAS && <Extras setGameState={setGameState} activeExtras={activeExtras} setActiveExtras={setActiveExtras} progress={progress} />}
      {gameState === GameState.STORY && <Story setGameState={setGameState} />}
      {gameState === GameState.LEADERBOARD && <Leaderboard setGameState={setGameState} />}
    </div>
  );
}