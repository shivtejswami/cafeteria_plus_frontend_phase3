import { SchoolReports } from "@/components/dashboard/district/schools/detail/SchoolReports";

export default async function SchoolReportsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SchoolReports schoolId={id} />;
}
