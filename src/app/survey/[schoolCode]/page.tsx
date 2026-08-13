import { getSchoolConfig, allSchoolCodes } from '@/lib/studentSurveyData';
import { notFound } from 'next/navigation';
import SurveyGate from '@/components/student-survey/SurveyGate';

export async function generateStaticParams() {
  return allSchoolCodes.map((code) => ({ schoolCode: code }));
}

export default async function SurveyPage({ params }: { params: Promise<{ schoolCode: string }> }) {
  // Next.js 15: route params are async and must be awaited before use.
  const { schoolCode } = await params;
  const config = getSchoolConfig(schoolCode);

  if (!config) {
    notFound();
  }

  return <SurveyGate config={config} />;
}