'use client';

import SurveysPage from '@/components/school-admin/surveys/SurveysPage';
import { useReadOnlyMode } from '@/components/school-admin/common/ReadOnlyModeContext';
import { schoolAdminData, readOnlyData } from '@/lib/schoolAdminData';

export default function SurveysRoute() {
  const { isReadOnly } = useReadOnlyMode();
  return <SurveysPage schoolData={isReadOnly ? readOnlyData : schoolAdminData} />;
}