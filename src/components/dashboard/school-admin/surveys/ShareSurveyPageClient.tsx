'use client';

import { useRouter } from 'next/navigation';
import SurveysPage from '@/components/school-admin/surveys/SurveysPage';
import ShareLinkQrModal from '@/components/school-admin/common/ShareLinkQrModal';
import { useReadOnlyMode } from '@/components/school-admin/common/ReadOnlyModeContext';
import { schoolAdminData } from '@/lib/schoolAdminData';

export default function ShareSurveyPageClient({ surveyId }: { surveyId: string }) {
  const router = useRouter();
  const { isReadOnly } = useReadOnlyMode();
  const survey = schoolAdminData.surveys.find(s => s.id === surveyId);

  return (
    <>
      <SurveysPage schoolData={schoolAdminData} />
      <ShareLinkQrModal
        open={true}
        surveyUrl={survey ? `https://school.cafeteria-pulse.app/survey/${survey.id}` : 'https://school.cafeteria-pulse.app/survey/s1'}
        accessCode={survey?.id === 's1' ? 'LUNCH7' : null}
        status={survey?.status === 'live' ? 'open' : 'scheduled'}
        scheduledOpensDate={survey?.status === 'scheduled' ? survey.openedDate : undefined}
        isReadOnly={isReadOnly}
        onClose={() => router.push('/school/surveys')}
      />
    </>
  );
}