// Reads every component in /components at build time.
// Each folder has a component.json (info) and the original code files.

export type ComponentInfo = {
  name: string;
  description: string;
  source?: string;
  stack?: string[];
  install?: string;
  requires?: string[];
  /** Height of the live preview in px. Needs a preview.tsx in the folder. */
  previewHeight?: number;
  /** Code files to show, in this order. */
  files: string[];
};

export type ComponentEntry = ComponentInfo & {
  slug: string;
  hasPreview: boolean;
  code: { name: string; content: string }[];
};

const infos = import.meta.glob<ComponentInfo>("/components/*/component.json", {
  eager: true,
  import: "default",
});

const previews = import.meta.glob("/components/*/preview.tsx");

const sources = import.meta.glob<string>(
  "/components/*/*.{ts,tsx,js,jsx,css}",
  { eager: true, query: "?raw", import: "default" },
);

export const components: ComponentEntry[] = Object.entries(infos)
  .map(([path, info]) => {
    const slug = path.split("/")[2];

    return {
      ...info,
      slug,
      hasPreview: `/components/${slug}/preview.tsx` in previews,
      code: info.files.map((name) => ({
        name,
        content: sources[`/components/${slug}/${name}`] ?? "",
      })),
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));
