'use client';

import Link from 'next/link';
import type { ActivityStatTile } from './types';

const accentStyles: Record<ActivityStatTile['accent'], { topBorder: string; iconBg: string; iconColor: string; valueColor: string }> = {
  sage: { topBorder: 'border-t-sage-200', iconBg: 'bg-leaf-50', iconColor: 'text-sage', valueColor: 'text-sage' },
  iris: { topBorder: 'border-t-[#d6b8f5]', iconBg: 'bg-iris-50', iconColor: 'text-iris', valueColor: 'text-iris' },
  gold: { topBorder: 'border-t-gold-250', iconBg: 'bg-gold-100', iconColor: 'text-gold', valueColor: 'text-gold' },
  neutral: { topBorder: 'border-t-[#d4d1ca]', iconBg: 'bg-surface-100', iconColor: 'text-muted', valueColor: 'text-ink' },
};

export default function ActivityStatCards({ tiles }: { tiles: ActivityStatTile[] }) {
  if (tiles.length === 0) return null;

  // Four tiles get their own row on wide screens; three or fewer share a 3-up grid.
  const wideColumns = tiles.length % 4 === 0 ? 'lg:grid-cols-4' : 'lg:grid-cols-3';

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${wideColumns} gap-3 sm:gap-4`}>
      {tiles.map((tile) => {
        const accent = accentStyles[tile.accent];

        const card = (
          <div
            className={`rounded-2xl p-4 sm:p-5 h-full flex flex-col relative overflow-hidden transition-all duration-200 ease-out hover:-translate-y-0.5 bg-white border border-line border-t-[3px] ${accent.topBorder} shadow-raised`}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-[12px] font-medium text-[#9A9A9A]">{tile.label}</p>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${accent.iconBg}`}>
                <span className="w-4 h-4 flex items-center justify-center">
                  <i className={`${tile.icon} text-[15px] ${accent.iconColor}`}></i>
                </span>
              </div>
            </div>
            <p className={`text-[22px] sm:text-[28px] font-bold leading-none tracking-tight mt-2 break-words ${accent.valueColor}`}>
              {tile.value}
            </p>
          </div>
        );

        if (tile.href) {
          return (
            <Link
              key={tile.label}
              href={tile.href}
              className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2"
            >
              {card}
            </Link>
          );
        }

        return <div key={tile.label}>{card}</div>;
      })}
    </div>
  );
}
