import React from 'react';
import { GameState, Skin, ActiveExtras } from '../types';
import { AVAILABLE_SKINS } from '../constants';
import { Button } from './Button';
import { Lock, Check, ArrowLeft, Flame, Trees } from 'lucide-react';

interface SkinsProps {
  setGameState: (state: GameState) => void;
  currentSkin: Skin;
  setCurrentSkin: (skin: Skin) => void;
  unlockedSkins: string[];
  activeExtras: ActiveExtras;
}

export const Skins: React.FC<SkinsProps> = ({ 
  setGameState, 
  currentSkin, 
  setCurrentSkin, 
  unlockedSkins,
  activeExtras
}) => {
  const isFuegorinMode = activeExtras.fuegorin;
  const isBananaMode = activeExtras.bananaMode;
  
  // Filter skins based on mode
  const displayedSkins = AVAILABLE_SKINS.filter(skin => {
    if (isBananaMode) return skin.type === 'banana';
    if (isFuegorinMode) return skin.type === 'fuegorin';
    return skin.type === 'arbolin';
  });

  return (
    <div className={`w-full h-full flex flex-col ${isBananaMode ? 'bg-yellow-950' : (isFuegorinMode ? 'bg-red-950' : 'bg-gray-900')} text-white p-4 md:p-8 overflow-y-auto transition-colors duration-500`}>
      <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto w-full">
        <button 
          onClick={() => setGameState(GameState.MENU)}
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold text-center">GALERÍA</h2>
            {isBananaMode ? <span className="text-2xl">🍌</span> : (isFuegorinMode ? <Flame className="text-orange-500" /> : <Trees className="text-green-500" />)}
        </div>
        <div className="w-10"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto w-full pb-8">
        {displayedSkins.map((skin) => {
          const isUnlocked = unlockedSkins.includes(skin.id);
          const isSelected = currentSkin.id === skin.id;

          return (
            <div 
              key={skin.id}
              className={`relative bg-gray-800 rounded-2xl p-6 border-2 flex flex-col items-center transition-all ${
                isSelected 
                  ? (isBananaMode ? 'border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)] transform scale-105' : (isFuegorinMode ? 'border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)] transform scale-105' : 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)] transform scale-105'))
                  : 'border-gray-700 hover:border-gray-500'
              }`}
            >
              <div 
                className="w-24 h-24 rounded-full mb-4 shadow-inner flex items-center justify-center text-4xl transition-transform hover:scale-110 overflow-hidden relative"
                style={{ backgroundColor: isFuegorinMode ? '#000' : (isBananaMode ? '#422006' : skin.color), border: `4px solid ${skin.secondaryColor}` }}
              >
                 {isBananaMode ? (
                     <div className="relative w-full h-full flex items-center justify-center">
                         <div className="w-16 h-16 rounded-full rotate-45" style={{ backgroundColor: skin.color, border: `3px solid ${skin.secondaryColor}` }}></div>
                         <div className="absolute top-4 right-4 w-4 h-4 bg-[#713f12] rounded-sm"></div>
                     </div>
                 ) : isFuegorinMode ? (
                     // Fuegorin: Fire Emoji
                     <span className="text-5xl">🔥</span>
                 ) : (
                     // Arbolin: Tree Shape Preview
                     <div className="relative w-full h-full flex items-center justify-center">
                         {/* Trunk */}
                         <div className="absolute bottom-2 w-4 h-10 bg-[#5d4037]"></div>
                         {/* Foliage */}
                         <div className="absolute top-4 w-12 h-12 rounded-full" style={{ backgroundColor: skin.color }}></div>
                         <div className="absolute top-4 w-6 h-6 rounded-full opacity-50" style={{ backgroundColor: skin.secondaryColor }}></div>
                     </div>
                 )}
              </div>
              
              <h3 className="text-xl font-bold mb-1">{skin.name}</h3>
              <p className="text-gray-400 text-xs text-center mb-4 min-h-[40px]">{skin.description}</p>
              
              <div className="mt-auto w-full">
                {isUnlocked ? (
                  <Button 
                    variant={isSelected ? 'success' : 'secondary'}
                    className={`w-full py-2 text-sm ${isSelected ? (isFuegorinMode ? '!bg-orange-600 !border-orange-800' : '') : ''}`}
                    onClick={() => setCurrentSkin(skin)}
                    disabled={isSelected}
                  >
                    {isSelected ? <span className="flex items-center justify-center gap-2"><Check size={16}/> EQUIPADO</span> : 'EQUIPAR'}
                  </Button>
                ) : (
                  <div className="w-full bg-black/40 p-3 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-center gap-2 text-red-400 mb-1">
                      <Lock size={16} />
                      <span className="font-bold text-sm">BLOQUEADO</span>
                    </div>
                    <p className="text-[10px] text-center text-gray-500 leading-tight">
                      {skin.unlockHint}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};