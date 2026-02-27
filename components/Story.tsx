import React, { useState } from 'react';
import { GameState } from '../types';
import { FUEGORIN_STORY, ARBOLIN_STORY, BANANA_STORY } from '../constants';
import { ArrowLeft, BookOpen, Flame, Leaf, Lock, Apple } from 'lucide-react';

export const Story: React.FC<{setGameState: (s: GameState) => void}> = ({ setGameState }) => {
  const [activeTab, setActiveTab] = useState<'fuegorin' | 'arbolin' | 'banana'>('fuegorin');
  const unlockedIds = JSON.parse(localStorage.getItem('arbolin_progress_v4') || '{}').unlockedStoryParts || [];

  const stories = { fuegorin: FUEGORIN_STORY, arbolin: ARBOLIN_STORY, banana: BANANA_STORY };
  const currentStory = stories[activeTab];
  
  const colors = {
      fuegorin: { text: 'text-orange-500', bg: 'bg-red-950', border: 'border-orange-600', icon: <Flame /> },
      arbolin: { text: 'text-green-400', bg: 'bg-green-950', border: 'border-green-600', icon: <Leaf /> },
      banana: { text: 'text-yellow-400', bg: 'bg-yellow-950', border: 'border-yellow-600', icon: <Apple /> }
  };

  return (
    <div className={`w-full h-full flex flex-col ${colors[activeTab].bg} text-gray-100 p-6 overflow-y-auto`}>
      <div className="flex items-center justify-between mb-4 mt-4 max-w-2xl mx-auto w-full">
        <button onClick={() => setGameState(GameState.EXTRAS)} className="p-3 rounded-full bg-black/30"><ArrowLeft size={24} /></button>
        <h2 className={`text-2xl font-bold uppercase tracking-widest ${colors[activeTab].text}`}>HISTORIAS</h2>
        <div className="w-12"></div>
      </div>

      <div className="flex max-w-2xl mx-auto w-full mb-8 bg-black/30 p-1 rounded-xl gap-1">
          {Object.keys(stories).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab as any)} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg capitalize transition-all ${activeTab === tab ? 'bg-white/20 text-white font-bold' : 'text-gray-500'}`}>
                  {tab === 'banana' ? 'Banana' : tab}
              </button>
          ))}
      </div>

      <div className="max-w-2xl mx-auto space-y-4 pb-12">
        {currentStory.map((part) => (
          <div key={part.id} className={`p-6 rounded-xl border-l-4 ${unlockedIds.includes(part.id) ? colors[activeTab].border + ' bg-black/40' : 'border-gray-800 bg-black/20 opacity-50'}`}>
              {unlockedIds.includes(part.id) ? (
                  <>
                    <h3 className={`text-xl font-bold mb-2 ${colors[activeTab].text}`}>{part.title}</h3>
                    <p className="font-serif italic text-gray-300">"{part.content}"</p>
                  </>
              ) : (
                  <div className="flex items-center gap-4"><Lock /><span className="italic text-gray-500">Fragmento #{part.id} bloqueado. {part.hint}</span></div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
};