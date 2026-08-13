'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentSurveyPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/survey/north-hills-elementary');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas">
      <div className="text-center">
        <div className="w-10 h-10 rounded-full border-2 animate-spin mx-auto mb-3 border-line border-t-sage" aria-hidden="true"></div>
        <p className="text-sm font-medium text-muted">Finding your survey...</p>
      </div>
    </div>
  );
}