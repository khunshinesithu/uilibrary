import { useEffect, useMemo, useRef, useState } from "react";
import { type ComponentEntry, components } from "../registry";
import { PreviewThumb } from "./PreviewThumb";

// The search text lives in the URL (#/?q=...), so Back returns to the same results.
function readQuery() {
  const search = window.location.hash.split("?")[1] ?? "";
  return new URLSearchParams(search).get("q") ?? "";
}

function writeQuery(query: string) {
  const hash = query ? `#/?q=${encodeURIComponent(query)}` : "#/";
  window.history.replaceState(null, "", hash);
}

function matches(entry: ComponentEntry, query: string) {
  const text = [entry.name, entry.description, entry.slug, ...(entry.stack ?? [])]
    .join(" ")
    .toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => text.includes(word));
}

export function HomePage() {
  const [query, setQuery] = useState(readQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useMemo(() => components.filter((c) => matches(c, query)), [query]);

  useEffect(() => writeQuery(query.trim()), [query]);

  // "/" jumps to the search box.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const typing = target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
      if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <section className="intro">
        <h1>Components</h1>
        <p>Components I saved. Open one and copy the code.</p>
      </section>

      <div className="search">
        <svg aria-hidden="true" className="search-icon" fill="none" viewBox="0 0 20 20">
          <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
          <path d="m13.5 13.5 3.5 3.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
        </svg>
        <input
          aria-label="Search components"
          autoComplete="off"
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setQuery("");
          }}
          placeholder="Search components"
          ref={inputRef}
          spellCheck={false}
          type="search"
          value={query}
        />
        {query ? (
          <button className="search-clear" onClick={() => setQuery("")} type="button">
            Clear
          </button>
        ) : (
          <kbd className="search-key">/</kbd>
        )}
      </div>

      <p aria-live="polite" className="result-count">
        {query.trim()
          ? `${results.length} of ${components.length} ${components.length === 1 ? "component" : "components"}`
          : ""}
      </p>

      {results.length ? (
        <ul className="grid">
          {results.map((c) => (
            <li key={c.slug}>
              <a className="card" href={`#/${c.slug}`}>
                {c.hasPreview ? (
                  <PreviewThumb
                    height={c.thumbnail?.height}
                    slug={c.slug}
                    title={c.name}
                    width={c.thumbnail?.width}
                  />
                ) : (
                  <div className="thumb thumb-empty">No preview</div>
                )}
                <div className="card-body">
                  <h2>{c.name}</h2>
                  <p>{c.description}</p>
                  {c.stack?.length ? (
                    <div className="tags">
                      {c.stack.map((s) => (
                        <span className="tag" key={s}>
                          {s}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty">
          <p>No components match “{query.trim()}”.</p>
          <button className="search-clear" onClick={() => setQuery("")} type="button">
            Clear search
          </button>
        </div>
      )}
    </>
  );
}
