import { Card } from '@/types';
import { createDeck, shuffleDeck } from '@/lib/utils/cardUtils';

/**
 * Deck class for managing a deck of playing cards.
 */
export class Deck {
  private cards: Card[];

  constructor(cards?: Card[]) {
    this.cards = cards ? [...cards] : createDeck();
  }

  /**
   * Shuffles the deck.
   */
  shuffle(): void {
    this.cards = shuffleDeck(this.cards);
  }

  /**
   * Deals a specified number of cards from the deck.
   * @param count - Number of cards to deal
   * @returns Array of dealt cards
   * @throws Error if there are not enough cards remaining
   */
  deal(count: number): Card[] {
    if (this.cards.length < count) {
      throw new Error(`Not enough cards in deck. Requested: ${count}, Available: ${this.cards.length}`);
    }

    const dealt = this.cards.splice(0, count);
    return dealt;
  }

  /**
   * Deals a single card from the deck.
   * @returns The dealt card
   * @throws Error if the deck is empty
   */
  dealOne(): Card {
    if (this.cards.length === 0) {
      throw new Error('Deck is empty');
    }

    return this.cards.shift()!;
  }

  /**
   * Returns the number of cards remaining in the deck.
   */
  remaining(): number {
    return this.cards.length;
  }

  /**
   * Resets the deck to a full 52-card deck and shuffles it.
   */
  reset(): void {
    this.cards = createDeck();
    this.shuffle();
  }

  /**
   * Gets a copy of the remaining cards (for inspection, not modification).
   */
  getCards(): readonly Card[] {
    return [...this.cards];
  }
}

