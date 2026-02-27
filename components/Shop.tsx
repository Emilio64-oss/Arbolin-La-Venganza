import React from 'react';
import { PowerUp, PlayerProgress, PowerUpType } from '../types';
import { POWER_UPS } from '../constants';
import { Button } from './Button';
import { X, ShoppingCart, Sparkles, Flame } from 'lucide-react';

interface ShopProps {
  progress: PlayerProgress;
  onBuy: (powerUp: PowerUp) => void;
  onClose: () => void;
  isFuegorin: boolean;
  selectedPowerUps: PowerUpType[];
}

export const Shop: React.FC<ShopProps> = ({ progress, onBuy, onClose, isFuegorin, selectedPowerUps }) => {
  const currency = isFuegorin ? progress.totalAshes : progress.totalSprouts;
  const currencyName = isFuegorin ? 'Cenizas' : 'Brotes';
  const currencyIcon = isFuegorin ? <Flame size={16} className="text-orange-500" /> : <Sparkles size={16} className="text-green-500" />;

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
              <ShoppingCart size={24} className="text-yellow-500" /> Tienda
            </h2>
            <div className="flex items-center gap-2 mt-1">
              {currencyIcon}
              <span className="text-sm font-bold text-gray-400">{currency} {currencyName} disponibles</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {POWER_UPS.map((pu) => {
            const isSelected = selectedPowerUps.includes(pu.id);
            const canAfford = currency >= pu.cost;
            
            return (
              <div 
                key={pu.id}
                className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                  isSelected 
                    ? 'bg-yellow-500/20 border-yellow-500' 
                    : 'bg-white/5 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{pu.icon}</div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">{pu.name}</h3>
                    <p className="text-xs text-gray-400">{pu.description}</p>
                  </div>
                </div>
                
                <button
                  disabled={isSelected || !canAfford}
                  onClick={() => onBuy(pu)}
                  className={`px-4 py-2 rounded-xl font-black text-sm transition-all ${
                    isSelected 
                      ? 'bg-green-500 text-white cursor-default' 
                      : canAfford 
                        ? 'bg-white text-black hover:scale-105 active:scale-95' 
                        : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isSelected ? 'COMPRADO' : `${pu.cost} ${currencyName.charAt(0)}`}
                </button>
              </div>
            );
          })}
        </div>

        <div className="p-6 bg-white/5 border-t border-white/5">
          <Button onClick={onClose} className="w-full py-4 bg-yellow-500 text-black font-black text-lg">
            ¡A JUGAR!
          </Button>
          <p className="text-[10px] text-center text-gray-500 mt-3 uppercase tracking-widest font-bold">
            Los power-ups duran solo una partida
          </p>
        </div>
      </div>
    </div>
  );
};
