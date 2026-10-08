// Live preview for the site. Not part of the saved component.
// Same markup as CheckoutStatus.tsx, but the stage can change so you can see
// the printing animation. It plays once on load; use the buttons to replay.
import { HouseIcon } from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ReceiptPrinter,
  type ReceiptPrinterStage,
} from "@/components/ReceiptPrinter";
import { TactileButton } from "@/components/TactileButton";

const stages: ReceiptPrinterStage[] = ["processing", "printing", "complete"];

function Logo() {
  return (
    <img
      alt=""
      className="size-6"
      // The logo file is not saved yet. Hide it instead of showing a broken image.
      onError={(event) => {
        event.currentTarget.style.visibility = "hidden";
      }}
      src="/images/receipt-printer-logo.png"
    />
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
            className="rounded-full px-3 py-1.5 capitalize text-grayscale-11 ring-1 ring-grayscale-6 aria-pressed:bg-grayscale-12 aria-pressed:text-grayscale-1 aria-pressed:ring-grayscale-12"
            aria-pressed={stage === s}
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
            <Logo />
            <TactileButton depth="shallow" href="/" size="sm">
              <HouseIcon aria-hidden="true" size={13} weight="fill" />
              Home
            </TactileButton>
          </ReceiptPrinter.Header>

          <ReceiptPrinter.Screen>
            <div className="space-y-4">
              <div className="flex justify-between">
                <div>
                  <p>Pro plan</p>
                  <p>Annual subscription</p>
                </div>
                <strong>£230.40</strong>
              </div>
              <ReceiptPrinter.Status />
            </div>
          </ReceiptPrinter.Screen>
        </ReceiptPrinter.Machine>

        <ReceiptPrinter.Output>
          <ReceiptPrinter.Paper>
            <h2>Receipt</h2>
            <hr />
            <dl>
              <div>
                <dt>Total paid</dt>
                <dd>£230.40</dd>
              </div>
            </dl>
            <p>Thanks for your order.</p>
          </ReceiptPrinter.Paper>
        </ReceiptPrinter.Output>
      </ReceiptPrinter.Root>
    </>
  );
}
