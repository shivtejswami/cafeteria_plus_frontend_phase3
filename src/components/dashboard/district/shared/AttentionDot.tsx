import React from 'react';
import { cn } from '@/utils/tailwind';

/** Amber "requires attention" marker used in list rows and legends. */
export function AttentionDot({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="Requires attention"
      className={cn('inline-block w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0', className)}
    />
  );
}
