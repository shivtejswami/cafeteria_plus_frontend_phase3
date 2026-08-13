import React from 'react';
import Link from 'next/link';
import { BookOpen, Clock } from 'lucide-react';
import { HELP_ARTICLES, type HelpArticle } from '@/constants/districtData';

const SECTION_TITLE: Record<HelpArticle['section'], string> = {
  'getting-started': 'Getting started',
  'managing-schools': 'Managing schools',
};

export function HelpArticleList({ section }: { section: HelpArticle['section'] }) {
  const articles = HELP_ARTICLES.filter((a) => a.section === section);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <h2 className="text-lg font-semibold text-slate-900">{SECTION_TITLE[section]}</h2>
      </div>

      <ul className="divide-y divide-slate-100">
        {articles.map((article) => (
          <li key={article.slug}>
            <Link
              href={`/district/help/${article.section}/${article.slug}`}
              className="flex items-start gap-4 px-5 py-5 hover:bg-slate-50/70 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">{article.title}</p>
                <p className="mt-1 text-sm text-slate-500">{article.summary}</p>
                <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  {article.readingMinutes} min read
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
