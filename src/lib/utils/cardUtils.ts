import { Card, Rank, Suit } from '@/types';

/**
 * Maps a Card object to its SVG filename.
 * @param card - The card object with rank and suit
 * @returns The SVG filename (e.g., "ace_of_spades.svg")
 */
export function getCardFilename(card: Card): string {
  return `${card.rank}_of_${card.suit}.svg`;
}

/**
 * Parses an SVG filename to extract card rank and suit.
 * @param filename - The SVG filename (e.g., "ace_of_spades.svg" or "ace_of_spades")
 * @returns The card object with rank and suit
 */
export function parseCardFilename(filename: string): Card {
  const nameWithoutExt = filename.replace('.svg', '');
  const parts = nameWithoutExt.split('_of_');
  
  if (parts.length !== 2) {
    throw new Error(`Invalid card filename format: ${filename}`);
  }
  
  const rank = parts[0] as Rank;
  const suit = parts[1] as Suit;
  
  return { rank, suit };
}

/**
 * Returns the public path to a card SVG file.
 * @param card - The card object or 'back' for the card back
 * @returns The public path to the SVG file
 */
export function getCardPath(card: Card | 'back'): string {
  if (card === 'back') {
    return '/cards/back.svg';
  }
  return `/cards/${getCardFilename(card)}`;
}

/**
 * Creates a standard 52-card deck.
 * @returns An array of all 52 cards
 */
export function createDeck(): Card[] {
  const suits: Suit[] = ['clubs', 'diamonds', 'hearts', 'spades'];
  const ranks: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
  
  const deck: Card[] = [];
  
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ rank, suit });
    }
  }
  
  return deck;
}

/**
 * Shuffles a deck of cards using the Fisher-Yates algorithm.
 * @param deck - The deck to shuffle
 * @returns A new shuffled deck
 */
export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

