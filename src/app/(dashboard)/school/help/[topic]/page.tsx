import { helpTopics } from '@/lib/schoolHelpContent';
import TopicPageClient from '@/components/school-admin/help/TopicPageClient';

export async function generateStaticParams() {
  return helpTopics.map((t) => ({ topic: t.slug }));
}

export default async function TopicPage({ params }: { params: Promise<{ topic: string }> }) {
  // Next.js 15: route params are async and must be awaited before use.
  const { topic } = await params;
  return <TopicPageClient topicSlug={topic} />;
}