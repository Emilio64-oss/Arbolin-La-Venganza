import React from 'react';
import { GameState, Difficulty, GameSettings } from '../types';
import { DIFFICULTY_CONFIG, DIFFICULTY_ORDER } from '../constants';
import { ArrowLeft, Lock, Play } from 'lucide-react';

interface LevelSelectorProps {
  setGameState: (state: GameState) => void;
  setSettings: React.Dispatch<React.SetStateAction<GameSettings>>;
  completedDifficulties: Difficulty[];
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({ setGameState, setSettings, completedDifficulties }) => {
  
  const startGame = (diff: Difficulty) => {
    setSettings(prev => ({ ...prev, difficulty: diff }));
    setGameState(GameState.PLAYING);
  };

  return (
    <div className="w-full h-full flex flex-col items-center bg-gray-900 text-white p-6 relative overflow-y-auto">
      <div className="w-full max-w-md flex items-center justify-between mb-8 mt-4">
        <button 
            onClick={() => setGameState(GameState.MENU)}
            className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
        >
            <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold uppercase tracking-wider">Selecciona Nivel</h2>
        <div className="w-12"></div>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-md pb-8">
        {DIFFICULTY_ORDER.map((diff, index) => {
            const config = DIFFICULTY_CONFIG[diff];
            const previousDiff = index > 0 ? DIFFICULTY_ORDER[index - 1] : null;
            const isUnlocked = index === 0 || (previousDiff && completedDifficulties.includes(previousDiff));
            const isCompleted = completedDifficulties.includes(diff);

            return (
                <button
                key={diff}
                onClick={() => isUnlocked && startGame(diff)}
                disabled={!isUnlocked}
                className={`group relative p-6 rounded-2xl border-2 transition-all overflow-hidden flex items-center justify-between ${
                    !isUnlocked 
                    ? 'bg-gray-900 border-gray-800 opacity-60 grayscale' 
                    : 'bg-gray-800 border-gray-700 hover:border-gray-500 hover:scale-[1.02] active:scale-[0.98]'
                }`}
                >
                    {/* Background tint based on difficulty color */}
                    {isUnlocked && (
                        <div 
                            className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                            style={{ backgroundColor: config.color }}
                        ></div>
                    )}

                    <div className="flex flex-col items-start z-10 gap-1">
                        <span 
                            className="text-2xl font-black italic uppercase tracking-widest flex items-center gap-2"
                            style={{ color: isUnlocked ? config.color : '#6b7280' }}
                        >
                            {config.label}
                        </span>
                        <span className="text-sm text-gray-400 font-medium">
                            Objetivo: {config.winScore} Brotes
                        </span>
                    </div>

                    <div className="z-10">
                        {!isUnlocked ? (
                            <div className="bg-black/40 p-3 rounded-full">
                                <Lock size={20} className="text-gray-500" />
                            </div>
                        ) : (
                            <div 
                                className={`p-3 rounded-full transition-colors ${isCompleted ? 'bg-green-500 text-white' : 'bg-white/10 text-white group-hover:bg-white group-hover:text-black'}`}
                            >
                                <Play size={24} fill="currentColor" />
                            </div>
                        )}
                    </div>
                </button>
            );
        })}
      </div>
    </div>
  );
};