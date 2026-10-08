// Reads every component in /components at build time.
// Each folder has a component.json (info) and the original code files.

export type ComponentInfo = {
  name: string;
  description: string;
  source?: string;
  stack?: string[];
  install?: string;
  requires?: string[];
  /** Code files to show, in this order. */
  files: string[];
};

export type ComponentEntry = ComponentInfo & {
  slug: string;
  code: { name: string; content: string }[];
};

const infos = import.meta.glob<ComponentInfo>("/components/*/component.json", {
  eager: true,
  import: "default",
});

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
      code: info.files.map((name) => ({
        name,
        content: sources[`/components/${slug}/${name}`] ?? "",
      })),
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));
