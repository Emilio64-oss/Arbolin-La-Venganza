import React from 'react';
import { GameState, Achievement, ActiveExtras } from '../types';
import { AVAILABLE_SKINS } from '../constants';
import { ArrowLeft, Lock, Trophy, Sparkles, Flame } from 'lucide-react';

interface AchievementsProps {
  setGameState: (state: GameState) => void;
  achievements: Achievement[];
  activeExtras: ActiveExtras;
}

export const Achievements: React.FC<AchievementsProps> = ({ setGameState, achievements = [], activeExtras }) => {
  const isFuegorinMode = activeExtras.fuegorin;
  const isBananaMode = activeExtras.bananaMode;

  return (
    <div className={`w-full h-full flex flex-col ${isBananaMode ? 'bg-yellow-950' : (isFuegorinMode ? 'bg-red-950' : 'bg-gray-900')} text-white p-4 md:p-8 overflow-y-auto transition-colors duration-500`}>
      <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto w-full">
        <button 
          onClick={() => setGameState(GameState.MENU)}
          className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors active:scale-90"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-3xl font-bold text-center flex-1 tracking-tighter uppercase">Logros</h2>
        <div className="flex items-center gap-2">
            {isBananaMode ? <span className="text-2xl">🍌</span> : (isFuegorinMode ? <Flame className="text-orange-500" /> : <Trophy className="text-green-500" />)}
        </div>
      </div>

      <div className="flex flex-col gap-4 max-w-3xl mx-auto w-full pb-10">
        {achievements.length === 0 ? (
            <div className="p-20 text-center opacity-50 italic">Cargando logros...</div>
        ) : (
            achievements.map((achievement) => {
              const rewardSkin = AVAILABLE_SKINS.find(s => s.id === achievement.skinRewardId);
              
              return (
                <div 
                  key={achievement.id}
                  className={`relative rounded-2xl p-6 border-2 flex items-center gap-4 transition-all shadow-xl ${
                    achievement.isUnlocked
                      ? isBananaMode ? 'bg-yellow-900/20 border-yellow-500/50' : (isFuegorinMode ? 'bg-orange-900/20 border-orange-500/50' : 'bg-green-900/20 border-green-500/50')
                      : 'bg-gray-800/50 border-gray-700'
                  }`}
                >
                  <div className={`p-4 rounded-2xl ${achievement.isUnlocked ? (isBananaMode ? 'bg-yellow-500 text-black' : (isFuegorinMode ? 'bg-orange-500 text-white' : 'bg-green-500 text-white')) : 'bg-gray-700 text-gray-500'}`}>
                    {achievement.isUnlocked ? <Sparkles size={28} /> : <Lock size={28} />}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className={`text-lg font-black uppercase italic ${achievement.isUnlocked ? (isBananaMode ? 'text-yellow-400' : (isFuegorinMode ? 'text-orange-400' : 'text-green-400')) : 'text-gray-400'}`}>
                        {achievement.title}
                      </h3>
                      <span className="text-xs font-mono text-gray-500 bg-black/40 px-2 py-1 rounded">
                        {Math.min(achievement.currentProgress, achievement.target)} / {achievement.target}
                      </span>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-4 leading-snug">{achievement.description}</p>
                    
                    <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden mb-4">
                      <div 
                        className={`h-full transition-all duration-1000 ease-out ${achievement.isUnlocked ? (isBananaMode ? 'bg-yellow-500 shadow-[0_0_10px_#eab308]' : (isFuegorinMode ? 'bg-orange-500 shadow-[0_0_10px_#f97316]' : 'bg-green-500 shadow-[0_0_10px_#22c55e]')) : 'bg-blue-600'}`}
                        style={{ width: `${Math.min(100, (achievement.currentProgress / achievement.target) * 100)}%` }}
                      />
                    </div>

                    {rewardSkin && (
                      <div className="flex items-center gap-2 text-[10px] bg-black/50 px-3 py-1.5 rounded-full inline-flex border border-white/5">
                        <span className="text-gray-500 uppercase font-bold">Recompensa:</span>
                        <div 
                          className="w-3 h-3 rounded-full shadow-inner" 
                          style={{ backgroundColor: rewardSkin.color, border: `1px solid ${rewardSkin.secondaryColor}` }}
                        />
                        <span className="font-bold text-gray-300">{rewardSkin.name}</span>
                        {achievement.isUnlocked && <Trophy size={10} className="text-yellow-500" />}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
};