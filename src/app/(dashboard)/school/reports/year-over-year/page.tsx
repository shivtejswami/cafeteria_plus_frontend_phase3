'use client';

import { YearOverYearPage } from '@/components/common/Reports';
import { useReadOnlyMode } from '@/components/school-admin/common/ReadOnlyModeContext';
import { schoolAdminData, readOnlyData } from '@/lib/schoolAdminData';

export default function YearOverYearRoute() {
  const { isReadOnly } = useReadOnlyMode();
  return <YearOverYearPage schoolData={isReadOnly ? readOnlyData : schoolAdminData} />;
}