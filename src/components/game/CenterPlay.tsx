'use client';

import { useGameStore } from '@/store/gameStore';
import { motion } from 'framer-motion';

export default function CenterPlay() {
  const { pot, bettingRound, phase, message } = useGameStore();

  if (phase === 'IDLE' || phase === 'GAME_OVER') {
    return null;
  }

  return (
    <motion.div 
      className="flex flex-col items-center justify-center"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Pot display */}
      <div className="bg-gradient-to-br from-[#1a3a28] to-[#0d1f15] border-2 border-[#d4a843] rounded-2xl px-10 py-5 shadow-2xl">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-[#d4a843] blur-xl opacity-10" />
        
        <div className="relative">
          <div className="text-[#d4a843]/60 text-xs uppercase tracking-[0.2em] mb-1 text-center">Pot</div>
          <div className="text-[#d4a843] font-bold text-4xl text-center flex items-center justify-center gap-1">
            <span className="text-2xl">$</span>
            <span>{pot}</span>
          </div>
          
          {/* Phase indicator */}
          {phase === 'DRAWING' && (
            <div className="text-[#d4a843]/80 text-sm mt-3 text-center border-t border-[#d4a843]/20 pt-3">
              ✦ Draw Phase ✦
            </div>
          )}
          {phase === 'BETTING' && bettingRound && (
            <div className="text-[#d4a843]/80 text-sm mt-3 text-center border-t border-[#d4a843]/20 pt-3">
              {bettingRound.round === 1 ? '♠ First Betting ♠' : '♦ Final Betting ♦'}
            </div>
          )}
        </div>
      </div>

      {/* Message */}
      {message && (
        <motion.div 
          className="mt-4 text-[#d4a843] text-sm text-center max-w-xs bg-black/40 backdrop-blur-sm px-4 py-2 rounded-lg border border-[#d4a843]/20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {message}
        </motion.div>
      )}
    </motion.div>
  );
}
