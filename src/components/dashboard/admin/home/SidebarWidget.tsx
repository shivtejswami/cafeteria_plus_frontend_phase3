import React from "react";

interface SidebarWidgetProps {
  title: string;
  badgeCount?: number | string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function SidebarWidget({
  title,
  badgeCount,
  children,
  footer,
}: SidebarWidgetProps) {
  return (
    <div className="bg-white rounded-xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] flex flex-col p-5 w-full">
      {/* Title block */}
      <div className="flex items-center gap-2 pb-3.5 border-b border-[#EFEDE8] mb-1">
        <h3 className="text-[16px] font-semibold text-[#2B2B2B] font-sans">
          {title}
        </h3>
        {badgeCount !== undefined && (
          <span className="inline-flex items-center justify-center text-[11px] font-bold font-sans text-slate-500 bg-slate-100 h-[18px] px-1.5 rounded-full select-none">
            {badgeCount}
          </span>
        )}
      </div>

      {/* Main Items list */}
      <div className="space-y-4 flex-1">
        {children}
      </div>

      {/* Footer link */}
      {footer && (
        <div className="mt-4 pt-3 border-t border-[#EFEDE8] flex justify-center">
          {footer}
        </div>
      )}
    </div>
  );
}
