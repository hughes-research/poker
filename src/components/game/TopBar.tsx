'use client';

interface TopBarProps {
  onHome?: () => void;
  onSettings?: () => void;
  onHint?: () => void;
  onHelp?: () => void;
}

export default function TopBar({ onHome, onSettings, onHint, onHelp }: TopBarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      {/* Left buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onHome}
          className="w-11 h-11 bg-black/40 backdrop-blur-sm border border-[#d4a843]/50 rounded-xl flex items-center justify-center hover:bg-black/60 hover:border-[#d4a843] transition-all shadow-lg"
        >
          <svg className="w-5 h-5 text-[#d4a843]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
        <button
          onClick={onSettings}
          className="w-11 h-11 bg-black/40 backdrop-blur-sm border border-[#d4a843]/50 rounded-xl flex items-center justify-center hover:bg-black/60 hover:border-[#d4a843] transition-all shadow-lg"
        >
          <svg className="w-5 h-5 text-[#d4a843]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* Right buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onHint}
          className="w-11 h-11 bg-black/40 backdrop-blur-sm border border-[#d4a843]/50 rounded-xl flex items-center justify-center hover:bg-black/60 hover:border-[#d4a843] transition-all shadow-lg"
        >
          <svg className="w-5 h-5 text-[#d4a843]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/>
          </svg>
        </button>
        <button
          onClick={onHelp}
          className="w-11 h-11 bg-black/40 backdrop-blur-sm border border-[#d4a843]/50 rounded-xl flex items-center justify-center hover:bg-black/60 hover:border-[#d4a843] transition-all shadow-lg"
        >
          <span className="text-[#d4a843] font-bold text-lg">?</span>
        </button>
      </div>
    </div>
  );
}
