import React from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import TimeSlot from './TimeSlot';

interface Slot {
    id: string;
    startTime: string;
    endTime: string;
}

interface DayScheduleProps {
    day: string;
    isEnabled: boolean;
    slots: Slot[];
    dayIndex: number;
    isEditing: boolean;
    onToggleDay?: (enabled: boolean) => void;
    onEditSlot?: (dayIndex: number, slotIndex: number) => void;
    onDeleteSlot?: (dayIndex: number, slotIndex: number) => void;
    onAddSlot?: (day: string) => void;
}

const DaySchedule = ({
    day,
    isEnabled,
    slots,
    dayIndex,
    isEditing,
    onToggleDay,
    onEditSlot,
    onDeleteSlot,
    onAddSlot
}: DayScheduleProps) => {
    const { t } = useTranslation();
    const hasSlots = slots.length > 0;
    const hasMultipleSlots = slots.length > 1;

    // Translate day name
    const translatedDay = t(`serviceMarket.myServices.details.tabs.availability.days.${day.toLowerCase()}`);

    return (
        <div className={`flex items-center w-full border-b border-red gap-4 py-4 ${hasMultipleSlots ? '' : ''}`}>
            <input
                type="checkbox"
                checked={isEnabled}
                onChange={(e) => onToggleDay?.(e.target.checked)}
                className={`w-5 h-5 accent-[#00664F] rounded cursor-pointer ${hasMultipleSlots ? 'mt-3' : 'mt-3'}`}
            />
            <span className={`w-24 text-[15px] font-medium ${hasMultipleSlots ? 'mt-3' : 'mt-3'} ${isEnabled ? 'text-[#353635]' : 'text-[#999999]'}`}>
                {translatedDay}
            </span>

            <div className={`flex-1 w-1/3 ${hasSlots ? ( 'flex-col gap-2' ) : 'flex items-center'}`}>
                {hasSlots ? (
                    <>
                        {slots.map((slot, slotIndex) => (
                            <TimeSlot
                                key={slot.id}
                                startTime={slot.startTime}
                                endTime={slot.endTime}
                                onEdit={() => onEditSlot?.(dayIndex, slotIndex)}
                                onDelete={() => onDeleteSlot?.(dayIndex, slotIndex)}
                                isEditing={isEditing}
                            />
                        ))}
                        {isEnabled && (
                            <button
                                onClick={() => onAddSlot?.(day)}
                                className="text-[#00664F] text-sm font-medium hover:underline mt-2"
                            >
                                + {t("serviceMarket.myServices.details.tabs.availability.addSlot")}
                            </button>
                        )}
                    </>
                ) : (
                    <div className="flex items-center gap-2 mt-3">
                        <span className="text-[#999999] text-sm font-medium">
                            {t("serviceMarket.myServices.details.tabs.availability.unavailable")}
                        </span>
                        {isEnabled && (
                            <button
                                onClick={() => onAddSlot?.(day)}
                                className="text-[#00664F] text-sm font-medium hover:underline"
                            >
                                + {t("serviceMarket.myServices.details.tabs.availability.addSlot")}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DaySchedule;
