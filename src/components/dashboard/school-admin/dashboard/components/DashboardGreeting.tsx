'use client';

import Link from 'next/link';

interface DashboardGreetingProps {
  adminName: string;
  schoolName: string;
  todayDate: string;
  disabled?: boolean;
}

export default function DashboardGreeting({ adminName, schoolName, todayDate, disabled }: DashboardGreetingProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
      <div className="min-w-0">
        <h1 className="text-base sm:text-lg font-bold leading-tight text-ink ">
          Welcome back, {adminName.split(' ')[0]}
        </h1>
        <p className="text-xs mt-1 text-muted">
          {schoolName} &middot; {todayDate}
        </p>
      </div>
      <Link
        href={disabled ? '#' : '/school/surveys/create'}
        className={`inline-flex w-full sm:w-auto shrink-0 items-center justify-center gap-2 rounded-full h-11 px-5 text-[14px] font-semibold whitespace-nowrap transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-90'} bg-sage text-white`}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onClick={(e) => { if (disabled) e.preventDefault(); }}
        title={disabled ? 'Creating surveys is not available in read-only mode' : undefined}
      >
        <span className="w-4 h-4 flex items-center justify-center">
          <i className="ri-add-line"></i>
        </span>
        Create survey
      </Link>
    </div>
  );
}