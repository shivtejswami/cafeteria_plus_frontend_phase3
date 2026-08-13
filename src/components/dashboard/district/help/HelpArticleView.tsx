import React from 'react';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { HELP_ARTICLES } from '@/constants/districtData';

const SECTION_LABEL = {
  'getting-started': 'Getting started',
  'managing-schools': 'Managing schools',
} as const;

export function HelpArticleView({ slug }: { slug: string }) {
  const article = HELP_ARTICLES.find((a) => a.slug === slug);
  if (!article) return null;

  return (
    <div className="space-y-4">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
        <Link href="/district/help" className="hover:text-indigo-700">
          Help
        </Link>
        <span>/</span>
        <Link href={`/district/help/${article.section}`} className="hover:text-indigo-700">
          {SECTION_LABEL[article.section]}
        </Link>
        <span>/</span>
        <span className="text-slate-600">{article.title}</span>
        <span className="ml-2 inline-flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          {article.readingMinutes} min
        </span>
      </nav>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="max-w-[70ch] space-y-8">
          {article.body.map((block) => (
            <section key={block.heading} className="space-y-3">
              <h2 className="text-lg font-semibold text-slate-900">{block.heading}</h2>
              {block.paragraphs.map((paragraph, i) => (
                <p key={i} className="text-base leading-relaxed text-slate-600">
                  {paragraph}
                </p>
              ))}
              {block.bullets && (
                <ul className="space-y-2 pt-1">
                  {block.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3 text-base leading-relaxed text-slate-600">
                      <span className="mt-2.5 w-1.5 h-1.5 shrink-0 rounded-full bg-purple-400" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
