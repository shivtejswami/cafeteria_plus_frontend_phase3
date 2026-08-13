'use client';

import StudentMessageScreen from '@/components/student-survey/StudentMessageScreen';

export default function CancelledPage() {
  return (
    <StudentMessageScreen
      isK5={false}
      iconName="ri-information-line"
      title="This survey was cancelled"
      body="Your school cancelled it. Nothing you need to do."
      iconBg="bg-sage-50"
      gradientFrom="from-canvas"
      gradientTo="to-canvas"
    />
  );
}