import React from 'react';
import { GameState, GameSettings } from '../types';
import { ArrowLeft, Volume2, VolumeX, User } from 'lucide-react';

interface SettingsProps {
  setGameState: (state: GameState) => void;
  settings: GameSettings;
  setSettings: React.Dispatch<React.SetStateAction<GameSettings>>;
  completedDifficulties: any; // Unused here now
}

export const Settings: React.FC<SettingsProps> = ({ setGameState, settings, setSettings }) => {
  const toggleSound = () => setSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({ ...prev, playerName: e.target.value }));
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white p-8 relative overflow-y-auto">
      <button 
        onClick={() => setGameState(GameState.MENU)}
        className="absolute top-8 left-8 p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors z-20"
      >
        <ArrowLeft size={24} />
      </button>

      <div className="bg-gray-800 p-8 rounded-3xl border border-gray-700 shadow-2xl w-full max-w-md my-auto">
        <h2 className="text-3xl font-bold text-center mb-8 border-b border-gray-700 pb-6">AJUSTES</h2>

        <div className="space-y-6">
          
          {/* Player Name */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-400 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
               <User size={16} /> Nombre de Jugador
            </label>
            <input 
                type="text" 
                maxLength={12}
                value={settings.playerName || 'Jugador'}
                onChange={handleNameChange}
                className="bg-gray-900 border border-gray-600 rounded-xl p-4 text-lg focus:outline-none focus:border-green-500 transition-colors"
                placeholder="Ingresa tu nombre..."
            />
            <p className="text-xs text-gray-500">Usado para la clasificación mundial.</p>
          </div>

          <hr className="border-gray-700/50" />

          {/* Sound */}
          <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
            <span className="text-xl font-medium">Efectos de Sonido</span>
            <button 
              onClick={toggleSound}
              className={`p-4 rounded-xl transition-all shadow-lg ${settings.soundEnabled ? 'bg-green-600 text-white shadow-green-900/20' : 'bg-red-600/20 text-red-400'}`}
            >
              {settings.soundEnabled ? <Volume2 size={28} /> : <VolumeX size={28} />}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};