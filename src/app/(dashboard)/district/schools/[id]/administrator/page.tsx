import { SchoolAdministrator } from "@/components/dashboard/district/schools/detail/SchoolAdministrator";

export default async function SchoolAdministratorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SchoolAdministrator schoolId={id} />;
}
