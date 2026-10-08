# UI Library

My collection of UI components. Open the site, pick a component, and copy the code.

## Run the site on your computer

```bash
npm install
npm run dev
```

The site is published to GitHub Pages each time `main` changes.

## Add a component

1. Make a folder in `components/`, for example `components/dynamic-button/`.
2. Put the original code files in it. Do not change them.
3. Add a `component.json` next to them:

   ```json
   {
     "name": "Dynamic Button",
     "description": "One or two sentences about it.",
     "source": "https://where-i-found-it.com",
     "stack": ["React", "Tailwind CSS"],
     "install": "npm install motion",
     "requires": ["Things the code imports that are not in this folder"],
     "files": ["DynamicButton.tsx"]
   }
   ```

   `files` sets which files the site shows, and in what order.

4. For a live preview, add a `preview.tsx` with a default export that renders
   the component. Set `previewHeight` (in px) in `component.json`.

5. The home page grid shows the same preview, scaled down to fit the card.
   It is drawn on an 800 × 600 page by default. If the component does not
   fit, make the page bigger (keep the 4:3 shape) in `component.json`:

   ```json
   "thumbnail": { "width": 1080, "height": 810 }
   ```

## Search

Type in the search box on the home page (or press `/` to jump to it).
It matches every word against the name, description and tech tags.
`Esc` clears it. The search is kept in the address, e.g. `#/?q=calendar`.

## How imports work in previews

Saved code imports things like `@/components/X` or `@/helpers/classname-helper`.
The site finds them like this:

1. `@/components/X` → `components/<any folder>/X.tsx`
2. Anything else → `shared/<path>`

`shared/` holds helpers and stand-ins for files that are not saved yet.
Each stand-in says so at the top of the file.

## Folders

```
components/   saved components (original code + component.json + preview.tsx)
shared/       helpers and stand-ins that the saved code imports
src/          the website (src/preview is the live preview page)
```
