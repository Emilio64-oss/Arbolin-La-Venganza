import React from 'react';
import { GameState, Skin } from '../types';
import { AVAILABLE_SKINS } from '../constants';
import { Button } from './Button';
import { Lock, Check, ArrowLeft } from 'lucide-react';

interface SkinsProps {
  setGameState: (state: GameState) => void;
  currentSkin: Skin;
  setCurrentSkin: (skin: Skin) => void;
  unlockedSkins: string[];
}

export const Skins: React.FC<SkinsProps> = ({ 
  setGameState, 
  currentSkin, 
  setCurrentSkin, 
  unlockedSkins
}) => {
  return (
    <div className="w-full h-full flex flex-col bg-gray-900 text-white p-4 md:p-8 overflow-y-auto">
      <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto w-full">
        <button 
          onClick={() => setGameState(GameState.MENU)}
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-3xl font-bold text-center flex-1">GALERÍA</h2>
        <div className="w-10"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto w-full pb-8">
        {AVAILABLE_SKINS.map((skin) => {
          const isUnlocked = unlockedSkins.includes(skin.id);
          const isSelected = currentSkin.id === skin.id;

          return (
            <div 
              key={skin.id}
              className={`relative bg-gray-800 rounded-2xl p-6 border-2 flex flex-col items-center transition-all ${
                isSelected 
                  ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)] transform scale-105' 
                  : 'border-gray-700 hover:border-gray-500'
              }`}
            >
              <div 
                className="w-24 h-24 rounded-full mb-4 shadow-inner flex items-center justify-center text-4xl transition-transform hover:scale-110"
                style={{ backgroundColor: skin.color, border: `4px solid ${skin.secondaryColor}` }}
              >
                🌲
              </div>
              
              <h3 className="text-xl font-bold mb-1">{skin.name}</h3>
              <p className="text-gray-400 text-xs text-center mb-4 min-h-[40px]">{skin.description}</p>
              
              <div className="mt-auto w-full">
                {isUnlocked ? (
                  <Button 
                    variant={isSelected ? 'success' : 'secondary'}
                    className="w-full py-2 text-sm"
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
