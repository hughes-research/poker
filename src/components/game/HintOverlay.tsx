'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { evaluateHand } from '@/lib/poker/handEvaluator';
import { HandRank } from '@/types';

interface HintOverlayProps {
  onClose: () => void;
}

/**
 * Converts a hand rank to a human-readable name.
 */
function getHandRankName(rank: HandRank): string {
  const rankNames: Record<HandRank, string> = {
    'HIGH_CARD': 'High Card',
    'PAIR': 'Pair',
    'TWO_PAIR': 'Two Pair',
    'THREE_OF_A_KIND': 'Three of a Kind',
    'STRAIGHT': 'Straight',
    'FLUSH': 'Flush',
    'FULL_HOUSE': 'Full House',
    'FOUR_OF_A_KIND': 'Four of a Kind',
    'STRAIGHT_FLUSH': 'Straight Flush',
    'ROYAL_FLUSH': 'Royal Flush',
  };
  return rankNames[rank];
}

export default function HintOverlay({ onClose }: HintOverlayProps) {
  const { player, phase, bettingRound, selectedCards } = useGameStore();

  // Evaluate current hand
  const handResult = player?.hand ? evaluateHand(player.hand) : null;
  
  // Generate hint based on phase
  const getHint = () => {
    if (!player || !handResult) {
      return { action: 'Wait', reason: 'Game not started yet.' };
    }

    const handStrength = handResult.value;
    const handName = getHandRankName(handResult.rank);

    if (phase === 'DRAWING') {
      // Drawing phase hints
      if (handStrength >= 6000) {
        return { action: 'Stand Pat', reason: `You have a ${handName}! Keep all your cards.` };
      } else if (handStrength >= 4000) {
        return { action: 'Keep your hand', reason: `Your ${handName} is decent. Consider keeping it.` };
      } else if (handStrength >= 2000) {
        // Has a pair
        const hint = selectedCards.length === 0 
          ? 'Discard your non-pair cards (tap 3 cards)' 
          : `Good selection! Draw ${selectedCards.length} new cards.`;
        return { action: 'Improve your pair', reason: hint };
      } else {
        // High card only
        return { action: 'Discard weak cards', reason: 'Keep your highest card (Ace if you have one) and discard the rest.' };
      }
    }

    if (phase === 'BETTING') {
      // Betting phase hints
      const currentBet = bettingRound?.currentBet || 0;
      
      if (handStrength >= 7000) {
        return { action: 'Raise!', reason: `Your ${handName} is very strong. Bet aggressively!` };
      } else if (handStrength >= 5000) {
        return { action: 'Bet/Call', reason: `Your ${handName} is good. Stay in the hand.` };
      } else if (handStrength >= 3000) {
        if (currentBet === 0) {
          return { action: 'Check', reason: `Your ${handName} is moderate. Check to see more for free.` };
        } else {
          return { action: 'Call (risky)', reason: `Your ${handName} might not be strong enough. Consider folding if the bet is high.` };
        }
      } else {
        if (currentBet === 0) {
          return { action: 'Check/Bluff', reason: `Your ${handName} is weak. Check, or try a small bluff.` };
        } else {
          return { action: 'Fold', reason: `Your ${handName} is weak. Folding might be the smart play.` };
        }
      }
    }

    return { action: 'Wait', reason: 'Waiting for the right moment...' };
  };

  const hint = getHint();

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-sm w-full mx-4"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', delay: 0.1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-br from-[#1a3a28] to-[#0d1f15] border-2 border-[#d4a843] rounded-2xl p-6 shadow-2xl">
          {/* Lightbulb icon */}
          <div className="text-4xl text-center mb-3">💡</div>
          
          {/* Hand info */}
          {handResult && (
            <div className="text-center mb-4 bg-black/30 rounded-lg p-3 border border-[#d4a843]/20">
              <div className="text-[#d4a843]/60 text-xs uppercase tracking-wider">Your Hand</div>
              <div className="text-[#d4a843] text-xl font-bold">{getHandRankName(handResult.rank)}</div>
            </div>
          )}

          {/* Hint */}
          <div className="text-center">
            <div className="text-[#d4a843] text-2xl font-bold mb-2">{hint.action}</div>
            <p className="text-[#d4a843]/80">{hint.reason}</p>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="mt-6 w-full py-3 bg-gradient-to-b from-[#f0d78c] via-[#d4a843] to-[#a67c2e] text-[#1a2e20] font-bold rounded-lg"
          >
            GOT IT
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}


