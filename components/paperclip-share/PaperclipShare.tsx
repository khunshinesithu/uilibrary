"use client";

import { CheckIcon, ExportIcon, LinkSimpleIcon, XIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import { DriveLogo, JiraLogo, LinearLogo, NotionLogo, SlackLogo } from "./logos";

export type ShareApp = {
  name: string;
  icon: ReactNode;
  onSelect?: () => void;
};

export type PaperclipShareProps = {
  /** Panel title. */
  title?: string;
  /** Heading on the clipped sheet. */
  documentTitle: string;
  /** Text on the clipped sheet. It fades out at the bottom. */
  documentBody: string;
  /** Full link that "Copy link" copies, e.g. "https://meetball.app/m/website-review". */
  link: string;
  /** Apps in the "Add to" row. Defaults to Drive, Notion, Linear, Jira and Slack. */
  apps?: ShareApp[];
  /** Start with the panel open. */
  defaultOpen?: boolean;
  /** Text on the trigger button. */
  triggerLabel?: string;
};

const DEFAULT_APPS: ShareApp[] = [
  { name: "Drive", icon: <DriveLogo className="size-7" /> },
  { name: "Notion", icon: <NotionLogo className="size-7" /> },
  { name: "Linear", icon: <LinearLogo className="size-7" /> },
  { name: "Jira", icon: <JiraLogo className="size-7" /> },
  { name: "Slack", icon: <SlackLogo className="size-7" /> },
];

const spring = { type: "spring", bounce: 0.2, duration: 0.5 } as const;
const easeOut = [0.23, 1, 0.32, 1] as const;

// Body text fades out from the 5th line down (values measured from the reference).
const fadeMask =
  "linear-gradient(to bottom, #000 222px, rgba(0,0,0,0.33) 247px, rgba(0,0,0,0.18) 270px, rgba(0,0,0,0.07) 292px, transparent 312px)";

export function PaperclipShare({
  title = "Share transcript",
  documentTitle,
  documentBody,
  link,
  apps = DEFAULT_APPS,
  defaultOpen = false,
  triggerLabel = "Share",
}: PaperclipShareProps) {
  const [open, setOpen] = useState(defaultOpen);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  // Close on Escape and on a click outside.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div className="relative inline-block font-sans" ref={rootRef}>
      <motion.button
        aria-expanded={open}
        aria-haspopup="dialog"
        className="flex h-[42px] cursor-pointer items-center gap-2 rounded-full border border-[#e3e3e3] bg-white pr-4 pl-3.5 text-[#4b4b4b] text-base outline-none transition-colors hover:bg-[#fafafa] focus-visible:ring-2 focus-visible:ring-black/20"
        onClick={() => setOpen((value) => !value)}
        ref={triggerRef}
        type="button"
        whileTap={{ scale: 0.97 }}
      >
        <ExportIcon aria-hidden="true" size={18} />
        {triggerLabel}
      </motion.button>

      <AnimatePresence>
        {open ? (
          <SharePanel
            apps={apps}
            documentBody={documentBody}
            documentTitle={documentTitle}
            link={link}
            onClose={() => {
              setOpen(false);
              triggerRef.current?.focus();
            }}
            title={title}
            titleId={titleId}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function SharePanel({
  apps,
  documentBody,
  documentTitle,
  link,
  onClose,
  title,
  titleId,
}: {
  apps: ShareApp[];
  documentBody: string;
  documentTitle: string;
  link: string;
  onClose: () => void;
  title: string;
  titleId: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1, y: 0 }}
      aria-labelledby={titleId}
      className="absolute top-[calc(100%+9px)] right-[-9px] z-50 w-[480px] max-w-[calc(100vw-32px)] origin-top-right rounded-[28px] border border-[#e3e3e3] bg-white px-8 pt-[37px] pb-[30px] shadow-[0_0_24px_rgba(0,0,0,0.05),0_12px_40px_-12px_rgba(0,0,0,0.12)]"
      exit={{ opacity: 0, scale: 0.96, y: -4, transition: { duration: 0.15, ease: easeOut } }}
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: -6 }}
      role="dialog"
      transition={spring}
    >
      <div className="flex items-center justify-between">
        <h2 className="font-normal text-[#0a0a0a] text-[22.5px] leading-7" id={titleId}>
          {title}
        </h2>
        <button
          aria-label="Close"
          className="relative -top-[3px] mr-1 grid size-8 cursor-pointer place-items-center rounded-full text-black outline-none transition-colors hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-black/20"
          onClick={onClose}
          type="button"
        >
          <XIcon aria-hidden="true" size={20} />
        </button>
      </div>

      <PaperStack body={documentBody} heading={documentTitle} />

      <h3 className="mt-[39.5px] font-medium text-[#0b0b0b] text-base leading-6">Add to</h3>
      <ul className="mt-3 flex justify-between">
        {apps.map((app, index) => (
          <motion.li
            animate={{ opacity: 1, y: 0 }}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            key={app.name}
            transition={{ duration: 0.3, ease: easeOut, delay: 0.25 + index * 0.04 }}
          >
            <button
              className="group flex cursor-pointer flex-col items-center gap-2 outline-none"
              onClick={app.onSelect}
              type="button"
            >
              <span className="grid size-14 place-items-center rounded-xl bg-[#f7f7f5] transition-[background-color,scale] duration-150 group-hover:bg-[#efefec] group-active:scale-95 group-focus-visible:ring-2 group-focus-visible:ring-black/20">
                {app.icon}
              </span>
              <span className="text-[#747474] text-[13.5px] leading-5">{app.name}</span>
            </button>
          </motion.li>
        ))}
      </ul>

      <CopyLink link={link} />
    </motion.div>
  );
}

function PaperStack({ body, heading }: { body: string; heading: string }) {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState(false);
  const sheet = "absolute inset-0 rounded-lg border border-black/[0.08] bg-white";

  return (
    <motion.div
      className="relative mx-auto mt-[51px] h-[324px] w-[296px] max-w-full"
      onHoverEnd={() => setHover(false)}
      onHoverStart={() => setHover(true)}
    >
      {/* Back sheets fan out from under the front sheet. */}
      <motion.div
        animate={{ rotate: hover ? -3.4 : -2.3, x: hover ? -7 : -5, y: 3 }}
        aria-hidden="true"
        className={`${sheet} shadow-[0_6px_16px_-10px_rgba(0,0,0,0.12)]`}
        initial={reduce ? false : { rotate: 0, x: 0, y: 0 }}
        transition={{ ...spring, delay: reduce ? 0 : 0.12 }}
      />
      <motion.div
        animate={{ rotate: hover ? 2 : 1, x: hover ? 5 : 3, y: 1, scale: 1.035 }}
        aria-hidden="true"
        className={`${sheet} shadow-[0_6px_16px_-10px_rgba(0,0,0,0.12)]`}
        initial={reduce ? false : { rotate: 0, x: 0, y: 0, scale: 1 }}
        transition={{ ...spring, delay: reduce ? 0 : 0.16 }}
      />

      {/* Front sheet */}
      <motion.article
        animate={{ y: hover ? -2 : 0 }}
        className={`${sheet} overflow-hidden shadow-[0_10px_28px_-14px_rgba(0,0,0,0.18)]`}
        transition={spring}
      >
        <div className="h-full px-[35px] pt-8" style={{ maskImage: fadeMask, WebkitMaskImage: fadeMask }}>
          <h4 className="font-medium text-[#0a0a0a] text-[20px] leading-[30px]">{heading}</h4>
          <p className="mt-[17px] text-[#4f4f4f] text-sm leading-relaxed">{body}</p>
        </div>
      </motion.article>

      <Paperclip hover={hover} />
    </motion.div>
  );
}

/** The clip's top loop sits above the sheet; its short back leg ends at the sheet edge. */
function Paperclip({ hover }: { hover: boolean }) {
  const reduce = useReducedMotion();
  const wire = "M15 16 V8 A7 7 0 0 0 1 8 V51 A7 7 0 0 0 15 51 V21";

  return (
    <motion.svg
      animate={{ opacity: 1, y: hover ? -3 : 0, rotate: -13 }}
      aria-hidden="true"
      className="absolute top-[-10px] left-[16px] h-[60px] w-4 overflow-visible drop-shadow-[0_1px_1px_rgba(0,0,0,0.18)]"
      fill="none"
      initial={reduce ? false : { opacity: 0, y: -14, rotate: -24 }}
      strokeLinecap="round"
      transition={{ ...spring, bounce: 0.35, delay: reduce ? 0 : 0.28 }}
      viewBox="0 0 16 60"
    >
      <path d={wire} stroke="#86868a" strokeWidth={2.6} />
      <path d={wire} stroke="#f1f1f3" strokeWidth={1.1} />
    </motion.svg>
  );
}

function CopyLink({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);
  const shown = link.replace(/^https?:\/\//, "");

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <div className="mt-[24.5px] flex h-[55px] items-center gap-3 rounded-full bg-[#f5f5f5] pr-[23px] pl-4">
      <span
        className="min-w-0 flex-1 overflow-hidden whitespace-nowrap text-[#252525] text-[15px]"
        style={{
          maskImage: "linear-gradient(to right, #000 35%, transparent 80%)",
          WebkitMaskImage: "linear-gradient(to right, #000 35%, transparent 80%)",
        }}
      >
        {shown}
      </span>
      <button
        className="flex shrink-0 cursor-pointer items-center gap-2 rounded-full font-medium text-[#050505] text-[17px] outline-none focus-visible:ring-2 focus-visible:ring-black/20"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
          } catch {
            // Clipboard can be blocked (for example in some iframes). Nothing to do.
          }
        }}
        type="button"
      >
        <span className="relative grid size-[18px] place-items-center text-[#505050]">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              animate={{ opacity: 1, scale: 1 }}
              className="grid place-items-center"
              exit={{ opacity: 0, scale: 0.6 }}
              initial={{ opacity: 0, scale: 0.6 }}
              key={copied ? "check" : "link"}
              transition={{ duration: 0.15, ease: easeOut }}
            >
              {copied ? (
                <CheckIcon aria-hidden="true" size={18} weight="bold" />
              ) : (
                <LinkSimpleIcon aria-hidden="true" size={18} />
              )}
            </motion.span>
          </AnimatePresence>
        </span>
        <span aria-live="polite">{copied ? "Copied" : "Copy link"}</span>
      </button>
    </div>
  );
}
