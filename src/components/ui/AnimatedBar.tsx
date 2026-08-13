'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/utils/tailwind';

interface AnimatedBarProps {
  value: number; // 0 to 100
  className?: string;
  style?: React.CSSProperties;
}

export function AnimatedBar({ value, className, style }: AnimatedBarProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // Trigger animation after initial render
    const timeout = setTimeout(() => {
      setWidth(value);
    }, 100);
    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <div
      className={cn('transition-all duration-1000 ease-out', className)}
      style={{ ...style, width: `${width}%` }}
    />
  );
}
