import React, { useState, useEffect } from 'react';
import { GameState, Skin, GameSettings, Difficulty, PlayerProgress, Achievement, GameResult, ActiveExtras, LeaderboardEntry } from './types';
import { AVAILABLE_SKINS } from './constants';
import { MainMenu } from './components/MainMenu';
import { Game } from './components/Game';
import { Skins } from './components/Skins';
import { Settings } from './components/Settings';
import { Achievements } from './components/Achievements';
import { LevelSelector } from './components/LevelSelector';
import { Extras } from './components/Extras';
import { Leaderboard } from './components/Leaderboard';
import { Story } from './components/Story';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  
  // Persisted Player State
  const [progress, setProgress] = useState<PlayerProgress>(() => {
    const saved = localStorage.getItem('arbolin_progress');
    return saved ? JSON.parse(saved) : {
      totalSprouts: 0,
      totalLosses: 0,
      completedDifficulties: [],
      unlockedSkins: ['default'],
      maxHackerSurvival: 0,
      maxTotalSurvivalTime: 0,
      unlockedStoryParts: [],
      fuegorinLosses: 0
    };
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    const saved = localStorage.getItem('arbolin_leaderboard');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentSkinId, setCurrentSkinId] = useState<string>(() => {
     return localStorage.getItem('arbolin_current_skin') || 'default';
  });

  const [settings, setSettings] = useState<GameSettings>(() => {
    const saved = localStorage.getItem('arbolin_settings');
    return saved ? JSON.parse(saved) : { soundEnabled: true, difficulty: 'easy', playerName: 'Jugador' };
  });

  // Extras State (Not persisted per session usually, but we can if desired. Let's keep it volatile for challenge)
  const [activeExtras, setActiveExtras] = useState<ActiveExtras>({
    mutant: false,
    infinite: false,
    fuegorin: false
  });

  // State to force game restart
  const [restartKey, setRestartKey] = useState(0);

  // Derived Achievements Data
  const achievements: Achievement[] = [
    {
      id: 'collect_50',
      title: 'Recolector Novato',
      description: 'Coge 50 brotes en total.',
      skinRewardId: 'golden',
      isUnlocked: progress.unlockedSkins.includes('golden'),
      currentProgress: progress.totalSprouts,
      target: 50
    },
    {
      id: 'all_difficulties',
      title: 'Maestro del Bosque',
      description: 'Pásate todas las dificultades.',
      skinRewardId: 'void',
      isUnlocked: progress.unlockedSkins.includes('void'),
      currentProgress: new Set(progress.completedDifficulties).size,
      target: 5 
    },
    {
      id: 'lose_25',
      title: 'Aprender del Dolor',
      description: 'Pierde 25 veces.',
      skinRewardId: 'ghost',
      isUnlocked: progress.unlockedSkins.includes('ghost'),
      currentProgress: progress.totalLosses,
      target: 25
    },
    {
      id: 'lose_50',
      title: 'Resiliencia Total',
      description: 'Pierde 50 veces.',
      skinRewardId: 'peruano',
      isUnlocked: progress.unlockedSkins.includes('peruano'),
      currentProgress: progress.totalLosses,
      target: 50
    },
    {
      id: 'hacker_survival',
      title: 'Economía de Guerra',
      description: 'Aguanta 50s en modo Hacker sin brotes.',
      skinRewardId: 'venezolano',
      isUnlocked: progress.unlockedSkins.includes('venezolano'),
      currentProgress: Math.floor(progress.maxHackerSurvival || 0),
      target: 50
    },
    {
      id: 'fuegorin_fail',
      title: 'Capitán de Ceniza',
      description: 'Pierde 25 veces en modo Fuegorín.',
      skinRewardId: 'bolivia',
      isUnlocked: progress.unlockedSkins.includes('bolivia'),
      currentProgress: progress.fuegorinLosses || 0,
      target: 25
    },
    {
      id: 'total_survival',
      title: 'Superviviente Legendario',
      description: 'Sobrevive un total de 120 segundos en cualquier dificultad.',
      skinRewardId: 'ancient',
      isUnlocked: progress.unlockedSkins.includes('ancient'),
      currentProgress: Math.floor(progress.maxTotalSurvivalTime || 0),
      target: 120
    }
  ];

  // Save state effects
  useEffect(() => localStorage.setItem('arbolin_progress', JSON.stringify(progress)), [progress]);
  useEffect(() => localStorage.setItem('arbolin_current_skin', currentSkinId), [currentSkinId]);
  useEffect(() => localStorage.setItem('arbolin_settings', JSON.stringify(settings)), [settings]);
  useEffect(() => localStorage.setItem('arbolin_leaderboard', JSON.stringify(leaderboard)), [leaderboard]);

  const currentSkin = AVAILABLE_SKINS.find(s => s.id === currentSkinId) || AVAILABLE_SKINS[0];

  const unlockSkin = (skinId: string, currentSkins: string[]) => {
    if (!currentSkins.includes(skinId)) {
      return [...currentSkins, skinId];
    }
    return currentSkins;
  };

  const handleGameEnd = (result: GameResult) => {
    const { won, score, hackerSurvivalTime, totalSurvivalTime, unlockedSecret } = result;

    // Handle Infinite Mode Leaderboard
    if (activeExtras.infinite) {
      setLeaderboard(prev => {
         const newEntry: LeaderboardEntry = {
            name: settings.playerName || 'Anónimo',
            score: score,
            date: new Date().toISOString()
         };
         return [...prev, newEntry];
      });
    }

    setProgress(prev => {
      let newSkins = [...prev.unlockedSkins];
      const newTotalSprouts = prev.totalSprouts + score;
      const newTotalLosses = won ? prev.totalLosses : prev.totalLosses + 1;
      const newCompletedDifficulties = [...prev.completedDifficulties];
      const newMaxHackerSurvival = Math.max(prev.maxHackerSurvival || 0, hackerSurvivalTime);
      const newMaxTotalSurvivalTime = Math.max(prev.maxTotalSurvivalTime || 0, totalSurvivalTime);
      
      const isFuegorinLoss = activeExtras.fuegorin && !won;
      const newFuegorinLosses = isFuegorinLoss ? (prev.fuegorinLosses || 0) + 1 : (prev.fuegorinLosses || 0);

      let newUnlockedStoryParts = [...(prev.unlockedStoryParts || [])];
      if (unlockedSecret && !newUnlockedStoryParts.includes(unlockedSecret)) {
          newUnlockedStoryParts.push(unlockedSecret);
      }

      if (won && !activeExtras.infinite && !activeExtras.fuegorin) {
         if (!newCompletedDifficulties.includes(settings.difficulty)) {
           newCompletedDifficulties.push(settings.difficulty);
         }
         
         if (settings.difficulty === 'normal') newSkins = unlockSkin('sakura', newSkins);
         if (settings.difficulty === 'hard') newSkins = unlockSkin('autumn', newSkins);
         if (settings.difficulty === 'extreme') newSkins = unlockSkin('magma', newSkins);
         if (settings.difficulty === 'hacker') newSkins = unlockSkin('glitch', newSkins);
      }

      // 50 Sprouts
      if (newTotalSprouts >= 50) newSkins = unlockSkin('golden', newSkins);
      // 25 Losses
      if (newTotalLosses >= 25) newSkins = unlockSkin('ghost', newSkins);
      // 50 Losses (Peruano)
      if (newTotalLosses >= 50) newSkins = unlockSkin('peruano', newSkins);
      // 50s Survival Hacker (Venezolano)
      if (newMaxHackerSurvival >= 50) newSkins = unlockSkin('venezolano', newSkins);
      // 25 Fuegorin Losses (Boliviana)
      if (newFuegorinLosses >= 25) newSkins = unlockSkin('bolivia', newSkins);
      // 120s Total Survival (Ancestral)
      if (newMaxTotalSurvivalTime >= 120) newSkins = unlockSkin('ancient', newSkins); 
      // All Difficulties
      const uniqueDiffs = new Set(newCompletedDifficulties);
      if (uniqueDiffs.size >= 5) newSkins = unlockSkin('void', newSkins);

      return {
        totalSprouts: newTotalSprouts,
        totalLosses: newTotalLosses,
        completedDifficulties: newCompletedDifficulties,
        unlockedSkins: newSkins,
        maxHackerSurvival: newMaxHackerSurvival,
        maxTotalSurvivalTime: newMaxTotalSurvivalTime,
        unlockedStoryParts: newUnlockedStoryParts,
        fuegorinLosses: newFuegorinLosses
      };
    });
  };

  const handleRestartGame = () => {
    setRestartKey(prev => prev + 1); 
    setGameState(GameState.PLAYING); 
  };

  return (
    <div className="w-full h-dvh bg-black overflow-hidden font-sans select-none">
      {gameState === GameState.MENU && (
        <MainMenu 
            setGameState={setGameState} 
            totalSprouts={progress.totalSprouts} 
            activeExtras={activeExtras}
        />
      )}

      {gameState === GameState.LEVEL_SELECT && (
        <LevelSelector 
            setGameState={setGameState}
            setSettings={setSettings}
            completedDifficulties={progress.completedDifficulties}
        />
      )}
      
      {gameState === GameState.PLAYING && (
        <Game 
          key={`${settings.difficulty}-${restartKey}-${activeExtras.fuegorin}-${activeExtras.infinite}-${activeExtras.mutant}-${currentSkin.id}`}
          currentSkin={currentSkin} 
          setGameState={setGameState} 
          onGameEnd={handleGameEnd}
          settings={settings}
          restartKey={restartKey} 
          onRestart={handleRestartGame}
          activeExtras={activeExtras}
          progress={progress}
        />
      )}
      
      {gameState === GameState.SKINS && (
        <Skins 
          setGameState={setGameState}
          currentSkin={currentSkin}
          setCurrentSkin={(skin) => setCurrentSkinId(skin.id)}
          unlockedSkins={progress.unlockedSkins}
        />
      )}
      
      {gameState === GameState.ACHIEVEMENTS && (
        <Achievements 
          setGameState={setGameState}
          achievements={achievements}
        />
      )}
      
      {gameState === GameState.SETTINGS && (
        <Settings 
          setGameState={setGameState}
          settings={settings}
          setSettings={setSettings}
          completedDifficulties={progress.completedDifficulties}
        />
      )}

      {gameState === GameState.EXTRAS && (
        <Extras
          setGameState={setGameState}
          activeExtras={activeExtras}
          setActiveExtras={setActiveExtras}
          progress={progress}
        />
      )}

      {gameState === GameState.LEADERBOARD && (
        <Leaderboard
          setGameState={setGameState}
          leaderboard={leaderboard}
        />
      )}

      {gameState === GameState.STORY && (
        <Story setGameState={setGameState} />
      )}
    </div>
  );
}