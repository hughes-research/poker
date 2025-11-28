'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import IntroScreen from './IntroScreen';
import TopBar from './TopBar';
import ScoreDisplay from './ScoreDisplay';
import OpponentCards from './OpponentCards';
import PlayerCards from './PlayerCards';
import CenterPlay from './CenterPlay';
import GameControls from './GameControls';
import RoundResult from './RoundResult';
import SettingsScreen from './SettingsScreen';
import HelpScreen from './HelpScreen';
import HintOverlay from './HintOverlay';

export default function GameBoard() {
  const { 
    showIntro, 
    phase, 
    player, 
    opponent, 
    winner, 
    matchPlayerScore, 
    matchOpponentScore,
    matchWinner,
    message,
    settings,
    gameHistory,
    startNewMatch,
    startHand,
    showIntroScreen,
    continueToNextHand,
    updateSettings,
    resetMatch,
  } = useGameStore();

  // Overlay states
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Show intro screen
  if (showIntro) {
    return (
      <IntroScreen
        onNewGame={startNewMatch}
        onContinueGame={startHand}
        canContinue={matchPlayerScore > 0 || matchOpponentScore > 0}
        playerScore={matchPlayerScore}
        opponentScore={matchOpponentScore}
        settings={settings}
        gameHistory={gameHistory}
        onUpdateSettings={updateSettings}
        onResetMatch={resetMatch}
      />
    );
  }

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/58471.jpg')`,
        }}
      />
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Vignette effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Top Bar with buttons */}
        <TopBar 
          onHome={showIntroScreen}
          onSettings={() => setShowSettings(true)}
          onHint={() => setShowHint(true)}
          onHelp={() => setShowHelp(true)}
        />
        
        {/* Score Display */}
        <div className="flex justify-center py-2">
          <ScoreDisplay />
        </div>

        {/* Main Game Area */}
        <div className="flex-1 flex flex-col justify-between px-4 py-2 min-h-0 relative">
          {/* Opponent Area */}
          <div className="flex flex-col items-center">
            <div className="bg-black/30 backdrop-blur-sm rounded-xl px-6 py-3 border border-[#d4a843]/20">
              <OpponentCards />
              <div className="text-[#d4a843] text-sm mt-2 text-center flex items-center justify-center gap-2">
                <span className="text-[#d4a843]/60">♠</span>
                <span>Opponent</span>
                <span className="text-[#d4a843]/60">♠</span>
                {opponent?.hasFolded && <span className="text-red-400 ml-2">(Folded)</span>}
              </div>
            </div>
          </div>

          {/* Center Play Area */}
          <div className="flex-1 flex items-center justify-center">
            <CenterPlay />
          </div>

          {/* Player Area */}
          <div className="flex flex-col items-center">
            <div className="bg-black/30 backdrop-blur-sm rounded-xl px-6 py-3 border border-[#d4a843]/20">
              <div className="text-[#d4a843] text-sm mb-2 text-center flex items-center justify-center gap-2">
                <span className="text-[#d4a843]/60">♥</span>
                <span>You</span>
                <span className="text-[#d4a843]/60">♥</span>
                {player?.hasFolded && <span className="text-red-400 ml-2">(Folded)</span>}
              </div>
              <PlayerCards />
            </div>
          </div>

          {/* Round Result Overlay */}
          {phase === 'GAME_OVER' && (
            <RoundResult
              winner={winner}
              matchWinner={matchWinner}
              message={message}
              playerScore={matchPlayerScore}
              opponentScore={matchOpponentScore}
              onContinue={continueToNextHand}
            />
          )}
        </div>

        {/* Game Controls */}
        <div className="px-4 pb-4">
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-[#d4a843]/20">
            <GameControls />
          </div>
        </div>
      </div>

      {/* Overlay Screens */}
      <AnimatePresence>
        {showSettings && (
          <SettingsScreen
            onClose={() => setShowSettings(false)}
            settings={settings}
            onSave={updateSettings}
            onResetMatch={() => {
              resetMatch();
              setShowSettings(false);
            }}
          />
        )}
        {showHelp && (
          <HelpScreen onClose={() => setShowHelp(false)} />
        )}
        {showHint && (
          <HintOverlay onClose={() => setShowHint(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
