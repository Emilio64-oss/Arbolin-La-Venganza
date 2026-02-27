import React, { useState } from 'react';
import { GameState, GameSettings } from '../types';
import { ArrowLeft, Volume2, VolumeX, User, Gamepad2, Move, Maximize, Eye, Terminal, Sparkles, Check, X } from 'lucide-react';
import { Button } from './Button';

interface SettingsProps {
  setGameState: (state: GameState) => void;
  settings: GameSettings;
  setSettings: React.Dispatch<React.SetStateAction<GameSettings>>;
  onRedeemCode?: (code: string) => boolean;
}

export const Settings: React.FC<SettingsProps> = ({ setGameState, settings, setSettings, onRedeemCode }) => {
  const [codeMsg, setCodeMsg] = useState<{type: 'success' | 'error' | '', text: string}>({type: '', text: ''});
  const [localCode, setLocalCode] = useState('');

  const toggleSound = () => setSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({ ...prev, playerName: e.target.value }));
  };

  const updateControl = (key: keyof GameSettings['controls'], value: any) => {
    setSettings(prev => ({ ...prev, controls: { ...prev.controls, [key]: value } }));
  };

  const handleCodeSubmit = () => {
    if (!localCode || localCode.length < 3) {
        setCodeMsg({type: 'error', text: 'Código muy corto'});
        return;
    }

    if (onRedeemCode) {
        const success = onRedeemCode(localCode);
        if (success) {
            setCodeMsg({type: 'success', text: '¡CÓDIGO ACEPTADO!'});
            setLocalCode(''); // Limpiar input
        } else {
            setCodeMsg({type: 'error', text: 'CÓDIGO INVÁLIDO'});
        }
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center bg-gray-900 text-white relative overflow-hidden">
      <div className="w-full p-6 flex items-center bg-gray-800 border-b border-gray-700 z-10 shrink-0">
          <button onClick={() => setGameState(GameState.MENU)} className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 mr-4">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-2xl font-bold">AJUSTES</h2>
      </div>

      <div className="flex-1 w-full overflow-y-auto p-6 pb-20">
        <div className="max-w-md mx-auto space-y-8">
          
          <section className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
            <h3 className="text-gray-400 text-xs font-bold uppercase mb-4 flex items-center gap-2"><User size={14} /> Perfil</h3>
            <input type="text" maxLength={12} value={settings.playerName} onChange={handleNameChange} className="bg-gray-900 border border-gray-600 rounded-xl p-3 w-full mb-4" />
            <button onClick={toggleSound} className={`w-full p-3 rounded-xl transition-all ${settings.soundEnabled ? 'bg-green-600' : 'bg-red-900'}`}>
                {settings.soundEnabled ? 'Sonido: ON' : 'Sonido: OFF'}
            </button>
          </section>

          {/* NUEVA TERMINAL SECRETA CON BOTON DE CONFIRMACIÓN */}
          <section className="bg-black/50 p-6 rounded-2xl border-2 border-yellow-600/30 shadow-lg">
            <h3 className="text-yellow-500 text-xs font-bold uppercase mb-4 flex items-center gap-2"><Terminal size={14} /> Terminal Secreta</h3>
            <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        placeholder="Ingresa código..."
                        value={localCode}
                        className="flex-1 bg-black border border-yellow-600/50 rounded-lg p-3 font-mono text-yellow-500 focus:outline-none focus:border-yellow-400 uppercase"
                        onChange={(e) => {
                            setLocalCode(e.target.value);
                            setCodeMsg({type: '', text: ''});
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && handleCodeSubmit()}
                    />
                    <Button onClick={handleCodeSubmit} className="py-2 px-4 bg-yellow-600 border-yellow-800 hover:bg-yellow-500 text-sm">
                        <Check size={18} />
                    </Button>
                </div>
                
                {codeMsg.text && (
                    <div className={`text-xs font-bold p-2 rounded flex items-center gap-2 ${codeMsg.type === 'success' ? 'bg-green-900/50 text-green-400 border border-green-500/30' : 'bg-red-900/50 text-red-400 border border-red-500/30'}`}>
                        {codeMsg.type === 'success' ? <Check size={12} /> : <X size={12} />}
                        {codeMsg.text}
                    </div>
                )}
                
                <p className="text-[10px] text-gray-500 mt-2">
                    Encuentra los códigos secretos explorando las dificultades más altas. ¡Presta atención al suelo!
                </p>
            </div>
          </section>

          <section className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
            <h3 className="text-gray-400 text-xs font-bold uppercase mb-6 flex items-center gap-2"><Gamepad2 size={14} /> Controles</h3>
            <div className="grid grid-cols-2 gap-2 bg-gray-900 p-1 rounded-xl mb-6">
                <button onClick={() => updateControl('type', 'joystick')} className={`py-2 rounded-lg text-sm font-bold ${settings.controls.type === 'joystick' ? 'bg-blue-600' : 'text-gray-400'}`}>JOYSTICK</button>
                <button onClick={() => updateControl('type', 'buttons')} className={`py-2 rounded-lg text-sm font-bold ${settings.controls.type === 'buttons' ? 'bg-blue-600' : 'text-gray-400'}`}>BOTONES</button>
            </div>
            
            <div className="space-y-4">
                <div>
                    <label className="text-xs text-gray-400 block mb-1">Tamaño { (settings.controls.scale * 100).toFixed(0) }%</label>
                    <input type="range" min="0.5" max="1.5" step="0.1" value={settings.controls.scale} onChange={(e) => updateControl('scale', parseFloat(e.target.value))} className="w-full" />
                </div>
                <div>
                    <label className="text-xs text-gray-400 block mb-1">Altura { settings.controls.yOffset }%</label>
                    <input type="range" min="0" max="50" step="1" value={settings.controls.yOffset} onChange={(e) => updateControl('yOffset', parseInt(e.target.value))} className="w-full" />
                </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};