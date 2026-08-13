'use client';

import StudentMessageScreen from '@/components/student-survey/StudentMessageScreen';

export default function PausedPage() {
  return (
    <StudentMessageScreen
      isK5={false}
      iconName="ri-pause-circle-line"
      title="Paused right now"
      body="Your school paused this survey. Try again later."
      iconBg="bg-sage-50"
      gradientFrom="from-canvas"
      gradientTo="to-canvas"
    />
  );
}