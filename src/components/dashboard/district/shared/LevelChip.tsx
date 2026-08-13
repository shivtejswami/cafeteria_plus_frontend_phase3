import React from 'react';
import { cn } from '@/utils/tailwind';
import { LEVEL_CHIP, type SchoolLevel } from '@/constants/districtData';

/** Elementary / Middle / High chip used across the district screens. */
export function LevelChip({ level, className }: { level: SchoolLevel; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium w-fit',
        LEVEL_CHIP[level],
        className,
      )}
    >
      {level}
    </span>
  );
}
