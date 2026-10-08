# Receipt Printer

A checkout status component that looks like a receipt printer. It has three stages: `processing` → `printing` → `complete`. In the `printing` stage, the paper feeds out of the printer.

## Files

| File | What it is |
| --- | --- |
| `ReceiptPrinter.tsx` | The component |
| `CheckoutStatus.tsx` | Example of how to use it |

## What it needs

**npm packages**

```bash
npm install motion @phosphor-icons/react
```

**Made for:** React + Tailwind CSS (Next.js, because of `"use client"`).

**Not included in this folder.** The code imports these, so your project must have them:

- `@/helpers/classname-helper`: the `cn()` helper for joining class names
- `@/components/TactileButton`: used in the example only
- Tailwind color tokens: `grayscale-1` to `grayscale-12`, and `green-9`
- Image files:
  - `/textures/plastic-noise.svg`
  - `/textures/receipt-paper.svg`
  - `/images/receipt-printer-logo.png` (example only)
