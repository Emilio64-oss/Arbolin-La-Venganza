import React from 'react';
import { GameState, ActiveExtras } from '../types';
import { Button } from './Button';
import { Trees, Trophy, Settings as SettingsIcon, Medal, Sparkles, Flame, BarChart3 } from 'lucide-react';

interface MainMenuProps {
  setGameState: (state: GameState) => void;
  totalSprouts: number;
  activeExtras: ActiveExtras;
}

export const MainMenu: React.FC<MainMenuProps> = ({ setGameState, totalSprouts, activeExtras }) => {
  
  const isFuegorinMode = activeExtras.fuegorin;

  return (
    <div className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-b ${isFuegorinMode ? 'from-orange-950 via-red-900 to-black' : 'from-green-950 via-gray-900 to-black'} text-white relative overflow-hidden transition-colors duration-1000`}>
      
      {/* Top Right Leaderboard Button */}
      <button 
        onClick={() => setGameState(GameState.LEADERBOARD)}
        className="absolute top-6 right-6 p-3 bg-gray-800/80 rounded-full border border-gray-600 shadow-lg hover:scale-110 transition-transform z-20"
      >
        <BarChart3 size={24} className="text-yellow-400" />
      </button>

      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className={`absolute top-10 left-10 w-64 h-64 ${isFuegorinMode ? 'bg-orange-600' : 'bg-green-600'} rounded-full blur-[100px]`}></div>
        <div className={`absolute bottom-10 right-10 w-64 h-64 ${isFuegorinMode ? 'bg-red-600' : 'bg-red-600'} rounded-full blur-[100px]`}></div>
      </div>

      <div className="z-10 text-center mb-10 animate-in slide-in-from-top duration-700 flex flex-col items-center">
        <div className="mb-6 relative">
          <div className={`absolute inset-0 ${isFuegorinMode ? 'bg-orange-500' : 'bg-green-500'} blur-2xl opacity-20 rounded-full`}></div>
          <div className={`bg-gray-800 p-6 rounded-3xl shadow-2xl border-4 ${isFuegorinMode ? 'border-orange-600' : 'border-green-600'} relative`}>
            {isFuegorinMode ? <Flame size={80} className="text-orange-500 animate-pulse" /> : <Trees size={80} className="text-green-400" />}
          </div>
        </div>
        
        {isFuegorinMode ? (
            <>
                <h1 className="text-5xl font-black tracking-tighter text-orange-500 mb-2 drop-shadow-lg uppercase">
                FUEGORÍN
                </h1>
                <h2 className="text-xl font-bold text-yellow-500 tracking-[0.2em] uppercase mb-6">
                Sus Orígenes
                </h2>
            </>
        ) : (
            <>
                <h1 className="text-6xl font-black tracking-tighter text-white mb-2 drop-shadow-lg">
                ARBOLÍN
                </h1>
                <h2 className="text-xl font-bold text-red-500 tracking-[0.2em] uppercase mb-6">
                La Venganza
                </h2>
            </>
        )}

        <div className="inline-flex items-center gap-3 bg-gray-800/80 px-5 py-2 rounded-full border border-gray-600 backdrop-blur-sm">
          <span className={`w-3 h-3 ${isFuegorinMode ? 'bg-orange-500' : 'bg-green-400'} rounded-full animate-pulse shadow-[0_0_10px_currentColor]`}></span>
          <span className="text-sm font-bold text-gray-200">{isFuegorinMode ? 'CENIZAS' : 'BROTES'}: {totalSprouts}</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-72 z-10 animate-in slide-in-from-bottom duration-700 delay-150">
        <Button onClick={() => setGameState(GameState.LEVEL_SELECT)} className={`flex items-center justify-center gap-3 py-4 text-xl ${isFuegorinMode ? 'shadow-orange-900/50 bg-orange-700 hover:bg-orange-600 border-orange-900' : 'shadow-green-900/50'}`}>
           {isFuegorinMode ? <Flame size={24} /> : <Trees size={24} />} JUGAR
        </Button>
        
        <Button variant="secondary" onClick={() => setGameState(GameState.EXTRAS)} className="bg-indigo-700 hover:bg-indigo-600 border-indigo-900 flex items-center justify-center gap-2">
             <Sparkles size={18} className="text-yellow-300" /> EXTRAS
        </Button>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="secondary" onClick={() => setGameState(GameState.SKINS)} className="flex items-center justify-center gap-2 text-sm">
             <Trophy size={18} /> SKINS
          </Button>
          <Button variant="secondary" onClick={() => setGameState(GameState.ACHIEVEMENTS)} className="bg-purple-700 hover:bg-purple-600 border-purple-900 flex items-center justify-center gap-2 text-sm">
             <Medal size={18} /> LOGROS
          </Button>
        </div>
        <Button variant="secondary" onClick={() => setGameState(GameState.SETTINGS)} className="bg-gray-700 hover:bg-gray-600 border-gray-800 flex items-center justify-center gap-2">
           <SettingsIcon size={20} /> AJUSTES
        </Button>
      </div>
      
      <p className="absolute bottom-6 text-gray-600 text-xs text-center px-4 font-mono">
        v3.0.0 • FUEGORIN UPDATE
      </p>
    </div>
  );
};