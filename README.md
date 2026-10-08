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

## Folders

```
components/   saved components (original code + component.json)
src/          the website
```
