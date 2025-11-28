'use client';

import { useGameStore } from '@/store/gameStore';
import Card2D from './Card2D';

export default function OpponentCards() {
  const { opponent, phase } = useGameStore();

  if (!opponent || !opponent.hand || opponent.hand.length === 0) {
    return null;
  }

  const cards = opponent.hand;
  const isShowdown = phase === 'SHOWDOWN' || phase === 'GAME_OVER';

  return (
    <div className="relative flex items-start justify-center" style={{ height: 100 }}>
      {cards.map((card, index) => {
        // Only show opponent's cards during showdown
        const isFaceUp = isShowdown;
        
        return (
          <Card2D
            key={`opponent-card-${index}`}
            card={card}
            isFaceUp={isFaceUp}
            rotation={0}
            scale={0.75}
            zIndex={index}
            style={{
              marginLeft: index === 0 ? 0 : -20,
            }}
          />
        );
      })}
    </div>
  );
}

