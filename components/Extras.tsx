import React from 'react';
import { GameState, ActiveExtras, PlayerProgress } from '../types';
import { Button } from './Button';
import { ArrowLeft, Zap, Flame, Lock, BookOpen, Leaf, Apple, Info, MapPin, Terminal, Check } from 'lucide-react';
import { FUEGORIN_STORY, ARBOLIN_STORY, BANANA_STORY, BANANA_CODES } from '../constants';

interface ExtrasProps {
  setGameState: (state: GameState) => void;
  activeExtras: ActiveExtras;
  setActiveExtras: (extras: ActiveExtras) => void;
  progress: PlayerProgress;
}

export const Extras: React.FC<ExtrasProps> = ({ setGameState, activeExtras, setActiveExtras, progress }) => {
  const toggleExtra = (key: keyof ActiveExtras) => setActiveExtras({ ...activeExtras, [key]: !activeExtras[key] });

  // Verificar requisitos para Fuegorin: Historias 1 a 5 desbloqueadas
  const unlockedIds = progress.unlockedStoryParts || [];
  const fuegorinUnlocked = [1, 2, 3, 4, 5].every(id => unlockedIds.includes(id));

  // Obtener SOLO la siguiente parte que falta en la secuencia (1 -> 2 -> 3 -> 4 -> 5)
  const nextMissingPart = FUEGORIN_STORY.find(part => !unlockedIds.includes(part.id));
  
  // Verificación de códigos canjeados
  const redeemed = progress.redeemedCodes || [];
  const hasCodeHard = redeemed.includes(BANANA_CODES.HARD);
  const hasCodeExtreme = redeemed.includes(BANANA_CODES.EXTREME);
  const hasCodeHacker = redeemed.includes(BANANA_CODES.HACKER);

  const renderStoryProgress = (storyArray: any[], label: string, colorClass: string, icon: React.ReactNode) => {
      const partsFound = storyArray.filter(part => unlockedIds.includes(part.id)).length;
      return (
        <div className="bg-black/40 p-4 rounded-xl border border-gray-700 mt-2">
            <div className="flex items-center gap-2 mb-2">
                {icon}
                <p className="text-xs font-bold text-gray-300 uppercase">{label}: {partsFound} / {storyArray.length}</p>
            </div>
            <div className="flex gap-1">
                {storyArray.map(part => (
                    <div key={part.id} className={`h-2 flex-1 rounded-full ${unlockedIds.includes(part.id) ? colorClass : 'bg-gray-700'}`}></div>
                ))}
            </div>
        </div>
      );
  };

  return (
    <div className={`w-full h-full flex flex-col transition-colors duration-500 ${activeExtras.fuegorin ? 'bg-orange-950/20 bg-gray-900' : 'bg-gray-900'} text-white p-4 overflow-y-auto`}>
      <div className="flex items-center justify-between mb-8 max-w-md mx-auto w-full mt-4">
        <button onClick={() => setGameState(GameState.MENU)} className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-all active:scale-95">
          <ArrowLeft size={24} />
        </button>
        <h2 className={`text-3xl font-bold tracking-tighter transition-colors ${activeExtras.fuegorin ? 'text-orange-500' : 'text-white'}`}>MODOS Y EXTRAS</h2>
        <div className="w-12"></div>
      </div>

      <div className="flex flex-col gap-4 max-w-md mx-auto w-full pb-10">
        
        {/* MODO FUEGORÍN */}
        <div 
          onClick={() => fuegorinUnlocked && toggleExtra('fuegorin')}
          className={`border-2 rounded-2xl p-5 transition-all ${
              fuegorinUnlocked 
              ? 'cursor-pointer active:scale-95 bg-gray-800 border-gray-700 hover:border-orange-500' 
              : 'opacity-70 bg-gray-900 border-gray-800'
          } ${activeExtras.fuegorin ? 'bg-orange-900/30 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)]' : ''}`}
        >
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-3">
              <div className={`${activeExtras.fuegorin ? 'bg-orange-500' : 'bg-gray-600'} p-3 rounded-xl transition-colors`}>
                <Flame size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                    Modo Fuegorín
                    {!fuegorinUnlocked && <Lock size={16} className="text-red-400" />}
                </h3>
                <p className="text-xs text-gray-400">
                    {fuegorinUnlocked ? "Juega como la llama original" : "Bloqueado: Encuentra las 5 historias"}
                </p>
              </div>
            </div>
            {fuegorinUnlocked ? (
                <div className={`w-6 h-6 rounded-full border-2 ${activeExtras.fuegorin ? 'bg-orange-500 border-white' : 'border-gray-600'}`}></div>
            ) : (
                <div className="text-[10px] text-red-400 font-bold border border-red-900 bg-red-900/20 px-2 py-1 rounded">BLOQUEADO</div>
            )}
          </div>
          
          {!fuegorinUnlocked && nextMissingPart && (
             <div className="mb-2 bg-black/30 p-3 rounded-lg text-xs text-gray-400 border border-gray-700/50">
                 <p className="mb-2 text-gray-300 font-bold flex items-center gap-2">
                    <MapPin size={12} className="text-orange-500" /> 
                    PISTA #{nextMissingPart.id}:
                 </p>
                 <div className="text-[10px] bg-white/5 p-3 rounded border border-white/10 animate-pulse">
                    <span className="font-bold text-orange-300 block mb-1">MISIÓN:</span> 
                    {nextMissingPart.hint}
                 </div>
                 <p className="mt-3 text-[10px] italic opacity-70 text-center text-blue-300">
                    Consejo: Quédate quieto 2 seg. en la zona secreta.
                 </p>
             </div>
          )}

          {renderStoryProgress(FUEGORIN_STORY, "Orígenes de Fuegorín", "bg-orange-500", <Flame size={12} className="text-orange-400" />)}
        </div>

        {/* MODO BANANA (FRUTAL) */}
        <div className={`border-2 rounded-2xl p-5 transition-all relative overflow-hidden ${
          progress.unlockedBananaMode 
            ? activeExtras.fuegorin 
              ? 'bg-orange-900/20 border-orange-500/50' 
              : 'bg-yellow-900/20 border-yellow-500/50' 
            : 'bg-gray-800/50 border-gray-700 opacity-60'
        }`}>
          {activeExtras.bananaMode && (
            <div className={`absolute inset-0 pointer-events-none animate-pulse ${activeExtras.fuegorin ? 'bg-orange-500/10' : 'bg-yellow-500/10'}`}></div>
          )}
          <div className="flex justify-between items-start mb-3 relative z-10">
            <div className="flex items-center gap-3">
              <div className={`${
                progress.unlockedBananaMode 
                  ? activeExtras.fuegorin ? 'bg-orange-600' : 'bg-yellow-500' 
                  : 'bg-gray-600'
              } p-3 rounded-xl transition-colors`}>
                {activeExtras.fuegorin ? <Flame size={24} className="text-white" /> : <Apple size={24} className="text-white" />}
              </div>
              <div>
                <h3 className={`text-xl font-bold transition-colors ${
                  progress.unlockedBananaMode 
                    ? activeExtras.fuegorin ? 'text-orange-400' : 'text-yellow-400' 
                    : 'text-gray-400'
                }`}>
                  {activeExtras.fuegorin ? 'Banana Caramelizada 🍮' : 'Modo Banana 🍌'}
                </h3>
                <p className="text-xs text-gray-400">
                  {activeExtras.fuegorin ? 'Dulzura Ardiente' : 'La Venganza Frutal'}
                </p>
              </div>
            </div>
            {progress.unlockedBananaMode ? (
               <div 
                className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-colors ${
                  activeExtras.bananaMode 
                    ? activeExtras.fuegorin ? 'bg-orange-500' : 'bg-green-500' 
                    : 'bg-gray-700'
                }`} 
                onClick={() => toggleExtra('bananaMode')}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${activeExtras.bananaMode ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            ) : <Lock size={20} className="text-gray-500 mt-2" />}
          </div>

          {!progress.unlockedBananaMode && (
            <div className="bg-black/40 p-3 rounded-lg border border-yellow-600/20 text-[10px] space-y-2">
                <p className="font-bold text-yellow-500 text-xs mb-1 text-center border-b border-yellow-800 pb-1">REQUISITO: CANJEAR 3 CÓDIGOS</p>
                <p className="text-[9px] text-gray-400 text-center mb-2 italic">Introduce los códigos en AJUSTES {'>'} TERMINAL.</p>
                
                <div className="flex justify-between items-center bg-white/5 p-1 rounded">
                    <span>Código DIFÍCIL:</span> 
                    <span className={hasCodeHard ? 'text-green-400 font-bold flex gap-1' : 'text-red-400'}>
                        {hasCodeHard ? <><Check size={12} /> CANJEADO</> : 'BUSCAR EN SUELO'}
                    </span>
                </div>
                
                <div className="flex justify-between items-center bg-white/5 p-1 rounded">
                    <span>Código EXTREMO:</span> 
                    <span className={hasCodeExtreme ? 'text-green-400 font-bold flex gap-1' : 'text-red-400'}>
                        {hasCodeExtreme ? <><Check size={12} /> CANJEADO</> : 'BUSCAR EN SUELO'}
                    </span>
                </div>

                <div className="flex justify-between items-center bg-white/5 p-1 rounded">
                    <span>Código HACKER:</span> 
                    <span className={hasCodeHacker ? 'text-green-400 font-bold flex gap-1' : 'text-red-400'}>
                        {hasCodeHacker ? <><Check size={12} /> CANJEADO</> : 'BUSCAR EN SUELO'}
                    </span>
                </div>
            </div>
          )}

          {progress.unlockedBananaMode && renderStoryProgress(
            BANANA_STORY, 
            activeExtras.fuegorin ? "Diario Caramelizado" : "Diario Frutal", 
            activeExtras.fuegorin ? "bg-orange-500" : "bg-yellow-500", 
            activeExtras.fuegorin ? <Flame size={12} className="text-orange-400" /> : <Apple size={12} className="text-yellow-400" />
          )}
        </div>

        {/* OTROS AJUSTES */}
        <div className="grid grid-cols-2 gap-4">
            <div 
              onClick={() => toggleExtra('mutant')}
              className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all cursor-pointer ${activeExtras.mutant ? 'bg-purple-900/40 border-purple-500' : 'bg-gray-800 border-gray-700'}`}
            >
              <Zap className={activeExtras.mutant ? 'text-purple-400' : 'text-gray-500'} />
              <span className="text-xs font-bold uppercase">Mutantes</span>
            </div>
            <div 
              onClick={() => toggleExtra('infinite')}
              className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all cursor-pointer ${activeExtras.infinite ? 'bg-blue-900/40 border-blue-500' : 'bg-gray-800 border-gray-700'}`}
            >
              <InfinityIcon className={activeExtras.infinite ? 'text-blue-400' : 'text-gray-500'} />
              <span className="text-xs font-bold uppercase">Infinito</span>
            </div>
        </div>

        <div className="pt-4 space-y-3">
            <Button onClick={() => setGameState(GameState.STORY)} className="w-full bg-indigo-700 flex items-center justify-center gap-2 text-sm">
                <BookOpen size={18} /> LEER TODAS LAS HISTORIAS
            </Button>
            <div className="flex items-start gap-2 bg-blue-900/20 p-3 rounded-xl border border-blue-500/20">
                <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
                <p className="text-[10px] text-blue-200/70">
                    Recuerda: El modo Fuegorín se desbloquea al encontrar las primeras 5 historias con Arbolín.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

const InfinityIcon = ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z" />
    </svg>
);