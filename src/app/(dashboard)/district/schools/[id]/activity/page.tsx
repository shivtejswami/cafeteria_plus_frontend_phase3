import { SchoolActivity } from "@/components/dashboard/district/schools/detail/SchoolActivity";

export default async function SchoolActivityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SchoolActivity schoolId={id} />;
}
