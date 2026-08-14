'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LEGAL_PAGES = [
  { href: '/platform-terms', label: 'Platform Terms' },
  { href: '/privacy-notice', label: 'Privacy Notice' },
];

/** The page you are on reads as plain text; the other one stays a link. */
export function LegalNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-4 sm:gap-6">
      {LEGAL_PAGES.map((page) => {
        const isCurrent = pathname === page.href;
        return isCurrent ? (
          <span key={page.href} aria-current="page" className="text-[12px] font-semibold text-[#2b2b2b] sm:text-[13px]">
            {page.label}
          </span>
        ) : (
          <Link
            key={page.href}
            href={page.href}
            className="rounded text-[12px] font-medium text-iris transition-opacity hover:opacity-70 focus:outline-none focus-visible:underline sm:text-[13px]"
          >
            {page.label}
          </Link>
        );
      })}
    </nav>
  );
}
