'use client';

interface GradeQuestionProps {
  options: { value: string; label: string }[];
  value: string;
  onSelect: (value: string) => void;
  privacyNote?: string;
  isK5: boolean;
  is912?: boolean;
}

const SHORT_WORDS: Record<string, string> = {
  'Kindergarten': 'K',
  '1st grade': '1',
  '2nd grade': '2',
  '3rd grade': '3',
  '4th grade': '4',
  '5th grade': '5',
};

export default function GradeQuestion({
  options,
  value,
  onSelect,
  privacyNote,
  isK5,
  is912,
}: GradeQuestionProps) {
  if (is912) {
    return (
      <div>
        <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="What grade are you in?">
          {options.map((opt) => {
            const isSelected = value === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onSelect(opt.value)}
                className={`relative rounded-[16px] flex items-center justify-center transition-all duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 active:scale-[0.995] cursor-pointer min-h-[64px] ${isSelected ? 'bg-sage-50' : 'bg-white'} ${isSelected ? 'border-2 border-sage' : 'border border-line'}`}
                role="radio"
                aria-checked={isSelected}
                aria-label={opt.value}
              >
                <span
                  className={`text-[24px] font-bold ${isSelected ? 'text-sage' : 'text-ink'}`}
                >
                  {opt.value}
                </span>
              </button>
            );
          })}
        </div>
        {privacyNote && (
          <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 mt-4 bg-sage-100">
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-shield-check-line text-[12px] text-sage"></i>
            </span>
            <span className="text-[12px] font-medium text-sage">{privacyNote}</span>
          </div>
        )}
      </div>
    );
  }

  if (!isK5) {
    return (
      <div>
        <div className="grid grid-cols-3 gap-2.5" role="radiogroup" aria-label="What grade are you in?">
          {options.map((opt) => {
            const isSelected = value === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onSelect(opt.value)}
                className={`relative rounded-2xl flex items-center justify-center transition-all duration-[120ms] focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 active:scale-[0.99] cursor-pointer min-h-[76px] ${isSelected ? 'bg-sage-50' : 'bg-white'} ${isSelected ? 'border-2 border-sage' : 'border-[1.5px] border-line'} ${isSelected ? 'shadow-[0_4px_16px_rgba(88,109,77,0.12)]' : 'shadow-[0_1px_3px_rgba(0,0,0,0.03)]'}`}
                role="radio"
                aria-checked={isSelected}
                aria-label={opt.label}
              >
                <span className={`text-[28px] font-bold ${isSelected ? 'text-sage' : 'text-ink'}`}>
                  {opt.value}
                </span>
              </button>
            );
          })}
        </div>
        {privacyNote && (
          <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 mt-4 bg-sage-100">
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-shield-check-line text-[13px] text-sage"></i>
            </span>
            <span className="text-[13px] font-medium text-sage">{privacyNote}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 max-w-[335px] mx-auto" role="radiogroup" aria-label="What grade are you in?">
        {options.map((opt) => {
          const isSelected = value === opt.value;
          const num = SHORT_WORDS[opt.label] || opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onSelect(opt.value)}
              className={`relative rounded-[24px] p-[14px] flex flex-col items-center justify-center gap-[4px] rotate-0 opacity-100 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 active:scale-[0.97] cursor-pointer w-full max-w-[159.5px] h-[104px] mx-auto ${isSelected ? 'bg-sage-50' : 'bg-white'} ${isSelected ? 'border-2 border-sage' : 'border-2 border-line'} ${isSelected ? 'shadow-[0_4px_20px_rgba(88,109,77,0.15)]' : 'shadow-[0_2px_8px_rgba(0,0,0,0.03)]'}`}
              role="radio"
              aria-checked={isSelected}
              aria-label={opt.label}
            >
              <span className={`text-[36px] font-extrabold leading-none ${isSelected ? 'text-sage' : 'text-ink'}`}>
                {num}
              </span>
              <span className={`text-[15px] font-semibold text-center leading-tight ${isSelected ? 'text-sage' : 'text-muted'}`}>
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>

      {privacyNote && (
        <div className="flex items-center gap-2 rounded-full px-4 py-3 mt-5 bg-sage-100 w-full">
          <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">
            <i className="ri-shield-check-line text-[15px] text-sage"></i>
          </span>
          <span className="text-[13px] leading-[19.5px] tracking-[0px] font-medium text-sage align-middle font-sans">{privacyNote}</span>
        </div>
      )}
    </div>
  );
}