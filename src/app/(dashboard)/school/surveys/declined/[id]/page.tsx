import SurveyDetailDeclinedClient from '@/components/school-admin/surveys/SurveyDetailDeclinedClient';
import { surveyReopenDeclinedData } from '@/lib/schoolAdminData';

export async function generateStaticParams() {
  return Object.keys(surveyReopenDeclinedData).map(id => ({ id }));
}

export default async function SurveyDetailDeclinedPage({ params }: { params: Promise<{ id: string }> }) {
  // Next.js 15: route params are async and must be awaited before use.
  const { id } = await params;
  return <SurveyDetailDeclinedClient surveyId={id} />;
}