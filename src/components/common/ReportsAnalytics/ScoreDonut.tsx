import React, { useState, useEffect } from 'react';
import { cn } from '@/utils/tailwind';
import type { ScoreBand } from '@/constants/districtData';

const BAND_STROKE: Record<ScoreBand, string> = {
  positive: '#4E9A51',
  moderate: '#E0A93B',
  attention: '#DC2626',
};

const BAND_TEXT: Record<ScoreBand, string> = {
  positive: 'text-[#4E9A51]',
  moderate: 'text-[#B07D28]',
  attention: 'text-red-600',
};

/**
 * Concept score ring from the district roll-up: 84px ring, 8px stroke, the arc
 * sweeps to the score and the number sits in the middle in the band colour.
 */
export function ScoreDonut({
  value,
  band,
  label,
  size = 84,
  stroke = 8,
}: {
  value: number;
  band: ScoreBand;
  label: string;
  size?: number;
  stroke?: number;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const finalOffset = circumference * (1 - value / 100);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const offset = isMounted ? finalOffset : circumference;

  return (
    // The svg sets the box, so the wrapper needs no explicit dimensions.
    <div className="relative shrink-0" role="img" aria-label={`${label}: ${value} out of 100`}>
      <svg width={size} height={size} className="block -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#F1EFEA" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={BAND_STROKE[band]}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <span
        className={cn(
          'absolute inset-0 flex items-center justify-center text-[22px] font-bold',
          BAND_TEXT[band],
        )}
      >
        {value}
      </span>
    </div>
  );
}
