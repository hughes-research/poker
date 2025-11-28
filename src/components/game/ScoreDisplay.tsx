'use client';

import { useGameStore } from '@/store/gameStore';

export default function ScoreDisplay() {
  const { matchPlayerScore, matchOpponentScore, bettingRound, targetScore } = useGameStore();

  return (
    <div className="flex items-center justify-center">
      <div className="bg-black/40 backdrop-blur-sm border border-[#d4a843]/50 rounded-xl px-6 py-3 flex items-center gap-6 shadow-lg">
        <div className="text-center min-w-[60px]">
          <div className="text-[10px] text-[#d4a843]/60 uppercase tracking-wider">You</div>
          <div className="text-2xl font-bold text-[#d4a843]">{matchPlayerScore}</div>
        </div>
        <div className="h-10 w-px bg-[#d4a843]/30"></div>
        <div className="text-center min-w-[60px]">
          <div className="text-[10px] text-[#d4a843]/60 uppercase tracking-wider">Them</div>
          <div className="text-2xl font-bold text-[#d4a843]">{matchOpponentScore}</div>
        </div>
        {bettingRound && (
          <>
            <div className="h-10 w-px bg-[#d4a843]/30"></div>
            <div className="text-center min-w-[40px]">
              <div className="text-2xl font-bold text-[#d4a843]">R{bettingRound.round}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
