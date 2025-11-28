import { Card, Hand, HandEvaluation, HandRank, Rank } from '@/types';

/**
 * Mapping of card ranks to their numeric values.
 * Ace is high (14) by default.
 */
const RANK_VALUES: Record<Rank, number> = {
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  'jack': 11,
  'queen': 12,
  'king': 13,
  'ace': 14,
};

/**
 * Gets the numeric value of a rank.
 * 
 * @param {Rank} rank - The rank to lookup (e.g., 'king', '5').
 * @returns {number} The numeric value (2-14).
 */
function getRankValue(rank: Rank): number {
  return RANK_VALUES[rank];
}

/**
 * Sorts cards by rank value in ascending order.
 * 
 * @param {Card[]} cards - Array of cards to sort.
 * @returns {Card[]} A new array of sorted cards.
 */
function sortByRank(cards: Card[]): Card[] {
  return [...cards].sort((a, b) => getRankValue(a.rank) - getRankValue(b.rank));
}

/**
 * Counts occurrences of each rank in a hand.
 * Useful for finding pairs, trips, quads, etc.
 * 
 * @param {Card[]} cards - The hand to analyze.
 * @returns {Map<Rank, number>} Map of rank to count.
 */
function getRankCounts(cards: Card[]): Map<Rank, number> {
  const counts = new Map<Rank, number>();
  for (const card of cards) {
    counts.set(card.rank, (counts.get(card.rank) || 0) + 1);
  }
  return counts;
}

/**
 * Checks if all cards have the same suit.
 * 
 * @param {Card[]} cards - The hand to check.
 * @returns {boolean} True if it is a flush.
 */
function isFlush(cards: Card[]): boolean {
  const suit = cards[0].suit;
  return cards.every(card => card.suit === suit);
}

/**
 * Checks if cards form a straight sequence.
 * Handles the special case of an A-2-3-4-5 ("Wheel") straight.
 * 
 * @param {Card[]} cards - The hand to check.
 * @returns {boolean} True if it is a straight.
 */
function isStraight(cards: Card[]): boolean {
  const sorted = sortByRank(cards);
  const values = sorted.map(c => getRankValue(c.rank));
  
  // Check for regular straight
  for (let i = 1; i < values.length; i++) {
    if (values[i] !== values[i - 1] + 1) {
      // Check for A-2-3-4-5 straight (wheel)
      if (values[0] === 2 && values[1] === 3 && values[2] === 4 && 
          values[3] === 5 && values[4] === 14) {
        return true;
      }
      return false;
    }
  }
  return true;
}

/**
 * Evaluates a 5-card poker hand and returns its rank and value.
 * Calculates a unique numeric value for the hand to allow easy comparison.
 * 
 * Score ranges:
 * - Royal Flush: 9000
 * - Straight Flush: 8000+
 * - Four of a Kind: 7000+
 * - Full House: 6000+
 * - Flush: 5000+
 * - Straight: 4000+
 * - Three of a Kind: 3000+
 * - Two Pair: 2000+
 * - Pair: 1000+
 * - High Card: < 1000
 * 
 * @param {Hand} hand - Array of 5 cards.
 * @throws {Error} If hand does not contain exactly 5 cards.
 * @returns {HandEvaluation} Object containing rank, value, and key cards.
 */
export function evaluateHand(hand: Hand): HandEvaluation {
  if (hand.length !== 5) {
    throw new Error('Hand must contain exactly 5 cards');
  }

  const sorted = sortByRank(hand);
  const rankCounts = getRankCounts(hand);
  const counts = Array.from(rankCounts.values()).sort((a, b) => b - a);
  const isFlushHand = isFlush(hand);
  const isStraightHand = isStraight(hand);

  // Royal Flush
  if (isFlushHand && isStraightHand && sorted[4].rank === 'ace' && sorted[0].rank === '10') {
    return {
      rank: 'ROYAL_FLUSH',
      value: 9000,
      cards: sorted,
      kickers: [],
    };
  }

  // Straight Flush
  if (isFlushHand && isStraightHand) {
    const highCard = sorted[4];
    // Handle A-2-3-4-5 straight (wheel)
    if (highCard.rank === 'ace' && sorted[0].rank === '2') {
      return {
        rank: 'STRAIGHT_FLUSH',
        value: 8005,
        cards: sorted,
        kickers: [],
      };
    }
    return {
      rank: 'STRAIGHT_FLUSH',
      value: 8000 + getRankValue(highCard.rank),
      cards: sorted,
      kickers: [],
    };
  }

  // Four of a Kind
  if (counts[0] === 4) {
    const fourRank = Array.from(rankCounts.entries()).find(([_, count]) => count === 4)?.[0]!;
    const kicker = sorted.find(c => c.rank !== fourRank)!;
    return {
      rank: 'FOUR_OF_A_KIND',
      value: 7000 + getRankValue(fourRank) * 100 + getRankValue(kicker.rank),
      cards: sorted,
      kickers: [kicker],
    };
  }

  // Full House
  if (counts[0] === 3 && counts[1] === 2) {
    const threeRank = Array.from(rankCounts.entries()).find(([_, count]) => count === 3)?.[0]!;
    const pairRank = Array.from(rankCounts.entries()).find(([_, count]) => count === 2)?.[0]!;
    return {
      rank: 'FULL_HOUSE',
      value: 6000 + getRankValue(threeRank) * 100 + getRankValue(pairRank),
      cards: sorted,
      kickers: [],
    };
  }

  // Flush
  if (isFlushHand) {
    const highCard = sorted[4];
    return {
      rank: 'FLUSH',
      value: 5000 + getRankValue(highCard.rank),
      cards: sorted,
      kickers: sorted.slice(0, 4).reverse(),
    };
  }

  // Straight
  if (isStraightHand) {
    let highCard = sorted[4];
    // Handle A-2-3-4-5 straight (wheel)
    if (highCard.rank === 'ace' && sorted[0].rank === '2') {
      highCard = sorted[3]; // 5 is the high card
    }
    return {
      rank: 'STRAIGHT',
      value: 4000 + getRankValue(highCard.rank),
      cards: sorted,
      kickers: [],
    };
  }

  // Three of a Kind
  if (counts[0] === 3) {
    const threeRank = Array.from(rankCounts.entries()).find(([_, count]) => count === 3)?.[0]!;
    const kickers = sorted.filter(c => c.rank !== threeRank).reverse();
    return {
      rank: 'THREE_OF_A_KIND',
      value: 3000 + getRankValue(threeRank) * 100 + 
             getRankValue(kickers[0].rank) * 10 + getRankValue(kickers[1].rank),
      cards: sorted,
      kickers,
    };
  }

  // Two Pair
  if (counts[0] === 2 && counts[1] === 2) {
    const pairs = Array.from(rankCounts.entries())
      .filter(([_, count]) => count === 2)
      .map(([rank]) => rank)
      .sort((a, b) => getRankValue(b) - getRankValue(a));
    const kicker = sorted.find(c => !pairs.includes(c.rank))!;
    return {
      rank: 'TWO_PAIR',
      value: 2000 + getRankValue(pairs[0]) * 100 + 
             getRankValue(pairs[1]) * 10 + getRankValue(kicker.rank),
      cards: sorted,
      kickers: [kicker],
    };
  }

  // Pair
  if (counts[0] === 2) {
    const pairRank = Array.from(rankCounts.entries()).find(([_, count]) => count === 2)?.[0]!;
    const kickers = sortByRank(sorted.filter(c => c.rank !== pairRank)).reverse();
    return {
      rank: 'PAIR',
      value: 1000 + getRankValue(pairRank) * 100 + 
             getRankValue(kickers[0].rank) * 10 + 
             getRankValue(kickers[1].rank) + 
             getRankValue(kickers[2].rank) * 0.01,
      cards: sorted,
      kickers,
    };
  }

  // High Card
  const kickers = sorted.reverse();
  return {
    rank: 'HIGH_CARD',
    value: getRankValue(kickers[0].rank) * 100 + 
           getRankValue(kickers[1].rank) * 10 + 
           getRankValue(kickers[2].rank) + 
           getRankValue(kickers[3].rank) * 0.1 + 
           getRankValue(kickers[4].rank) * 0.01,
    cards: sorted,
    kickers,
  };
}

/**
 * Compares two hands to determine the winner.
 * 
 * @param {Hand} hand1 - First hand to compare.
 * @param {Hand} hand2 - Second hand to compare.
 * @returns {number} 
 * - 1 if hand1 is better
 * - -1 if hand2 is better
 * - 0 if hands are equal (tie)
 */
export function compareHands(hand1: Hand, hand2: Hand): number {
  const eval1 = evaluateHand(hand1);
  const eval2 = evaluateHand(hand2);

  if (eval1.value > eval2.value) return 1;
  if (eval1.value < eval2.value) return -1;
  return 0;
}


