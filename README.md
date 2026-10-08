# UI Library

A personal collection of UI components I like.

Every component is a small, self-contained HTML file (HTML + CSS, sometimes a little JavaScript).
There is nothing to install and no build step.

## How to view the gallery

Open `index.html` in your browser. You will see a live preview of every component.
You can search by name and filter by tag.

If the previews do not load when you double-click the file, run a tiny local server instead:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## How to add a new component

1. Copy the template folder and give it a short name, for example `pricing-table`:

   ```bash
   cp -r components/_template components/pricing-table
   ```

2. Build your component inside `components/pricing-table/index.html`.
   Write where you found the idea in the comment at the top.

3. Add one entry to `components.js` so the gallery shows it:

   ```js
   {
     id: "pricing-table",          // must match the folder name
     name: "Pricing table",
     tags: ["card", "marketing"],
     source: "https://example.com", // where you saw it (optional)
     note: "Why I like it.",         // optional
     added: "2026-10-08",
   },
   ```

## Folder structure

```
index.html            gallery page
components.js         list of all components (the gallery reads this)
components/
  _template/          copy this to start a new component
  button-set/
  toggle-switch/
  floating-label-input/
  profile-card/
```

## Rules for each component

- One folder per component, with an `index.html` inside.
- Keep it self-contained: put the CSS and JS in the same file, so it is easy to copy into another project.
- Support dark mode with `@media (prefers-color-scheme: dark)` when you can.
