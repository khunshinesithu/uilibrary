import { useMemo } from "react";
import { highlight } from "sugar-high";

export function CodeBlock({ code }: { code: string }) {
  // sugar-high escapes the code, so the HTML is safe to insert.
  const html = useMemo(() => highlight(code), [code]);

  return (
    <pre className="code">
      <code dangerouslySetInnerHTML={{ __html: html }} />
    </pre>
  );
}
