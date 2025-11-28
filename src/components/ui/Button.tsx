'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 border-2';
  
  const variantStyles = {
    primary: 'bg-poker-felt border-poker-gold text-poker-gold hover:bg-poker-felt-dark hover:border-poker-gold-light focus:ring-poker-gold',
    secondary: 'bg-poker-felt-dark border-poker-gold text-poker-gold hover:bg-poker-felt hover:border-poker-gold-light focus:ring-poker-gold',
    danger: 'bg-poker-felt border-red-500 text-red-400 hover:bg-poker-felt-dark hover:border-red-400 focus:ring-red-500',
    success: 'bg-poker-gold border-poker-gold-dark text-poker-felt-dark hover:bg-poker-gold-light focus:ring-poker-gold',
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  const disabledStyles = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer hover:scale-105 active:scale-95';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

