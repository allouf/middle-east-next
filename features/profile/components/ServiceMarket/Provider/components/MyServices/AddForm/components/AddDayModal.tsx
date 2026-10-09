"use client";

import React, { useState } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import SelectField from "@/components/ui/SelectFiled";
import {  Trash2, PlusCircle} from "lucide-react";
import TimeInput from "./TimeInput";

type TimeSlot = {
  id: string;
  from: string;
  to: string;
};

type AddDayModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (day: string, slots: TimeSlot[]) => void;
  existingDays: string[];
};

function formatTimeForDisplay(value: string) {
  // TimePickerField already returns HH:mm format, so just return as-is
  return value;
}

function normalizeTimeForInput(value: string) {
  // TimePickerField expects HH:mm format, so just return as-is
  return value;
}

export default function AddDayModal({
  isOpen,
  onClose,
  onSave,
  existingDays,
}: AddDayModalProps) {
  const { t } = useTranslation();

  const days = [
    { id: 'sunday', name: t('serviceMarket.myServices.details.tabs.availability.days.sunday') },
    { id: 'monday', name: t('serviceMarket.myServices.details.tabs.availability.days.monday') },
    { id: 'tuesday', name: t('serviceMarket.myServices.details.tabs.availability.days.tuesday') },
    { id: 'wednesday', name: t('serviceMarket.myServices.details.tabs.availability.days.wednesday') },
    { id: 'thursday', name: t('serviceMarket.myServices.details.tabs.availability.days.thursday') },
    { id: 'friday', name: t('serviceMarket.myServices.details.tabs.availability.days.friday') },
    { id: 'saturday', name: t('serviceMarket.myServices.details.tabs.availability.days.saturday') },
  ];

  const [selectedDay, setSelectedDay] = useState<string>("");
  const [localSlots, setLocalSlots] = useState<TimeSlot[]>([
    {
      id: `slot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      from: "",
      to: "",
    },
  ]);

  React.useEffect(() => {
    if (!isOpen) {
      setSelectedDay("");
      setLocalSlots([
        {
          id: `slot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          from: "",
          to: "",
        },
      ]);
    }
  }, [isOpen]);

  const availableDays = days.filter(
    (day) => !existingDays.includes(day.id)
  );

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

  const handleSave = () => {
    if (!selectedDay) {
      return;
    }

    const cleanedSlots = localSlots
      .filter((slot) => slot.from && slot.to)
      .map((slot) => ({
        ...slot,
        from: formatTimeForDisplay(slot.from),
        to: formatTimeForDisplay(slot.to),
      }));

    onSave(selectedDay, cleanedSlots);
    onClose();
  };

  const isSaveDisabled = !selectedDay || localSlots.every(slot => !slot.from || !slot.to);

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
            <h3 className="text-[22px] font-bold text-textColor">
              {t("serviceMarket.myServices.availability.addNewDay")}
            </h3>
          </div>

          <p className="text-[18px] text-textGrayColor">
            {t("serviceMarket.myServices.availability.addNewDayDescription")}
          </p>
        </div>

        <div className="space-y-6">
          {/* Day Selection */}
          <SelectField
            id="day-select"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            label={t("serviceMarket.myServices.availability.selectDay")}
            placeholder={t("serviceMarket.myServices.availability.selectDayPlaceholder")}
            selectorOptions={availableDays.map(day => ({
              id: day.id,
              name: day.name
            }))}
            required={true}
            withFieldset
          />

          {/* Time Slots */}
          {selectedDay && (
            <div className="space-y-4">
              <h4 className="text-[16px] font-medium text-textColor">
                {t("serviceMarket.myServices.availability.availableTimeSlots")}
              </h4>
              
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
            </div>
          )}

          <div className="flex flex-col gap-4 pt-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-4">
              <Button
                onClick={handleSave}
                unstyled
                disabled={isSaveDisabled}
                className="min-w-[170px] rounded-[10px] bg-blueSite px-6 py-3 text-base font-semibold text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("serviceMarket.myServices.availability.addDay")}
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
          </div>
        </div>
      </div>
    </Modal>
  );
}
