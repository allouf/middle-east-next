"use client";

import React from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import DaySchedule from './DaySchedule';

interface Slot {
    id: string;
    startTime: string;
    endTime: string;
}

interface DaySchedule {
    day: string;
    isEnabled: boolean;
    slots: Slot[];
}

interface AvailabilityCardProps {
    daySchedule: DaySchedule;
    index: number;
    isEditing: boolean;
    onToggleDay: (index: number, enabled: boolean) => void;
    onEditSlot: (dayIndex: number, slotIndex: number) => void;
    onDeleteSlot: (dayIndex: number, slotIndex: number) => void;
    onAddSlot?: (day: string) => void;
}

const AvailabilityCard: React.FC<AvailabilityCardProps> = ({
    daySchedule,
    index,
    isEditing,
    onToggleDay,
    onEditSlot,
    onDeleteSlot,
    onAddSlot,
}) => {
    const { t } = useTranslation();

    return (
        <DaySchedule
            day={daySchedule.day}
            isEnabled={daySchedule.isEnabled}
            slots={daySchedule.slots}
            dayIndex={index}
            isEditing={isEditing}
            onToggleDay={(enabled) => onToggleDay(index, enabled)}
            onEditSlot={onEditSlot}
            onDeleteSlot={onDeleteSlot}
            onAddSlot={onAddSlot}
        />
    );
};

export default AvailabilityCard;
