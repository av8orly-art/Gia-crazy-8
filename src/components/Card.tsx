import React from 'react';
import { motion } from 'motion/react';
import { type CardData, SUIT_ICONS, SUIT_COLORS, RANK_CHARACTERS } from '../types';
import { cn } from '../utils';

interface CardProps {
  card: CardData;
  isFaceUp?: boolean;
  onClick?: () => void;
  isPlayable?: boolean;
  className?: string;
  index?: number;
}

export const Card: React.FC<CardProps> = ({ 
  card, 
  isFaceUp = true, 
  onClick, 
  isPlayable = false,
  className,
  index = 0
}) => {
  const Icon = SUIT_ICONS[card.suit];
  const colorClass = SUIT_COLORS[card.suit];
  const characterName = RANK_CHARACTERS[card.rank];

  return (
    <motion.div
      layoutId={card.id}
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      whileHover={isPlayable ? { y: -20, scale: 1.05 } : {}}
      onClick={isPlayable ? onClick : undefined}
      className={cn(
        "relative w-20 h-28 sm:w-24 sm:h-36 rounded-xl shadow-lg cursor-pointer transition-shadow duration-200 overflow-hidden",
        isFaceUp ? "bg-white border-2 border-slate-200" : "bg-white border-2 border-slate-200",
        isPlayable && "ring-4 ring-yellow-400 shadow-yellow-400/50",
        !isPlayable && isFaceUp && "cursor-default",
        className
      )}
    >
      {isFaceUp ? (
        <div className="flex flex-col h-full p-1.5 justify-between select-none relative">
          {/* Top Left Rank/Suit */}
          <div className={cn("flex flex-col items-start z-10", colorClass)}>
            <span className="text-lg sm:text-xl font-black leading-none">{card.rank}</span>
            <Icon size={14} className="sm:w-4 sm:h-4" />
          </div>
          
          {/* Center Character Avatar */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full h-full rounded-full overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center relative group">
              <img 
                src={`https://picsum.photos/seed/${characterName}/200`}
                alt={characterName}
                className="w-full h-full object-cover opacity-80"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
            </div>
          </div>

          {/* Character Name Label */}
          <div className="z-10 text-center">
            <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate px-1 bg-white/80 rounded-full">
              {characterName}
            </p>
          </div>

          {/* Bottom Right Rank/Suit (Inverted) */}
          <div className={cn("flex flex-col items-start rotate-180 z-10", colorClass)}>
            <span className="text-lg sm:text-xl font-black leading-none">{card.rank}</span>
            <Icon size={14} className="sm:w-4 sm:h-4" />
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-lg bg-[#f8fcfd] relative">
          {/* Porcelain Pattern */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #003399 1px, transparent 0)`,
            backgroundSize: '12px 12px'
          }} />
          <div className="absolute inset-2 border-2 border-[#003399]/30 rounded-lg flex items-center justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-double border-[#003399] rounded-full flex items-center justify-center bg-white shadow-inner">
               <div className="flex flex-col items-center">
                  <span className="text-[#003399] font-serif italic text-lg sm:text-xl font-bold">刘曜菁</span>
                  <div className="w-8 h-0.5 bg-[#003399] mt-1 opacity-50" />
               </div>
            </div>
          </div>
          {/* Corner Ornaments */}
          <div className="absolute top-1 left-1 w-4 h-4 border-t-2 border-l-2 border-[#003399]/40 rounded-tl-md" />
          <div className="absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2 border-[#003399]/40 rounded-tr-md" />
          <div className="absolute bottom-1 left-1 w-4 h-4 border-b-2 border-l-2 border-[#003399]/40 rounded-bl-md" />
          <div className="absolute bottom-1 right-1 w-4 h-4 border-b-2 border-r-2 border-[#003399]/40 rounded-br-md" />
        </div>
      )}
    </motion.div>
  );
};
