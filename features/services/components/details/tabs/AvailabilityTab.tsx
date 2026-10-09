"use client";

import React from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { ServiceAvailableSlot } from "../../../types/type";

interface AvailabilityTabProps {
  availableSlots?: ServiceAvailableSlot[];
}

const AvailabilityTab: React.FC<AvailabilityTabProps> = ({ availableSlots = [] }) => {
  const { t } = useTranslation();
  if (availableSlots.length === 0) {
    return (
      <div className="container 2xl:max-w-[1440px] mx-auto py-12 text-center text-gray-500 min-h-[400px]">
        <h3 className="text-xl font-bold mb-4 text-subTitleColor">
          {t("services.details.availabilityEmptyTitle", { defaultValue: "Availability Content" })}
        </h3>
        <p>{t("services.details.availabilityEmptyDesc", { defaultValue: "No availability information provided for this service yet." })}</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 container 2xl:max-w-[1440px] mx-auto py-12 text-gray-500 min-h-[400px]">
      <h3 className="text-[28px] font-bold text-subTitleColor mb-6">
        {t("services.details.availabilityTabHeader", { defaultValue: "Service Availability" })}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableSlots.map((daySlot, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm">
            <h4 className="text-lg font-bold text-[#00664F] mb-4 capitalize">{daySlot.day}</h4>
            <ul className="space-y-2">
              {daySlot.slots.map((slot) => (
                <li key={slot.id} className="flex items-center gap-2 text-[#474947] bg-gray-50 px-3 py-2 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="font-medium">{slot.start_time} - {slot.end_time}</span>
                </li>
              ))}
              {daySlot.slots.length === 0 && (
                <li className="text-gray-400 italic">
                  {t("services.details.noSlotsAvailable", { defaultValue: "No slots available" })}
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailabilityTab;
