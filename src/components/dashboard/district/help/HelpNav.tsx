'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/tailwind';

const LINKS = [
  { label: 'Getting started', href: '/district/help/getting-started' },
  { label: 'Managing schools', href: '/district/help/managing-schools' },
  { label: 'My requests', href: '/district/help/my-requests' },
  { label: 'Contact support', href: '/district/help/contact' },
];

/** Side rail inside Help. Collapses to a scrollable strip below lg. */
export function HelpNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Help sections">
      <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:gap-0.5">
        {LINKS.map((link) => {
          const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'block whitespace-nowrap rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700',
                )}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
