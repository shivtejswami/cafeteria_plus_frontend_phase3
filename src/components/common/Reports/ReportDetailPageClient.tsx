'use client';

import ReportDetailPage from '@/components/common/Reports/components/ReportDetailPage';
import { useReadOnlyMode } from '@/components/school-admin/common/ReadOnlyModeContext';
import { schoolAdminData, readOnlyData } from '@/lib/schoolAdminData';

export default function ReportDetailPageClient({ reportId }: { reportId: string }) {
  const { isReadOnly } = useReadOnlyMode();
  return <ReportDetailPage reportId={reportId} schoolData={isReadOnly ? readOnlyData : schoolAdminData} />;
}