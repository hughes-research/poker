'use client';

interface ChipProps {
  amount: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Chip({ amount, size = 'md', className = '' }: ChipProps) {
  const sizeStyles = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
  };

  // Determine chip color based on amount
  const getChipColor = (amount: number) => {
    if (amount >= 100) return 'bg-red-600 border-red-800 text-white';
    if (amount >= 50) return 'bg-poker-gold border-poker-gold-dark text-poker-felt-dark';
    if (amount >= 25) return 'bg-blue-600 border-blue-800 text-white';
    if (amount >= 10) return 'bg-poker-gold-light border-poker-gold text-poker-felt-dark';
    return 'bg-white border-poker-gold text-poker-felt-dark';
  };

  return (
    <div
      className={`${sizeStyles[size]} ${getChipColor(amount)} rounded-full border-2 flex items-center justify-center text-white font-bold shadow-lg ${className}`}
    >
      {amount}
    </div>
  );
}

