'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      sessionStorage.setItem('lastActivePath', pathname);
    }
  }, [pathname]);

  return (
    <div className="flex h-full max-h-full w-full overflow-hidden">
      <Sidebar />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header />

        {/* Dynamic Page Rendering */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5 lg:p-6 bg-canvas">
          {children}
        </main>
      </div>
    </div>
  );
}
