export type Suit = 'clubs' | 'diamonds' | 'hearts' | 'spades';

export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'jack' | 'queen' | 'king' | 'ace';

export interface Card {
  rank: Rank;
  suit: Suit;
}

export type Hand = Card[];

export type GamePhase = 'IDLE' | 'DEALING' | 'BETTING' | 'DRAWING' | 'SHOWDOWN' | 'GAME_OVER';

export type PlayerAction = 'BET' | 'FOLD' | 'CHECK' | 'CALL' | 'RAISE';

export interface Player {
  id: string;
  name: string;
  chips: number;
  hand: Hand;
  cardsFaceUp: boolean[];
  isActive: boolean;
  hasFolded: boolean;
  currentBet: number;
}

export interface BettingRound {
  round: number;
  currentBet: number;
  pot: number;
  activePlayer: 'player' | 'opponent';
  lastAction: PlayerAction | null;
}

export type HandRank =
  | 'HIGH_CARD'
  | 'PAIR'
  | 'TWO_PAIR'
  | 'THREE_OF_A_KIND'
  | 'STRAIGHT'
  | 'FLUSH'
  | 'FULL_HOUSE'
  | 'FOUR_OF_A_KIND'
  | 'STRAIGHT_FLUSH'
  | 'ROYAL_FLUSH';

export interface HandEvaluation {
  rank: HandRank;
  value: number;
  cards: Card[];
  kickers: Card[];
}

export interface GameState {
  phase: GamePhase;
  deck: Card[];
  player: Player;
  opponent: Player;
  pot: number;
  bettingRound: BettingRound | null;
  winner: 'player' | 'opponent' | 'tie' | null;
  fixedLimit: {
    smallBet: number;
    bigBet: number;
  };
}

