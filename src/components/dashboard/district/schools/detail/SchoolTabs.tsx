'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/tailwind';

/**
 * School profile tabs from DIV-101 (2226:8898).
 * 45px strip, 1px bottom rule, active tab in indigo with a 2px underline
 * spanning the full tab width. Label is "Administrator", singular.
 */
const TABS = [
  { label: 'Overview', segment: '' },
  { label: 'Surveys', segment: 'surveys' },
  { label: 'Reports', segment: 'reports' },
  { label: 'Administrator', segment: 'administrator' },
  { label: 'Activity', segment: 'activity' },
];

export function SchoolTabs({ schoolId }: { schoolId: string }) {
  const pathname = usePathname();
  const base = `/district/schools/${schoolId}`;

  return (
    <nav aria-label="School sections" className="border-b border-slate-200">
      <ul className="flex items-center overflow-x-auto">
        {TABS.map((tab) => {
          const href = tab.segment ? `${base}/${tab.segment}` : base;
          const isActive = pathname === href;
          return (
            <li key={tab.label} className="relative">
              <Link
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex h-[45px] items-center justify-center whitespace-nowrap px-4 text-sm font-semibold transition-colors',
                  isActive ? 'text-iris' : 'text-slate-500 hover:text-slate-700',
                )}
              >
                {tab.label}
              </Link>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-iris" />
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
