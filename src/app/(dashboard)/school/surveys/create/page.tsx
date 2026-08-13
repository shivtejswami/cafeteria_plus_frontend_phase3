'use client';

import { useRouter } from 'next/navigation';
import CreateSurveyForm from '@/components/dashboard/school-admin/surveys/CreateSurveyForm';
import { useReadOnlyMode } from '@/components/dashboard/school-admin/common/ReadOnlyModeContext';
import SurveysPage from '@/components/school-admin/surveys/SurveysPage';
import { schoolAdminData } from '@/lib/schoolAdminData';

const gradeBands = [
  { value: 'k-5', label: 'K-5', instrumentVersion: 'v2 (current instrument)' },
  { value: '6-8', label: '6-8', instrumentVersion: 'v3 (current instrument)' },
  { value: '9-12', label: '9-12', instrumentVersion: 'v4 (current instrument)' },
];

const activeBands = [
  { band: '6-8', surveyId: 's1' },
];

export default function CreateSurveyPage() {
  const router = useRouter();
  const { isReadOnly } = useReadOnlyMode();

  return (
    <>
      <SurveysPage schoolData={schoolAdminData} />
      <CreateSurveyForm
        open={true}
        onClose={() => router.push('/school/surveys')}
        gradeBands={gradeBands}
        activeBands={activeBands}
        isReadOnly={isReadOnly}
      />
    </>
  );
}