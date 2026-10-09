import { TimerReset } from "lucide-react";

interface Props {
  days: number;
  hours: number;
  mins: number;
  note: string;
}

function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="min-w-[64px] text-center">
      <div className="text-[22px] font-bold leading-none text-red-500 md:text-[26px]">
        {String(value).padStart(2, "0")}
      </div>
      <div className="mt-2 text-xs uppercase tracking-wide text-textGrayColor">{label}</div>
    </div>
  );
}

export default function OrderCountdownCard({ days, hours, mins, note }: Props) {
  return (
    <div className="rounded-[22px] border border-grayBorder bg-white px-5 py-5 shadow-[0_6px_24px_rgba(15,23,42,0.04)]">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF6EF]">
              <TimerReset className="h-5 w-5 text-blueSite" />
            </span>
            <h3 className="text-[22px] font-bold text-textColor">Time Remaining</h3>
          </div>

          <p className="pl-14 text-base text-textGrayColor">
            <span className="font-semibold text-textColor">{note}</span>
          </p>
        </div>

        <div className="flex items-center gap-6 md:gap-8">
          <TimeBox value={days} label="Days" />
          <TimeBox value={hours} label="Hours" />
          <TimeBox value={mins} label="Mins" />
        </div>
      </div>
    </div>
  );
}