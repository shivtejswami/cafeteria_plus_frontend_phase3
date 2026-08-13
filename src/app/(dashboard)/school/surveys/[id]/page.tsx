import SurveyDetailPageClient from '@/components/school-admin/surveys/SurveyDetailPageClient';
import { surveysListData } from '@/lib/schoolAdminData';

export async function generateStaticParams() {
  return surveysListData.surveys.map(s => ({ id: s.id }));
}

export default async function SurveyDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  // Next.js 15: route params are async and must be awaited before use.
  const { id } = await params;
  return <SurveyDetailPageClient surveyId={id} />;
}