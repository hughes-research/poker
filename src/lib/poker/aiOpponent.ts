import { evaluateHand } from './handEvaluator';
import { GameEngine } from './gameLogic';
import { PlayerAction, HandRank } from '@/types';

/**
 * Determines the AI opponent's action based on game state.
 * @param gameEngine - The game engine instance
 * @returns The action the AI should take
 */
export function makeAIDecision(gameEngine: GameEngine): {
  action: PlayerAction;
  amount?: number;
} {
  const opponent = gameEngine.getOpponent();
  const player = gameEngine.getPlayer();
  const bettingRound = gameEngine.getBettingRound();
  const fixedLimit = gameEngine.getFixedLimit();

  if (!bettingRound) {
    return { action: 'CHECK' };
  }

  // Evaluate hand strength based on visible cards
  const visibleCards = opponent.hand.filter((_, index) => opponent.cardsFaceUp[index]);
  const handStrength = evaluateHandStrength(opponent.hand, visibleCards);

  // Calculate pot odds
  const currentBet = bettingRound.currentBet;
  const amountToCall = currentBet - opponent.currentBet;
  const potOdds = amountToCall > 0 ? (bettingRound.pot + amountToCall) / amountToCall : 0;

  // Determine if it's small bet or big bet round
  const isSmallBet = bettingRound.round <= 2;
  const maxBet = isSmallBet ? fixedLimit.smallBet : fixedLimit.bigBet;

  // Decision logic based on hand strength
  if (handStrength >= 0.8) {
    // Very strong hand - bet/raise aggressively
    if (currentBet === 0) {
      return { action: 'BET', amount: maxBet };
    } else if (amountToCall > 0 && opponent.chips >= amountToCall) {
      if (currentBet < maxBet && opponent.chips >= currentBet + maxBet) {
        return { action: 'RAISE', amount: maxBet };
      }
      return { action: 'CALL' };
    }
  } else if (handStrength >= 0.6) {
    // Strong hand - bet/raise moderately
    if (currentBet === 0) {
      const betAmount = Math.floor(maxBet * 0.75);
      return { action: 'BET', amount: betAmount };
    } else if (amountToCall > 0) {
      if (potOdds > 3 && opponent.chips >= amountToCall) {
        return { action: 'CALL' };
      } else if (potOdds <= 2) {
        return { action: 'FOLD' };
      }
    } else {
      return { action: 'CHECK' };
    }
  } else if (handStrength >= 0.4) {
    // Medium hand - call if pot odds are good
    if (currentBet === 0) {
      return { action: 'CHECK' };
    } else if (amountToCall > 0) {
      if (potOdds > 4 && opponent.chips >= amountToCall) {
        return { action: 'CALL' };
      } else {
        return { action: 'FOLD' };
      }
    }
  } else {
    // Weak hand - fold unless pot odds are very favorable
    if (currentBet === 0) {
      // Sometimes check with weak hand to bluff
      if (Math.random() < 0.3) {
        return { action: 'CHECK' };
      }
      return { action: 'CHECK' };
    } else if (amountToCall > 0) {
      if (potOdds > 8 && opponent.chips >= amountToCall) {
        return { action: 'CALL' };
      } else {
        return { action: 'FOLD' };
      }
    }
  }

  // Default: check if no bet, fold if bet
  if (currentBet === 0) {
    return { action: 'CHECK' };
  } else {
    return { action: 'FOLD' };
  }
}

/**
 * Evaluates the strength of a hand (0.0 to 1.0).
 * Uses full hand evaluation when all cards are visible, otherwise estimates.
 */
function evaluateHandStrength(fullHand: typeof fullHand, visibleCards: typeof visibleCards): number {
  if (fullHand.length !== 5) {
    return 0;
  }

  // If we can see all cards, use actual evaluation
  if (visibleCards.length === 5) {
    const evaluation = evaluateHand(fullHand);
    return normalizeHandValue(evaluation.rank, evaluation.value);
  }

  // Otherwise, estimate based on visible cards and known patterns
  const evaluation = evaluateHand(fullHand);
  const baseStrength = normalizeHandValue(evaluation.rank, evaluation.value);

  // Adjust based on number of visible cards (more visible = more confidence)
  const visibilityFactor = visibleCards.length / 5;
  return baseStrength * (0.5 + 0.5 * visibilityFactor);
}

/**
 * Normalizes hand value to 0.0-1.0 scale.
 */
function normalizeHandValue(rank: HandRank, value: number): number {
  // Map hand ranks to base strength
  const rankStrength: Record<HandRank, number> = {
    'HIGH_CARD': 0.1,
    'PAIR': 0.3,
    'TWO_PAIR': 0.5,
    'THREE_OF_A_KIND': 0.6,
    'STRAIGHT': 0.7,
    'FLUSH': 0.75,
    'FULL_HOUSE': 0.85,
    'FOUR_OF_A_KIND': 0.95,
    'STRAIGHT_FLUSH': 0.98,
    'ROYAL_FLUSH': 1.0,
  };

  const baseStrength = rankStrength[rank];
  
  // Adjust based on value within the rank
  // Higher value within same rank = slightly stronger
  const normalizedValue = Math.min(value / 10000, 1);
  
  return baseStrength + (normalizedValue * 0.1);
}

