import { ReportDetailPageClient } from '@/components/common/Reports';
import { reportsListData } from '@/lib/schoolAdminData';

export const dynamicParams = true;

export async function generateStaticParams() {
  return [
    ...reportsListData.map((r) => ({ id: r.id })),
    { id: 'suppressed' },
  ];
}

export default async function ReportDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  // Next.js 15: route params are async and must be awaited before use.
  const { id } = await params;
  return <ReportDetailPageClient reportId={id} />;
}