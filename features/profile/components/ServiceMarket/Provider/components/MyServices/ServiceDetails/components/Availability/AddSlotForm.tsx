import React, { useState, useEffect } from 'react';
import { Save, X, Loader2 } from 'lucide-react';
import InputField from '@/components/ui/InputField';
import SelectField from '@/components/ui/SelectFiled';
import TimeInput from '../../../AddForm/components/TimeInput';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAlert } from '@/lib/context/AlertProvider';
import { playErrorSound } from '@/lib/utils/playSound';
import { useAvailabilityOperations } from './useAvailabilityOperations';

interface SlotData {
    day: string;
    start_time: string;
    end_time: string;
}

interface AddSlotFormProps {
    slotData: SlotData;
    editingIndex?: number | null;
    loading?: boolean;
    onSlotChange: (slot: SlotData) => void;
    onAdd?: () => void;
    onUpdate?: () => void;
    onCancel: () => void;
}

const AddSlotForm = ({
    slotData,
    editingIndex,
    loading = false,
    onSlotChange,
    onAdd,
    onUpdate,
    onCancel
}: AddSlotFormProps) => {
    const { t } = useTranslation();
    const alert = useAlert();
    const [isSubmited ,setIsSubmited]=useState(false);
    const { validate, errors, setIsSubmitted, setDay, setStartTime, setEndTime } = useAvailabilityOperations({ offer: null });

    // Update hook state when slotData changes
    useEffect(() => {
        setDay(slotData.day);
        setStartTime(slotData.start_time);
        setEndTime(slotData.end_time);
    }, [slotData.day, slotData.start_time, slotData.end_time, setDay, setStartTime, setEndTime]);

    const handleSave = () => {
        // Set form data in the hook before validation
        setDay(slotData.day);
        setStartTime(slotData.start_time);
        setEndTime(slotData.end_time);

        const isValid = validate();
        if (!isValid) {
            setIsSubmited(true);
            setIsSubmitted(true);
            playErrorSound();
            const errorMessage = Object.values(errors).join(', ');
            alert.message.error(errorMessage);
            return;
        }

        if (editingIndex !== null) {
            onUpdate?.();
        } else {
            onAdd?.();
        }
    };

    const days = [
        { id: 'monday', name: t('serviceMarket.myServices.details.tabs.availability.days.monday') },
        { id: 'tuesday', name: t('serviceMarket.myServices.details.tabs.availability.days.tuesday') },
        { id: 'wednesday', name: t('serviceMarket.myServices.details.tabs.availability.days.wednesday') },
        { id: 'thursday', name: t('serviceMarket.myServices.details.tabs.availability.days.thursday') },
        { id: 'friday', name: t('serviceMarket.myServices.details.tabs.availability.days.friday') },
        { id: 'saturday', name: t('serviceMarket.myServices.details.tabs.availability.days.saturday') },
        { id: 'sunday', name: t('serviceMarket.myServices.details.tabs.availability.days.sunday') },
    ];

    const updateSlotField = (key: keyof SlotData, value: string) => {
        onSlotChange({ ...slotData, [key]: value });
    };

    return (
        <div className="relative overflow-hidden rounded-[22px] space-y-4 border border-[#DDE3E7] bg-[#FCFCFD] p-5 md:p-6">
            <div className="pointer-events-none absolute inset-0 rounded-[22px] shadow-[0_0_90px_rgba(53,208,182,0.12)_inset]" />

            <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.05fr]">
                <div className="space-y-5">
                    <SelectField
                        id={`slotDay-${editingIndex !== null ? editingIndex : 'new'}`}
                        label={t("serviceMarket.myServices.details.tabs.availability.day")}
                        placeholder={t("serviceMarket.myServices.availability.selectDay")}
                        value={slotData.day}
                        onChange={(e: any) => updateSlotField('day', e.target.value)}
                        selectorOptions={days}
                        withFieldset
                        validate
                        isSubmited={isSubmited}
                    />
                </div>

                <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TimeInput
                            label={t("serviceMarket.myServices.details.tabs.availability.startTime")}
                            placeholder="09:00"
                            value={slotData.start_time}
                            onChange={(value) => updateSlotField('start_time', value)}
                        />
                        
                        <TimeInput
                            label={t("serviceMarket.myServices.details.tabs.availability.endTime")}
                            placeholder="17:00"
                            value={slotData.end_time}
                            onChange={(value) => updateSlotField('end_time', value)}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-2">
                <button
                    onClick={onCancel}
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-textColor border border-[#DDE3E7] bg-white rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {t("common.cancel")}
                </button>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#00664F] rounded-lg hover:bg-[#005543] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {loading ? t("common.saving") : (editingIndex !== null ? t("common.update") : t("serviceMarket.myServices.details.tabs.availability.addSlot"))}
                </button>
            </div>
        </div>
    );
};

export default AddSlotForm;
