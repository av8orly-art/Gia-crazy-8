import { useState, useCallback, useEffect } from 'react';
import { type CardData, type Suit, SUITS, RANKS } from './types';

const createDeck = (): CardData[] => {
  const deck: CardData[] = [];
  SUITS.forEach(suit => {
    RANKS.forEach(rank => {
      deck.push({
        id: `${suit}-${rank}`,
        suit,
        rank,
      });
    });
  });
  return deck.sort(() => Math.random() - 0.5);
};

export const useGameLogic = () => {
  const [deck, setDeck] = useState<CardData[]>([]);
  const [playerHand, setPlayerHand] = useState<CardData[]>([]);
  const [aiHand, setAiHand] = useState<CardData[]>([]);
  const [discardPile, setDiscardPile] = useState<CardData[]>([]);
  const [currentSuit, setCurrentSuit] = useState<Suit | null>(null);
  const [turn, setTurn] = useState<'player' | 'ai'>('player');
  const [gameState, setGameState] = useState<'rules' | 'dealing' | 'playing' | 'suitSelection' | 'gameOver'>('rules');
  const [winner, setWinner] = useState<'player' | 'ai' | null>(null);
  const [message, setMessage] = useState<string>('欢迎来到 刘曜菁 的疯狂 8 点！');
  const [winMessage, setWinMessage] = useState<string>('');

  const WINNING_QUOTES = [
    "太不可思议了！你简直是扑克界的莫扎特！",
    "王者归来！这波操作足以载入史册！",
    "你刚才的表现简直是艺术！AI 在你面前瑟瑟发抖！",
    "这就是传说中的赌神吗？我愿称你为最强！",
    "天呐！你不仅赢了比赛，还赢得了全场的欢呼！",
    "这种掌控全局的感觉，只有真正的王者才配拥有！",
    "你的策略无懈可击，今晚的蒙特卡罗为你闪耀！"
  ];

  const initGame = useCallback(() => {
    const newDeck = createDeck();
    const pHand = newDeck.splice(0, 8);
    const aHand = newDeck.splice(0, 8);
    const firstDiscard = newDeck.pop()!;
    
    setDeck(newDeck);
    setPlayerHand(pHand);
    setAiHand(aHand);
    setDiscardPile([firstDiscard]);
    setCurrentSuit(firstDiscard.suit);
    setTurn('player');
    setGameState('playing');
    setWinner(null);
    setMessage('你的回合，请出牌或摸牌。');
  }, []);

  const drawCard = useCallback((target: 'player' | 'ai') => {
    if (deck.length === 0) {
      setMessage('摸牌堆已空，跳过回合。');
      setTurn(prev => prev === 'player' ? 'ai' : 'player');
      return;
    }

    const newDeck = [...deck];
    const card = newDeck.pop()!;
    setDeck(newDeck);

    if (target === 'player') {
      setPlayerHand(prev => [...prev, card]);
      setMessage('你摸了一张牌。');
      // In Crazy Eights, usually if you draw you end your turn, 
      // but some variants allow playing it immediately. 
      // Let's stick to simple: draw ends turn if no playable card.
      setTurn('ai');
    } else {
      setAiHand(prev => [...prev, card]);
      setMessage('AI 摸了一张牌。');
      setTurn('player');
    }
  }, [deck]);

  const playCard = useCallback((card: CardData, target: 'player' | 'ai', selectedSuit?: Suit) => {
    const topCard = discardPile[discardPile.length - 1];
    const isEight = card.rank === '8';
    
    // Validation
    if (!isEight && card.suit !== currentSuit && card.rank !== topCard.rank) {
      return false;
    }

    // Move card to discard
    if (target === 'player') {
      setPlayerHand(prev => prev.filter(c => c.id !== card.id));
    } else {
      setAiHand(prev => prev.filter(c => c.id !== card.id));
    }

    setDiscardPile(prev => [...prev, card]);
    
    if (isEight) {
      if (target === 'player') {
        setGameState('suitSelection');
        setMessage('疯狂 8 点！请选择一个新的花色。');
      } else {
        // AI logic for 8
        const newSuit = selectedSuit || SUITS[Math.floor(Math.random() * SUITS.length)];
        setCurrentSuit(newSuit);
        setMessage(`AI 打出了 8，并将花色改为 ${newSuit === 'hearts' ? '红心' : newSuit === 'diamonds' ? '方块' : newSuit === 'clubs' ? '梅花' : '黑桃'}`);
        setTurn('player');
      }
    } else {
      setCurrentSuit(card.suit);
      setTurn(target === 'player' ? 'ai' : 'player');
      setMessage(target === 'player' ? 'AI 的回合...' : '你的回合。');
    }

    return true;
  }, [discardPile, currentSuit]);

  const selectSuit = (suit: Suit) => {
    setCurrentSuit(suit);
    setGameState('playing');
    setTurn('ai');
    setMessage(`你选择了 ${suit === 'hearts' ? '红心' : suit === 'diamonds' ? '方块' : suit === 'clubs' ? '梅花' : '黑桃'}。AI 的回合...`);
  };

  // AI Turn Logic
  useEffect(() => {
    if (turn === 'ai' && gameState === 'playing' && !winner) {
      const timer = setTimeout(() => {
        const topCard = discardPile[discardPile.length - 1];
        
        // Find playable cards
        const playable = aiHand.filter(c => 
          c.rank === '8' || c.suit === currentSuit || c.rank === topCard.rank
        );

        if (playable.length > 0) {
          // AI Strategy: Prefer non-8 matches first, then 8
          const normalPlay = playable.find(c => c.rank !== '8');
          if (normalPlay) {
            playCard(normalPlay, 'ai');
          } else {
            // Play 8 and pick most common suit in hand
            const suitCounts: Record<Suit, number> = { hearts: 0, diamonds: 0, clubs: 0, spades: 0 };
            aiHand.forEach(c => { if(c.rank !== '8') suitCounts[c.suit]++ });
            const bestSuit = (Object.keys(suitCounts) as Suit[]).reduce((a, b) => suitCounts[a] > suitCounts[b] ? a : b);
            playCard(playable[0], 'ai', bestSuit);
          }
        } else {
          drawCard('ai');
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [turn, aiHand, discardPile, currentSuit, gameState, winner, playCard, drawCard]);

  // Check Win Condition
  useEffect(() => {
    if (gameState === 'playing') {
      if (playerHand.length === 0) {
        setWinner('player');
        setGameState('gameOver');
        const randomQuote = WINNING_QUOTES[Math.floor(Math.random() * WINNING_QUOTES.length)];
        setWinMessage(randomQuote);
        setMessage('恭喜你！你赢了！');
      } else if (aiHand.length === 0) {
        setWinner('ai');
        setGameState('gameOver');
        setMessage('AI 赢了，下次努力！');
      }
    }
  }, [playerHand, aiHand, gameState]);

  return {
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
  };
};
