'use client';
import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/tailwind';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, children, className }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 modal-backdrop transition-opacity" 
        onClick={onClose} 
      />
      <div 
        className={cn("bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain relative z-10 animate-in fade-in zoom-in-95 duration-200", className)}
      >
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  );
}
