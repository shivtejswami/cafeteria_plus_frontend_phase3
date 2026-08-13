import { notFound } from "next/navigation";
import { HelpArticleView } from "@/components/dashboard/district/help/HelpArticleView";
import { HELP_ARTICLES } from "@/constants/districtData";

export default async function GettingStartedArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!HELP_ARTICLES.some((a) => a.slug === slug)) notFound();
  return <HelpArticleView slug={slug} />;
}
