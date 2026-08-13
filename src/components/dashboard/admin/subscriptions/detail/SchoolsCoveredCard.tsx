import React from 'react';
import { Check } from 'lucide-react';
import { SchoolCovered } from '../types';

interface SchoolsCoveredCardProps {
  schools: SchoolCovered[];
  onManageSchools: () => void;
}

export function SchoolsCoveredCard({
  schools,
  onManageSchools,
}: SchoolsCoveredCardProps) {
  const activeSchools = schools.filter((s) => s.isActive);

  return (
    <div className="bg-[#FFFFFF] rounded-2xl sm:rounded-3xl border border-[#E8E6E1] p-4 sm:p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] space-y-4 font-sans min-w-0 w-full">
      {/* Header: Stacked on mobile (button on next line with full width), horizontal on desktop */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
        <div className="min-w-0 flex-1">
          <h2 className="text-[16px] sm:text-[17px] font-bold text-[#1F1F1F] font-sans leading-tight">
            Schools covered / district agreement
          </h2>
          <p className="text-[12px] sm:text-[13px] text-[#9A9A9A] font-secondary mt-0.5">
            {activeSchools.length} of {schools.length} schools on the agreement
          </p>
        </div>

        {/* Manage schools Pill button: Full width on mobile screens, auto on desktop */}
        <button
          type="button"
          onClick={onManageSchools}
          className="w-full sm:w-auto bg-[#F2F5F0] border border-[#D6E0D2] text-[#3A4A32] hover:bg-[#E5EAE2] text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2.5 sm:py-2 rounded-full transition-colors cursor-pointer shadow-sm shrink-0 flex items-center justify-center text-center"
        >
          Manage schools
        </button>
      </div>

      {/* Grid of School Badges matching Screenshot 1 */}
      {schools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5 sm:gap-3 pt-1">
          {schools.map((sch) => (
            <div
              key={sch.id}
              className={`px-4 py-2.5 rounded-xl flex items-center justify-between gap-2 transition-all select-none ${
                sch.isActive
                  ? 'bg-[#E3F5E3] text-[#1F1F1F]'
                  : 'bg-[#FAF9F6] border border-[#E8E6E1] text-slate-400 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                {sch.isActive && (
                  <Check className="w-3.5 h-3.5 text-[#1D6B1D] shrink-0" strokeWidth={3} />
                )}
                <span className="text-xs sm:text-sm font-semibold truncate font-sans">
                  {sch.name}
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium text-[#6D6D6D] shrink-0">
                {sch.level}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-400">No schools covered under this agreement.</p>
      )}
    </div>
  );
}
