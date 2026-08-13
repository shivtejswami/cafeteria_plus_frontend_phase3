'use client';

import Link from 'next/link';
import EmptyStateToggle from '@/components/ui/EmptyStateToggle';

interface GlanceTile {
  label: string;
  value: string;
  sub?: string;
  href?: string;
  isEmpty?: boolean;
  emptyLabel?: string;
}

const tileConfig = [
  { key: 'live', icon: 'ri-play-circle-line', iconBg: '#f0eafb', iconColor: '#6d28d9', topBorder: 'border-t-[#d6b8f5]' },
  { key: 'closing', icon: 'ri-time-line', iconBg: '#ffecd1', iconColor: '#d97706', topBorder: 'border-t-gold-250' },
  { key: 'latest', icon: 'ri-file-chart-line', iconBg: '#e3f5e3', iconColor: '#586d4d', topBorder: 'border-t-sage-200' },
  { key: 'scheduled', icon: 'ri-calendar-line', iconBg: '#f1efea', iconColor: '#6d6d6d', topBorder: 'border-t-[#d4d1ca]' },
];

export default function AtAGlanceStrip({ tiles }: { tiles: GlanceTile[] }) {
  const allEmpty = tiles.every(t => t.isEmpty);

  return (
    <EmptyStateToggle
      isEmpty={allEmpty}
      emptyIcon="ri-eye-line"
      emptyTitle="No data at a glance"
      emptyDescription="Key metrics will appear here once you have live surveys, upcoming schedules, or completed reports."
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {tiles.map((tile, idx) => {
          const config = tileConfig[idx] || tileConfig[3];

          const content = (
            <div
              className="rounded-2xl p-4 sm:p-5 h-full flex flex-col relative overflow-hidden transition-all duration-200 ease-out hover:-translate-y-0.5 bg-white border border-t-[3px] border-[#E8E6E1] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04),0px_6px_20px_0px_rgba(0,0,0,0.05)]"
            >
              <div className="flex items-start justify-between">
                <p
                  className="text-[11px] font-semibold uppercase tracking-wider text-[#9A9A9A]"
                >
                  {tile.label}
                </p>
                {/* Tile Icon SVGs */}
                {idx === 0 && (
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 ml-2">
                    <path d="M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z" fill="#E3F5E3" />
                    <path d="M15.3672 12.875H16.6172V19.125H15.3672V12.875ZM17.8672 15.375H19.1172V19.125H17.8672V15.375ZM12.8672 16.625H14.1172V19.125H12.8672V16.625ZM17.8672 11H11.6172V21H20.3672V13.5H17.8672V11ZM10.3672 10.375C10.3672 10.2 10.4276 10.0521 10.5484 9.93125C10.6693 9.81042 10.8172 9.75 10.9922 9.75H18.4922L21.6172 12.875V21.625C21.6172 21.7917 21.5568 21.9375 21.4359 22.0625C21.3151 22.1875 21.1672 22.25 20.9922 22.25H10.9922C10.8172 22.25 10.6693 22.1896 10.5484 22.0687C10.4276 21.9479 10.3672 21.8 10.3672 21.625V10.375Z" fill="#586D4D" />
                  </svg>
                )}
                {idx === 1 && (
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 ml-2">
                    <path d="M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z" fill="#F1EFEA" />
                    <path d="M14.1172 9.75V11H17.8672V9.75H19.1172V11H21.6172C21.7922 11 21.9401 11.0604 22.0609 11.1812C22.1818 11.3021 22.2422 11.45 22.2422 11.625V21.625C22.2422 21.8 22.1818 21.9479 22.0609 22.0687C21.9401 22.1896 21.7922 22.25 21.6172 22.25H10.3672C10.1922 22.25 10.0443 22.1896 9.92344 22.0687C9.8026 21.9479 9.74219 21.8 9.74219 21.625V11.625C9.74219 11.45 9.8026 11.3021 9.92344 11.1812C10.0443 11.0604 10.1922 11 10.3672 11H12.8672V9.75H14.1172ZM20.9922 16H10.9922V21H20.9922V16ZM12.8672 12.25H10.9922V14.75H20.9922V12.25H19.1172V13.5H17.8672V12.25H14.1172V13.5H12.8672V12.25Z" fill="#6D6D6D" />
                  </svg>
                )}
                {idx === 2 && (
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 ml-2">
                    <path d="M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z" fill="#F0EAFB" />
                    <path d="M15.36 12.6665H16.64V19.3332H15.36V12.6665ZM17.92 15.3332H19.2V19.3332H17.92V15.3332ZM12.8 16.6665H14.08V19.3332H12.8V16.6665ZM17.92 10.6665H11.52V21.3332H20.48V13.3332H17.92V10.6665ZM10.24 9.99984C10.24 9.81317 10.3019 9.65539 10.4256 9.5265C10.5493 9.39762 10.7008 9.33317 10.88 9.33317H18.56L21.76 12.6665V21.9998C21.76 22.1776 21.6981 22.3332 21.5744 22.4665C21.4507 22.5998 21.2992 22.6665 21.12 22.6665H10.88C10.7008 22.6665 10.5493 22.6021 10.4256 22.4732C10.3019 22.3443 10.24 22.1865 10.24 21.9998V9.99984Z" fill="#6D28D9" />
                  </svg>
                )}
                {idx === 3 && (
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 ml-2">
                    <path d="M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z" fill="#FFECD1" />
                    <path d="M12.8 10.6665V9.33317H19.2V10.6665H21.12C21.2992 10.6665 21.4507 10.7309 21.5744 10.8598C21.6981 10.9887 21.76 11.1465 21.76 11.3332V21.9998C21.76 22.1865 21.6981 22.3443 21.5744 22.4732C21.4507 22.6021 21.2992 22.6665 21.12 22.6665H10.88C10.7008 22.6665 10.5493 22.6021 10.4256 22.4732C10.3019 22.3443 10.24 22.1865 10.24 21.9998V11.3332C10.24 11.1465 10.3019 10.9887 10.4256 10.8598C10.5493 10.7309 10.7008 10.6665 10.88 10.6665H12.8ZM12.8 11.9998H11.52V21.3332H20.48V11.9998H19.2V13.3332H12.8V11.9998ZM14.08 10.6665V11.9998H17.92V10.6665H14.08Z" fill="#D97706" />
                  </svg>
                )}
              </div>
              <div className="mt-2">
                {tile.isEmpty ? (
                  <p className="text-[17px] sm:text-[22px] font-bold leading-tight break-words text-subtle">
                    {tile.emptyLabel || '\u2014'}
                  </p>
                ) : (
                  <p className="text-[17px] sm:text-[22px] font-bold leading-tight break-words text-ink">
                    {tile.value}
                  </p>
                )}
              </div>
              {tile.sub && !tile.isEmpty && (
                <p className="text-[12px] mt-2 text-[#9A9A9A]">
                  {tile.sub}
                </p>
              )}
            </div>
          );

          if (tile.href && !tile.isEmpty) {
            return (
              <Link key={idx} href={tile.href} className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 rounded-2xl">
                {content}
              </Link>
            );
          }

          return <div key={idx}>{content}</div>;
        })}
      </div>
    </EmptyStateToggle>
  );
}