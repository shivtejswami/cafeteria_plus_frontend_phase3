'use client';

import StudentMessageScreen from '@/components/student-survey/StudentMessageScreen';

export default function MissedCutoffPage() {
  return (
    <StudentMessageScreen
      isK5={false}
      iconName="ri-time-line"
      title="You just missed the deadline"
      body="This survey closed a short while ago."
      iconBg="bg-sage-50"
      gradientFrom="from-canvas"
      gradientTo="to-canvas"
    />
  );
}