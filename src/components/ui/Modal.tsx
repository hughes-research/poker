'use client';

import { ReactNode } from 'react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  showCloseButton?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
      onClick={onClose}
    >
      <div
        className="bg-poker-felt-dark border-2 border-poker-gold rounded-lg shadow-2xl max-w-md w-full mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 className="text-2xl font-bold mb-4 text-poker-gold">{title}</h2>
        )}
        <div className="mb-4 text-poker-gold-light">{children}</div>
        {showCloseButton && (
          <div className="flex justify-end">
            <Button onClick={onClose} variant="primary">
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

