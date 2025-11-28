'use client';

import { motion } from 'framer-motion';

interface HelpScreenProps {
  onClose: () => void;
}

const handRankings = [
  { name: 'Royal Flush', description: 'A, K, Q, J, 10 all same suit', example: 'A♠ K♠ Q♠ J♠ 10♠' },
  { name: 'Straight Flush', description: '5 consecutive cards, same suit', example: '9♥ 8♥ 7♥ 6♥ 5♥' },
  { name: 'Four of a Kind', description: '4 cards of same rank', example: 'K♠ K♥ K♦ K♣ 2♠' },
  { name: 'Full House', description: '3 of a kind + a pair', example: 'J♠ J♥ J♦ 8♣ 8♠' },
  { name: 'Flush', description: '5 cards of same suit', example: 'A♦ J♦ 8♦ 6♦ 2♦' },
  { name: 'Straight', description: '5 consecutive cards', example: '10♠ 9♥ 8♦ 7♣ 6♠' },
  { name: 'Three of a Kind', description: '3 cards of same rank', example: '7♠ 7♥ 7♦ K♣ 2♠' },
  { name: 'Two Pair', description: '2 different pairs', example: 'Q♠ Q♥ 5♦ 5♣ A♠' },
  { name: 'One Pair', description: '2 cards of same rank', example: '9♠ 9♥ A♦ 7♣ 3♠' },
  { name: 'High Card', description: 'No combination', example: 'A♠ J♥ 8♦ 6♣ 2♠' },
];

export default function HelpScreen({ onClose }: HelpScreenProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-lg w-full mx-4 max-h-[85vh] flex flex-col"
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
        <div className="bg-gradient-to-br from-[#1a3a28] to-[#0d1f15] border-2 border-[#d4a843] rounded-2xl p-6 shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <h2 className="text-2xl font-bold text-[#d4a843] text-center mb-4">
            HAND RANKINGS
          </h2>
          <p className="text-[#d4a843]/60 text-center text-sm mb-4">
            From highest to lowest
          </p>

          {/* Rankings List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {handRankings.map((hand, index) => (
              <motion.div
                key={hand.name}
                className="bg-black/30 rounded-lg p-3 border border-[#d4a843]/20"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[#d4a843] font-bold">{index + 1}. {hand.name}</span>
                </div>
                <p className="text-[#d4a843]/60 text-sm">{hand.description}</p>
                <p className="text-white/80 text-sm mt-1 font-mono">{hand.example}</p>
              </motion.div>
            ))}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="mt-4 w-full py-3 bg-gradient-to-b from-[#f0d78c] via-[#d4a843] to-[#a67c2e] text-[#1a2e20] font-bold rounded-lg"
          >
            GOT IT
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

