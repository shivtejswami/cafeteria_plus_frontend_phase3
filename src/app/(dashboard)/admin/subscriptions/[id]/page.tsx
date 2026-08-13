import { SubscriptionDetailPage } from '@/components/dashboard/admin/subscriptions/detail/SubscriptionDetailPage';

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function SubscriptionDetailRoute({ params }: PageProps) {
  const resolvedParams = await params;
  return <SubscriptionDetailPage id={resolvedParams.id} />;
}
