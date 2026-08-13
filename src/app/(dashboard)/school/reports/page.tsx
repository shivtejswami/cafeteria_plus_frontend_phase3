'use client';

import { ReportsPage } from '@/components/common/Reports';
import { useReadOnlyMode } from '@/components/school-admin/common/ReadOnlyModeContext';
import { schoolAdminData, readOnlyData } from '@/lib/schoolAdminData';

export default function ReportsRoute() {
  const { isReadOnly } = useReadOnlyMode();
  return <ReportsPage schoolData={isReadOnly ? readOnlyData : schoolAdminData} />;
}