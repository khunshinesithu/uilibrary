import { useState } from "react";
import type { ComponentEntry } from "../registry";
import { CodeBlock } from "./CodeBlock";
import { CopyButton } from "./CopyButton";

export function ComponentPage({ entry }: { entry: ComponentEntry }) {
  const [activeFile, setActiveFile] = useState(0);
  const file = entry.code[activeFile];

  return (
    <article className="detail">
      <a className="back" href="#/">
        ← All components
      </a>

      <header className="detail-head">
        <h1>{entry.name}</h1>
        <p>{entry.description}</p>
        <div className="tags">
          {entry.stack?.map((s) => (
            <span className="tag" key={s}>
              {s}
            </span>
          ))}
          {entry.source ? (
            <a className="source" href={entry.source} rel="noreferrer" target="_blank">
              Source ↗
            </a>
          ) : null}
        </div>
      </header>

      {entry.install ? (
        <section>
          <h2>Install</h2>
          <div className="command">
            <code>{entry.install}</code>
            <CopyButton text={entry.install} />
          </div>
        </section>
      ) : null}

      {entry.requires?.length ? (
        <section>
          <h2>Also needs</h2>
          <p className="hint">Not included here. Your project must have these.</p>
          <ul className="requires">
            {entry.requires.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section>
        <h2>Code</h2>
        <div className="code-panel">
          <div className="code-bar">
            <div className="file-tabs" role="tablist">
              {entry.code.map((f, i) => (
                <button
                  aria-selected={i === activeFile}
                  className="file-tab"
                  key={f.name}
                  onClick={() => setActiveFile(i)}
                  role="tab"
                  type="button"
                >
                  {f.name}
                </button>
              ))}
            </div>
            {file ? <CopyButton text={file.content} /> : null}
          </div>
          {file ? <CodeBlock code={file.content} /> : null}
        </div>
      </section>
    </article>
  );
}
