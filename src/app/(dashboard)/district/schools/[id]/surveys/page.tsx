import { SchoolSurveys } from "@/components/dashboard/district/schools/detail/SchoolSurveys";

export default async function SchoolSurveysPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SchoolSurveys schoolId={id} />;
}
