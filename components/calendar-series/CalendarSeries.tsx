"use client";

import {
  ArrowRightIcon,
  ArrowsOutSimpleIcon,
  XIcon,
} from "@phosphor-icons/react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "motion/react";
import { type ReactNode, useEffect, useMemo, useState } from "react";

export type CalendarImage = {
  src: string;
  alt: string;
  /** Width / height. Defaults to 4 / 3. */
  aspect?: number;
};

export type CalendarEntry = {
  /** Day of the entry, as "YYYY-MM-DD". */
  date: string;
  /** Background color of the day square and the open card. */
  color: string;
  /** Short label shown when hovering the day, e.g. "Blog". */
  category?: string;
  title?: string;
  body?: ReactNode;
  images?: CalendarImage[];
  /** Images go above the note when "top". Default "bottom". */
  imagePosition?: "top" | "bottom";
  link?: { label: string; href: string };
};

export type CalendarSeriesProps = {
  entries: CalendarEntry[];
  /** First month shown, "YYYY-MM". Defaults to the month of the oldest entry. */
  from?: string;
  /** Last month shown, "YYYY-MM". Defaults to the month of the newest entry. */
  to?: string;
  className?: string;
};

type Month = { year: number; month: number };

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const spring = { type: "spring", bounce: 0.15, duration: 0.5 } as const;
const easeOut = [0.23, 1, 0.32, 1] as const;

// Card geometry (px): 7 columns of 40px squares, 8px gaps, 28px side padding.
const CELL = 40;
const GAP = 8;
const HEADER = 63;
const PAD_BOTTOM = 27;

const pad = (n: number) => String(n).padStart(2, "0");
const toKey = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;
const parseMonth = (value: string): Month => {
  const [y, m] = value.split("-").map(Number);
  return { year: y, month: m - 1 };
};

/** Months from newest to oldest. */
function monthRange(from: Month, to: Month): Month[] {
  const out: Month[] = [];
  let { year, month } = to;
  while (year > from.year || (year === from.year && month >= from.month)) {
    out.push({ year, month });
    month -= 1;
    if (month < 0) {
      month = 11;
      year -= 1;
    }
  }
  return out;
}

/** Weeks start on Monday. Returns leading blanks and the day count. */
function monthLayout({ year, month }: Month) {
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const rows = Math.ceil((firstWeekday + days) / 7);
  return { blanks: firstWeekday, days, rows };
}

export function CalendarSeries({ entries, from, to, className }: CalendarSeriesProps) {
  const [openDate, setOpenDate] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ id: string; image: CalendarImage } | null>(null);

  const byDate = useMemo(() => new Map(entries.map((e) => [e.date, e])), [entries]);

  const years = useMemo(() => {
    const sorted = [...entries].map((e) => e.date).sort();
    if (!sorted.length && !(from && to)) return [];
    const start = parseMonth(from ?? sorted[0].slice(0, 7));
    const end = parseMonth(to ?? sorted[sorted.length - 1].slice(0, 7));
    const groups: { year: number; months: Month[] }[] = [];
    for (const m of monthRange(start, end)) {
      const last = groups[groups.length - 1];
      if (last?.year === m.year) last.months.push(m);
      else groups.push({ year: m.year, months: [m] });
    }
    return groups;
  }, [entries, from, to]);

  // Escape closes the image first, then the open day.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (lightbox) setLightbox(null);
      else setOpenDate(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  return (
    <LayoutGroup>
      <div className={className}>
        {years.map(({ year, months }, yearIndex) => (
          <section className="relative" key={year}>
            <div className="sticky top-5 z-30 flex justify-center pt-0 pb-10">
              <span className="rounded-full bg-white px-3 py-1 font-semibold text-[#5f5f63] text-xs shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
                {year}
              </span>
            </div>
            <div className="flex flex-col items-center gap-[84px] pb-10">
              {months.map((m, i) => (
                <MonthCard
                  activeImageId={lightbox?.id ?? null}
                  byDate={byDate}
                  index={yearIndex * 12 + i}
                  key={`${m.year}-${m.month}`}
                  month={m}
                  onClose={() => setOpenDate(null)}
                  onOpen={setOpenDate}
                  onOpenImage={(id, image) => setLightbox({ id, image })}
                  openDate={openDate}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <Lightbox lightbox={lightbox} onClose={() => setLightbox(null)} />
    </LayoutGroup>
  );
}

function MonthCard({
  activeImageId,
  byDate,
  index,
  month,
  onClose,
  onOpen,
  onOpenImage,
  openDate,
}: {
  activeImageId: string | null;
  byDate: Map<string, CalendarEntry>;
  index: number;
  month: Month;
  onClose: () => void;
  onOpen: (date: string) => void;
  onOpenImage: (id: string, image: CalendarImage) => void;
  openDate: string | null;
}) {
  const reduce = useReducedMotion();
  const { blanks, days, rows } = monthLayout(month);
  const height = HEADER + rows * (CELL + GAP) - GAP + PAD_BOTTOM;
  const open = openDate?.startsWith(toKey(month.year, month.month, 1).slice(0, 8))
    ? byDate.get(openDate)
    : undefined;
  const label = `${MONTH_NAMES[month.month]} ${month.year}`;

  return (
    <motion.div
      animate={{ opacity: 1, rotate: 0, y: 0, scale: 1 }}
      className="relative w-96 max-w-full"
      initial={reduce ? false : { opacity: 0, rotate: index % 2 ? -2 : 3, y: 24, scale: 0.97 }}
      style={{ height }}
      transition={{ ...spring, delay: Math.min(index, 4) * 0.08 }}
    >
      <section
        aria-label={label}
        className="absolute inset-0 overflow-hidden rounded-[20px] bg-[#212023] shadow-[0_18px_36px_-18px_rgba(0,0,0,0.45)]"
      >
        <motion.div
          animate={{ opacity: open ? 0 : 1 }}
          className="absolute inset-0 px-7"
          transition={{ duration: 0.2, ease: easeOut }}
        >
          <h2 className="pt-[27px] font-semibold text-[15px] text-white/85 leading-5">
            {MONTH_NAMES[month.month]}
          </h2>
          <div
            className="mt-4 grid grid-cols-7"
            style={{ gap: GAP, gridAutoRows: CELL }}
          >
            {Array.from({ length: blanks }, (_, i) => (
              <div className="rounded-lg bg-[#2c2b30]/40" key={`blank-${i}`} />
            ))}
            {Array.from({ length: days }, (_, i) => {
              const date = toKey(month.year, month.month, i + 1);
              const entry = byDate.get(date);
              const cellIndex = blanks + i;
              return entry ? (
                <DayButton
                  date={date}
                  delay={reduce ? 0 : 0.15 + Math.min(index, 4) * 0.08 + cellIndex * 0.012}
                  entry={entry}
                  hidden={openDate === date}
                  key={date}
                  label={`${MONTH_NAMES[month.month]} ${i + 1}, ${month.year}${entry.title ? `: ${entry.title}` : ""}`}
                  onOpen={onOpen}
                />
              ) : (
                <motion.div
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-lg bg-[#2c2b30]"
                  initial={reduce ? false : { opacity: 0, scale: 0.8 }}
                  key={date}
                  transition={{
                    duration: 0.3,
                    ease: easeOut,
                    delay: 0.15 + Math.min(index, 4) * 0.08 + cellIndex * 0.012,
                  }}
                />
              );
            })}
          </div>
        </motion.div>
      </section>

      <AnimatePresence>
        {open ? (
          <OpenDay
            activeImageId={activeImageId}
            entry={open}
            key={open.date}
            onClose={onClose}
            onOpenImage={onOpenImage}
          />
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

function DayButton({
  date,
  delay,
  entry,
  hidden,
  label,
  onOpen,
}: {
  date: string;
  delay: number;
  entry: CalendarEntry;
  hidden: boolean;
  label: string;
  onOpen: (date: string) => void;
}) {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState(false);

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      className="relative"
      initial={reduce ? false : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3, ease: easeOut, delay }}
    >
      {hidden ? null : (
        <motion.button
          aria-label={label}
          className="absolute inset-0 cursor-pointer rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#212023]"
          layoutId={`day-${date}`}
          onBlur={() => setHover(false)}
          onClick={() => onOpen(date)}
          onFocus={() => setHover(true)}
          onHoverEnd={() => setHover(false)}
          onHoverStart={() => setHover(true)}
          style={{ backgroundColor: entry.color, borderRadius: 8 }}
          transition={spring}
          type="button"
          whileTap={{ scale: 0.94 }}
        />
      )}
      <AnimatePresence>
        {hover && entry.category && !hidden ? (
          <motion.span
            animate={{ opacity: 1, y: 0 }}
            className="pointer-events-none absolute bottom-[calc(100%+6px)] left-0 z-10 whitespace-nowrap rounded-md bg-[#0e0e10] px-2 py-1 font-medium text-[12px] text-white leading-[14px]"
            exit={{ opacity: 0, y: 2 }}
            initial={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15, ease: easeOut }}
          >
            {entry.category}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

function OpenDay({
  activeImageId,
  entry,
  onClose,
  onOpenImage,
}: {
  activeImageId: string | null;
  entry: CalendarEntry;
  onClose: () => void;
  onOpenImage: (id: string, image: CalendarImage) => void;
}) {
  const reduce = useReducedMotion();
  const imagesFirst = entry.imagePosition === "top" || (!entry.title && !entry.body);
  const hasNote = Boolean(entry.title || entry.body);

  const images = entry.images?.map((image, i) => (
    <CardImage
      activeImageId={activeImageId}
      id={`image-${entry.date}-${i}`}
      image={image}
      key={image.src + i}
      onOpen={onOpenImage}
    />
  ));

  return (
    <motion.div
      className="absolute inset-0 z-20 overflow-hidden rounded-[20px] shadow-[0_18px_36px_-18px_rgba(0,0,0,0.35)]"
      exit={{ opacity: 0, transition: { duration: 0.2, delay: 0.15 } }}
      layoutId={`day-${entry.date}`}
      style={{ backgroundColor: entry.color, borderRadius: 20 }}
      transition={spring}
    >
      <motion.button
        animate={{ opacity: 1, scale: 1 }}
        className="absolute top-2 left-2 z-10 cursor-pointer rounded-full bg-white px-3 py-2 font-semibold text-[#3a3a3d] leading-[19px] shadow-[0_2px_6px_rgba(0,0,0,0.12)] outline-none focus-visible:ring-2 focus-visible:ring-black/40"
        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.12 } }}
        initial={{ opacity: 0, scale: 0.9 }}
        onClick={onClose}
        transition={{ duration: 0.2, ease: easeOut, delay: 0.2 }}
        type="button"
        whileTap={{ scale: 0.95 }}
      >
        back
      </motion.button>

      <motion.div
        animate={{ opacity: 1, rotate: 0, y: 0 }}
        className="flex h-full flex-col gap-2 overflow-y-auto p-2 [scrollbar-width:thin]"
        exit={{ opacity: 0, transition: { duration: 0.12 } }}
        initial={reduce ? { opacity: 0 } : { opacity: 0, rotate: -3, y: 16 }}
        transition={{ ...spring, delay: 0.12 }}
      >
        {imagesFirst ? images : null}
        {hasNote ? (
          <div className={`shrink-0 rounded-2xl bg-white px-6 pt-6 pb-7 ${imagesFirst ? "" : "mt-[41px]"}`}>
            {entry.title ? (
              <h3 className="font-bold text-[#1d1d1f] text-xl leading-7">{entry.title}</h3>
            ) : null}
            {entry.body ? (
              <div className="mt-2 text-[#4a4a4f] text-base leading-6 [&_a]:text-[#2f6bf2] [&_a]:underline [&_a]:underline-offset-2">
                {entry.body}
              </div>
            ) : null}
          </div>
        ) : null}
        {imagesFirst ? null : images}
        {entry.link ? (
          <a
            className="flex shrink-0 items-center justify-between rounded-2xl bg-white px-6 py-[14px] font-semibold text-[#1d1d1f] text-base leading-5 outline-none focus-visible:ring-2 focus-visible:ring-black/40"
            href={entry.link.href}
          >
            {entry.link.label}
            <ArrowRightIcon aria-hidden="true" size={20} weight="bold" />
          </a>
        ) : null}
      </motion.div>
    </motion.div>
  );
}

function CardImage({
  activeImageId,
  id,
  image,
  onOpen,
}: {
  activeImageId: string | null;
  id: string;
  image: CalendarImage;
  onOpen: (id: string, image: CalendarImage) => void;
}) {
  const aspectRatio = image.aspect ?? 4 / 3;

  // While this image is open in the lightbox, keep its space but hand the
  // shared layoutId to the lightbox copy.
  if (activeImageId === id) {
    return <div className="shrink-0" style={{ aspectRatio }} />;
  }

  return (
    <div className="relative shrink-0">
      <motion.img
        alt={image.alt}
        className="block w-full rounded-xl object-cover"
        layoutId={id}
        src={image.src}
        style={{ aspectRatio, borderRadius: 12 }}
        transition={spring}
      />
      <button
        aria-label="View image larger"
        className="absolute right-2 bottom-2 grid size-7 cursor-pointer place-items-center rounded-full bg-white/35 text-white backdrop-blur-md transition-colors hover:bg-white/50"
        onClick={() => onOpen(id, image)}
        type="button"
      >
        <ArrowsOutSimpleIcon aria-hidden="true" size={14} weight="bold" />
      </button>
    </div>
  );
}

function Lightbox({
  lightbox,
  onClose,
}: {
  lightbox: { id: string; image: CalendarImage } | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {lightbox ? (
        <div className="fixed inset-0 z-50 grid place-items-center p-6" key="lightbox">
          <motion.button
            animate={{ opacity: 1 }}
            aria-label="Close image"
            className="absolute inset-0 cursor-default bg-[#e8e8e8]/60 backdrop-blur-md"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={onClose}
            transition={{ duration: 0.25, ease: easeOut }}
            type="button"
          />
          <div className="relative w-full max-w-[668px]">
            <motion.img
              alt={lightbox.image.alt}
              className="block w-full object-cover shadow-[0_24px_48px_-20px_rgba(0,0,0,0.4)]"
              layoutId={lightbox.id}
              src={lightbox.image.src}
              style={{ aspectRatio: lightbox.image.aspect ?? 4 / 3, borderRadius: 12 }}
              transition={spring}
            />
            <motion.button
              animate={{ opacity: 1 }}
              aria-label="Close image"
              className="absolute top-3 right-3 grid size-7 cursor-pointer place-items-center rounded-full bg-white/40 text-white backdrop-blur-md hover:bg-white/55"
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              initial={{ opacity: 0 }}
              onClick={onClose}
              transition={{ duration: 0.2, delay: 0.2 }}
              type="button"
            >
              <XIcon aria-hidden="true" size={14} weight="bold" />
            </motion.button>
          </div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
