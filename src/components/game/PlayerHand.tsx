'use client';

import { useGameStore } from '@/store/gameStore';
import Card3D from './Card3D';
import { gridToIsometric } from '@/lib/utils/isometric';

export default function PlayerHand() {
  const { player } = useGameStore();

  if (!player || !player.hand || player.hand.length === 0) {
    return null;
  }

  const cardSpacing = 1.5;
  const startCol = -(player.hand.length - 1) / 2;

  return (
    <group>
      {player.hand.map((card, index) => {
        const { x, y, z } = gridToIsometric(startCol + index, 0, cardSpacing);
        const isFaceUp = player.cardsFaceUp[index] ?? false;

        return (
          <Card3D
            key={`player-card-${index}`}
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


