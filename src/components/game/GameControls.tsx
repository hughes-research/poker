'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

export default function GameControls() {
  const {
    phase,
    player,
    bettingRound,
    fixedLimit,
    selectedCards,
    message,
    playerBet,
    playerCheck,
    playerCall,
    playerRaise,
    playerFold,
    playerDraw,
  } = useGameStore();

  const isPlayerTurn = player?.isActive ?? false;
  const canBet = phase === 'BETTING' && isPlayerTurn;
  const currentBet = bettingRound?.currentBet || 0;
  const playerBetAmount = player?.currentBet || 0;
  const amountToCall = currentBet - playerBetAmount;
  const isSecondRound = (bettingRound?.round || 0) === 2;
  const maxBet = isSecondRound ? fixedLimit.bigBet : fixedLimit.smallBet;

  // Game Over - no controls (RoundResult handles this)
  if (phase === 'GAME_OVER' || phase === 'IDLE') {
    return null;
  }

  // Drawing phase
  if (phase === 'DRAWING') {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="text-[#d4a843] text-sm flex items-center gap-2">
          <span className="text-[#d4a843]/60">♣</span>
          {selectedCards.length === 0 
            ? 'Tap cards to discard, then draw'
            : `${selectedCards.length} card${selectedCards.length > 1 ? 's' : ''} selected`
          }
          <span className="text-[#d4a843]/60">♣</span>
        </div>
        <motion.button
          onClick={playerDraw}
          className="px-10 py-3 bg-gradient-to-b from-[#f0d78c] via-[#d4a843] to-[#a67c2e] text-[#1a2e20] font-bold text-lg rounded-lg shadow-lg"
          whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(212, 168, 67, 0.4)' }}
          whileTap={{ scale: 0.98 }}
        >
          {selectedCards.length === 0 ? 'STAND PAT' : `DRAW ${selectedCards.length}`}
        </motion.button>
      </div>
    );
  }

  // Waiting for opponent
  if (!canBet) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 text-[#d4a843]">
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ⏳
          </motion.span>
          <span className="font-semibold">{message || 'Waiting for opponent...'}</span>
        </div>
      </div>
    );
  }

  // Betting controls
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-[#d4a843]/70 text-xs flex items-center gap-3">
        <span>Round {bettingRound?.round || 1}</span>
        <span className="text-[#d4a843]/40">•</span>
        <span>Limit: ${maxBet}</span>
        <span className="text-[#d4a843]/40">•</span>
        <span>Pot: ${bettingRound?.pot || 0}</span>
      </div>
      <div className="flex items-center justify-center gap-3 flex-wrap">
        {currentBet === 0 ? (
          <>
            <motion.button
              onClick={() => playerBet(maxBet)}
              className="px-6 py-3 bg-gradient-to-b from-[#f0d78c] via-[#d4a843] to-[#a67c2e] text-[#1a2e20] font-bold rounded-lg shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              BET ${maxBet}
            </motion.button>
            <motion.button
              onClick={playerCheck}
              className="px-6 py-3 bg-black/40 border-2 border-[#d4a843] text-[#d4a843] font-bold rounded-lg"
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(212, 168, 67, 0.1)' }}
              whileTap={{ scale: 0.98 }}
            >
              CHECK
            </motion.button>
          </>
        ) : (
          <>
            {amountToCall > 0 && (player?.chips || 0) >= amountToCall && (
              <motion.button
                onClick={playerCall}
                className="px-6 py-3 bg-gradient-to-b from-[#f0d78c] via-[#d4a843] to-[#a67c2e] text-[#1a2e20] font-bold rounded-lg shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                CALL ${amountToCall}
              </motion.button>
            )}
            {currentBet < maxBet && (player?.chips || 0) >= maxBet && (
              <motion.button
                onClick={() => playerRaise(maxBet - currentBet)}
                className="px-6 py-3 bg-black/40 border-2 border-[#d4a843] text-[#d4a843] font-bold rounded-lg"
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(212, 168, 67, 0.1)' }}
                whileTap={{ scale: 0.98 }}
              >
                RAISE TO ${maxBet}
              </motion.button>
            )}
          </>
        )}
        <motion.button
          onClick={playerFold}
          className="px-6 py-3 bg-red-900/60 border border-red-500/50 text-red-400 font-bold rounded-lg"
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(185, 28, 28, 0.4)' }}
          whileTap={{ scale: 0.98 }}
        >
          FOLD
        </motion.button>
      </div>
    </div>
  );
}
