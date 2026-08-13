import React from 'react';
import { cn } from '@/utils/tailwind';

export type StatusVariant = 
  | 'open'
  | 'ready'
  | 'none'
  | 'scheduled'
  | 'closed'
  | 'under-review'
  | 'published'
  | 'pending';

interface StatusChipProps {
  status: StatusVariant;
  label?: string;
  className?: string;
}

const statusConfig: Record<StatusVariant, { bg: string; text: string; dot: string; defaultLabel: string }> = {
  open: { bg: 'bg-[#E3F5E3]', text: 'text-[#586D4D]', dot: 'bg-[#586D4D]', defaultLabel: 'Survey open' },
  ready: { bg: 'bg-[#F0EAFB]', text: 'text-[#6D28D9]', dot: 'bg-[#6D28D9]', defaultLabel: 'Report ready' },
  none: { bg: 'bg-[#F8F8F7]', text: 'text-[#9A9A9A]', dot: 'bg-[#9A9A9A]', defaultLabel: 'No active survey' },
  scheduled: { bg: 'bg-[#F1EFEA]', text: 'text-[#6D6D6D]', dot: 'bg-[#6D6D6D]', defaultLabel: 'Scheduled' },
  closed: { bg: 'bg-[#F1EFEA]', text: 'text-[#6D6D6D]', dot: 'bg-[#6D6D6D]', defaultLabel: 'Closed' },
  'under-review': { bg: 'bg-[#F1EFEA]', text: 'text-[#6D6D6D]', dot: 'bg-[#6D6D6D]', defaultLabel: 'Under review' },
  published: { bg: 'bg-[#E3F5E3]', text: 'text-[#586D4D]', dot: 'bg-[#586D4D]', defaultLabel: 'Published' },
  pending: { bg: 'bg-[#FFECD1]', text: 'text-[#D97706]', dot: 'bg-[#EA580C]', defaultLabel: 'Pending' },
};

export function StatusChip({ status, label, className }: StatusChipProps) {
  const config = statusConfig[status];
  
  return (
    <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", config.bg, config.text, className)}>
      <div className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
      {label || config.defaultLabel}
    </div>
  );
}
