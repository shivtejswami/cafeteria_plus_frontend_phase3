import React from 'react';
import Link from 'next/link';
import {
  ClipboardList,
  FileText,
  RefreshCw,
  School,
  Settings,
  Users,
} from 'lucide-react';
import { cn } from '@/utils/tailwind';
import type { ActivityCategory, DistrictActivity } from '@/constants/districtData';
import { AttentionDot } from '@/components/dashboard/district/shared/AttentionDot';

const CONFIG: Record<
  ActivityCategory,
  { Icon: React.ElementType; bg: string; text: string; chip: string; label: string }
> = {
  survey: { Icon: ClipboardList, bg: 'bg-[#E3F5E3]', text: 'text-[#586D4D]', chip: 'bg-[#E3F5E3] text-[#586D4D]', label: 'Survey' },
  report: { Icon: FileText, bg: 'bg-[#F0EAFB]', text: 'text-[#6D28D9]', chip: 'bg-[#F0EAFB] text-[#6D28D9]', label: 'Report' },
  reopen: { Icon: RefreshCw, bg: 'bg-[#FFECD1]', text: 'text-[#D97706]', chip: 'bg-[#FFECD1] text-[#D97706]', label: 'Reopen' },
  school: { Icon: School, bg: 'bg-[#F8F8F7]', text: 'text-[#9A9A9A]', chip: 'bg-[#F8F8F7] text-[#9A9A9A]', label: 'School' },
  people: { Icon: Users, bg: 'bg-[#F8F8F7]', text: 'text-[#9A9A9A]', chip: 'bg-[#F8F8F7] text-[#9A9A9A]', label: 'People' },
  settings: { Icon: Settings, bg: 'bg-[#F8F8F7]', text: 'text-[#9A9A9A]', chip: 'bg-[#F8F8F7] text-[#9A9A9A]', label: 'Settings' },
};

/** Icon chip, category badge, sentence and relative stamp. */
export function ActivityRow({ event }: { event: DistrictActivity }) {
  const config = CONFIG[event.category];
  const { Icon } = config;
  const href = event.schoolId ? `/district/schools/${event.schoolId}/activity` : '/district/activity';

  return (
    <Link href={href} className="flex gap-4 px-5 py-4 hover:bg-slate-50/70 transition-colors">
      <div className={cn('w-10 h-10 rounded-full flex items-center justify-center shrink-0', config.bg)}>
        <Icon className={cn('w-5 h-5', config.text)} />
      </div>
      <div className="min-w-0">
        <div className="flex items-center flex-wrap gap-2 mb-1">
          <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', config.chip)}>
            {config.label}
          </span>
          {event.needsAttention && (
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-[#FFECD1] text-[#D97706]">
              <AttentionDot /> Needs attention
            </span>
          )}
        </div>
        <p className="text-sm text-slate-500">
          {event.schoolName && (
            <span className="font-semibold text-slate-900">{event.schoolName} </span>
          )}
          {event.description}
        </p>
        <div className="text-sm text-slate-500 mt-1">
          {event.timeAgo}
          {event.actor !== 'System' && ` · ${event.actor}`}
        </div>
      </div>
    </Link>
  );
}
