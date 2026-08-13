import type { ReactNode } from 'react';

/** Same reason as the survey layout: the document itself never scrolls. */
export default function StudentLayout({ children }: { children: ReactNode }) {
  return <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">{children}</div>;
}
