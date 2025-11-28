/**
 * Supported card suits.
 */
export type Suit = 'clubs' | 'diamonds' | 'hearts' | 'spades';

/**
 * Supported card ranks.
 * Ace can be high or low depending on context.
 */
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'jack' | 'queen' | 'king' | 'ace';

/**
 * Represents a playing card.
 */
export interface Card {
  /** The rank of the card (e.g., 'ace', 'king', '2') */
  rank: Rank;
  /** The suit of the card */
  suit: Suit;
}

/**
 * Represents a collection of cards (usually 5).
 */
export type Hand = Card[];

/**
 * Possible phases of the game flow.
 */
export type GamePhase = 'IDLE' | 'DEALING' | 'BETTING' | 'DRAWING' | 'SHOWDOWN' | 'GAME_OVER';

/**
 * Actions a player can take during their turn.
 */
export type PlayerAction = 'BET' | 'FOLD' | 'CHECK' | 'CALL' | 'RAISE';

/**
 * Represents a participant in the game (Human or AI).
 */
export interface Player {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Current chip stack */
  chips: number;
  /** Current hand of cards */
  hand: Hand;
  /** Visibility state of each card in the hand (true = face up) */
  cardsFaceUp: boolean[];
  /** Whether it is currently this player's turn */
  isActive: boolean;
  /** Whether the player has folded in the current hand */
  hasFolded: boolean;
  /** The amount the player has bet in the current round */
  currentBet: number;
}

/**
 * Tracks the state of the current betting round.
 */
export interface BettingRound {
  /** The current round number (e.g., 1 or 2) */
  round: number;
  /** The current highest bet that must be matched */
  currentBet: number;
  /** Total chips currently in the pot */
  pot: number;
  /** Whose turn it is to act */
  activePlayer: 'player' | 'opponent';
  /** The last action performed in this round */
  lastAction: PlayerAction | null;
}

/**
 * Standard poker hand rankings from lowest to highest.
 */
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

/**
 * Result of a hand evaluation.
 */
export interface HandEvaluation {
  /** The category of the hand (e.g., FLUSH) */
  rank: HandRank;
  /** Numeric value for comparing hands of the same rank */
  value: number;
  /** The cards sorted by importance */
  cards: Card[];
  /** The cards used as tie-breakers (kickers) */
  kickers: Card[];
}

/**
 * Complete snapshot of the game state.
 */
export interface GameState {
  /** Current phase of the game */
  phase: GamePhase;
  /** The remaining deck */
  deck: Card[];
  /** The human player state */
  player: Player;
  /** The opponent state */
  opponent: Player;
  /** Current pot size */
  pot: number;
  /** Current betting round details */
  bettingRound: BettingRound | null;
  /** The winner of the hand */
  winner: 'player' | 'opponent' | 'tie' | null;
  /** Betting limits configuration */
  fixedLimit: {
    smallBet: number;
    bigBet: number;
  };
}

