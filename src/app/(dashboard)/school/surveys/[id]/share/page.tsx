import ShareSurveyPageClient from '@/components/school-admin/surveys/ShareSurveyPageClient';

export async function generateStaticParams() {
  return [
    { id: 's1' },
  ];
}

export default async function ShareSurveyRoute({ params }: { params: Promise<{ id: string }> }) {
  // Next.js 15: route params are async and must be awaited before use.
  const { id } = await params;
  return <ShareSurveyPageClient surveyId={id} />;
}