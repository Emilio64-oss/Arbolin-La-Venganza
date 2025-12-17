import React from 'react';
import { GameState, ActiveExtras, PlayerProgress } from '../types';
import { Button } from './Button';
import { ArrowLeft, Zap, Infinity as InfinityIcon, Flame, Lock, BookOpen } from 'lucide-react';
import { FUEGORIN_STORY } from '../constants';

interface ExtrasProps {
  setGameState: (state: GameState) => void;
  activeExtras: ActiveExtras;
  setActiveExtras: (extras: ActiveExtras) => void;
  progress: PlayerProgress;
}

export const Extras: React.FC<ExtrasProps> = ({ 
  setGameState, 
  activeExtras, 
  setActiveExtras,
  progress
}) => {
  
  const toggleExtra = (key: keyof ActiveExtras) => {
    setActiveExtras({
      ...activeExtras,
      [key]: !activeExtras[key]
    });
  };

  const isFuegorinUnlocked = progress.unlockedStoryParts.length >= 5;

  return (
    <div className="w-full h-full flex flex-col bg-gray-900 text-white p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-8 max-w-md mx-auto w-full mt-4">
        <button 
          onClick={() => setGameState(GameState.MENU)}
          className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-3xl font-bold">EXTRAS</h2>
        <div className="w-12"></div>
      </div>

      <div className="flex flex-col gap-6 max-w-md mx-auto w-full pb-8">
        
        {/* Mutant Mode */}
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 p-3 rounded-xl">
                <Zap size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-purple-300">Modo Mutante</h3>
                <p className="text-xs text-purple-200/60">Potenciador</p>
              </div>
            </div>
            <div 
              className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors ${activeExtras.mutant ? 'bg-green-500' : 'bg-gray-700'}`}
              onClick={() => toggleExtra('mutant')}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${activeExtras.mutant ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
          </div>
          <p className="text-sm text-gray-300">
            Aparecen brotes mutantes morados aleatoriamente (+4 puntos). ¡7% de probabilidad por segundo!
          </p>
        </div>

        {/* Infinite Mode */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-3 rounded-xl">
                <InfinityIcon size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-300">Modo Infinito</h3>
                <p className="text-xs text-blue-200/60">Modo de Juego</p>
              </div>
            </div>
            <div 
              className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors ${activeExtras.infinite ? 'bg-green-500' : 'bg-gray-700'}`}
              onClick={() => toggleExtra('infinite')}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${activeExtras.infinite ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
          </div>
          <p className="text-sm text-gray-300">
            Sin límite de puntuación. Recolecta hasta que caigas. Compite en la Clasificación Mundial.
          </p>
        </div>

        {/* Fuegorin Mode */}
        <div className={`border rounded-2xl p-6 transition-all ${isFuegorinUnlocked ? 'bg-red-900/20 border-red-500/30' : 'bg-gray-800 border-gray-700 opacity-80'}`}>
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className={`${isFuegorinUnlocked ? 'bg-red-600' : 'bg-gray-600'} p-3 rounded-xl`}>
                <Flame size={24} className="text-white" />
              </div>
              <div>
                <h3 className={`text-xl font-bold ${isFuegorinUnlocked ? 'text-red-400' : 'text-gray-400'}`}>Fuegorín 🔥</h3>
                <p className="text-xs text-gray-400">Inversión Total</p>
              </div>
            </div>
            
            {isFuegorinUnlocked ? (
               <div 
                className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors ${activeExtras.fuegorin ? 'bg-green-500' : 'bg-gray-700'}`}
                onClick={() => toggleExtra('fuegorin')}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${activeExtras.fuegorin ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
            ) : (
               <Lock size={24} className="text-gray-500" />
            )}
          </div>

          <p className="text-sm text-gray-300 mb-4">
            Todo se invierte. Juega como el fuego, destruye el bosque. Descubre la verdad.
          </p>

          {!isFuegorinUnlocked && (
             <div className="bg-black/40 p-3 rounded-lg border border-gray-700">
                <p className="text-xs font-bold text-gray-400 mb-2 uppercase">Secretos Encontrados: {progress.unlockedStoryParts.length} / 5</p>
                <div className="flex gap-1 mb-2">
                   {[1,2,3,4,5].map(id => (
                      <div key={id} className={`h-2 flex-1 rounded-full ${progress.unlockedStoryParts.includes(id) ? 'bg-yellow-500' : 'bg-gray-700'}`}></div>
                   ))}
                </div>
                <div className="text-[10px] text-gray-500 italic">
                    {FUEGORIN_STORY.map(part => {
                        if (!progress.unlockedStoryParts.includes(part.id)) {
                             // Show hint for next locked part
                             if (part.id === (progress.unlockedStoryParts.length > 0 ? Math.max(...progress.unlockedStoryParts) + 1 : 1) || part.id === progress.unlockedStoryParts.length + 1) {
                                 return <div key={part.id}>Pista #{part.id}: {part.hint}</div>
                             }
                             return null;
                        }
                        return null;
                    })}
                </div>
             </div>
          )}

          {isFuegorinUnlocked && activeExtras.fuegorin && (
             <Button 
                onClick={() => setGameState(GameState.STORY)}
                className="w-full mt-4 bg-orange-700 hover:bg-orange-600 border-orange-900 flex items-center justify-center gap-2"
             >
                <BookOpen size={18} /> LEER HISTORIA
             </Button>
          )}

        </div>

      </div>
    </div>
  );
};