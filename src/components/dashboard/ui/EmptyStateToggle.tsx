interface EmptyStateToggleProps {
  isEmpty: boolean;
  emptyIcon: string;
  emptyTitle: string;
  emptyDescription: string;
  children: React.ReactNode;
}

/**
 * Renders either an empty-state placeholder or the real content, based
 * purely on whether there is data (`isEmpty`). No manual preview toggle —
 * the empty state only ever shows when there is actually nothing to show.
 */
export default function EmptyStateToggle({
  isEmpty,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  children,
}: EmptyStateToggleProps) {
  if (isEmpty) {
    return (
      <div
        className="rounded-2xl p-12 text-center flex flex-col items-center justify-center bg-white border border-[#E8E6E1] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04),0px_8px_24px_0px_rgba(0,0,0,0.06)]"
      >
        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-slate-100">
          <span className="w-6 h-6 flex items-center justify-center">
            <i className={`${emptyIcon} text-[22px] text-slate-400`}></i>
          </span>
        </div>
        <p className="text-[15px] font-semibold mb-1.5 text-slate-800">
          {emptyTitle}
        </p>
        <p className="text-[13px] max-w-[360px] leading-relaxed text-slate-400">
          {emptyDescription}
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
