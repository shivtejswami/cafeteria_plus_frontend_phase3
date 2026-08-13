'use client';

const DAY_OPTIONS = [
  { value: '0', label: '0 days', dots: 0 },
  { value: '1', label: '1 day', dots: 1 },
  { value: '2', label: '2 days', dots: 2 },
  { value: '3', label: '3 days', dots: 3 },
  { value: '4', label: '4 days', dots: 4 },
  { value: '5', label: '5 days', dots: 5 },
];

interface FrequencyQuestionProps {
  value: string;
  onSelect: (value: string) => void;
  question: string;
  isK5: boolean;
  is912?: boolean;
}

export default function FrequencyQuestion({ value, onSelect, question, isK5, is912 }: FrequencyQuestionProps) {
  if (is912) {
    return (
      <div className="flex flex-col gap-2" role="radiogroup" aria-label={question}>
        {DAY_OPTIONS.map((opt) => {
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
      <div className="flex flex-col gap-2.5" role="radiogroup" aria-label={question}>
        {DAY_OPTIONS.map((opt) => {
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
    <div className="flex flex-col gap-3" role="radiogroup" aria-label={question}>
      {DAY_OPTIONS.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={`w-full flex items-center gap-4 rounded-[22px] py-5 px-5 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 active:scale-[0.98] cursor-pointer min-h-[68px] ${isSelected ? 'bg-sage-50' : 'bg-white'} ${isSelected ? 'border-2 border-sage' : 'border-2 border-line'} ${isSelected ? 'shadow-[0_4px_20px_rgba(88,109,77,0.15)]' : 'shadow-[0_2px_8px_rgba(0,0,0,0.03)]'}`}
            role="radio"
            aria-checked={isSelected}
            aria-label={opt.label}
          >
            <span className={`text-[24px] font-bold flex-shrink-0 min-w-[90px] text-left ${isSelected ? 'text-sage' : 'text-ink'}`}>
              {opt.label}
            </span>

            {opt.dots > 0 && (
              <span className="flex items-center gap-2 flex-1" aria-hidden="true">
                {Array.from({ length: opt.dots }).map((_, i) => (
                  <span
                    key={i}
                    className={`w-3 h-3 rounded-full flex-shrink-0 ${isSelected ? 'bg-sage' : 'bg-[#d6d2c8]'}`}
                  />
                ))}
              </span>
            )}

            {isSelected && (
              <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ml-auto bg-sage">
                <i className="ri-check-line text-[16px] text-white"></i>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}