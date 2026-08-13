import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/utils/tailwind';

/** White card with a 52px header and an optional "View all →" link. */
export function SectionCard({
  title,
  legend,
  action,
  children,
  footer,
  className,
}: {
  title: string;
  legend?: React.ReactNode;
  action?: { label: string; href: string };
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden',
        className,
      )}
    >
      <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100 gap-4">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-[#9A9A9A]">{title}</h2>
          {legend && <div className="mt-0.5">{legend}</div>}
        </div>
        {action && (
          <Link
            href={action.href}
            className="text-sm font-medium text-[#6D28D9] flex items-center gap-1 hover:underline whitespace-nowrap"
          >
            {action.label} <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
      {children}
      {footer}
    </div>
  );
}
