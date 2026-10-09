"use client";

import React from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import AddSlotForm from './AddSlotForm';

interface SlotData {
    day: string;
    start_time: string;
    end_time: string;
}

interface AvailabilityFormProps {
    slotData: SlotData;
    editingIndex: number | null;
    title: string;
    loading?: boolean;
    onSlotChange: (slot: SlotData) => void;
    onSave: () => void;
    onCancel: () => void;
    onUpdate?: () => void;
}

const AvailabilityForm: React.FC<AvailabilityFormProps> = ({
    slotData,
    editingIndex,
    title,
    loading = false,
    onSlotChange,
    onSave,
    onCancel,
    onUpdate,
}) => {
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[#353635] mb-4">
                {title}
            </h3>
            <AddSlotForm
                slotData={slotData}
                editingIndex={editingIndex}
                loading={loading}
                onSlotChange={onSlotChange}
                onAdd={editingIndex === null ? onSave : undefined}
                onUpdate={editingIndex !== null ? onUpdate : undefined}
                onCancel={onCancel}
            />
        </div>
    );
};

export default AvailabilityForm;
