"use client";

import React, { useState } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { Clock3, Trash2, PlusCircle, X } from "lucide-react";
import { useAlert } from "@/lib/context/AlertProvider";
import TimeInput from "./TimeInput";
import { playErrorSound } from "@/lib/utils/playSound";

type TimeSlot = {
  id: string;
  from: string;
  to: string;
};

type WorkingHoursModalProps = {
  isOpen: boolean;
  day: string;
  slots: TimeSlot[];
  onClose: () => void;
  onSave: (slots: TimeSlot[]) => void;
};

function formatTimeForDisplay(value: string) {
  // TimePickerField already returns HH:mm format, so just return as-is
  return value;
}

function normalizeTimeForInput(value: string) {
  // TimePickerField expects HH:mm format, so just return as-is
  return value;
}

export default function WorkingHoursModal({
  isOpen,
  day,
  slots,
  onClose,
  onSave,
}: WorkingHoursModalProps) {
  const { t } = useTranslation();
  const alert = useAlert();


  const [localSlots, setLocalSlots] = useState<TimeSlot[]>([]);

  React.useEffect(() => {
    if (!isOpen) return;

    setLocalSlots(
      slots.length > 0
        ? slots.map((slot) => ({
            ...slot,
            from: normalizeTimeForInput(slot.from),
            to: normalizeTimeForInput(slot.to),
          }))
        : [
          {
            id: `slot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            from: "",
            to: "",
          },
        ]
    );
  }, [isOpen, slots]);

  const isEditMode = slots.length > 0;

  const handleChangeSlot = (
    slotId: string,
    field: keyof Pick<TimeSlot, "from" | "to">,
    value: string
  ) => {
    setLocalSlots((prev) =>
      prev.map((slot) => (slot.id === slotId ? { ...slot, [field]: value } : slot))
    );
  };

  const handleAddAnotherTime = () => {
    const newSlot = {
      id: `slot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      from: "",
      to: "",
    };
    setLocalSlots((prev) => [...prev, newSlot]);
  };

  const handleRemoveTime = (slotId: string) => {
    setLocalSlots((prev) => {
      const filtered = prev.filter((slot) => slot.id !== slotId);
      // Ensure at least one empty slot remains for adding new time
      if (filtered.length === 0) {
        return [
          {
            id: `slot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            from: "",
            to: "",
          },
        ];
      }
      return filtered;
    });
  };

  const handleDeleteAll = () => {
    setLocalSlots([]);
  };

  const handleSave = () => {
    // Validate that all start times are before end times
    const invalidSlots = localSlots.filter(slot => {
      if (!slot.from || !slot.to) return false;
      
      // Convert HH:mm to minutes for comparison
      const [startHour, startMin] = slot.from.split(':').map(Number);
      const [endHour, endMin] = slot.to.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      
      return startMinutes >= endMinutes;
    });

    if (invalidSlots.length > 0) {
      playErrorSound();
      alert.message.error(t("serviceMarket.myServices.availability.startTimeMustBeBeforeEndTime"));
      return;
    }

    const cleanedSlots = localSlots
      .filter((slot) => slot.from && slot.to)
      .map((slot) => ({
        ...slot,
        from: formatTimeForDisplay(slot.from),
        to: formatTimeForDisplay(slot.to),
      }));

    onSave(cleanedSlots);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showLine={false}
      className="relative w-full max-w-[980px] rounded-[28px] !bg-[#f8faf9] p-6 md:p-8"
    >
      <div>
        <div className="mb-8 pe-10">
          <div className="mb-3 flex items-center gap-3">
            <span className="inline-block h-9 w-1 rounded-full bg-blueSite" />
            <div className="flex justify-between items-center">
              <h3 className="text-[22px] font-bold text-textColor">
                {isEditMode
                  ? t("serviceMarket.myServices.availability.editWorkingHours")
                  : t("serviceMarket.myServices.availability.addWorkingHours")}
              </h3>
              {/* {isEditMode && (
                <Button
                  type="button"
                  unstyled
                  onClick={handleDeleteAll}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-red-500 underline underline-offset-2"
                >
                  <Trash2 className="h-4 w-4" />
                  {t("serviceMarket.myServices.availability.deleteAllHours")}
                </Button>
              )} */}
            </div>
          </div>

          <p className="text-[18px] text-textGrayColor">
            {t("serviceMarket.myServices.availability.workingHoursDescription")}
          </p>
        </div>

        <div className="space-y-6">
          {localSlots.map((slot, index) => (
            <div key={slot.id} className="space-y-3">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <TimeInput
                  label={t("serviceMarket.myServices.availability.from")}
                  placeholder={t("serviceMarket.myServices.availability.startTimePlaceholder")}
                  value={slot.from}
                  onChange={(value) => handleChangeSlot(slot.id, "from", value)}
                />

                <TimeInput
                  label={t("serviceMarket.myServices.availability.to")}
                  placeholder={t("serviceMarket.myServices.availability.endTimePlaceholder")}
                  value={slot.to}
                  onChange={(value) => handleChangeSlot(slot.id, "to", value)}
                />
              </div>

              {localSlots.length > 1 && (
                <div className="flex justify-end">
                  <Button
                    type="button"
                    unstyled
                    onClick={() => handleRemoveTime(slot.id)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-red-500 underline underline-offset-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    {t("serviceMarket.myServices.availability.removeTiming")}
                  </Button>
                </div>
              )}
            </div>
          ))}

          <Button
            type="button"
            unstyled
            onClick={handleAddAnotherTime}
            className="inline-flex items-center gap-2 text-[16px] font-semibold text-blueSite"
          >
            <PlusCircle className="h-5 w-5" />
            {t("serviceMarket.myServices.availability.addAnotherTime")}
          </Button>

          <div className="flex flex-col gap-4 pt-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-4">
              <Button
                onClick={handleSave}
                unstyled
                className="min-w-[170px] rounded-[10px] bg-blueSite px-6 py-3 text-base font-semibold text-white hover:opacity-90"
              >
                {isEditMode ? t("serviceMarket.myServices.availability.saveChanges") : t("serviceMarket.myServices.availability.addTime")}
              </Button>

              <Button
                type="button"
                unstyled
                onClick={onClose}
                className="text-[16px] font-semibold text-textColor underline underline-offset-2"
              >
                {t("common.cancel")}
              </Button>
            </div>

            {isEditMode && (
              <Button
                type="button"
                unstyled
                onClick={handleDeleteAll}
                className="inline-flex items-center gap-2 self-start rounded-[8px] bg-red-100 px-4 py-2 text-sm font-semibold text-red-500"
              >
                <Trash2 className="h-4 w-4" />
                {t("serviceMarket.myServices.availability.deleteAllHours")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
