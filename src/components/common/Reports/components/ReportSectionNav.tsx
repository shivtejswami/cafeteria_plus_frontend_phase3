'use client';

const sections = [
  { id: 'overview', label: 'Overview' },
  { id: 'scores', label: 'Scores & categories' },
  { id: 'insights', label: 'Insights' },
  { id: 'top-items', label: 'Top items' },
  { id: 'comments', label: 'Comments & sentiment' },
  { id: 'participation', label: 'Participation' },
];

interface ReportSectionNavProps {
  active: string;
  onChange: (id: string) => void;
}

export default function ReportSectionNav({ active, onChange }: ReportSectionNavProps) {
  return (
    <div className="flex items-center gap-0 border-b border-b-line overflow-x-auto overscroll-x-contain scrollbar-none [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="Report sections">
      {sections.map((section) => {
        const isActive = active === section.id;
        return (
          <button
            key={section.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(section.id)}
            className={`relative shrink-0 px-3 sm:px-5 py-3 text-[13px] sm:text-[14px] font-medium whitespace-nowrap transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 ${isActive ? 'text-iris font-semibold' : 'text-muted hover:text-ink'}`}
          >
            {section.label}
            {isActive && (
              <span
                className="absolute -bottom-px left-3 right-3 h-0.5 rounded-full bg-iris"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}