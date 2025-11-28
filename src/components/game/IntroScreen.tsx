'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import TutorialScreen from './TutorialScreen';
import GameHistoryScreen from './GameHistoryScreen';
import SettingsScreen from './SettingsScreen';

interface IntroScreenProps {
  onNewGame: () => void;
  onContinueGame?: () => void;
  canContinue?: boolean;
  playerScore: number;
  opponentScore: number;
  settings: {
    soundEnabled: boolean;
    musicEnabled: boolean;
    animationSpeed: 'slow' | 'normal' | 'fast';
  };
  gameHistory: { date: string; result: 'win' | 'loss'; playerScore: number; opponentScore: number }[];
  onUpdateSettings: (settings: IntroScreenProps['settings']) => void;
  onResetMatch: () => void;
}

export default function IntroScreen({
  onNewGame,
  onContinueGame,
  canContinue = false,
  playerScore = 0,
  opponentScore = 0,
  settings,
  gameHistory,
  onUpdateSettings,
  onResetMatch,
}: IntroScreenProps) {
  const [showTutorial, setShowTutorial] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/58471.jpg')`,
        }}
      />
      
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      
      {/* Vignette effect */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
        }}
      />
      
      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo - Poker Chip */}
        <motion.div
          className="relative mb-6"
          initial={{ scale: 0.8, opacity: 0, rotateY: -180 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{ duration: 0.8, delay: 0.2, type: 'spring' }}
        >
          {/* Outer glow */}
          <div className="absolute inset-0 rounded-full bg-[#d4a843] blur-xl opacity-30 scale-110" />
          
          <div className="relative w-36 h-36 rounded-full border-4 border-[#d4a843] bg-gradient-to-br from-[#1a3a28] to-[#0d1f15] flex items-center justify-center shadow-2xl">
            {/* Inner ring pattern like a poker chip */}
            <div className="absolute inset-2 rounded-full border-2 border-[#d4a843]/30" />
            <div className="absolute inset-4 rounded-full border border-[#d4a843]/20" />
            
            {/* Center design */}
            <div className="relative w-24 h-24 rounded-full border-4 border-[#d4a843] bg-gradient-to-br from-[#2d5a3d] to-[#1a4a2e] flex items-center justify-center shadow-inner">
              {/* Card suits */}
              <div className="flex flex-col items-center">
                <div className="flex gap-1 mb-1">
                  <span className="text-red-500 text-lg">♥</span>
                  <span className="text-[#d4a843] text-lg">♠</span>
                </div>
                <span className="text-[#d4a843] text-2xl font-bold">$</span>
                <div className="flex gap-1 mt-1">
                  <span className="text-red-500 text-lg">♦</span>
                  <span className="text-[#d4a843] text-lg">♣</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative dots around the circle */}
          <div className="absolute top-0 left-1/2 w-3 h-3 bg-[#d4a843] rounded-full transform -translate-x-1/2 shadow-lg" />
          <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-[#d4a843] rounded-full transform -translate-x-1/2 shadow-lg" />
          <div className="absolute left-0 top-1/2 w-3 h-3 bg-[#d4a843] rounded-full transform -translate-y-1/2 shadow-lg" />
          <div className="absolute right-0 top-1/2 w-3 h-3 bg-[#d4a843] rounded-full transform -translate-y-1/2 shadow-lg" />
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-5xl md:text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-[#f0d78c] via-[#d4a843] to-[#a67c2e] mb-2 tracking-wide drop-shadow-lg"
          style={{ fontFamily: 'Georgia, serif', textShadow: '0 2px 10px rgba(212, 168, 67, 0.3)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          5-CARD DRAW
        </motion.h1>
        
        <motion.p
          className="text-[#d4a843] text-base tracking-[0.4em] mb-8 font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          P O K E R
        </motion.p>

        {/* Current Score (if game in progress) */}
        {(playerScore > 0 || opponentScore > 0) && (
          <motion.div
            className="mb-6 text-center bg-black/40 backdrop-blur-sm rounded-xl px-8 py-4 border border-[#d4a843]/30"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.55 }}
          >
            <div className="text-[#d4a843]/70 text-xs tracking-[0.2em] mb-2">CURRENT MATCH</div>
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="text-[#d4a843] text-3xl font-bold">{playerScore}</div>
                <div className="text-[#d4a843]/60 text-xs tracking-wider">YOU</div>
              </div>
              <div className="text-[#d4a843]/30 text-2xl">vs</div>
              <div className="text-center">
                <div className="text-[#d4a843] text-3xl font-bold">{opponentScore}</div>
                <div className="text-[#d4a843]/60 text-xs tracking-wider">THEM</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Menu Buttons */}
        <motion.div
          className="flex flex-col gap-3 w-full max-w-xs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <motion.button
            onClick={onNewGame}
            className="w-full py-4 bg-gradient-to-b from-[#f0d78c] via-[#d4a843] to-[#a67c2e] text-[#1a2e20] font-bold text-lg rounded-lg shadow-lg border border-[#f0d78c]/50"
            whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(212, 168, 67, 0.4)' }}
            whileTap={{ scale: 0.98 }}
          >
            NEW GAME
          </motion.button>
          
          {canContinue && onContinueGame && (
            <motion.button
              onClick={onContinueGame}
              className="w-full py-4 bg-black/40 backdrop-blur-sm border-2 border-[#d4a843] text-[#d4a843] font-bold text-lg rounded-lg"
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(212, 168, 67, 0.1)' }}
              whileTap={{ scale: 0.98 }}
            >
              CONTINUE GAME
            </motion.button>
          )}
          
          <motion.button
            onClick={() => setShowTutorial(true)}
            className="w-full py-4 bg-black/40 backdrop-blur-sm border border-[#d4a843]/50 text-[#d4a843] font-bold text-lg rounded-lg"
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(212, 168, 67, 0.1)' }}
            whileTap={{ scale: 0.98 }}
          >
            TUTORIAL
          </motion.button>
          
          <motion.button
            onClick={() => setShowHistory(true)}
            className="w-full py-4 bg-black/40 backdrop-blur-sm border border-[#d4a843]/50 text-[#d4a843] font-bold text-lg rounded-lg"
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(212, 168, 67, 0.1)' }}
            whileTap={{ scale: 0.98 }}
          >
            GAME HISTORY
          </motion.button>
          
          <motion.button
            onClick={() => setShowSettings(true)}
            className="w-full py-4 bg-black/40 backdrop-blur-sm border border-[#d4a843]/50 text-[#d4a843] font-bold text-lg rounded-lg"
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(212, 168, 67, 0.1)' }}
            whileTap={{ scale: 0.98 }}
          >
            SETTINGS
          </motion.button>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="flex items-center justify-center gap-4 text-[#d4a843]/60 text-sm">
            <span>♠</span>
            <span>First to 100 wins</span>
            <span>♥</span>
            <span>Draw up to 5 cards</span>
            <span>♦</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Overlay Screens */}
      <AnimatePresence>
        {showTutorial && (
          <TutorialScreen onClose={() => setShowTutorial(false)} />
        )}
        {showHistory && (
          <GameHistoryScreen 
            onClose={() => setShowHistory(false)} 
            history={gameHistory}
          />
        )}
        {showSettings && (
          <SettingsScreen
            onClose={() => setShowSettings(false)}
            settings={settings}
            onSave={onUpdateSettings}
            onResetMatch={onResetMatch}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
