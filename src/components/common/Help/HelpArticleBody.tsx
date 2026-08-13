import Link from 'next/link';

/**
 * Renders the light markup used by help article bodies:
 *   blank line   → new block          `- `  → bullet list
 *   `1. `        → numbered steps     `> `  → info note
 *   `! `         → warning note       `## ` / `### ` → headings
 *   `[label](/path)` → inline link (internal paths use next/link)
 */

type InlinePart = string | { url: string; label: string; internal: boolean };

function parseInlineLinks(text: string): InlinePart[] {
  const parts: InlinePart[] = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    parts.push({ label: match[1], url: match[2], internal: match[2].startsWith('/') });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));

  return parts;
}

function RenderInline({ text }: { text: string }) {
  const parts = parseInlineLinks(text);
  if (parts.every((p) => typeof p === 'string')) return <>{text}</>;

  return (
    <>
      {parts.map((part, i) => {
        if (typeof part === 'string') return <span key={i}>{part}</span>;
        if (part.internal) {
          return (
            <Link
              key={i}
              href={part.url}
              className="font-medium underline underline-offset-2 transition-colors duration-150 hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 rounded text-iris"
            >
              {part.label}
            </Link>
          );
        }
        return (
          <a
            key={i}
            href={part.url}
            className="font-medium underline underline-offset-2 transition-colors duration-150 hover:opacity-80 text-iris"
          >
            {part.label}
          </a>
        );
      })}
    </>
  );
}

function RenderBlock({ block }: { block: string }) {
  if (block.startsWith('! ')) {
    return (
      <div className="rounded-xl p-4 flex items-start gap-3 bg-[#fff7ed] border border-[#fed7aa]">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[#ffedd5]">
          <span className="w-4 h-4 flex items-center justify-center text-gold">
            <i className="ri-alert-line text-base"></i>
          </span>
        </div>
        <p className="flex-1 min-w-0 text-[14px] leading-relaxed wrap-break-word text-gold-800">
          <RenderInline text={block.slice(2)} />
        </p>
      </div>
    );
  }

  if (block.startsWith('> ')) {
    return (
      <div className="rounded-xl p-4 flex items-start gap-3 bg-sage-50 border border-sage-200">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-sage-100">
          <span className="w-4 h-4 flex items-center justify-center text-sage">
            <i className="ri-information-line text-base"></i>
          </span>
        </div>
        <p className="flex-1 min-w-0 text-[14px] leading-relaxed wrap-break-word text-sage-900">
          <RenderInline text={block.slice(2)} />
        </p>
      </div>
    );
  }

  if (block.startsWith('## ')) {
    return <h2 className="text-[17px] font-bold text-ink">{block.slice(3)}</h2>;
  }

  if (block.startsWith('### ')) {
    return <h3 className="text-[15px] font-semibold text-ink">{block.slice(4)}</h3>;
  }

  const lines = block.split('\n');
  const isBulletList = lines.length > 1 && lines.every((l) => l.startsWith('- '));
  const isNumberedList = lines.length > 1 && lines.every((l) => /^\d+\.\s/.test(l));

  if (isBulletList) {
    return (
      <ul className="space-y-1.5">
        {lines.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-[14px] leading-relaxed wrap-break-word text-ink">
            <span className="mt-[0.6em] w-1.5 h-1.5 rounded-full shrink-0 bg-sage" />
            <span>
              <RenderInline text={item.slice(2)} />
            </span>
          </li>
        ))}
      </ul>
    );
  }

  if (isNumberedList) {
    return (
      <ol className="space-y-2">
        {lines.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-[14px] leading-relaxed wrap-break-word text-ink">
            <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-semibold mt-px bg-sage-50 text-sage">
              {i + 1}
            </span>
            <span className="min-w-0">
              <RenderInline text={item.replace(/^\d+\.\s*/, '')} />
            </span>
          </li>
        ))}
      </ol>
    );
  }

  // A single newline inside a paragraph is a line break, not a space — without
  // this, stacked lines like "Accepted formats: …" run together into one string.
  return (
    <p className="text-[14px] leading-relaxed wrap-break-word text-ink">
      {lines.map((line, i) => (
        <span key={i} className="block">
          <RenderInline text={line} />
        </span>
      ))}
    </p>
  );
}

export default function HelpArticleBody({ body }: { body: string }) {
  const blocks = body.split('\n\n').filter((b) => b.trim().length > 0);

  return (
    <div className="divide-y divide-line">
      {blocks.map((block, i) => (
        <div key={i} className={i === 0 ? 'pb-4' : 'py-4 last:pb-0'}>
          <RenderBlock block={block} />
        </div>
      ))}
    </div>
  );
}
