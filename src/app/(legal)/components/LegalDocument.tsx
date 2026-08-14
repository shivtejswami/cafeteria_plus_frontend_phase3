'use client';

import { useState } from 'react';
import Link from 'next/link';
import type {
  LegalBlock,
  LegalDocumentContent,
  LegalListItem,
  LegalRun,
} from '@/app/(legal)/content/types';

function Runs({ parts }: { parts: LegalRun[] }) {
  return (
    <>
      {parts.map((part, index) =>
        part.bold ? (
          <span key={index} className="font-semibold text-[#2b2b2b]">
            {part.text}
          </span>
        ) : (
          <span key={index}>{part.text}</span>
        ),
      )}
    </>
  );
}

function ListItem({ item }: { item: LegalListItem }) {
  return (
    <li className="flex gap-2.5">
      <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-[#b8b4ac]" />
      <span className="text-[13.5px] leading-[1.75] text-[#5c5c5c]">
        {typeof item === 'string' ? (
          item
        ) : 'parts' in item ? (
          <Runs parts={item.parts} />
        ) : (
          <>
            <span className="font-semibold text-[#2b2b2b]">{item.term}</span>
            {item.separator ?? ' — '}
            {item.text}
          </>
        )}
      </span>
    </li>
  );
}

function Block({ block }: { block: LegalBlock }) {
  if (block.kind === 'p') {
    return <p className="text-[13.5px] leading-[1.75] text-[#5c5c5c]">{block.text}</p>;
  }

  if (block.kind === 'p-rich') {
    return (
      <p className="text-[13.5px] leading-[1.75] text-[#5c5c5c]">
        <Runs parts={block.parts} />
      </p>
    );
  }

  if (block.kind === 'lead') {
    return <p className="text-[13.5px] font-semibold text-[#2b2b2b]">{block.text}</p>;
  }

  if (block.kind === 'list') {
    return (
      <ul className="flex flex-col gap-2.5 pl-1">
        {block.items.map((item, index) => (
          <ListItem key={index} item={item} />
        ))}
      </ul>
    );
  }

  // Wording still with legal counsel — held visually quieter than settled clauses.
  if (block.kind === 'note-inline') {
    return <p className="text-[12.5px] leading-[1.7] text-[#b5b1aa]">{block.text}</p>;
  }

  return (
    <p className="rounded-xl border border-[#eceae6] bg-[#f8f8f7] px-4 py-3.5 text-[13px] leading-[1.75] italic text-[#9a9a9a]">
      {block.text}
    </p>
  );
}

function ContactCard({ contact }: { contact: LegalDocumentContent['contact'] }) {
  return (
    <div className="rounded-xl border border-[#eceae6] bg-[#f8f8f7] px-4 py-4 sm:px-5 sm:py-5">
      <p className="text-[14px] font-semibold text-[#2b2b2b]">{contact.heading}</p>
      <p className="mt-2 text-[13.5px] leading-[1.7] text-[#5c5c5c]">{contact.body}</p>
      <p className="mt-3 text-[13.5px] text-[#5c5c5c]">
        {contact.name} -{' '}
        <a
          href={`mailto:${contact.email}`}
          className="rounded text-iris underline-offset-2 transition-opacity hover:opacity-70 hover:underline focus:outline-none focus-visible:underline"
        >
          {contact.email}
        </a>
      </p>
    </div>
  );
}

/** Collapsible section index, collapsed by default as in the design. */
function OnThisPage({ sections }: { sections: LegalDocumentContent['sections'] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-[#eceae6] bg-[#f8f8f7]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-5 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-inset"
      >
        <span className="text-[14px] font-semibold text-[#2b2b2b]">On this page</span>
        <span
          className={`flex h-4 w-4 shrink-0 items-center justify-center text-[#6d6d6d] transition-transform duration-150 ${open ? '' : 'rotate-180'}`}
        >
          <i className="ri-arrow-up-s-line text-base" aria-hidden="true" />
        </span>
      </button>

      {open && (
        <nav className="border-t border-[#eceae6] px-5 py-4">
          <ul className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="block rounded text-[13px] leading-relaxed text-[#6d6d6d] transition-colors hover:text-iris focus:outline-none focus-visible:underline"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}

export function LegalDocument({ content }: { content: LegalDocumentContent }) {
  return (
    <article className="mx-auto w-full max-w-[760px] rounded-2xl border border-[#e8e6e1] bg-white px-4 py-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_rgba(0,0,0,0.05)] sm:px-8 sm:py-9">
      <Link
        href="/activate"
        className="inline-flex items-center gap-1.5 rounded text-[13.5px] font-medium text-iris transition-opacity hover:opacity-70 focus:outline-none focus-visible:underline"
      >
        <i className="ri-arrow-left-line text-[14px]" aria-hidden="true" />
        Back to Terms &amp; privacy
      </Link>

      <h1 className="mt-4 text-[26px] font-bold leading-tight text-[#2b2b2b] sm:text-[30px]">
        {content.title}
      </h1>
      <p className="mt-2 text-[13.5px] text-[#6d6d6d]">{content.version}</p>

      {/* Rule runs the full width of the card, as in the design. */}
      <div className="-mx-4 mt-6 border-t border-[#eceae6] sm:-mx-8" />

      {/* In plain language */}
      <div className="mt-6 rounded-xl border border-[#eceae6] bg-[#f8f8f7] px-4 py-4 sm:px-5 sm:py-5">
        <p className="text-[14px] font-semibold text-[#2b2b2b]">In plain language:</p>
        <ul className="mt-3 flex flex-col gap-2.5">
          {content.summaryPoints.map((point) => (
            <li key={point} className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center text-leaf">
                <i className="ri-check-line text-sm" aria-hidden="true" />
              </span>
              <span className="text-[13.5px] leading-[1.6] text-[#5c5c5c]">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <OnThisPage sections={content.sections} />
      </div>

      <div className="mt-2">
        {content.sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="scroll-mt-24 border-t border-[#efedea] py-7 first:border-t-0"
          >
            <h2 className="text-[17px] font-bold text-[#2b2b2b] sm:text-[18px]">{section.title}</h2>
            <div className="mt-3.5 flex flex-col gap-3.5">
              {section.blocks.map((block, index) => (
                <Block key={index} block={block} />
              ))}

              {content.contactAfterSection === section.id && <ContactCard contact={content.contact} />}
            </div>
          </section>
        ))}
      </div>

      {!content.contactAfterSection && (
        <div className="mt-2">
          <ContactCard contact={content.contact} />
        </div>
      )}
    </article>
  );
}
