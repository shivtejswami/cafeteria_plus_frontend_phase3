import { SubscriptionStatus } from '@/lib/schoolAdminData';

interface Stage {
  key: SubscriptionStatus | 'renewal-reminders';
  label: string;
  description: string;
}

const stages: Stage[] = [
  {
    key: 'active',
    label: 'Active',
    description: 'Full access to all surveys, reports, and benchmarks.',
  },
  {
    key: 'renewal-reminders',
    label: 'Renewal reminders',
    description: 'SFWG sends renewal notices. Full access continues.',
  },
  {
    key: 'grace-period',
    label: 'Grace period',
    description: '30 days of full access while renewal is arranged.',
  },
  {
    key: 'read-only',
    label: 'Read-only',
    description: 'View and download reports only. Surveys paused.',
  },
  {
    key: 'deactivated',
    label: 'Deactivated',
    description: 'Interactive access suspended. Data is retained.',
  },
];

function getCurrentStageIndex(status: SubscriptionStatus): number {
  switch (status) {
    case 'active': return 0;
    case 'renewal-due': return 1;
    case 'grace-period': return 2;
    case 'read-only': return 3;
    case 'deactivated': return 4;
    default: return 0;
  }
}

function StageCircle({ label, isCurrent, isPast, isFuture }: {
  label: string;
  isCurrent: boolean;
  isPast: boolean;
  isFuture: boolean;
}) {
  const bg = isCurrent ? '#586d4d' : isPast ? '#e3f5e3' : '#f2f5f0';
  const textColor = isCurrent ? '#ffffff' : isPast ? '#586d4d' : '#8a8a8a';
  const borderClass = isCurrent ? 'border-2 border-sage' : isPast ? 'border-2 border-leaf-50' : 'border-2 border-line';

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${bg}`}
        aria-current={isCurrent ? 'step' : undefined}
      >
        <span className={`text-[13px] font-semibold ${textColor}`}>
          {isPast ? (
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-check-line text-sm"></i>
            </span>
          ) : (
            label.slice(0, 1)
          )}
        </span>
      </div>
      <div className="text-center">
        <p className={`text-[13px] font-medium ${isCurrent || isPast ? 'text-ink' : 'text-muted-500'}`}>
          {label}
        </p>
        <p className={`text-[11px] leading-snug mt-0.5 max-w-[140px] ${isCurrent ? 'text-ink-700' : 'text-subtle'}`}
        >
          {stages.find(s => s.label === label)?.description}
        </p>
      </div>
    </div>
  );
}

export default function SubscriptionLifecycleStepper({ status }: { status: SubscriptionStatus }) {
  const currentIdx = getCurrentStageIndex(status);

  return (
    <div className="rounded-2xl p-5 sm:p-8 bg-white border border-line shadow-card"
    >
      <h2 className="text-[15px] font-semibold mb-5 text-ink"
      >
        Account lifecycle
      </h2>

      <div className="hidden sm:flex items-start justify-between gap-2">
        {stages.map((stage, idx) => (
          <div key={stage.key} className="flex items-start flex-1">
            <div className="flex-1">
              <StageCircle
                label={stage.label}
                isCurrent={idx === currentIdx}
                isPast={idx < currentIdx}
                isFuture={idx > currentIdx}
              />
            </div>
            {idx < stages.length - 1 && (
              <div className="flex items-center pt-5 px-1">
                <div className={`h-px w-full min-w-[24px] ${idx < currentIdx ? 'bg-sage-200' : 'bg-line'}`} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 sm:hidden">
        {stages.map((stage, idx) => (
          <div key={stage.key} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${idx === currentIdx ? 'bg-sage' : idx < currentIdx ? 'bg-leaf-50' : 'bg-sage-50'} ${idx === currentIdx ? 'border-2 border-sage' : idx < currentIdx ? 'border-2 border-leaf-50' : 'border-2 border-line'}`}
              >
                <span className={`text-[12px] font-semibold ${idx === currentIdx ? 'text-white' : idx < currentIdx ? 'text-sage' : 'text-muted-500'}`}
                >
                  {idx < currentIdx ? (
                    <span className="w-3.5 h-3.5 flex items-center justify-center">
                      <i className="ri-check-line text-sm"></i>
                    </span>
                  ) : (
                    stage.label.slice(0, 1)
                  )}
                </span>
              </div>
              {idx < stages.length - 1 && (
                <div className={`w-px h-8 ${idx < currentIdx ? 'bg-sage-200' : 'bg-line'}`} />
              )}
            </div>
            <div className="pt-0.5">
              <p className={`text-[14px] font-medium ${idx === currentIdx || idx < currentIdx ? 'text-ink' : 'text-muted-500'}`}
              >
                {stage.label}
              </p>
              <p className={`text-[12px] leading-relaxed mt-0.5 ${idx === currentIdx ? 'text-ink-700' : 'text-subtle'}`}
              >
                {stage.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-t-line">
        <p className="text-[13px] leading-relaxed text-ink-700"
        >
          <strong>Current stage:</strong> {stages[currentIdx].label}. {stages[currentIdx].description}
          {status === 'grace-period' && ' Your data is safe and will remain accessible even after deactivation.'}
          {status === 'read-only' && ' Any in-flight survey has been automatically paused and will resume on renewal.'}
          {status === 'deactivated' && ' Your data is retained. Contact SFWG to restore interactive access.'}
        </p>
      </div>
    </div>
  );
}