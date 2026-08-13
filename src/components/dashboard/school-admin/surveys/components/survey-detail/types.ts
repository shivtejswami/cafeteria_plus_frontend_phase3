/** Collection state the survey detail screen is rendering. */
export type Phase = 'draft' | 'scheduled' | 'live' | 'paused' | 'analysing' | 'published' | 'cancelled';

/** Where a cancelled survey's permanent-deletion request has got to. */
export type DeletionState = 'none' | 'pending' | 'rejected';

/**
 * Where a published survey's reopen has got to. 'reopened' only happens when the district
 * has given the school direct permission — otherwise it goes through 'pending' first.
 */
export type ReopenState = 'none' | 'pending' | 'declined' | 'reopened';

export const PHASE_CHIP: Record<Phase, { label: string; className: string; dot?: string }> = {
  draft: { label: 'Draft', className: 'bg-[#F1EFEA] text-[#6D6D6D]' },
  scheduled: { label: 'Scheduled', className: 'bg-[#F0EAFB] text-[#6D28D9]' },
  live: { label: 'Open', className: 'bg-[#006EB21A] text-[#006EB2]', dot: 'bg-[#006EB2]' },
  paused: { label: 'Paused', className: 'bg-[#FFECD1] text-[#D97706]' },
  analysing: { label: 'Analysing', className: 'bg-[#F1EFEA] text-[#6D6D6D]' },
  published: { label: 'Published', className: 'bg-[#E3F5E3] text-[#586D4D]' },
  cancelled: { label: 'Cancelled', className: 'bg-[#F1EFEA] text-[#9A9A9A]' },
};

export { formatIsoDate } from '@/components/ui/dateFormat';
