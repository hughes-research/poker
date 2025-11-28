'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card } from '@/types';
import { getCardPath } from '@/lib/utils/cardUtils';

interface Card2DProps {
  card: Card | null;
  isFaceUp: boolean;
  rotation?: number;
  scale?: number;
  zIndex?: number;
  onClick?: () => void;
  isSelected?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function Card2D({
  card,
  isFaceUp,
  rotation = 0,
  scale = 1,
  zIndex = 0,
  onClick,
  isSelected = false,
  className = '',
  style = {},
}: Card2DProps) {
  const [isFlipped, setIsFlipped] = useState(!isFaceUp);

  useEffect(() => {
    setIsFlipped(!isFaceUp);
  }, [isFaceUp]);

  const cardPath = isFaceUp && card ? getCardPath(card) : getCardPath('back');

  return (
    <motion.div
      className={`relative cursor-pointer ${className}`}
      style={{
        width: 80 * scale,
        height: 116 * scale,
        zIndex,
        transformOrigin: 'center bottom',
        ...style,
      }}
      initial={{ rotateY: isFlipped ? 180 : 0 }}
      animate={{
        rotateY: isFlipped ? 180 : 0,
        rotate: rotation,
        y: isSelected ? -20 : 0,
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={onClick}
      whileHover={{ y: isSelected ? -20 : -10 }}
    >
      <div
        className="absolute inset-0 rounded-lg shadow-lg overflow-hidden"
        style={{
          backfaceVisibility: 'hidden',
          transform: 'rotateY(0deg)',
        }}
      >
        <Image
          src={cardPath}
          alt={card ? `${card.rank} of ${card.suit}` : 'Card back'}
          width={80}
          height={116}
          className="w-full h-full object-contain bg-white rounded-lg"
          draggable={false}
          unoptimized
        />
      </div>
    </motion.div>
  );
}


