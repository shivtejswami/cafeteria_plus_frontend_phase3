'use client';

const OPTIONS = [
  { value: 'yes', label: 'Yes', iconPath: 'M0 44H44V1.3113e-05H0V44Z' },
  { value: 'sometimes', label: 'Sometimes', iconPath: 'M0 44H44V1.3113e-05H0V44Z' },
  { value: 'no', label: 'No', iconPath: 'M0 44H44V-1.74046e-05H0V44Z' },
];

interface ThreePointBlockProps {
  question: string;
  questionId: string;
  value: string;
  onChange: (value: string) => void;
  highlightUnanswered?: boolean;
}

export default function ThreePointBlock({
  question,
  questionId,
  value,
  onChange,
  highlightUnanswered,
}: ThreePointBlockProps) {
  const isUnanswered = !value && highlightUnanswered;

  return (
    <div
      role="radiogroup"
      aria-label={question}
      className={isUnanswered ? 'rounded-[12px] p-3 -mx-3 bg-[#faf5ff] border-[1.5px] border-[#e9d5ff]' : ''}
    >
      <h1
        className="text-[22px] font-bold mb-5 leading-snug text-ink"
      >
        {question}
      </h1>
      <div className="flex flex-col gap-2.5" role="radiogroup" aria-label={question}>
        {OPTIONS.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`w-full text-left rounded-[16px] transition-all duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 active:scale-[0.99] cursor-pointer ${isSelected ? 'bg-sage-50' : 'bg-white'} ${isSelected ? 'border-2 border-sage' : 'border-[1.5px] border-line'}`}
              role="radio"
              aria-checked={isSelected}
            >
              <div className="flex items-center gap-3 px-4 py-3.5">
                <svg
                  width="44"
                  height="44"
                  viewBox="0 0 44 44"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="w-6 h-6 flex-shrink-0"
                >
                  <path d={opt.iconPath} fill="black" />
                </svg>
                <span
                  className={`text-[15px] sm:text-[16px] font-medium leading-snug flex-1 break-words ${isSelected ? 'text-sage font-semibold' : 'text-ink'}`}
                >
                  {opt.label}
                </span>
                {isSelected && (
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-sage"
                  >
                    <i className="ri-check-line text-[12px] text-white"></i>
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}