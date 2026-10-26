/**
 * Renders the small markdown subset blog posts are written in: blank-line
 * paragraphs, "## " headings and "- " bullet lists. Deliberately not a real
 * markdown library — the admin textarea only ever needs these three shapes,
 * and pulling in a parser for three tags is not worth the bundle weight.
 */
export function MarkdownLite({ content }: { content: string }) {
  const blocks = content.trim().split(/\n{2,}/);

  return (
    <div className="prose-content max-w-none">
      {blocks.map((block, i) => {
        const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
        if (lines.length === 0) return null;

        if (lines[0].startsWith("## ")) {
          return (
            <h2 key={i} className="mb-3 mt-8 text-[1.35rem] font-extrabold first:mt-0">
              {lines[0].slice(3)}
            </h2>
          );
        }

        if (lines.every((l) => l.startsWith("- "))) {
          return (
            <ul key={i} className="mb-5 space-y-2">
              {lines.map((l, j) => (
                <li key={j} className="flex items-start gap-3 text-[0.98rem] text-muted-foreground">
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand" />
                  {l.slice(2)}
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={i} className="mb-5 text-[1rem] leading-relaxed text-muted-foreground">
            {block}
          </p>
        );
      })}
    </div>
  );
}
