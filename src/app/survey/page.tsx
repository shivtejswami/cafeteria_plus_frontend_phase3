'use client';

import Link from 'next/link';
import { schoolSurveyConfigs, SchoolSurveyConfig } from '@/lib/studentSurveyData';

const BAND_LABELS: Record<string, string> = {
  'K-5': 'Grades K\u20135',
  '6-8': 'Grades 6\u20138',
  '9-12': 'Grades 9\u201312',
};

const STATUS_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  'open': { label: 'Open', bg: 'bg-sage-100', color: 'text-sage' },
  'not-started': { label: 'Not started', bg: 'bg-gold-50', color: 'text-gold-900' },
  'paused': { label: 'Paused', bg: 'bg-iris-50', color: 'text-iris' },
  'closed': { label: 'Closed', bg: 'bg-[#f5f5f5]', color: 'text-subtle' },
  'cancelled': { label: 'Cancelled', bg: 'bg-[#fef0f0]', color: 'text-[#c0392b]' },
  'link-invalid': { label: 'Link invalid', bg: 'bg-[#fef0f0]', color: 'text-[#c0392b]' },
};

function groupByBand(configs: Record<string, SchoolSurveyConfig>) {
  const grouped: Record<string, SchoolSurveyConfig[]> = {};
  for (const school of Object.values(configs)) {
    if (!grouped[school.gradeBand]) grouped[school.gradeBand] = [];
    grouped[school.gradeBand].push(school);
  }
  return grouped;
}

export default function SurveyIndexPage() {
  const grouped = groupByBand(schoolSurveyConfigs);
  const bands = ['K-5', '6-8', '9-12'];

  return (
    <div className="min-h-screen bg-canvas">
      <div className="w-full max-w-[960px] mx-auto px-5 py-12">
        <div className="mb-10">
          <h1
            className="text-[22px] sm:text-[28px] font-bold mb-2 text-ink"
          >
            Student Survey Previews
          </h1>
          <p className="text-[15px] text-muted">
            Jump into any school survey to test the student experience across grade bands.
          </p>
        </div>

        {bands.map((band) => {
          const schools = grouped[band];
          if (!schools || schools.length === 0) return null;

          const iconMap: Record<string, string> = {
            'K-5': 'ri-shield-star-line',
            '6-8': 'ri-compass-3-line',
            '9-12': 'ri-focus-3-line',
          };

          return (
            <div key={band} className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${band === '6-8' ? 'bg-sage-100' : band === 'K-5' ? 'bg-[#fef3e0]' : 'bg-iris-50'}`}
                >
                  <i
                    className={`${iconMap[band] || 'ri-survey-line'} text-[20px] ${band === '6-8' ? 'text-sage' : band === 'K-5' ? 'text-[#b86d14]' : 'text-iris'}`}
                  ></i>
                </span>
                <h2
                  className="text-[22px] font-bold text-ink"
                >
                  {BAND_LABELS[band] || band}
                </h2>
                <span className="text-[13px] font-medium px-2.5 py-1 rounded-full bg-line-soft text-muted">
                  {schools.length} school{schools.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {schools.map((school) => {
                  const status = STATUS_BADGE[school.surveyStatus] || STATUS_BADGE['closed'];
                  const isOpen = school.surveyStatus === 'open';

                  const card = (
                    <div
                      key={school.schoolCode}
                      className={`rounded-2xl p-5 transition-all duration-[120ms] bg-surface ${isOpen ? 'border-1.5 border-line' : 'border-1.5 border-line'} shadow-[0_1px_3px_rgba(0,0,0,0.03)] ${isOpen ? 'opacity-100' : 'opacity-65'}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3
                            className="text-[17px] font-semibold mb-1 text-ink"
                          >
                            {school.schoolName}
                          </h3>
                          <span
                            className={`inline-block text-[12px] font-semibold px-2.5 py-1 rounded-full ${status.bg} ${status.color}`}
                          >
                            {status.label}
                          </span>
                        </div>
                        {isOpen && (
                          <span className="w-9 h-9 rounded-xl flex items-center justify-center bg-sage-50">
                            <i className="ri-arrow-right-line text-[18px] text-sage"></i>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-[13px] text-muted">
                        <span className="flex items-center gap-1.5">
                          <span className="w-4 h-4 flex items-center justify-center">
                            <i className="ri-key-line text-[13px]"></i>
                          </span>
                          {school.requiresAccessCode ? 'Access code required' : 'No access code'}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-4 h-4 flex items-center justify-center">
                            <i className="ri-question-answer-line text-[13px]"></i>
                          </span>
                          {school.questionCount} questions
                        </span>
                      </div>
                    </div>
                  );

                  if (isOpen) {
                    return (
                      <Link key={school.schoolCode} href={`/survey/${school.schoolCode}`} className="block group cursor-pointer">
                        <div className="group-hover:shadow-md transition-shadow duration-[120ms] rounded-2xl">
                          {card}
                        </div>
                      </Link>
                    );
                  }

                  return (
                    <div key={school.schoolCode}>
                      {card}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div
          className="rounded-2xl p-5 mt-6 bg-surface border border-line shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
        >
          <div className="flex items-start gap-3">
            <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 bg-iris-50">
              <i className="ri-information-line text-[16px] text-iris"></i>
            </span>
            <div>
              <p className="text-[14px] font-semibold mb-1 text-ink">
                This page is for testing only
              </p>
              <p className="text-[13px] leading-relaxed text-muted">
                Students reach the survey directly via <code className="text-[12px] px-1.5 py-0.5 rounded bg-line-soft text-sage">/survey/{'{schoolCode}'}</code> — they never see this index. Closed, paused, and cancelled surveys show their state screens, not the survey itself.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}