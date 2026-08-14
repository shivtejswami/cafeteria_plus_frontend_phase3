import type { ReactNode } from 'react';

import { BrandLockup, FeatureList } from '@/app/(auth)/components/shell/BrandPanel';
import {
  PanelTexture,
  ShellPatternDefs,
  ShowcaseTiles,
} from '@/app/(auth)/components/shell/ShowcaseTiles';

/**
 * The only auth shell. Every screen under /auth renders as the card contents,
 * so no page should wrap itself in a layout again.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  const year = new Date().getFullYear();

  return (
    <div className="flex h-full min-h-0 font-sans text-[#2b2b2b]">
      <ShellPatternDefs />

      {/* Left panel — presentational, no focusable elements */}
      <aside className="hidden lg:flex lg:w-1/2 flex-shrink-0 flex-col relative overflow-hidden bg-white border-r border-[#e8e6e1]">
        <PanelTexture />

        <div className="relative z-10 flex flex-col h-full px-8 lg:px-12">
          <div className="pt-8 shrink-0">
            <BrandLockup />
          </div>

          <div className="flex-1 flex flex-col justify-center py-6">
            <ShowcaseTiles />
          </div>

          <div className="shrink-0 pb-8">
            <FeatureList />
            <p className="text-xs text-[#9a9a9a] text-center mt-8">Student voice. Real insight. Better meals.</p>
          </div>
        </div>
      </aside>

      {/* Right panel — the active screen */}
      {/*
        Scrolls here rather than on the page: the root body is overflow-hidden.
        The id lets multi-step screens reset it to the top when the step changes.
      */}
      <main
        id="auth-scroll"
        className="flex-1 min-w-0 flex flex-col overflow-y-auto px-4 sm:px-6 py-8 sm:py-12 bg-[#faf9f6]"
      >
        {/* my-auto centres the column but still lets tall screens scroll to the top. */}
        <div className="my-auto w-full flex flex-col items-center">
          {/* Mobile & Tablet Logo */}
          <div className="lg:hidden mb-5 sm:mb-6 flex justify-center">
            <BrandLockup />
          </div>

          <div className="w-full max-w-[420px] p-5 sm:p-8 bg-white rounded-2xl border border-[#e8e6e1] shadow-[0_12px_32px_rgba(0,0,0,0.12)]">
            {children}
          </div>

          <p className="text-[11px] sm:text-xs mt-4 sm:mt-6 text-center text-[#9a9a9a]">
            ©  {year}  School Food &amp; Wellness Group
          </p>
        </div>
      </main>
    </div>
  );
}
