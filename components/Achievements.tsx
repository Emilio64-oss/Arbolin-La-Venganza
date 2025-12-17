import React from 'react';
import { GameState, Achievement } from '../types';
import { AVAILABLE_SKINS } from '../constants';
import { ArrowLeft, Lock, Unlock, Trophy } from 'lucide-react';

interface AchievementsProps {
  setGameState: (state: GameState) => void;
  achievements: Achievement[];
}

export const Achievements: React.FC<AchievementsProps> = ({ setGameState, achievements }) => {
  return (
    <div className="w-full h-full flex flex-col bg-gray-900 text-white p-4 md:p-8 overflow-y-auto">
      <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto w-full">
        <button 
          onClick={() => setGameState(GameState.MENU)}
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-3xl font-bold text-center flex-1">LOGROS</h2>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      <div className="flex flex-col gap-4 max-w-3xl mx-auto w-full pb-8">
        {achievements.map((achievement) => {
          const rewardSkin = AVAILABLE_SKINS.find(s => s.id === achievement.skinRewardId);
          
          return (
            <div 
              key={achievement.id}
              className={`relative rounded-xl p-6 border-2 flex items-center gap-4 transition-all ${
                achievement.isUnlocked
                  ? 'bg-green-900/20 border-green-500/50'
                  : 'bg-gray-800 border-gray-700'
              }`}
            >
              <div className={`p-4 rounded-full ${achievement.isUnlocked ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'}`}>
                {achievement.isUnlocked ? <Trophy size={24} /> : <Lock size={24} />}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h3 className={`text-lg font-bold ${achievement.isUnlocked ? 'text-green-400' : 'text-gray-200'}`}>
                    {achievement.title}
                  </h3>
                  <span className="text-xs font-mono text-gray-400">
                    {Math.min(achievement.currentProgress, achievement.target)} / {achievement.target}
                  </span>
                </div>
                
                <p className="text-gray-400 text-sm mb-3">{achievement.description}</p>
                
                {/* Progress Bar */}
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-3">
                  <div 
                    className={`h-full transition-all duration-500 ${achievement.isUnlocked ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{ width: `${Math.min(100, (achievement.currentProgress / achievement.target) * 100)}%` }}
                  />
                </div>

                {rewardSkin && (
                  <div className="flex items-center gap-2 text-xs bg-black/30 p-2 rounded-lg inline-flex">
                    <span className="text-gray-400">Recompensa:</span>
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: rewardSkin.color }}
                    />
                    <span className="font-bold" style={{ color: rewardSkin.secondaryColor }}>{rewardSkin.name}</span>
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
