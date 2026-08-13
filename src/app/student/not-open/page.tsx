'use client';

import StudentMessageScreen from '@/components/student-survey/StudentMessageScreen';

export default function NotOpenPage() {
  return (
    <StudentMessageScreen
      isK5={false}
      iconName="ri-calendar-line"
      title="This survey hasn't opened yet"
      body="Check back later."
      iconBg="bg-sage-50"
      gradientFrom="from-canvas"
      gradientTo="to-canvas"
    />
  );
}