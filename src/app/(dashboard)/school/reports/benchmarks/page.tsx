'use client';

import BenchmarksPage from '@/components/school-admin/benchmarks/BenchmarksPage';
import { useReadOnlyMode } from '@/components/school-admin/common/ReadOnlyModeContext';
import { schoolAdminData, readOnlyData } from '@/lib/schoolAdminData';

export default function BenchmarksRoute() {
  const { isReadOnly } = useReadOnlyMode();
  return <BenchmarksPage schoolData={isReadOnly ? readOnlyData : schoolAdminData} />;
}