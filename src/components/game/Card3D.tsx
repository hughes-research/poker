'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Card } from '@/types';
import { getCardPath } from '@/lib/utils/cardUtils';

interface Card3DProps {
  card: Card | null;
  isFaceUp: boolean;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  onFlipComplete?: () => void;
}

export default function Card3D({
  card,
  isFaceUp,
  position,
  rotation = [0, 0, 0],
  scale = 1,
  onFlipComplete,
}: Card3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [flipProgress, setFlipProgress] = useState(isFaceUp ? 1 : 0);
  const [isFlipping, setIsFlipping] = useState(false);
  const targetFlip = isFaceUp ? 1 : 0;

  // Card dimensions (aspect ratio ~0.688:1)
  const cardWidth = 1.67;
  const cardHeight = 2.43;

  useEffect(() => {
    if (flipProgress !== targetFlip) {
      setIsFlipping(true);
    }
  }, [isFaceUp, flipProgress, targetFlip]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Animate flip with easing
      if (Math.abs(flipProgress - targetFlip) > 0.01) {
        const speed = 6; // Animation speed
        const newProgress = flipProgress + (targetFlip - flipProgress) * delta * speed;
        setFlipProgress(newProgress);
        
        // Update rotation based on flip progress with easing
        const rotationY = Math.PI * (1 - newProgress);
        meshRef.current.rotation.y = rotationY;
        
        // Add slight scale effect during flip
        const scaleEffect = 1 + Math.sin(rotationY) * 0.1;
        meshRef.current.scale.set(scale * scaleEffect, scale * scaleEffect, scale);
        
        if (Math.abs(newProgress - targetFlip) < 0.01) {
          setFlipProgress(targetFlip);
          setIsFlipping(false);
          if (onFlipComplete) {
            onFlipComplete();
          }
        }
      } else {
        meshRef.current.rotation.y = Math.PI * (1 - targetFlip);
        meshRef.current.scale.set(scale, scale, scale);
      }

      // Apply position and base rotation
      meshRef.current.position.set(...position);
      meshRef.current.rotation.x = rotation[0];
      meshRef.current.rotation.z = rotation[2];
    }
  });

  const cardPath = isFaceUp && card ? getCardPath(card) : getCardPath('back');
  const flipRotation = Math.PI * (1 - flipProgress);
  const isBackVisible = flipRotation < Math.PI / 2 || flipRotation > (3 * Math.PI) / 2;

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[cardWidth, cardHeight]} />
      <meshStandardMaterial
        color="#ffffff"
        side={THREE.DoubleSide}
        transparent
        opacity={isFlipping ? 0.9 : 1}
      />
      <Html
        position={[0, 0, 0.01]}
        transform
        occlude
        style={{
          width: `${cardWidth * 100}px`,
          height: `${cardHeight * 100}px`,
          transform: `rotateY(${flipRotation}rad)`,
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            transformStyle: 'preserve-3d',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              backfaceVisibility: 'hidden',
              transform: isBackVisible ? 'rotateY(0deg)' : 'rotateY(180deg)',
            }}
          >
            <img
              src={getCardPath('back')}
              alt="Card back"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                imageRendering: 'crisp-edges',
              }}
            />
          </div>
          {card && (
            <div
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                backfaceVisibility: 'hidden',
                transform: !isBackVisible ? 'rotateY(0deg)' : 'rotateY(180deg)',
              }}
            >
              <img
                src={getCardPath(card)}
                alt={`${card.rank} of ${card.suit}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  imageRendering: 'crisp-edges',
                }}
              />
            </div>
          )}
        </div>
      </Html>
    </mesh>
  );
}

