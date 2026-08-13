'use client';

import Link from 'next/link';

export default function ReadOnlyNotice() {
  return (
    <div className="rounded-2xl p-4 sm:p-6 text-center mb-5 sm:mb-6 bg-brick-50 border border-[#f0baba]">
      <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 bg-[#fbe5e5]">
        <span className="w-6 h-6 flex items-center justify-center text-brick">
          <i className="ri-lock-line text-2xl"></i>
        </span>
      </div>
      <h3 className="text-[16px] font-semibold mb-1 text-[#9b1c1c]">
        Read-only mode
      </h3>
      <p className="text-[14px] mb-3 text-[#9b1c1c]">
        Your access is currently read-only — you can't start new surveys right now.
      </p>
      <Link
        href="/school/subscription"
        className="inline-flex items-center gap-1.5 rounded-full h-10 px-5 text-[14px] font-semibold whitespace-nowrap transition-all duration-150 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brick focus-visible:ring-offset-2 bg-brick text-white"
      >
        View subscription
      </Link>
    </div>
  );
}