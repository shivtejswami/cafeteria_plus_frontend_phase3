'use client';

import Link from 'next/link';

export default function QuickLinks() {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1">
      <Link
        href="/school/reports/year-over-year"
        className="inline-flex w-full sm:w-auto justify-center sm:justify-start items-center gap-2 rounded-full px-3.5 sm:px-4 py-2.5 text-[13px] sm:text-[14px] font-medium text-left whitespace-normal sm:whitespace-nowrap bg-[#F2F5F0] border border-[#D6E0D2] text-[#586D4D] focus:outline-none hover:bg-[#e6ebe3] transition-colors"
      >
        <svg width="16" height="21" viewBox="0 0 16 21" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-5 flex-shrink-0">
          <path d="M3.7004 5.25V14.5833H13.0304V15.75H2.53415V5.25H3.7004ZM12.6222 7.175L13.4502 7.99167L10.1148 11.3283L8.3654 9.57833L5.86962 12.075L5.04159 11.2583L8.3654 7.92167L10.1148 9.67167L12.6222 7.175Z" fill="#586D4D"/>
        </svg>
        <span>Year-over-year comparison</span>
      </Link>

      <Link
        href="/school/reports/benchmarks"
        className="inline-flex w-full sm:w-auto justify-center sm:justify-start items-center gap-2 rounded-full px-3.5 sm:px-4 py-2.5 text-[13px] sm:text-[14px] font-medium text-left whitespace-normal sm:whitespace-nowrap bg-[#F2F5F0] border border-[#D6E0D2] text-[#586D4D] focus:outline-none hover:bg-[#e6ebe3] transition-colors"
      >
        <svg width="16" height="21" viewBox="0 0 16 21" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-5 flex-shrink-0">
          <path d="M2.16095 11.0833H5.6597V15.75H2.16095V11.0833ZM10.3247 8.16667H13.8235V15.75H10.3247V8.16667ZM6.24282 5.25H9.74157V15.75H6.24282V5.25ZM3.3272 12.25V14.5833H4.49345V12.25H3.3272ZM7.40907 6.41667V14.5833H8.57532V6.41667H7.40907ZM11.4909 9.33333V14.5833H12.6572V9.33333H11.4909Z" fill="#586D4D"/>
        </svg>
        <span>View benchmarks</span>
      </Link>
    </div>
  );
}