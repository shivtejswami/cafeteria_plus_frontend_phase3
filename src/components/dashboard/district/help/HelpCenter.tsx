'use client';

import { HelpTopicGrid } from '@/components/common/Help';
import type { HelpTopicItem } from '@/components/common/Help';

const ENTRY_POINTS: HelpTopicItem[] = [
  {
    id: 'getting-started',
    href: '/district/help/getting-started',
    icon: 'ri-book-open-line',
    title: 'Getting started',
    description: 'Find your way around a school profile and read participation targets.',
  },
  {
    id: 'managing-schools',
    href: '/district/help/managing-schools',
    icon: 'ri-building-2-line',
    title: 'Managing schools',
    description: 'Add a school, set its enrolment band, assign administrators.',
  },
  {
    id: 'my-requests',
    href: '/district/help/my-requests',
    icon: 'ri-list-check',
    title: 'My requests',
    description: 'Follow anything you have already sent to support.',
  },
  {
    id: 'contact',
    href: '/district/help/contact',
    icon: 'ri-lifebuoy-line',
    title: 'Contact support',
    description: 'Send a question and get a reply within one working day.',
  },
];

/** "School > help & support" (2235:14833). */
export function HelpCenter() {
  return <HelpTopicGrid topics={ENTRY_POINTS} />;
}
