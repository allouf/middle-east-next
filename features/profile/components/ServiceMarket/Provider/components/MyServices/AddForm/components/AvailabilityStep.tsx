"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import DayCard from "./DayCard";
import WorkingHoursModal from "./WorkingHoursModal";

type TimeSlot = {
  start_time: string;
  end_time: string;
};

type DayAvailability = {
  day: string;
  slots: TimeSlot[] | null;
};

type AvailabilityStepProps = {
  form: {
    available_slots: DayAvailability[];
  };
  serviceForm: any;
  isSubmitted: boolean;
};

const DEFAULT_AVAILABILITY: DayAvailability[] = [];

export default function AvailabilityStep({
  form,
  serviceForm,
  isSubmitted,
}: AvailabilityStepProps) {
  const { t } = useTranslation();
  const availableSlots = useMemo(
    () => form?.available_slots ?? DEFAULT_AVAILABILITY,
    [form?.available_slots]
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const weekDays = useMemo(
    () => [
      { id: "sunday", label: t("serviceMarket.myServices.details.tabs.availability.days.sunday") },
      { id: "monday", label: t("serviceMarket.myServices.details.tabs.availability.days.monday") },
      { id: "tuesday", label: t("serviceMarket.myServices.details.tabs.availability.days.tuesday") },
      { id: "wednesday", label: t("serviceMarket.myServices.details.tabs.availability.days.wednesday") },
      { id: "thursday", label: t("serviceMarket.myServices.details.tabs.availability.days.thursday") },
      { id: "friday", label: t("serviceMarket.myServices.details.tabs.availability.days.friday") },
      { id: "saturday", label: t("serviceMarket.myServices.details.tabs.availability.days.saturday") },
    ],
    [t]
  );

  const selectedDayData = useMemo(() => {
    if (!selectedDay) return null;
    return (
      availableSlots.find((item) => item.day === selectedDay) ?? {
        day: selectedDay,
        slots: [],
      }
    );
  }, [availableSlots, selectedDay]);

  const formatTimeRange = (value: string) => {
    if (!value) return "";

    const [hours, minutes] = value.split(":").map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return value;
    }

    const period = hours >= 12 ? "pm" : "am";
    const normalizedHours = hours % 12 || 12;
    return `${normalizedHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const updateAvailableSlots = (updatedSlots: DayAvailability[]) => {
    serviceForm.setAvailableSlots(updatedSlots);
  };

  const openDayModal = (day: string) => {
    setSelectedDay(day);
    setModalOpen(true);
  };

  const closeDayModal = () => {
    setModalOpen(false);
    setSelectedDay(null);
  };

  const handleSaveDaySlots = (day: string, slots: any[]) => {
    // Transform from modal format to API format
    const apiSlots = slots.map((slot) => ({
      start_time: slot.from,
      end_time: slot.to,
    }));

    const hasDay = availableSlots.some((item) => item.day === day);
    const updated = hasDay
      ? availableSlots.map((item) =>
          item.day === day
            ? {
                ...item,
                slots: apiSlots,
              }
            : item
        )
      : [...availableSlots, { day, slots: apiSlots }];

    updateAvailableSlots(updated);
  };

  const handleDeleteDay = (dayToDelete: string) => {
    const updated = availableSlots.filter((item) => item.day !== dayToDelete);
    updateAvailableSlots(updated);
  };

  return (
    <div>
      {/* <div className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          <span className="inline-block h-12 w-1 rounded-full bg-blueSite" />
          <h2 className="text-[34px] font-bold leading-none text-blueSite">
            {t("serviceMarket.myServices.availability.title")}
          </h2>
        </div>

        <p className="ps-4 text-[22px] text-textGrayColor">
          {t("serviceMarket.myServices.availability.description")}
        </p>
      </div> */}

      <div className="mb-6">
        <h3 className="text-[22px] font-bold text-textColor mb-4">
          {t("serviceMarket.myServices.availability.manageAvailability")}
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
          {weekDays.map((dayItem) => {
            const item = availableSlots.find((slot) => slot.day === dayItem.id) ?? {
              day: dayItem.id,
              slots: [],
            };

            // Transform from API format to DayCard format
            const dayCardItem = {
              day: dayItem.label,
              enabled: !!(item.slots && item.slots.length > 0),
              slots: item.slots ? item.slots.map((slot, index) => ({
                id: `${dayItem.id}-${index}`,
                from: formatTimeRange(slot.start_time),
                to: formatTimeRange(slot.end_time),
              })) : [],
            };

            return (
              <DayCard
                key={dayItem.id}
                item={dayCardItem}
                onAddTime={() => openDayModal(dayItem.id)}
                onEditDay={() => openDayModal(dayItem.id)}
                onDeleteDay={() => handleDeleteDay(dayItem.id)}
                isSelected={selectedDay === dayItem.id}
              />
            );
          })}
        </div>
      </div>

      {selectedDay && selectedDayData && (
        <WorkingHoursModal
          isOpen={modalOpen}
          day={selectedDay}

          // Transform from API format to modal format
          slots={selectedDayData.slots ? selectedDayData.slots.map((slot, index) => ({
            id: `${selectedDay}-${index}`,
            from: slot.start_time,
            to: slot.end_time,
          })) : []}
          onClose={closeDayModal}
          onSave={(slots) => handleSaveDaySlots(selectedDay, slots)}
        />
      )}
    </div>
  );
}