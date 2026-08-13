import React from 'react';
import { AuditEvent } from '../types';

interface ActivityAuditCardProps {
  events?: AuditEvent[];
}

export function ActivityAuditCard({ events = [] }: ActivityAuditCardProps) {
  return (
    <div className="bg-[#FFFFFF] rounded-2xl border border-[#E8E6E1] p-4 sm:p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] space-y-4 font-sans">
      <h3 className="text-[15px] font-bold text-[#1F1F1F] font-sans leading-tight">
        Activity / audit
      </h3>

      <div className="space-y-4 pt-1">
        {events.map((evt) => (
          <div key={evt.id} className="flex items-start gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#6D28D9] shrink-0 mt-1.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap text-[12px] leading-snug">
                <span className="font-bold text-[#2B2B2B]">{evt.action}</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-500 font-medium">{evt.actor}</span>
                <span className="text-slate-400">·</span>
                <span className="text-[11px] text-slate-400 font-mono">{evt.timestamp}</span>
              </div>
              <p className="text-[12px] text-[#6D6D6D] font-secondary mt-0.5 leading-snug">
                {evt.description}
              </p>
              {evt.note && (
                <p className="text-[11px] text-[#6D6D6D] italic font-secondary mt-0.5">
                  {evt.note}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
