import React from "react";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n/useTranslation";
import Button from "@/components/ui/Button";
import { Clock3, Pencil, Trash2 } from "lucide-react";

type TimeSlot = {
  id: string;
  from: string;
  to: string;
};

type DayAvailability = {
  day: string;
  enabled: boolean;
  slots: TimeSlot[];
};

type DayCardProps = {
  item: DayAvailability;
  onAddTime: () => void;
  onEditDay: () => void;
  onDeleteDay: () => void;
  isSelected?: boolean;
};

export default function DayCard({ item, onAddTime, onEditDay, onDeleteDay, isSelected = false }: DayCardProps) {
  const { t } = useTranslation();
  const hasSlots = item.slots.length > 0;
  const isActive = isSelected;

  return (
    <div
      className={`relative flex h-[150px] flex-col rounded-[10px] border bg-[#F9FBFA] p-5 transition-colors ${isActive
          ? "border-[#8FB9B1]"
          : "border-[#D3DEDB]"
        }`}
    >
      <h3 className="flex items-center gap-2 text-[20px] font-semibold leading-none text-[#3E4A4A]">
        <Image src="/timeplus.svg" alt="" width={22} height={22} />
        {item.day}
      </h3>

      {hasSlots ? (
        <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2">
          {item.slots.map((slot) => (
            <div
              key={slot.id}
              className="flex items-center gap-2 text-[16px] font-medium text-[#5C6666]"
            >
              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-[#6F7B7A]" />
                <span className="leading-none">{slot.from}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-[#6F7B7A]" />
                <span className="leading-none">{slot.to}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-1 items-end justify-center">
          <Button
            type="button"
            unstyled
            onClick={onAddTime}
            className="inline-flex items-center gap-2 rounded-[4px] bg-[#00664F4D] px-4 py-2 text-[14px] font-medium text-blueSite"
          >
            <Image src="/timeplus.svg" alt="" width={16} height={16} />
            <span className="leading-none underline underline-offset-2">
              {t("serviceMarket.myServices.availability.addTime")}
            </span>
          </Button>
        </div>
      )}

      {hasSlots && (
        <div className="absolute end-3 top-3 flex items-center gap-3">
          <Button
            onClick={onEditDay}
            className="text-[#007A5E] transition hover:opacity-80"
            unstyled
            aria-label="Edit day"
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <Button
            onClick={onDeleteDay}
            className="text-[#D92D20] transition hover:opacity-80"
            unstyled
            aria-label="Delete day"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
