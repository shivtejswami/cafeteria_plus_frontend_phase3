'use client';

import { useMemo } from 'react';
import { HelpContactPage } from '@/components/common/Help';
import type { HelpQuestionItem } from '@/components/common/Help';
import { popularQuestions } from '@/lib/schoolHelpContent';
import { schoolSupportRequests } from '@/lib/schoolSupportRequests';
import { schoolContactCategories, schoolHelpRoutes, SUPPORT_EMAIL } from '@/lib/schoolHelpRoutes';
import { accountData } from '@/lib/schoolAdminData';

export default function ContactPage() {
  const openCount = schoolSupportRequests.filter((r) => r.status === 'open').length;

  const suggestions = useMemo<HelpQuestionItem[]>(
    () =>
      popularQuestions.map((q) => ({
        id: String(q.id),
        question: q.question,
        href: schoolHelpRoutes.article(q.topicSlug, q.articleSlug),
      })),
    []
  );

  return (
    <HelpContactPage
      routes={schoolHelpRoutes}
      categories={schoolContactCategories}
      defaultEmail={accountData.email}
      supportEmail={SUPPORT_EMAIL}
      suggestions={suggestions}
      openRequestCount={openCount}
    />
  );
}
