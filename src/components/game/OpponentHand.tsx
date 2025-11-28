'use client';

import { useGameStore } from '@/store/gameStore';
import Card3D from './Card3D';
import { gridToIsometric } from '@/lib/utils/isometric';

export default function OpponentHand() {
  const { opponent } = useGameStore();

  if (!opponent || !opponent.hand || opponent.hand.length === 0) {
    return null;
  }

  const cardSpacing = 1.5;
  const startCol = -(opponent.hand.length - 1) / 2;
  const rowOffset = 3; // Position opponent cards further away

  return (
    <group>
      {opponent.hand.map((card, index) => {
        const { x, y, z } = gridToIsometric(startCol + index, rowOffset, cardSpacing);
        const isFaceUp = opponent.cardsFaceUp[index] ?? false;

        return (
          <Card3D
            key={`opponent-card-${index}`}
            card={card}
            isFaceUp={isFaceUp}
            position={[x, y, z]}
            rotation={[0, 0, 0]}
            scale={0.8}
          />
        );
      })}
    </group>
  );
}

