'use client';

import { motion } from 'framer-motion';

interface RoundResultProps {
  winner: 'player' | 'opponent' | 'tie' | null;
  matchWinner: 'player' | 'opponent' | null;
  message: string;
  playerScore: number;
  opponentScore: number;
  onContinue: () => void;
}

export default function RoundResult({
  winner,
  matchWinner,
  message,
  playerScore,
  opponentScore,
  onContinue,
}: RoundResultProps) {
  const isMatchOver = matchWinner !== null;
  const isWin = winner === 'player' || matchWinner === 'player';
  const isTie = winner === 'tie';

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background blur */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      
      <motion.div
        className="relative bg-gradient-to-br from-[#1a3a28] to-[#0d1f15] border-2 border-[#d4a843] rounded-2xl p-8 text-center max-w-sm mx-4 shadow-2xl"
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, type: 'spring' }}
      >
        {/* Glow effect */}
        <div className={`absolute inset-0 rounded-2xl blur-xl opacity-20 ${
          isWin ? 'bg-[#d4a843]' : isTie ? 'bg-blue-400' : 'bg-red-500'
        }`} />
        
        <div className="relative">
          {/* Trophy/Result Icon */}
          <motion.div
            className="text-5xl mb-4"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            {isMatchOver 
              ? (matchWinner === 'player' ? '🏆' : '💔')
              : (isWin ? '✨' : isTie ? '🤝' : '😔')
            }
          </motion.div>

          {/* Result Header */}
          <motion.h2
            className={`text-3xl font-bold mb-2 ${
              isWin ? 'text-[#d4a843]' : isTie ? 'text-blue-400' : 'text-red-400'
            }`}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {isMatchOver 
              ? (matchWinner === 'player' ? 'MATCH WON!' : 'MATCH LOST')
              : (isWin ? 'YOU WIN!' : isTie ? 'TIE!' : 'YOU LOSE')
            }
          </motion.h2>

          {/* Message */}
          <p className="text-[#d4a843]/80 text-lg mb-6">
            {message}
          </p>

          {/* Score Display */}
          <div className="flex justify-center gap-8 mb-6 bg-black/30 rounded-xl p-4">
            <div className="text-center">
              <div className="text-[#d4a843] text-3xl font-bold">{playerScore}</div>
              <div className="text-[#d4a843]/60 text-xs tracking-wider">YOU</div>
            </div>
            <div className="flex items-center">
              <div className="text-[#d4a843]/30 text-2xl">vs</div>
            </div>
            <div className="text-center">
              <div className="text-[#d4a843] text-3xl font-bold">{opponentScore}</div>
              <div className="text-[#d4a843]/60 text-xs tracking-wider">THEM</div>
            </div>
          </div>

          {/* Target reminder */}
          {!isMatchOver && (
            <p className="text-[#d4a843]/50 text-xs mb-6 flex items-center justify-center gap-2">
              <span>♠</span>
              <span>First to 100 wins</span>
              <span>♠</span>
            </p>
          )}

          {/* Continue Button */}
          <motion.button
            onClick={onContinue}
            className="w-full py-4 bg-gradient-to-b from-[#f0d78c] via-[#d4a843] to-[#a67c2e] text-[#1a2e20] font-bold text-lg rounded-lg shadow-lg"
            whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(212, 168, 67, 0.4)' }}
            whileTap={{ scale: 0.98 }}
          >
            {isMatchOver ? 'NEW MATCH' : 'NEXT HAND'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
