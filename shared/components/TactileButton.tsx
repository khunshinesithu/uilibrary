// STAND-IN. The real TactileButton code was not provided yet.
// Styled from the screenshot of the original (shallow depth, small size).
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
      className="inline-flex h-8 items-center gap-1.5 rounded-[10px] bg-[#4a4a46] px-3 font-medium text-[#eeeeec] text-xs shadow-[inset_0_1px_0_#64645f,0_2px_0_#292926,0_2.5px_0_#141412] transition-[translate,box-shadow] duration-100 active:translate-y-0.5 active:shadow-[inset_0_1px_0_#64645f,0_0_0_#292926]"
      href={href}
      onClick={(event) => event.preventDefault()}
    >
      {children}
    </a>
  );
}
