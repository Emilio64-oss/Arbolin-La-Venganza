import React, { useEffect, useState } from 'react';
import { GameState, LeaderboardEntry } from '../types';
import { ArrowLeft, Trophy, Crown, RefreshCcw } from 'lucide-react';

interface LeaderboardProps {
  setGameState: (state: GameState) => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ setGameState }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('/api/leaderboard');
      const data = await res.json();
      setLeaderboard(data);
    } catch (err) {
      console.error("Error fetching leaderboard", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(`${protocol}//${window.location.host}`);
    
    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'leaderboard') {
        setLeaderboard(msg.data);
      }
    };

    return () => socket.close();
  }, []);

  const sorted = [...leaderboard].sort((a, b) => b.score - a.score).slice(0, 10);

  return (
    <div className="w-full h-full flex flex-col bg-gray-900 text-white p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-8 mt-4 max-w-md mx-auto w-full">
        <button 
          onClick={() => setGameState(GameState.MENU)}
          className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold uppercase tracking-wider text-yellow-500">Clasificación</h2>
        <button 
          onClick={fetchLeaderboard}
          className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="max-w-md mx-auto w-full bg-gray-800 rounded-3xl overflow-hidden border border-gray-700 shadow-2xl">
         <div className="bg-yellow-600/20 p-6 text-center border-b border-gray-700">
            <Trophy className="mx-auto text-yellow-400 mb-2 w-12 h-12" />
            <p className="text-sm text-yellow-200/70 uppercase font-bold tracking-widest">Top Infinito</p>
         </div>

         <div className="divide-y divide-gray-700/50">
            {sorted.length === 0 ? (
                <div className="p-8 text-center text-gray-500 italic">
                    Aún no hay registros. ¡Juega el modo Infinito!
                </div>
            ) : (
                sorted.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${
                                index === 0 ? 'bg-yellow-500 text-black' :
                                index === 1 ? 'bg-gray-400 text-black' :
                                index === 2 ? 'bg-orange-700 text-white' :
                                'bg-gray-700 text-gray-400'
                            }`}>
                                {index < 3 ? <Crown size={14} /> : index + 1}
                            </div>
                            <div>
                                <p className="font-bold text-lg">{entry.name}</p>
                                <p className="text-xs text-gray-500">{new Date(entry.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-black text-green-400">{entry.score}</span>
                            <span className="text-xs block text-gray-500">brotes</span>
                        </div>
                    </div>
                ))
            )}
         </div>
      </div>
    </div>
  );
};