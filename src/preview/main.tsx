// Renders one component's live preview: preview.html#/<folder-name>
// Each component folder can have a preview.tsx with a default export.
import { type ComponentType, StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import "./preview.css";

const previews = import.meta.glob<{ default: ComponentType }>(
  "/components/*/preview.tsx",
);

const slug = window.location.hash.replace(/^#\/?/, "");
const load = previews[`/components/${slug}/preview.tsx`];
const Preview = load ? lazy(load) : null;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {Preview ? (
      <Suspense fallback={null}>
        <Preview />
      </Suspense>
    ) : (
      <p className="text-grayscale-9 text-sm">No preview for this component.</p>
    )}
  </StrictMode>,
);
