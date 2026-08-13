'use client';

import StudentMessageScreen from '@/components/student-survey/StudentMessageScreen';

export default function ClosedPage() {
  return (
    <StudentMessageScreen
      isK5={false}
      iconName="ri-check-line"
      title="This survey has closed"
      body="Thanks anyway — it's no longer accepting answers."
      iconBg="bg-sage-50"
      gradientFrom="from-canvas"
      gradientTo="to-canvas"
    />
  );
}