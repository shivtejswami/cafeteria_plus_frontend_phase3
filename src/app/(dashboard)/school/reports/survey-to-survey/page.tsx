'use client';

import { SurveyToSurvey } from '@/components/common/ReportsAnalytics/SurveyToSurvey';
import { useReadOnlyMode } from '@/components/school-admin/common/ReadOnlyModeContext';
import { schoolAdminData, readOnlyData } from '@/lib/schoolAdminData';

export default function SurveyToSurveyRoute() {
  const { isReadOnly } = useReadOnlyMode();
  return <SurveyToSurvey role="school" schoolData={isReadOnly ? readOnlyData : schoolAdminData} />;
}
