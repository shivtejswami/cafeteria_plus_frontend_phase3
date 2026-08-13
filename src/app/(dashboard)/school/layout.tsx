'use client';

import { ReadOnlyModeProvider } from '@/components/dashboard/school-admin/common/ReadOnlyModeContext';
import ReadOnlyModeBar from '@/components/dashboard/school-admin/shell/ReadOnlyModeBar';
import { ToastProvider } from '@/components/ToastContext';

export default function SchoolAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ReadOnlyModeProvider>
        <ReadOnlyModeBar />
        {children}
      </ReadOnlyModeProvider>
    </ToastProvider>
  );
}