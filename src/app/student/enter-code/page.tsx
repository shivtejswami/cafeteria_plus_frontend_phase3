'use client';

import { useRouter } from 'next/navigation';
import AccessCodeScreen from '@/components/student-survey/AccessCodeScreen';

const SCHOOL_NAME = 'North Hills Elementary';

export default function StudentEnterCodePage() {
  const router = useRouter();

  return (
    <AccessCodeScreen
      schoolName={SCHOOL_NAME}
      onSuccess={() => router.push('/student/survey')}
      isK5={false}
    />
  );
}