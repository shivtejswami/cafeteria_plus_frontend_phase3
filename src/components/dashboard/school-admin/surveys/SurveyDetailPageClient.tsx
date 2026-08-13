'use client';

import SurveyDetailPage from '@/components/school-admin/surveys/components/SurveyDetailPage';
import { useReadOnlyMode } from '@/components/school-admin/common/ReadOnlyModeContext';
import { surveyDetailData, schoolReopenPolicy } from '@/lib/schoolAdminData';

export default function SurveyDetailPageClient({ surveyId }: { surveyId: string }) {
  const { isReadOnly } = useReadOnlyMode();
  const survey = surveyDetailData[surveyId] || null;

  return (
    <SurveyDetailPage
      surveyId={surveyId}
      survey={survey}
      isReadOnly={isReadOnly}
      reopenPolicy={schoolReopenPolicy}
    />
  );
}