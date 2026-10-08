import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const root = fileURLToPath(new URL(".", import.meta.url));
const componentsDir = path.join(root, "components");
const sharedDir = path.join(root, "shared");
const extensions = ["", ".tsx", ".ts", ".jsx", ".js"];

/**
 * Saved components import things like "@/components/ReceiptPrinter" or
 * "@/helpers/classname-helper". This resolves those imports so the original
 * files run without changes:
 *   1. "@/components/X" -> components/<any folder>/X.tsx
 *   2. anything else    -> shared/<path>
 */
function componentImports(): Plugin {
  const findFile = (base: string) =>
    extensions
      .map((ext) => base + ext)
      .find((file) => fs.existsSync(file) && fs.statSync(file).isFile());

  return {
    name: "component-imports",
    enforce: "pre",
    resolveId(source) {
      if (!source.startsWith("@/")) return null;
      const rest = source.slice(2);

      if (rest.startsWith("components/")) {
        const name = path.basename(rest);
        for (const folder of fs.readdirSync(componentsDir)) {
          const file = findFile(path.join(componentsDir, folder, name));
          if (file) return file;
        }
      }

      return findFile(path.join(sharedDir, rest)) ?? null;
    },
  };
}

export default defineConfig({
  // Relative paths, so the built site works on GitHub Pages under /uilibrary/.
  base: "./",
  plugins: [componentImports(), react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: path.join(root, "index.html"),
        preview: path.join(root, "preview.html"),
      },
    },
  },
});
