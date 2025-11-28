import { Card, Rank, Suit } from '@/types';

/**
 * Maps a Card object to its SVG filename.
 * 
 * Converts a card object to the corresponding SVG filename format
 * used in the public/cards directory.
 * 
 * @param card - The card object with rank and suit
 * @returns The SVG filename (e.g., "ace_of_spades.svg")
 * 
 * @example
 * ```typescript
 * const filename = getCardFilename({rank: 'ace', suit: 'spades'});
 * // Returns: "ace_of_spades.svg"
 * ```
 */
export function getCardFilename(card: Card): string {
  return `${card.rank}_of_${card.suit}.svg`;
}


/**
 * Returns the public path to a card SVG file.
 * 
 * Generates the URL path to the card SVG image in the public directory.
 * Used for rendering card images in React components.
 * 
 * @param card - The card object or 'back' for the card back
 * @returns The public path to the SVG file (e.g., "/cards/ace_of_spades.svg")
 * 
 * @example
 * ```typescript
 * const path = getCardPath({rank: 'ace', suit: 'spades'});
 * // Returns: "/cards/ace_of_spades.svg"
 * 
 * const backPath = getCardPath('back');
 * // Returns: "/cards/back.svg"
 * ```
 */
export function getCardPath(card: Card | 'back'): string {
  if (card === 'back') {
    return '/cards/back.svg';
  }
  return `/cards/${getCardFilename(card)}`;
}

/**
 * Creates a standard 52-card deck.
 * 
 * Generates a complete deck with all combinations of:
 * - 4 suits: clubs, diamonds, hearts, spades
 * - 13 ranks: 2-10, jack, queen, king, ace
 * 
 * Cards are generated in suit order (clubs, then diamonds, etc.)
 * and rank order (2 through ace).
 * 
 * @returns An array of all 52 cards in standard order
 * 
 * @example
 * ```typescript
 * const deck = createDeck();
 * // Returns array of 52 cards: [{rank: '2', suit: 'clubs'}, ...]
 * ```
 */
export function createDeck(): Card[] {
  const suits: Suit[] = ['clubs', 'diamonds', 'hearts', 'spades'];
  const ranks: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
  
  const deck: Card[] = [];
  
  // Generate all combinations of suits and ranks
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ rank, suit });
    }
  }
  
  return deck;
}

/**
 * Shuffles a deck of cards using the Fisher-Yates algorithm.
 * 
 * Creates a new shuffled array without modifying the original.
 * The Fisher-Yates algorithm ensures uniform random distribution.
 * 
 * @param deck - The deck to shuffle (will not be modified)
 * @returns A new shuffled deck array
 * 
 * @example
 * ```typescript
 * const shuffled = shuffleDeck(deck);
 * // Returns new array with cards in random order
 * ```
 */
export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  
  // Fisher-Yates shuffle algorithm
  // Iterate from end to beginning, swapping each element with a random earlier element
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}


