'use client';

import { useRouter } from 'next/navigation';
import StudentMessageScreen from '@/components/student-survey/StudentMessageScreen';

export default function AlreadyAnsweredPage() {
  const router = useRouter();

  return (
    <StudentMessageScreen
      isK5={false}
      iconName="ri-thumb-up-line"
      title="This device already answered"
      body="If that was you, you're done — thanks."
      bodyTwo="If it wasn't you — someone else may have used this device — you can still take the survey."
      secondaryLabel="That wasn't me — let me answer"
      onSecondary={() => router.push('/student')}
      iconBg="bg-sage-50"
      gradientFrom="from-canvas"
      gradientTo="to-canvas"
    />
  );
}