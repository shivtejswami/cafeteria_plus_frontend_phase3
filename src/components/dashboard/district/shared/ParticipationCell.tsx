import React from 'react';
import { participationRate } from '@/constants/districtData';

/**
 * "94 / 120 (78%)" cell. Below-target schools render in amber, matching the
 * schools table in Figma.
 */
export function ParticipationCell({
  responses,
  target,
  belowTarget,
  layout = 'inline',
}: {
  responses: number | null;
  target: number | null;
  belowTarget?: boolean;
  layout?: 'inline' | 'stacked';
}) {
  if (responses === null || target === null) {
    return <span className="text-slate-400">–</span>;
  }

  const rate = participationRate(responses, target);
  const tone = belowTarget ? 'text-gold' : 'text-slate-900';

  if (layout === 'stacked') {
    return (
      <div>
        <div className={tone}>
          {responses} · {rate}%
        </div>
        {belowTarget && (
          <div className="text-[11px] font-medium text-gold">below target</div>
        )}
      </div>
    );
  }

  return (
    <div className={tone}>
      {responses} / {target}
      <span className={belowTarget ? 'text-gold-70 ml-1' : 'text-slate-500 ml-1'}>
        ({rate}%)
      </span>
    </div>
  );
}
