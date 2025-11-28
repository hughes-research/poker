import { Card } from '@/types';
import { createDeck, shuffleDeck } from '@/lib/utils/cardUtils';

/**
 * Deck class for managing a deck of playing cards.
 * 
 * Provides functionality for:
 * - Creating and shuffling decks
 * - Dealing cards to players
 * - Tracking remaining cards
 * - Resetting the deck
 * 
 * @example
 * ```typescript
 * const deck = new Deck();
 * deck.shuffle();
 * const hand = deck.deal(5); // Deal 5 cards
 * ```
 */
export class Deck {
  /** Array of cards in the deck (ordered from top to bottom) */
  private cards: Card[];

  /**
   * Creates a new Deck instance.
   * 
   * @param cards - Optional pre-existing card array (default: creates new 52-card deck)
   */
  constructor(cards?: Card[]) {
    this.cards = cards ? [...cards] : createDeck();
  }

  /**
   * Shuffles the deck using the Fisher-Yates algorithm.
   * 
   * Randomizes the order of cards in the deck. This should be called
   * before dealing cards to ensure randomness.
   * 
   * @example
   * ```typescript
   * deck.shuffle(); // Randomize card order
   * ```
   */
  shuffle(): void {
    this.cards = shuffleDeck(this.cards);
  }

  /**
   * Deals a specified number of cards from the top of the deck.
   * 
   * Cards are removed from the deck and returned in order.
   * The deck is modified (cards are removed).
   * 
   * @param count - Number of cards to deal (must be positive)
   * @returns Array of dealt cards (in order from top of deck)
   * @throws {Error} If there are not enough cards remaining in the deck
   * 
   * @example
   * ```typescript
   * const hand = deck.deal(5); // Deal 5 cards
   * ```
   */
  deal(count: number): Card[] {
    if (this.cards.length < count) {
      throw new Error(`Not enough cards in deck. Requested: ${count}, Available: ${this.cards.length}`);
    }

    // Remove cards from the beginning of the array (top of deck)
    const dealt = this.cards.splice(0, count);
    return dealt;
  }

  /**
   * Deals a single card from the top of the deck.
   * 
   * Convenience method for dealing one card at a time.
   * 
   * @returns The dealt card
   * @throws {Error} If the deck is empty
   * 
   * @example
   * ```typescript
   * const card = deck.dealOne(); // Deal one card
   * ```
   */
  dealOne(): Card {
    if (this.cards.length === 0) {
      throw new Error('Deck is empty');
    }

    return this.cards.shift()!;
  }

  /**
   * Returns the number of cards remaining in the deck.
   * 
   * @returns Number of cards left in the deck
   * 
   * @example
   * ```typescript
   * const remaining = deck.remaining(); // e.g., 42
   * ```
   */
  remaining(): number {
    return this.cards.length;
  }

  /**
   * Resets the deck to a full 52-card deck and shuffles it.
   * 
   * Creates a new standard deck and randomizes the order.
   * Useful for starting a new game or hand.
   * 
   * @example
   * ```typescript
   * deck.reset(); // New shuffled deck
   * ```
   */
  reset(): void {
    this.cards = createDeck();
    this.shuffle();
  }

  /**
   * Gets a copy of the remaining cards (for inspection, not modification).
   * 
   * Returns a read-only copy to prevent external modification of the deck.
   * 
   * @returns Copy of the cards array (read-only)
   * 
   * @example
   * ```typescript
   * const cards = deck.getCards(); // Inspect remaining cards
   * ```
   */
  getCards(): readonly Card[] {
    return [...this.cards];
  }
}


