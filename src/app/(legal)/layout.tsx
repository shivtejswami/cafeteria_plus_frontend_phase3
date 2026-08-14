import type { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { LegalNav } from '@/app/(legal)/components/LegalNav';

/**
 * Public shell for the Platform Terms and Privacy Notice. These are read before
 * sign-in, so they carry their own top bar rather than the auth card or the
 * dashboard chrome. The root `body` is `overflow-hidden`, so the document
 * scrolls inside this layout rather than on the page.
 */
export default function LegalLayout({ children }: { children: ReactNode }) {
  const year = new Date().getFullYear();

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#faf9f6] font-sans text-[#2b2b2b]">
      <header className="shrink-0 border-b border-[#e8e6e1] bg-white">
        <div className="mx-auto flex h-14 w-full max-w-[1180px] items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
          <Link href="/login" className="shrink-0 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2">
            <Image
              src="/logowhite.svg"
              alt="Cafeteria Pulse"
              width={160}
              height={32}
              priority
              className="h-6 w-auto object-contain sm:h-7"
            />
          </Link>
          <LegalNav />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <main className="px-4 py-6 sm:px-6 sm:py-10">{children}</main>

        <footer className="border-t border-[#e8e6e1] bg-white">
          <div className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6">
            <p className="text-[12px] text-[#9a9a9a]">© {year} School Food &amp; Wellness Group</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
