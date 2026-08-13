'use client';

interface StatCard {
  label: string;
  valueA: string;
  valueB: string;
  delta: number | null;
  unit: string;
  invertColors: boolean;
}

interface HeadlineComparisonProps {
  periodALabel: string;
  periodBLabel: string;
  overallScoreA: number;
  overallScoreB: number;
  responseRateA: number;
  responseRateB: number;
  sentimentA: number;
  sentimentB: number;
  isLoading?: boolean;
}

function DeltaBadge({ delta, unit, invertColors }: { delta: number | null; unit: string; invertColors: boolean }) {
  if (delta === null) {
    return <span className="text-[13px] text-subtle">—</span>;
  }

  const improved = delta > 0;
  const textClass = invertColors
    ? improved ? 'text-brick-600' : 'text-leaf'
    : improved ? 'text-leaf' : 'text-brick-600';
  const bgClass = invertColors
    ? improved ? 'bg-brick-50' : 'bg-sage-100'
    : improved ? 'bg-sage-100' : 'bg-brick-50';
  const arrow = improved ? '▲' : '▼';
  const sign = delta > 0 ? '+' : '';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[13px] font-semibold whitespace-nowrap ${bgClass} ${textClass}`}
    >
      {arrow} {sign}{delta} {unit}
    </span>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl p-4 sm:p-5 bg-white border border-line shadow-card">
      <div className="h-3 rounded-full mb-5 w-20 bg-sage-50" />
      <div className="grid grid-cols-3 gap-2 items-end">
        <div>
          <div className="h-2.5 rounded-full mb-1 w-16 bg-sage-50" />
          <div className="h-8 rounded-full w-16 bg-sage-50" />
        </div>
        <div>
          <div className="h-2.5 rounded-full mb-1 w-16 bg-sage-50" />
          <div className="h-8 rounded-full w-16 bg-sage-50" />
        </div>
        <div className="flex flex-col items-end">
          <div className="h-2.5 rounded-full mb-1 w-12 bg-sage-50" />
          <div className="h-6 rounded-full w-20 bg-sage-50" />
        </div>
      </div>
    </div>
  );
}

export default function HeadlineComparison({
  periodALabel,
  periodBLabel,
  overallScoreA,
  overallScoreB,
  responseRateA,
  responseRateB,
  sentimentA,
  sentimentB,
  isLoading = false,
}: HeadlineComparisonProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  const cards: StatCard[] = [
    {
      label: 'Overall score',
      valueA: String(overallScoreA),
      valueB: String(overallScoreB),
      delta: overallScoreB - overallScoreA,
      unit: 'pts',
      invertColors: false,
    },
    {
      label: 'Response rate',
      valueA: `${responseRateA}%`,
      valueB: `${responseRateB}%`,
      delta: responseRateB - responseRateA,
      unit: 'pp',
      invertColors: false,
    },
    {
      label: 'Positive sentiment',
      valueA: `${sentimentA}%`,
      valueB: `${sentimentB}%`,
      delta: sentimentB - sentimentA,
      unit: 'pp',
      invertColors: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl p-4 sm:p-5 transition-shadow duration-150 hover:shadow-lg bg-white border border-line shadow-card"
        >
          <p className="text-[12px] font-medium uppercase tracking-wide mb-3 text-subtle">
            {card.label}
          </p>
          <div className="grid grid-cols-3 gap-2 items-end">
            <div>
              <p className="text-[11px] mb-0.5 text-subtle">{periodALabel}</p>
              <p className="text-[19px] sm:text-[24px] font-semibold leading-tight text-ink">
                {card.valueA}
              </p>
            </div>
            <div>
              <p className="text-[11px] mb-0.5 text-subtle">{periodBLabel}</p>
              <p className="text-[19px] sm:text-[24px] font-semibold leading-tight text-ink">
                {card.valueB}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-[11px] mb-0.5 text-subtle">Change</p>
              <DeltaBadge delta={card.delta} unit={card.unit} invertColors={card.invertColors} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}