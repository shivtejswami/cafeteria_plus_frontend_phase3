import { notFound } from "next/navigation";
import { ReopenReview } from "@/components/dashboard/district/reopen-requests/ReopenReview";
import { REOPEN_REQUESTS } from "@/constants/districtData";

export default async function ReopenReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!REOPEN_REQUESTS.some((r) => r.id === id)) notFound();
  return <ReopenReview requestId={id} />;
}
