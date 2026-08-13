import { SupportStatusDetailPage } from "../../../../../components/dashboard/admin/home/SupportStatusDetailPage";

export default async function AdminSupportStatusDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SupportStatusDetailPage issueId={id} />;
}
