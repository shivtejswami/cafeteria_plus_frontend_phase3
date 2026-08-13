const SUMMARY_POINTS = [
  'Student responses are anonymous — no names, emails, or student IDs are collected.',
  'Only grade level is collected about a respondent.',
  "You'll see totals and themes, never an individual student's answers.",
];

const PLATFORM_TERMS = [
  'By using Cafeteria Pulse, you agree to these platform terms. This agreement is between the School Food & Wellness Group ("SFWG") and the organisation named in your account ("Customer").',
  'SFWG grants Customer a non-exclusive, non-transferable right to access and use Cafeteria Pulse for the purpose of administering student surveys, viewing reports, and managing their account, subject to the subscription terms agreed at purchase.',
  'Customer is responsible for maintaining the confidentiality of account credentials and for all activity under their account. Customer must not share access with unauthorised individuals.',
  'SFWG may update these terms from time to time. Continued use of the platform after changes are posted constitutes acceptance.',
];

const PRIVACY_NOTICE = [
  'SFWG is committed to protecting student privacy. This notice explains what data is collected through Cafeteria Pulse and how it is used.',
  "Student surveys are anonymous. We do not collect student names, email addresses, student ID numbers, or any other personally identifiable information from student respondents. The only demographic data collected is the respondent's grade level, which is used for aggregate reporting only.",
  'Survey responses are aggregated and presented to administrators as totals, averages, and themes. Individual responses are never shown to school or district staff. Free-text comments are included verbatim only when they cannot reasonably identify an individual student.',
  'Account administrator information — including name, email address, and role — is collected to operate the platform. This data is not shared with third parties except as required for platform operation or by law.',
  'Data is retained for the duration of the subscription. After termination, data may be retained as described in the data retention policy or as required by applicable law.',
];

function Section({ heading, paragraphs, first }: { heading: string; paragraphs: string[]; first?: boolean }) {
  return (
    <>
      <h4 className={`text-sm mb-2 font-semibold text-[#2b2b2b] ${first ? '' : 'mt-4'}`}>{heading}</h4>
      {paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className={`text-xs leading-relaxed text-[#4a4a4a] ${
            index === paragraphs.length - 1 ? '' : 'mb-3'
          }`}
        >
          {paragraph}
        </p>
      ))}
    </>
  );
}

export function TermsSummary() {
  return (
    <div className="rounded-xl bg-[#f5f6f8] border border-[#e8e6e1] p-3 sm:p-3.5 mb-4">
      <p className="text-xs font-semibold mb-2 text-[#2b2b2b]">In plain language:</p>
      <ul className="flex flex-col gap-2">
        {SUMMARY_POINTS.map((point) => (
          <li key={point} className="flex items-start gap-2">
            <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5 text-[#586d4d]">
              <i className="ri-check-line text-sm" aria-hidden="true" />
            </span>
            <span className="text-xs leading-snug text-[#4a4a4a]">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TermsDocument() {
  return (
    <div
      className="h-40 sm:h-50 overflow-y-auto overscroll-contain rounded-xl bg-white border border-[#e8e6e1] mb-4"
      tabIndex={0}
      role="region"
      aria-label="Terms and privacy notice content"
    >
      <div className="p-3 sm:p-4">
        <Section heading="Platform Terms" paragraphs={PLATFORM_TERMS} first />
        <Section heading="Privacy Notice" paragraphs={PRIVACY_NOTICE} />
      </div>
    </div>
  );
}
