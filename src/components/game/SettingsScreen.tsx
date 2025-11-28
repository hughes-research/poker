'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface SettingsScreenProps {
  onClose: () => void;
  settings: {
    soundEnabled: boolean;
    musicEnabled: boolean;
    animationSpeed: 'slow' | 'normal' | 'fast';
  };
  onSave: (settings: SettingsScreenProps['settings']) => void;
  onResetMatch: () => void;
}

export default function SettingsScreen({ onClose, settings, onSave, onResetMatch }: SettingsScreenProps) {
  const [localSettings, setLocalSettings] = useState(settings);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const handleReset = () => {
    onResetMatch();
    setShowConfirmReset(false);
    onClose();
  };

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
        <div className="bg-gradient-to-br from-[#1a3a28] to-[#0d1f15] border-2 border-[#d4a843] rounded-2xl p-6 shadow-2xl">
          {/* Header */}
          <h2 className="text-2xl font-bold text-[#d4a843] text-center mb-6">
            SETTINGS
          </h2>

          {/* Settings Options */}
          <div className="space-y-4 mb-6">
            {/* Sound */}
            <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
              <span className="text-[#d4a843]">Sound Effects</span>
              <button
                onClick={() => setLocalSettings({ ...localSettings, soundEnabled: !localSettings.soundEnabled })}
                className={`w-14 h-8 rounded-full transition-colors ${
                  localSettings.soundEnabled ? 'bg-[#d4a843]' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${
                    localSettings.soundEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Music */}
            <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
              <span className="text-[#d4a843]">Music</span>
              <button
                onClick={() => setLocalSettings({ ...localSettings, musicEnabled: !localSettings.musicEnabled })}
                className={`w-14 h-8 rounded-full transition-colors ${
                  localSettings.musicEnabled ? 'bg-[#d4a843]' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${
                    localSettings.musicEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Animation Speed */}
            <div className="p-3 bg-black/30 rounded-lg">
              <span className="text-[#d4a843] block mb-2">Animation Speed</span>
              <div className="flex gap-2">
                {(['slow', 'normal', 'fast'] as const).map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setLocalSettings({ ...localSettings, animationSpeed: speed })}
                    className={`flex-1 py-2 rounded-lg font-bold text-sm transition-colors ${
                      localSettings.animationSpeed === speed
                        ? 'bg-[#d4a843] text-[#1a2e20]'
                        : 'bg-black/40 text-[#d4a843]/60 border border-[#d4a843]/30'
                    }`}
                  >
                    {speed.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reset Match */}
          <div className="border-t border-[#d4a843]/30 pt-4 mb-6">
            {showConfirmReset ? (
              <div className="space-y-3">
                <p className="text-red-400 text-center text-sm">
                  Are you sure? This will reset all match progress.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="flex-1 py-2 bg-black/40 border border-[#d4a843]/50 text-[#d4a843] font-bold rounded-lg"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 py-2 bg-red-600 text-white font-bold rounded-lg"
                  >
                    RESET
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirmReset(true)}
                className="w-full py-2 bg-black/40 border border-red-500/50 text-red-400 font-bold rounded-lg hover:bg-red-900/30 transition-colors"
              >
                RESET MATCH
              </button>
            )}
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            className="w-full py-3 bg-gradient-to-b from-[#f0d78c] via-[#d4a843] to-[#a67c2e] text-[#1a2e20] font-bold rounded-lg"
          >
            SAVE SETTINGS
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

