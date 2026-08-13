'use client';

const SATISFACTION_OPTIONS = [
  { value: 'yes', label: 'Yes', emoji: '\u{1F642}', emojiLabel: 'Happy face' },
  { value: 'sometimes', label: 'Sometimes', emoji: '\u{1F610}', emojiLabel: 'Neutral face' },
  { value: 'no', label: 'No', emoji: '\u{1F615}', emojiLabel: 'Sad face' },
];

interface SatisfactionQuestionProps {
  value: string;
  onSelect: (value: string) => void;
  gradeBand: 'K-5' | '6-8' | '9-12';
}

export default function SatisfactionQuestion({ value, onSelect, gradeBand }: SatisfactionQuestionProps) {
  const isK5 = gradeBand === 'K-5';
  const is912 = gradeBand === '9-12';

  if (is912) {
    return (
      <div className="flex flex-col gap-2" role="radiogroup" aria-label="Answer options: Yes, Sometimes, No">
        {[
          { value: 'yes', label: 'Yes' },
          { value: 'sometimes', label: 'Sometimes' },
          { value: 'no', label: 'No' },
        ].map((opt) => {
          const isSelected = value === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onSelect(opt.value)}
              className={`w-full rounded-[16px] px-4 transition-all duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 active:scale-[0.995] cursor-pointer min-h-[44px] ${isSelected ? 'bg-sage-50' : 'bg-white'} ${isSelected ? 'border-2 border-sage' : 'border border-line'}`}
              role="radio"
              aria-checked={isSelected}
              aria-label={opt.label}
            >
              <div className="flex items-center py-3">
                <span
                  className={`text-[15px] font-medium ${isSelected ? 'text-sage' : 'text-ink'}`}
                >
                  {opt.label}
                </span>
                {isSelected && (
                  <span className="ml-auto w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-sage">
                    <i className="ri-check-line text-[12px] text-white"></i>
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  if (!isK5) {
    return (
      <div className="flex flex-col gap-2.5" role="radiogroup" aria-label="Answer options: Yes, Sometimes, No">
        {SATISFACTION_OPTIONS.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onSelect(opt.value)}
              className={`w-full rounded-2xl px-5 transition-all duration-[120ms] focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 active:scale-[0.99] cursor-pointer min-h-[54px] ${isSelected ? 'bg-sage-50' : 'bg-white'} ${isSelected ? 'border-2 border-sage' : 'border-[1.5px] border-line'} ${isSelected ? 'shadow-[0_4px_16px_rgba(88,109,77,0.12)]' : 'shadow-[0_1px_3px_rgba(0,0,0,0.03)]'}`}
              role="radio"
              aria-checked={isSelected}
              aria-label={opt.label}
            >
              <div className="flex items-center">
                <span className={`text-[18px] font-medium ${isSelected ? 'text-sage' : 'text-ink'}`}>
                  {opt.label}
                </span>
                {isSelected && (
                  <span className="ml-auto w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-sage">
                    <i className="ri-check-line text-[14px] text-white"></i>
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3" role="radiogroup" aria-label="Answer options: Yes, Sometimes, No">
      {SATISFACTION_OPTIONS.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={`w-full flex items-center gap-5 rounded-[24px] py-5 px-5 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 active:scale-[0.98] cursor-pointer min-h-[88px] ${isSelected ? 'bg-sage-50' : 'bg-white'} ${isSelected ? 'border-2 border-sage' : 'border-2 border-line'} ${isSelected ? 'shadow-[0_4px_20px_rgba(88,109,77,0.15)]' : 'shadow-[0_2px_8px_rgba(0,0,0,0.03)]'}`}
            role="radio"
            aria-checked={isSelected}
            aria-label={opt.label}
          >
            <span
              className={`w-[68px] h-[68px] rounded-[22px] flex items-center justify-center flex-shrink-0 text-[44px] leading-none transition-colors duration-150 ${isSelected ? 'bg-white' : 'bg-canvas'}`}
              role="img"
              aria-label={opt.emojiLabel}
            >
              {opt.emoji}
            </span>
            <span
              className={`text-[24px] font-bold ${isSelected ? 'text-sage' : 'text-ink'}`}
            >
              {opt.label}
            </span>
            {isSelected && (
              <span className="ml-auto w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-sage">
                <i className="ri-check-line text-[17px] text-white"></i>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}