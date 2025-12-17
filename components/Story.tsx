import React from 'react';
import { GameState } from '../types';
import { FUEGORIN_STORY } from '../constants';
import { ArrowLeft, BookOpen } from 'lucide-react';

interface StoryProps {
  setGameState: (state: GameState) => void;
}

export const Story: React.FC<StoryProps> = ({ setGameState }) => {
  return (
    <div className="w-full h-full flex flex-col bg-red-950 text-orange-100 p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-8 mt-4 max-w-2xl mx-auto w-full">
        <button 
          onClick={() => setGameState(GameState.EXTRAS)}
          className="p-3 rounded-full bg-red-900/50 hover:bg-red-800 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold font-serif tracking-widest text-orange-500">CRÓNICAS DE FUEGO</h2>
        <div className="w-12"></div>
      </div>

      <div className="max-w-2xl mx-auto space-y-8 pb-12">
        {FUEGORIN_STORY.map((part) => (
          <div key={part.id} className="bg-black/40 p-6 rounded-xl border-l-4 border-orange-600 backdrop-blur-sm shadow-xl">
            <div className="flex items-center gap-3 mb-3">
               <span className="text-4xl font-black text-orange-800/50">{part.id}</span>
               <h3 className="text-xl font-bold text-orange-300">{part.title}</h3>
            </div>
            <p className="text-lg leading-relaxed font-serif text-gray-300 italic">
              "{part.content}"
            </p>
          </div>
        ))}
        
        <div className="text-center mt-12 opacity-50">
           <BookOpen size={40} className="mx-auto mb-2"/>
           <p className="text-sm">Fin de los registros.</p>
        </div>
      </div>
    </div>
  );
};