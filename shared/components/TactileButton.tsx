// STAND-IN. The real TactileButton was not provided yet.
// This only exists so previews that import "@/components/TactileButton" can run.
// To use the real one: save it as components/tactile-button/TactileButton.tsx
// (it is picked up before this file), then delete this file.
import type { ReactNode } from "react";

type TactileButtonProps = {
  children: ReactNode;
  depth?: string;
  href?: string;
  size?: string;
};

export function TactileButton({ children, href = "#" }: TactileButtonProps) {
  return (
    <a
      className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium text-white text-xs ring-1 ring-white/20"
      href={href}
      onClick={(event) => event.preventDefault()}
    >
      {children}
    </a>
  );
}
