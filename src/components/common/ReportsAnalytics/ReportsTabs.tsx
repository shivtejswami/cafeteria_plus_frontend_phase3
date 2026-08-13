'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/tailwind';

const TABS = [
  { label: 'District roll-up', href: '/district/reports-analytics' },
  { label: 'School comparison', href: '/district/reports-analytics/school-comparison' },
  { label: 'Survey-to-survey', href: '/district/reports-analytics/survey-to-survey' },
  { label: 'District benchmarks', href: '/district/reports-analytics/district-benchmarks' },
];

export function ReportsTabs() {
  const pathname = usePathname();

  return (
    <nav aria-label="Report views">
      <ul className="flex items-center gap-6 overflow-x-auto border-b border-slate-200">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'relative -mb-px block whitespace-nowrap px-0 py-3 text-[13px] font-medium transition-colors',
                  isActive
                    ? 'text-[#5B2DA3]'
                    : 'text-slate-500 hover:text-slate-700',
                )}
              >
                {tab.label}
                {isActive && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#5B2DA3]" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
