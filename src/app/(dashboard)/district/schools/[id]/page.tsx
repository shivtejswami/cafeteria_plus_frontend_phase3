import { SchoolOverview } from "@/components/dashboard/district/schools/detail/SchoolOverview";

export default async function SchoolOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SchoolOverview schoolId={id} />;
}
