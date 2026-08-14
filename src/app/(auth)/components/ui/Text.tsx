import Link from 'next/link';
import type { ReactNode } from 'react';

import { SUPPORT_EMAIL } from '@/app/(auth)/constants';

interface PageHeadingProps {
  title: string;
  children?: ReactNode;
  align?: 'left' | 'center';
}

export function PageHeading({ title, children, align = 'left' }: PageHeadingProps) {
  const centered = align === 'center';

  return (
    <>
      <h2 className={`text-xl sm:text-3xl font-semibold leading-snug sm:leading-tight text-[#2b2b2b] ${centered ? 'mb-2 text-center' : 'mb-1'}`}>{title}</h2>
      {children && (
        <p className={`text-[13px] sm:text-sm text-[#6d6d6d] mb-5 sm:mb-6 ${centered ? 'text-center leading-relaxed' : ''}`}>
          {children}
        </p>
      )}
    </>
  );
}

interface BackLinkProps {
  href: string;
  children: ReactNode;
}

export function BackLink({ href, children }: BackLinkProps) {
  return (
    <Link href={href} className="inline-flex items-center gap-1.5 text-xs font-medium mb-5 sm:mb-6 text-[#6d28d9] transition-colors duration-150 hover:opacity-80 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6d28d9] focus-visible:ring-offset-2">
      <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.55475 9.41691H12.6572V10.5836H5.55475L8.69196 13.7102L7.86392 14.5386L3.32721 10.0002L7.86392 5.46191L8.69196 6.29024L5.55475 9.41691Z" fill="#6D28D9"/>
      </svg>
      {children}
    </Link>
  );
}

interface StepBadgeProps {
  current: number;
  total: number;
}

export function StepBadge({ current, total }: StepBadgeProps) {
  return (
    <div className="flex items-center gap-2 mb-4 sm:mb-5">
      <span className="text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-full bg-[#f0eafb] text-[#6d28d9]">
        Step {current} of {total}
      </span>
    </div>
  );
}

interface SupportNoteProps {
  /** Sentence tail after the support address, e.g. "to restore access." */
  action: string;
  className?: string;
}

export function SupportNote({ action, className = 'mb-6' }: SupportNoteProps) {
  return (
    <div className={`p-3 sm:p-3.5 rounded-xl text-center bg-[#f5f0fa] border border-[#e0d5f0] text-[#4a3a5e] ${className}`}>
      <p className="text-[11px] sm:text-xs leading-relaxed">
        Contact SFWG at <span className="font-medium text-[#6d28d9] break-all">{SUPPORT_EMAIL}</span> {action}
      </p>
    </div>
  );
}
