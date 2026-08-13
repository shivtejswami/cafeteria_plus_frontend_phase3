'use client';

interface SectionHeaderProps {
  label: string;
  questionCount: number;
}

export default function SectionHeader({ label, questionCount }: SectionHeaderProps) {
  return (
    <div className="mb-5">
      <span
        className="text-[12px] font-semibold uppercase tracking-wide text-subtle"
      >
        {label}
      </span>
      <span
        className="text-[12px] font-medium ml-2 text-stone"
      >
        {questionCount} question{questionCount !== 1 ? 's' : ''}
      </span>
    </div>
  );
}