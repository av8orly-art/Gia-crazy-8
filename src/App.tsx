/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { useGameLogic } from './useGameLogic';
import { Card } from './components/Card';
import { SUITS, SUIT_ICONS, SUIT_COLORS, SUIT_LABELS } from './types';
import { cn } from './utils';
import { Trophy, RotateCcw, Info, Layers } from 'lucide-react';

export default function App() {
  const {
    deck,
    playerHand,
    aiHand,
    discardPile,
    currentSuit,
    turn,
    gameState,
    winner,
    message,
    winMessage,
    initGame,
    playCard,
    drawCard,
    selectSuit,
  } = useGameLogic();

  useEffect(() => {
    initGame();
  }, [initGame]);

  useEffect(() => {
    if (winner === 'player') {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [winner]);

  const topDiscard = discardPile[discardPile.length - 1];

  const isCardPlayable = (card: any) => {
    if (turn !== 'player' || gameState !== 'playing') return false;
    return card.rank === '8' || card.suit === currentSuit || card.rank === topDiscard.rank;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden flex flex-col relative">
      {/* Decorative Casino Royale Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffd700' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />
      
      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60 pointer-events-none" />

      {/* Header */}
      <header className="p-4 flex justify-between items-center bg-black/60 backdrop-blur-xl border-b border-[#ffd700]/10 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#ffd700] via-[#b8860b] to-[#8b6508] rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(184,134,11,0.4)] border border-[#ffd700]/30">
            <span className="text-xl font-black italic text-black">刘</span>
          </div>
          <h1 className="text-xl font-bold tracking-[0.1em] hidden sm:block text-transparent bg-clip-text bg-gradient-to-r from-[#ffd700] to-[#b8860b] uppercase">刘曜菁的疯狂 8 点</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 bg-[#ffd700]/10 rounded-full text-sm font-medium border border-[#ffd700]/20 text-[#ffd700]">
            {message}
          </div>
          <button 
            onClick={initGame}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-[#ffd700]"
            title="重新开始"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </header>

      {/* Game Board */}
      <main className="flex-1 relative p-4 flex flex-col items-center justify-between max-w-6xl mx-auto w-full z-10">
        
        {/* AI Hand */}
        <div className="w-full flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-[#ffd700]/60 text-sm uppercase tracking-widest font-semibold">
            <div className={cn("w-2 h-2 rounded-full", turn === 'ai' ? "bg-red-500 animate-pulse shadow-[0_0_8px_red]" : "bg-white/20")} />
            AI 对手 ({aiHand.length})
          </div>
          <div className="flex justify-center -space-x-12 sm:-space-x-16 h-32 sm:h-40 items-center">
            <AnimatePresence>
              {aiHand.map((card, idx) => (
                <Card 
                  key={card.id} 
                  card={card} 
                  isFaceUp={false} 
                  index={idx}
                  className="hover:z-10 transition-all"
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Center Area: Deck and Discard */}
        <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-16 my-4">
          {/* Draw Pile */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative group" onClick={() => turn === 'player' && gameState === 'playing' && drawCard('player')}>
              <div className="absolute -inset-1 bg-[#ffd700]/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative">
                {deck.length > 0 ? (
                  <div className="relative">
                    {/* Visual stack effect */}
                    <div className="absolute top-1 left-1 w-20 h-28 sm:w-24 sm:h-36 bg-[#003399]/40 rounded-xl border border-white/10 translate-x-1 translate-y-1" />
                    <div className="absolute top-1 left-1 w-20 h-28 sm:w-24 sm:h-36 bg-[#003399]/20 rounded-xl border border-white/10 translate-x-0.5 translate-y-0.5" />
                    <Card card={deck[0]} isFaceUp={false} className={cn(turn === 'player' && "cursor-pointer hover:scale-105 active:scale-95")} />
                  </div>
                ) : (
                  <div className="w-20 h-28 sm:w-24 sm:h-36 border-2 border-dashed border-[#ffd700]/20 rounded-xl flex items-center justify-center text-[#ffd700]/20">
                    <Layers size={32} />
                  </div>
                )}
              </div>
            </div>
            <span className="text-xs font-mono text-[#ffd700]/40 uppercase tracking-tighter">摸牌堆 ({deck.length})</span>
          </div>

          {/* Current Suit Indicator (if 8 was played) */}
          <div className="flex flex-col items-center gap-4">
             <div className="text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#ffd700]/40 mb-1">当前花色</p>
                <div className={cn(
                  "w-12 h-12 rounded-full bg-black/40 flex items-center justify-center border border-[#ffd700]/30 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]",
                  currentSuit && SUIT_COLORS[currentSuit]
                )}>
                  {currentSuit && React.createElement(SUIT_ICONS[currentSuit], { size: 24 })}
                </div>
             </div>
          </div>

          {/* Discard Pile */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <AnimatePresence mode="popLayout">
                {discardPile.map((card, idx) => (
                  idx === discardPile.length - 1 && (
                    <Card 
                      key={card.id} 
                      card={card} 
                      className="shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-[#ffd700]/20"
                    />
                  )
                ))}
              </AnimatePresence>
            </div>
            <span className="text-xs font-mono text-[#ffd700]/40 uppercase tracking-tighter">弃牌堆</span>
          </div>
        </div>

        {/* Player Hand */}
        <div className="w-full flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-[#ffd700]/60 text-sm uppercase tracking-widest font-semibold">
            <div className={cn("w-2 h-2 rounded-full", turn === 'player' ? "bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" : "bg-white/20")} />
            你的手牌 ({playerHand.length})
          </div>
          <div className="flex justify-center -space-x-8 sm:-space-x-12 h-40 sm:h-48 items-end pb-4 overflow-x-auto max-w-full px-8 no-scrollbar">
            <AnimatePresence>
              {playerHand.map((card, idx) => (
                <Card 
                  key={card.id} 
                  card={card} 
                  isPlayable={isCardPlayable(card)}
                  onClick={() => playCard(card, 'player')}
                  index={idx}
                  className="hover:z-50"
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {gameState === 'suitSelection' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#1a1a1a] border border-[#ffd700]/30 p-8 rounded-3xl max-w-sm w-full shadow-[0_0_50px_rgba(0,0,0,0.8)] text-center"
            >
              <h2 className="text-2xl font-bold mb-2 text-[#ffd700]">疯狂 8 点！</h2>
              <p className="text-white/60 mb-8">请选择接下来要匹配的花色</p>
              
              <div className="grid grid-cols-2 gap-4">
                {SUITS.map(suit => {
                  const Icon = SUIT_ICONS[suit];
                  return (
                    <button
                      key={suit}
                      onClick={() => selectSuit(suit)}
                      className={cn(
                        "flex flex-col items-center gap-3 p-6 rounded-2xl border border-white/5 bg-white/5 hover:bg-[#ffd700]/10 transition-all active:scale-95 group",
                        SUIT_COLORS[suit]
                      )}
                    >
                      <Icon size={40} className="group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-bold uppercase tracking-widest">{SUIT_LABELS[suit]}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}

        {gameState === 'gameOver' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4"
          >
            <motion.div 
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              className="bg-[#1a1a1a] border-2 border-[#ffd700]/30 p-12 rounded-[40px] max-w-md w-full shadow-[0_0_100px_rgba(0,0,0,1)] text-center relative overflow-hidden"
            >
              {/* Decorative background */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#ffd700] via-[#b8860b] to-[#ffd700]" />
              
              <div className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#ffd700]/5 border border-[#ffd700]/20">
                {winner === 'player' ? (
                  <Trophy size={48} className="text-[#ffd700]" />
                ) : (
                  <Info size={48} className="text-slate-400" />
                )}
              </div>

              <h2 className="text-4xl font-black mb-4 tracking-tight text-[#ffd700]">
                {winner === 'player' ? '你赢了！' : '游戏结束'}
              </h2>
              <p className="text-white/80 mb-12 text-xl font-medium leading-relaxed italic">
                {winner === 'player' ? winMessage : 'AI 棋高一着，再来一局挑战它吧！'}
              </p>
              
              <button
                onClick={initGame}
                className="w-full py-5 bg-gradient-to-r from-[#ffd700] to-[#b8860b] text-[#4a0404] font-bold rounded-2xl hover:brightness-110 transition-all flex items-center justify-center gap-3 text-lg shadow-[0_10px_30px_rgba(184,134,11,0.3)]"
              >
                <RotateCcw size={24} />
                重新开始
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer / Info */}
      <footer className="p-4 text-center text-[10px] uppercase tracking-[0.4em] text-[#ffd700]/10 font-mono z-10">
        刘曜菁的疯狂 8 点 &copy; 2024 &bull; Built with React & Motion
      </footer>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
