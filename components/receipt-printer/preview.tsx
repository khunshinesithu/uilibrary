// Live preview for the site. Not part of the saved component.
// Built to match the screenshot of the original demo. The stage can change,
// so you can see the printing animation. It plays once on load.
import { HouseIcon } from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ReceiptPrinter,
  type ReceiptPrinterStage,
} from "@/components/ReceiptPrinter";
import { TactileButton } from "@/components/TactileButton";

const stages: ReceiptPrinterStage[] = ["processing", "printing", "complete"];

// Placeholder logo (the original logo is replaced).
function Logo({ className, mark, tile }: { className: string; mark: string; tile: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24">
      <rect fill={tile} height="24" width="24" />
      <path d="M12 6h6v6a6 6 0 0 1-6 6H6v-6a6 6 0 0 1 6-6z" fill={mark} />
    </svg>
  );
}

function Divider() {
  return (
    <div
      aria-hidden="true"
      className="h-px bg-[length:5px_1px] bg-[linear-gradient(to_right,color-mix(in_oklab,currentColor_25%,transparent)_3px,transparent_3px)] bg-repeat-x"
    />
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <dt className="text-grayscale-10">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}

export default function ReceiptPrinterPreview() {
  const [stage, setStage] = useState<ReceiptPrinterStage>("processing");
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    for (const timer of timers.current) window.clearTimeout(timer);
    timers.current = [];
  }, []);

  const play = useCallback(() => {
    clearTimers();
    setStage("processing");
    timers.current = [
      window.setTimeout(() => setStage("printing"), 1500),
      window.setTimeout(() => setStage("complete"), 3500),
    ];
  }, [clearTimers]);

  useEffect(() => {
    play();
    return clearTimers;
  }, [play, clearTimers]);

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-center gap-2 text-xs">
        {stages.map((s) => (
          <button
            aria-pressed={stage === s}
            className="rounded-full px-3 py-1.5 text-grayscale-11 capitalize ring-1 ring-grayscale-6 aria-pressed:bg-grayscale-12 aria-pressed:text-grayscale-1 aria-pressed:ring-grayscale-12"
            key={s}
            onClick={() => {
              clearTimers();
              setStage(s);
            }}
            type="button"
          >
            {s}
          </button>
        ))}
        <button
          className="rounded-full px-3 py-1.5 text-grayscale-12 ring-1 ring-grayscale-6"
          onClick={play}
          type="button"
        >
          Replay
        </button>
      </div>

      <ReceiptPrinter.Root stage={stage}>
        <ReceiptPrinter.Machine>
          <ReceiptPrinter.Header>
            <Logo className="size-8 p-1" mark="#323232" tile="#6b6b6b" />
            <TactileButton depth="shallow" href="/" size="sm">
              <HouseIcon aria-hidden="true" size={13} weight="fill" />
              Home
            </TactileButton>
          </ReceiptPrinter.Header>

          <ReceiptPrinter.Screen>
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-0.5 font-medium">
                  <p className="text-sm">Pro plan</p>
                  <p className="text-grayscale-8 text-xs">Annual subscription</p>
                </div>
                <div className="text-right">
                  <p className="text-grayscale-8 text-xs">Total</p>
                  <p className="font-bold leading-5">£230.40</p>
                </div>
              </div>
              <ReceiptPrinter.Status />
            </div>
          </ReceiptPrinter.Screen>
        </ReceiptPrinter.Machine>

        <ReceiptPrinter.Output>
          <ReceiptPrinter.Paper>
            <Logo className="mx-auto size-10" mark="#fcfcfc" tile="#363636" />

            <div className="mt-5">
              <Divider />
            </div>

            <div className="pt-[21.5px] pb-[17px] text-[9px]">
              <div className="flex items-baseline justify-between">
                <h2 className="font-bold uppercase tracking-[0.08em]">Pro plan</h2>
                <span className="font-semibold">£192.00</span>
              </div>
              <p className="mt-0.5 text-grayscale-10">Annual subscription</p>
            </div>

            <Divider />

            <div className="pt-[13px] pb-[13px]">
              <dl className="text-[9px] leading-[15px]">
                <Row label="Subtotal" value="£192.00" />
                <Row label="Tax" value="£38.40" />
              </dl>
              <div className="mt-[9px] flex items-baseline justify-between">
                <span className="font-bold text-[10px] uppercase tracking-[0.08em]">
                  Total paid
                </span>
                <span className="font-bold text-sm">£230.40</span>
              </div>
            </div>

            <Divider />

            <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 pt-4 text-[8px]">
              <dt className="text-grayscale-10">Order</dt>
              <dd className="font-medium">ORD-2048</dd>
              <dt className="text-grayscale-10">Paid with</dt>
              <dd className="font-medium">Visa •••• 4242</dd>
              <dt className="text-grayscale-10">Date</dt>
              <dd className="font-medium">11 AUG 2026 · 14:32</dd>
            </dl>

            <div
              aria-hidden="true"
              className="mx-auto mt-[20.5px] h-7 w-[126px] bg-[repeating-linear-gradient(to_right,currentColor_0_1px,transparent_1px_3px,currentColor_3px_5px,transparent_5px_7px,currentColor_7px_8px,transparent_8px_11px)]"
            />
            <p className="mt-[3.5px] text-center text-[7px] text-grayscale-9 tracking-[0.18em]">
              ORD 2048
            </p>
          </ReceiptPrinter.Paper>
        </ReceiptPrinter.Output>
      </ReceiptPrinter.Root>
    </>
  );
}
