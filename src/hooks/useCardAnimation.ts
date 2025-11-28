import { useState, useEffect } from 'react';

interface UseCardAnimationProps {
  isFaceUp: boolean;
  duration?: number;
}

export function useCardAnimation({ isFaceUp, duration = 0.6 }: UseCardAnimationProps) {
  const [animationProgress, setAnimationProgress] = useState(isFaceUp ? 1 : 0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (animationProgress !== (isFaceUp ? 1 : 0)) {
      setIsAnimating(true);
      const startTime = Date.now();
      const startProgress = animationProgress;
      const targetProgress = isFaceUp ? 1 : 0;

      const animate = () => {
        const elapsed = (Date.now() - startTime) / 1000;
        const progress = Math.min(elapsed / duration, 1);
        const currentProgress = startProgress + (targetProgress - startProgress) * progress;
        setAnimationProgress(currentProgress);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isFaceUp, duration, animationProgress]);

  return {
    animationProgress,
    isAnimating,
  };
}

