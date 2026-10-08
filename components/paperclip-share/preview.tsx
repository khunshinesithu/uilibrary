// Live preview for the site. Text from the reference screenshot.
import "@fontsource-variable/inter";
import { PaperclipShare } from "@/components/PaperclipShare";

export default function PaperclipSharePreview() {
  return (
    <div className="flex w-full justify-center font-['Inter_Variable',sans-serif] [--font-sans:'Inter_Variable',sans-serif]">
      <div aria-hidden="true" className="fixed inset-0 -z-10 bg-[#fcfcfc]" />
      {/* Room for the panel, which opens below the button and to the left. */}
      <div className="flex w-[480px] max-w-full justify-end pt-2 pr-[9px]">
        <PaperclipShare
          defaultOpen
          documentBody="The team compared the homepage, services page, and case studies with the approved brand direction. Hospitality and wellness work should move above the older corporate projects. Careers and culture stay below the case studies for now."
          documentTitle="Opening copy needs a decision before Wednesday"
          link="https://meetball.app/m/website-review"
        />
      </div>
    </div>
  );
}
