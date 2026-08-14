import type { LegalDocumentContent } from './types';

export const PRIVACY_NOTICE: LegalDocumentContent = {
  title: 'Privacy Notice',
  version: 'Version 1.0 · Last updated August 2026',
  summaryPoints: [
    'Student responses are anonymous — no names, emails, or student IDs are collected.',
    'Only grade level is collected about a respondent.',
    'You’ll see totals and themes, never an individual student’s answers.',
  ],
  // The design closes section 12 with the contact box rather than the document.
  contactAfterSection: 'your-rights-contact',
  sections: [
    {
      id: 'introduction-scope',
      title: '1. Introduction & scope',
      blocks: [
        {
          kind: 'p',
          text: 'This Privacy Notice explains how the School Food & Wellness Group ("sfwg", "we", "us", or "our") collects, uses, and protects information through the Cafeteria Pulse platform ("the Platform").',
        },
        { kind: 'p', text: 'This notice covers two groups of people whose data interacts with the Platform:' },
        {
          kind: 'list',
          items: [
            {
              term: 'Administrators',
              text: 'school and district staff who have an account on the Platform to manage surveys, view reports, and administer their organisation’s survey programme.',
            },
            {
              term: 'Student respondents',
              text: 'K-12 students who participate in anonymous meal experience surveys through a link, QR code, or access code provided by their school.',
            },
          ],
        },
        {
          kind: 'p',
          text: 'sfwg provides Cafeteria Pulse to help schools and districts understand student meal experiences through aggregated, de-identified data. Protecting the privacy of both administrators and students is fundamental to how the Platform is designed.',
        },
      ],
    },
    {
      id: 'roles-controller-processor',
      title: '2. Roles — controller & processor',
      blocks: [
        {
          kind: 'p',
          text: 'Under data protection law, different parties have different responsibilities. For the Cafeteria Pulse Platform:',
        },
        {
          kind: 'list',
          items: [
            {
              parts: [
                { text: 'The Customer', bold: true },
                { text: ' (the school or district named in your account) is the ' },
                { text: 'data controller', bold: true },
                {
                  text: ' for its survey programme. The Customer determines the purpose of collecting survey responses (understanding student meal experiences) and is responsible for compliance with applicable data protection laws, including any obligations to inform parents or students about the survey.',
                },
              ],
            },
            {
              parts: [
                { text: 'sfwg / Cafeteria Pulse', bold: true },
                { text: ', operated by Fonix as the technology provider, acts as the ' },
                { text: 'data processor', bold: true },
                {
                  text: '. We process survey response data and administrator account data solely on the Customer’s documented instructions: to generate aggregated reports, compute benchmarks, and maintain the Platform.',
                },
              ],
            },
          ],
        },
        {
          kind: 'note-inline',
          text: 'A Data Processing Agreement (DPA) governs the processor relationship between sfwg and the Customer. — Placeholder; DPA terms to be confirmed by sfwg legal.',
        },
      ],
    },
    {
      id: 'what-we-collect',
      title: '3. What we collect',
      blocks: [
        { kind: 'lead', text: 'From student respondents' },
        {
          kind: 'p-rich',
          parts: [
            { text: 'Student surveys on Cafeteria Pulse are ' },
            { text: 'anonymous by design', bold: true },
            { text: '. When a student responds to a survey, the Platform collects:' },
          ],
        },
        {
          kind: 'list',
          items: [
            'Survey answers — responses to scaled questions (e.g., satisfaction ratings, frequency scales) and optional open-text comments about meal experiences.',
            'Grade level only — the student’s grade band (e.g., 3-5, 6-8, 9-12). This is the only demographic data point collected and is used solely to enable grade-level breakdowns in reports.',
          ],
        },
        {
          kind: 'p-rich',
          parts: [
            { text: 'The Platform does ' },
            { text: 'not', bold: true },
            {
              text: ' collect student names, email addresses, student ID numbers, IP addresses, device fingerprints, or any other information that could directly identify an individual student. Responses are anonymous and cannot be linked back to a specific child.',
            },
          ],
        },
        { kind: 'lead', text: 'From administrators' },
        { kind: 'p', text: 'For school and district staff with Platform accounts, we collect:' },
        {
          kind: 'list',
          items: ['Full name', 'Work email address', 'Role (District Administrator or School Administrator)'],
        },
        {
          kind: 'p',
          text: 'Account activity data — login timestamps, actions taken within the Platform (e.g., launching a survey, viewing a report), and account status changes. This activity data is used for security, audit, and support purposes.',
        },
      ],
    },
    {
      id: 'how-we-use-it',
      title: '4. How we use it',
      blocks: [
        { kind: 'p', text: 'We process the data described in Section 3 for the following purposes:' },
        {
          kind: 'list',
          items: [
            {
              term: 'Generating aggregated, de-identified reports',
              text: 'survey responses are combined and presented as totals, averages, distributions, and themes. No individual student’s answers are visible in any report.',
            },
            {
              term: 'Computing participating-school benchmarks',
              text: 'anonymised, aggregated data from multiple schools is used to calculate benchmark values. Benchmarks are displayed only when the contributing cohort meets the Platform’s minimum threshold.',
            },
            {
              term: 'AI analysis of open-text comments',
              text: 'open-ended responses are processed by an AI classification system that identifies themes and sentiment categories. This analysis is deterministic and operates on anonymous text; it never attempts to identify, profile, or attribute comments to any individual.',
            },
            {
              term: 'Operating the service',
              text: 'managing administrator accounts, processing survey launches, securing the Platform, and maintaining an audit trail of significant actions.',
            },
            {
              term: 'Support and quality control',
              text: 'investigating technical issues, monitoring Platform performance, and ensuring survey data quality.',
            },
          ],
        },
      ],
    },
    {
      id: 'anonymity-safeguards',
      title: '5. Anonymity & re-identification safeguards',
      blocks: [
        {
          kind: 'p',
          text: 'Cafeteria Pulse is designed from the ground up so that no one — not school administrators, not district administrators, not sfwg staff — can single out or identify an individual student from survey data. The Platform includes multiple, overlapping safeguards:',
        },
        {
          kind: 'list',
          items: [
            {
              term: 'Small-sample suppression',
              text: 'detailed results are automatically hidden when the number of respondents in a breakdown (e.g., a specific grade at a specific school) falls below the Platform’s minimum response threshold. Only aggregated, safe-to-display summaries are shown.',
            },
            {
              term: 'Benchmark de-identification',
              text: 'benchmarks are calculated from aggregated data across multiple schools. A concentration limit ensures no single school can dominate or be reverse-engineered from a benchmark value. Individual schools are never named in benchmarks.',
            },
            {
              term: 'Group-level display only',
              text: 'all results are presented as group totals, averages, distributions, and thematic summaries. There is no interface, export, or API endpoint that exposes individual student responses to any user.',
            },
            {
              term: 'No re-identification permitted',
              text: 'administrators are contractually prohibited from attempting to re-identify, de-anonymise, or link anonymous survey responses to individual students (see Platform Terms, Section 4).',
            },
          ],
        },
      ],
    },
    {
      id: 'who-can-see-the-data',
      title: '6. Who can see the data',
      blocks: [
        { kind: 'p', text: 'Access to data within Cafeteria Pulse is role-scoped and tenant-isolated:' },
        {
          kind: 'list',
          items: [
            {
              term: 'School administrators',
              separator: '- ',
              text: 'see only the aggregated reports for their own school. They cannot view data belonging to another school.',
            },
            {
              term: 'District administrators',
              separator: ' - ',
              text: 'see aggregated reports for the schools within their district. They cannot view data belonging to schools in another district.',
            },
            {
              term: 'sfwg platform operations staff',
              separator: ' ',
              text: 'may access platform-level data as necessary to operate the service: investigating technical issues, performing quality control on reports, providing customer support, and maintaining the audit trail. This access is limited, logged, and governed by internal access policies.',
            },
          ],
        },
        {
          kind: 'p',
          text: 'Report review status displayed to customers (e.g., whether a report has passed automated quality checks) is neutral and factual. Internal review notes, quality-control commentary, and any non-customer-facing metadata are never exposed to customers.',
        },
      ],
    },
    {
      id: 'sharing-sub-processors',
      title: '7. Sharing & sub-processors',
      blocks: [
        {
          kind: 'p',
          text: 'sfwg does not sell, rent, or trade any data collected through Cafeteria Pulse. Data is shared only in the following limited circumstances:',
        },
        {
          kind: 'list',
          items: [
            {
              term: 'With sub-processors',
              text: 'who provide services essential to operating the Platform. These include the cloud hosting provider, the AI analysis service that processes open-text comments, and any infrastructure or monitoring services required for Platform operations. All sub-processors are bound by contractual obligations to protect data and process it only on sfwg’s documented instructions.',
            },
            {
              term: 'As required by law',
              text: 'sfwg may disclose data if required to do so by a valid legal process, court order, or applicable regulation.',
            },
          ],
        },
      ],
    },
    {
      id: 'data-retention',
      title: '8. Data retention',
      blocks: [
        {
          kind: 'p',
          text: 'Survey response data and the resulting reports are retained for the duration of the Customer’s active subscription and for a defined retention period thereafter.',
        },
        {
          kind: 'p',
          text: 'Reports generated during the subscription term are retained as historical records, subject to the same retention policy. After the retention period expires, data is securely deleted in accordance with sfwg’s data deletion procedures.',
        },
        {
          kind: 'p',
          text: 'Administrator account data is retained for the duration of the account’s active status plus any period required for audit, legal, or legitimate business purposes. Inactive administrator accounts may be deactivated after a period of non-use.',
        },
      ],
    },
    {
      id: 'data-deletion-requests',
      title: '9. Data deletion & requests',
      blocks: [
        {
          kind: 'p',
          text: 'The Customer may request permanent deletion of their survey data at any time through the sfwg-approved deletion-request process.',
        },
        { kind: 'p', text: 'When a deletion request is received and validated, sfwg will:' },
        {
          kind: 'list',
          items: [
            'Confirm the request with the Customer’s authorised contact;',
            'Execute the deletion within a reasonable timeframe, subject to any legal obligations requiring retention of certain records;',
            'Create an audit record confirming that the deletion was completed, including the scope and timestamp of the deletion.',
          ],
        },
        {
          kind: 'p',
          text: 'Data remains retained until the deletion request is fully executed. Once deleted, data is permanently removed and cannot be recovered.',
        },
      ],
    },
    {
      id: 'security',
      title: '10. Security',
      blocks: [
        { kind: 'note-inline', text: 'Placeholder — final wording to be confirmed by sfwg legal.' },
        {
          kind: 'p',
          text: 'sfwg implements technical and organisational measures to protect data processed through the Platform. These measures include:',
        },
        {
          kind: 'list',
          items: [
            {
              term: 'Access controls & role scoping',
              text: 'role-based access ensures users can only see data within their authorised scope. Tenant isolation prevents cross-organisation data access.',
            },
            {
              term: 'Encryption in transit',
              text: 'all data transmitted between users and the Platform is encrypted using industry-standard TLS.',
            },
            {
              term: 'Audit logging',
              text: 'significant actions (account changes, data access events, report generation, deletion requests) are logged and retained for security monitoring and compliance.',
            },
          ],
        },
      ],
    },
    {
      id: 'childrens-privacy',
      title: '11. Children’s privacy',
      blocks: [
        {
          kind: 'p',
          text: 'The student respondents who participate in Cafeteria Pulse surveys are K-12 students. Protecting their privacy is our highest priority.',
        },
        {
          kind: 'p',
          text: 'The survey is anonymous by design. No personal data is collected from student respondents beyond their grade level. Because no names, contact information, identifiers, or persistent tracking mechanisms are used, the Platform does not collect "personal information" from children in a way that would require parental consent under applicable children’s privacy laws.',
        },
        {
          kind: 'p',
          text: 'The Customer (school or district) is responsible for providing appropriate notice to parents and students about the survey programme in accordance with its own policies and applicable law. sfwg supports the Customer in meeting these obligations by maintaining the Platform’s anonymous data-collection design.',
        },
      ],
    },
    {
      id: 'your-rights-contact',
      title: '12. Your rights & contact',
      blocks: [
        {
          kind: 'p',
          text: 'Administrators and the organisations they represent have rights regarding the data processed through the Platform. These may include the right to access, correct, export, or request deletion of data, depending on the applicable data protection laws in the Customer’s jurisdiction.',
        },
        {
          kind: 'p',
          text: 'To exercise these rights or ask questions about data practices, please contact sfwg directly.',
        },
      ],
    },
    {
      id: 'changes-to-this-notice',
      title: '13. Changes to this notice',
      blocks: [
        {
          kind: 'p',
          text: 'sfwg may update this Privacy Notice from time to time to reflect changes in data practices, the Platform, or applicable law. When material changes are made, sfwg will notify Customers through the Platform or via the contact information associated with the Customer’s account.',
        },
        {
          kind: 'p',
          text: 'The version number and last-updated date are displayed at the top of this page so you can see when the notice was last revised. Continued use of the Platform after the effective date of an updated notice constitutes acceptance of the revised terms.',
        },
        {
          kind: 'p',
          text: 'We encourage you to review this Privacy Notice periodically to stay informed about how we protect your data.',
        },
      ],
    },
  ],
  contact: {
    heading: 'Questions about your data?',
    body: 'If you have questions about this Privacy Notice or wish to exercise your data rights, please contact the School Food & Wellness Group.',
    name: 'Madeline Smith',
    email: 'madeline@sfwgroup.org(dummy)',
  },
};
