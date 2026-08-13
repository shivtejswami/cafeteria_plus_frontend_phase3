/**
 * Shared activity-feed contract.
 *
 * The school, district, and admin dashboards all show the same activity screen,
 * so they all feed these shapes into the components in this folder. Anything
 * dashboard-specific (which categories exist, which stat tiles to show, what the
 * empty state says) arrives as props rather than being branched on in here.
 */

export interface ActivityDetail {
  label: string;
  before?: string;
  after?: string;
}

export interface ActivityEvent {
  id: string;
  /** Key into the `categoryStyles` map passed to the feed. */
  category: string;
  /** Short action label shown next to the category chip, e.g. "Survey opened". */
  action: string;
  description: string;
  /** Key into the `actorLabels` map, e.g. 'you' | 'System' | 'SFWG'. */
  actorRole: string;
  /** Person's name, shown in brackets when it differs from the role label. */
  actor: string;
  timestamp: Date;
  reason?: string;
  detail?: ActivityDetail[];
  linkHref?: string;
  linkLabel?: string;
  /** Renders the amber "Needs attention" chip. */
  needsAttention?: boolean;
  /** Used by the survey filter; the feed itself ignores it. */
  survey?: { gradeBand: string; period: string; href: string };
}

export interface ActivityDayGroup {
  label: string;
  events: ActivityEvent[];
}

/** Tailwind classes — these go straight into `className`, so no raw hex here. */
export interface ActivityCategoryStyle {
  label: string;
  /** Remixicon class, e.g. 'ri-clipboard-line'. */
  icon: string;
  bg: string;
  color: string;
}

export interface ActivityStatTile {
  label: string;
  value: string;
  icon: string;
  accent: 'sage' | 'iris' | 'gold' | 'neutral';
  href?: string;
}

export interface ActivityFilterOption {
  value: string;
  label: string;
}

export interface ActivityFilterDef {
  key: string;
  label: string;
  defaultValue: string;
  options: ActivityFilterOption[];
  /**
   * 'date-range' swaps in the picker that reveals from/to inputs when the
   * "Custom" option is chosen. Its value is encoded as `custom:<from>:<to>`
   * so the filter contract stays a plain string.
   */
  kind?: 'select' | 'date-range';
  /** How to match an event against the selected value. */
  match: (event: ActivityEvent, value: string) => boolean;
}

export const CUSTOM_RANGE_VALUE = 'custom';

/** Parses `custom:2026-07-01:2026-07-23` into its two ends. */
export function parseCustomRange(value: string): { from: string; to: string } {
  const [, from = '', to = ''] = value.split(':');
  return { from, to };
}
