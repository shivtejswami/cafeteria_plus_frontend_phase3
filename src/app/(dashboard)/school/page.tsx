'use client';

import SchoolAdminDashboard from '@/components/school-admin/dashboard/SchoolAdminDashboard';
import { useReadOnlyMode } from '@/components/school-admin/common/ReadOnlyModeContext';
import { schoolAdminData, readOnlyData } from '@/lib/schoolAdminData';

export default function SchoolAdminPage() {
  const { isReadOnly } = useReadOnlyMode();
  return <SchoolAdminDashboard data={isReadOnly ? readOnlyData : schoolAdminData} />;
}