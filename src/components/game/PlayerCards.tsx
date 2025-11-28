'use client';

import { useGameStore } from '@/store/gameStore';
import Card2D from './Card2D';

export default function PlayerCards() {
  const { player, phase, selectedCards, toggleCardSelection } = useGameStore();

  if (!player || !player.hand || player.hand.length === 0) {
    return null;
  }

  const cards = player.hand;
  const cardCount = cards.length;
  const fanAngle = 8;
  const totalAngle = (cardCount - 1) * fanAngle;
  const startAngle = -totalAngle / 2;
  const isDrawPhase = phase === 'DRAWING';

  return (
    <div className="relative flex items-end justify-center" style={{ height: 160 }}>
      {cards.map((card, index) => {
        const rotation = startAngle + index * fanAngle;
        const isFaceUp = player.cardsFaceUp[index] ?? true;
        const isSelected = selectedCards.includes(index);
        
        return (
          <Card2D
            key={`player-card-${index}`}
            card={card}
            isFaceUp={isFaceUp}
            rotation={rotation}
            scale={1.1}
            zIndex={index}
            isSelected={isSelected}
            onClick={isDrawPhase ? () => toggleCardSelection(index) : undefined}
            style={{
              marginLeft: index === 0 ? 0 : -25,
              transformOrigin: 'center bottom',
              cursor: isDrawPhase ? 'pointer' : 'default',
            }}
          />
        );
      })}
    </div>
  );
}
