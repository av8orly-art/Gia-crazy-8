import { type LucideIcon, Heart, Diamond, Club, Spade } from 'lucide-react';

export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface CardData {
  id: string;
  suit: Suit;
  rank: Rank;
}

export const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
export const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export const RANK_CHARACTERS: Record<Rank, string> = {
  'A': 'Judy Hopps',
  '2': 'Nick Wilde',
  '3': 'Chief Bogo',
  '4': 'Clawhauser',
  '5': 'Mayor Lionheart',
  '6': 'Bellwether',
  '7': 'Flash',
  '8': 'Mr. Big',
  '9': 'Gazelle',
  '10': 'Finnick',
  'J': 'Yax',
  'Q': 'Fru Fru',
  'K': 'Duke Weaselton',
};

export const SUIT_ICONS: Record<Suit, LucideIcon> = {
  hearts: Heart,
  diamonds: Diamond,
  clubs: Club,
  spades: Spade,
};

export const SUIT_COLORS: Record<Suit, string> = {
  hearts: 'text-red-500',
  diamonds: 'text-red-500',
  clubs: 'text-slate-900',
  spades: 'text-slate-900',
};

export const SUIT_LABELS: Record<Suit, string> = {
  hearts: '红心',
  diamonds: '方块',
  clubs: '梅花',
  spades: '黑桃',
};
