import type { ReactNode } from 'react';

/**
 * The document itself never scrolls (see the root layout), so the survey needs
 * its own scroll container — its screens are `min-h-screen` and routinely run
 * taller than the viewport on phones.
 */
export default function SurveyLayout({ children }: { children: ReactNode }) {
  return <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">{children}</div>;
}
