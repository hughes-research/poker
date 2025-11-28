'use client';

import { motion } from 'framer-motion';

interface GameHistoryScreenProps {
  onClose: () => void;
  history: { date: string; result: 'win' | 'loss'; playerScore: number; opponentScore: number }[];
}

export default function GameHistoryScreen({ onClose, history }: GameHistoryScreenProps) {
  const wins = history.filter(h => h.result === 'win').length;
  const losses = history.filter(h => h.result === 'loss').length;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('/58471.jpg')` }}
      />
      <div className="absolute inset-0 bg-black/80" />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-md w-full mx-4 max-h-[80vh] flex flex-col"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-[#d4a843] hover:text-[#f0d78c] transition-colors"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Card */}
        <div className="bg-gradient-to-br from-[#1a3a28] to-[#0d1f15] border-2 border-[#d4a843] rounded-2xl p-6 shadow-2xl flex flex-col">
          {/* Header */}
          <h2 className="text-2xl font-bold text-[#d4a843] text-center mb-6">
            GAME HISTORY
          </h2>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{wins}</div>
              <div className="text-[#d4a843]/60 text-sm">WINS</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400">{losses}</div>
              <div className="text-[#d4a843]/60 text-sm">LOSSES</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#d4a843]">
                {wins + losses > 0 ? Math.round((wins / (wins + losses)) * 100) : 0}%
              </div>
              <div className="text-[#d4a843]/60 text-sm">WIN RATE</div>
            </div>
          </div>

          {/* History List */}
          <div className="flex-1 overflow-y-auto min-h-[200px] max-h-[300px] space-y-2">
            {history.length === 0 ? (
              <div className="text-[#d4a843]/50 text-center py-8">
                No games played yet
              </div>
            ) : (
              history.map((game, index) => (
                <motion.div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    game.result === 'win' 
                      ? 'bg-green-900/30 border border-green-500/30' 
                      : 'bg-red-900/30 border border-red-500/30'
                  }`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-center gap-3">
                    <span className={game.result === 'win' ? 'text-green-400' : 'text-red-400'}>
                      {game.result === 'win' ? '🏆' : '💔'}
                    </span>
                    <span className="text-[#d4a843]/70 text-sm">{game.date}</span>
                  </div>
                  <div className="text-[#d4a843] font-bold">
                    {game.playerScore} - {game.opponentScore}
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="mt-6 w-full py-3 bg-gradient-to-b from-[#f0d78c] via-[#d4a843] to-[#a67c2e] text-[#1a2e20] font-bold rounded-lg"
          >
            CLOSE
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}


