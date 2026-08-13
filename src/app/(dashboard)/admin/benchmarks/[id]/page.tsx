import { ManageBenchmarkPage } from '@/components/dashboard/admin/benchmarks/detail/ManageBenchmarkPage';

export default async function ManageBenchmarkRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ManageBenchmarkPage id={id} />;
}

