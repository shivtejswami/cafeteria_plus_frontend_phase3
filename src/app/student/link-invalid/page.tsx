'use client';

import StudentMessageScreen from '@/components/student-survey/StudentMessageScreen';

export default function LinkInvalidPage() {
  return (
    <StudentMessageScreen
      isK5={false}
      iconName="ri-link-unlink"
      title="This link no longer works"
      body="Your school may have shared a new one. Ask your teacher."
      iconBg="bg-sage-50"
      gradientFrom="from-canvas"
      gradientTo="to-canvas"
    />
  );
}