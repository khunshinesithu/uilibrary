import { useEffect, useState } from "react";
import { components } from "./registry";
import { ComponentPage } from "./site/ComponentPage";
import { HomePage } from "./site/HomePage";

// Hash routing (#/receipt-printer) works on any static host with no server setup.
function useSlug() {
  const read = () => window.location.hash.replace(/^#\/?/, "");
  const [slug, setSlug] = useState(read);

  useEffect(() => {
    const onChange = () => {
      setSlug(read());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return slug;
}

export function App() {
  const slug = useSlug();
  const entry = components.find((c) => c.slug === slug);

  return (
    <div className="shell">
      <header className="topbar">
        <a className="brand" href="#/">
          UI Library
        </a>
        <span className="count">
          {components.length} {components.length === 1 ? "component" : "components"}
        </span>
      </header>
      <main>{entry ? <ComponentPage entry={entry} key={entry.slug} /> : <HomePage />}</main>
    </div>
  );
}
