import { CohortViewerPage } from '@/components/dashboard/admin/benchmarks/cohort/CohortViewerPage';

export default async function AdminCohortViewerRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CohortViewerPage id={id} />;
}

