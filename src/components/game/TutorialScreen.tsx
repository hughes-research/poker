'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface TutorialScreenProps {
  onClose: () => void;
}

const tutorialSteps = [
  {
    title: 'Welcome to 5-Card Draw',
    content: 'Learn how to play poker and beat your opponent!',
    icon: '🎰',
  },
  {
    title: 'The Deal',
    content: 'Each player receives 5 cards. You can see your cards, but the opponent\'s cards are hidden until showdown.',
    icon: '🃏',
  },
  {
    title: 'First Betting Round',
    content: 'You can BET to put chips in the pot, CHECK to pass without betting, CALL to match a bet, RAISE to increase, or FOLD to give up.',
    icon: '💰',
  },
  {
    title: 'The Draw',
    content: 'Tap cards you want to discard, then click DRAW to get new cards. You can discard up to 5 cards, or STAND PAT to keep all.',
    icon: '🔄',
  },
  {
    title: 'Second Betting Round',
    content: 'Another round of betting with higher limits. This is your last chance to bet before showdown.',
    icon: '💎',
  },
  {
    title: 'Showdown',
    content: 'If no one folds, both hands are revealed. Best poker hand wins the pot!',
    icon: '🏆',
  },
  {
    title: 'Hand Rankings',
    content: 'From highest to lowest: Royal Flush, Straight Flush, Four of a Kind, Full House, Flush, Straight, Three of a Kind, Two Pair, One Pair, High Card.',
    icon: '📊',
  },
  {
    title: 'Win the Match',
    content: 'First player to reach 100 points wins the match. Points are earned from winning pots.',
    icon: '🎯',
  },
];

export default function TutorialScreen({ onClose }: TutorialScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = tutorialSteps[currentStep];

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
        className="relative z-10 max-w-md w-full mx-4"
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
        <div className="bg-gradient-to-br from-[#1a3a28] to-[#0d1f15] border-2 border-[#d4a843] rounded-2xl p-8 shadow-2xl">
          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-6">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-[#d4a843]' : 'bg-[#d4a843]/30'
                }`}
              />
            ))}
          </div>

          {/* Icon */}
          <motion.div
            key={currentStep}
            className="text-6xl text-center mb-4"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring' }}
          >
            {step.icon}
          </motion.div>

          {/* Title */}
          <motion.h2
            key={`title-${currentStep}`}
            className="text-2xl font-bold text-[#d4a843] text-center mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            {step.title}
          </motion.h2>

          {/* Content */}
          <motion.p
            key={`content-${currentStep}`}
            className="text-[#d4a843]/80 text-center mb-8 leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {step.content}
          </motion.p>

          {/* Navigation */}
          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={prevStep}
                className="flex-1 py-3 bg-black/40 border border-[#d4a843]/50 text-[#d4a843] font-bold rounded-lg hover:bg-black/60 transition-colors"
              >
                BACK
              </button>
            )}
            <button
              onClick={nextStep}
              className="flex-1 py-3 bg-gradient-to-b from-[#f0d78c] via-[#d4a843] to-[#a67c2e] text-[#1a2e20] font-bold rounded-lg"
            >
              {currentStep === tutorialSteps.length - 1 ? 'GOT IT!' : 'NEXT'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

