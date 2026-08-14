/** Shared shape for the public Platform Terms and Privacy Notice documents. */

/** Inline run used wherever a sentence mixes bold and normal text. */
export type LegalRun = { text: string; bold?: boolean };

export type LegalListItem =
  /** Plain sentence. */
  | string
  /** Bolded term, then its explanation. `separator` defaults to an em dash. */
  | { term: string; text: string; separator?: string }
  /** Bullet whose sentence bolds more than one run. */
  | { parts: LegalRun[] };

export type LegalBlock =
  | { kind: 'p'; text: string }
  /** Paragraph with bolded runs inline, e.g. the two administrator role names. */
  | { kind: 'p-rich'; parts: LegalRun[] }
  /** Small bold run-in heading inside a section, e.g. "From student respondents". */
  | { kind: 'lead'; text: string }
  | { kind: 'list'; items: LegalListItem[] }
  /** Tinted box for wording that is still with legal counsel. */
  | { kind: 'note'; text: string }
  /** Same meaning as `note`, but set as quiet running text rather than a box. */
  | { kind: 'note-inline'; text: string };

export type LegalSection = {
  /** Anchor target, also used by the "On this page" list. */
  id: string;
  title: string;
  blocks: LegalBlock[];
};

export type LegalDocumentContent = {
  title: string;
  version: string;
  summaryPoints: string[];
  sections: LegalSection[];
  /**
   * Section the contact box sits inside. Left unset, it closes the document
   * instead — the Platform Terms place it after the final section.
   */
  contactAfterSection?: string;
  contact: {
    heading: string;
    body: string;
    name: string;
    email: string;
  };
};
