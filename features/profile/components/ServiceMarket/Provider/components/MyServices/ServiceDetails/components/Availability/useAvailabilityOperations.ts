"use client";

import { useCallback } from 'react';
import { useSlotsApi } from '../../../../../hooks/Service/useSlotsApi';
import { ServiceOffer } from '../../../../../types/provider.types';
import { useSlotForm } from '../../../../../hooks/Service/useSlotForm';
import { useServiceDataStore } from '@/features/profile/components/ServiceMarket/stores';

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

interface UseAvailabilityOperationsProps {
    offer: ServiceOffer | null;
    onSuccess?: () => void;
}

export const useAvailabilityOperations = ({ offer, onSuccess }: UseAvailabilityOperationsProps) => {
    const slotsApi = useSlotsApi();
    const { triggerAvailabilityRefetch } = useServiceDataStore();
    const { loading } = slotsApi;

    // Use slot form for validation and form management
    const {
        validate,
        errors,
        isSubmitted,
        setIsSubmitted,
        setDay,
        setStartTime,
        setEndTime,
        submitForm,
    } = useSlotForm({
        serviceId: offer ? Number(offer.id) : undefined,
        onSuccess: () => {
            onSuccess?.();
            triggerAvailabilityRefetch();
        },
    });

    const buildSlotsFormData = useCallback((weeklySchedule: DaySchedule[]) => {
        const formData = new FormData();
        const slots = weeklySchedule
            .filter(day => day.isEnabled && day.slots.length > 0)
            .flatMap(day =>
                day.slots.map(slot => ({
                    day: day.day.toLowerCase(),
                    start_time: slot.startTime.replace(' : ', ':').replace(' AM', '').replace(' PM', ''),
                    end_time: slot.endTime.replace(' : ', ':').replace(' AM', '').replace(' PM', ''),
                }))
            );

        // Append each slot as a separate entry using array notation
        slots.forEach((slot, index) => {
            formData.append(`${index}[day]`, slot.day);
            formData.append(`${index}[start_time]`, slot.start_time);
            formData.append(`${index}[end_time]`, slot.end_time);
        });

        return formData;
    }, []);

    const updateAvailability = useCallback(async (weeklySchedule: DaySchedule[]) => {
        if (!offer) return { success: false, error: 'No offer provided' };

        try {
            const formData = buildSlotsFormData(weeklySchedule);
            const result = await slotsApi.updateSlots(Number(offer.id), formData, {
                showMessage: true,
                onSuccess: () => {
                    onSuccess?.();
                    triggerAvailabilityRefetch();
                },
            });

            return { success: !!result, error: null };
        } catch (error) {
            console.error('Error updating availability:', error);
            return { success: false, error: 'Failed to update availability' };
        }
    }, [offer, slotsApi, buildSlotsFormData, onSuccess]);

    const addAvailabilitySlot = useCallback(async (newSlot: any, weeklySchedule: DaySchedule[], existingPlans: any[] = [], existingFAQs: any[] = []) => {
        // Set form data for validation
        setDay(newSlot.day);
        setStartTime(newSlot.start_time);
        setEndTime(newSlot.end_time);

        // Validate slot data first
        const isValid = validate();
        if (!isValid) {
            setIsSubmitted(true);
            return { success: false, error: Object.values(errors).join(', ') };
        }

        try {
            // Add new slot to appropriate day
            let dayIndex = weeklySchedule.findIndex(day => day.day.toLowerCase() === newSlot.day);

            const updatedSchedule = [...weeklySchedule];

            // If day doesn't exist, create it
            if (dayIndex === -1) {
                const newDaySchedule: DaySchedule = {
                    day: newSlot.day.charAt(0).toUpperCase() + newSlot.day.slice(1),
                    isEnabled: true,
                    slots: []
                };
                updatedSchedule.push(newDaySchedule);
                dayIndex = updatedSchedule.length - 1;
            }

            updatedSchedule[dayIndex] = {
                ...updatedSchedule[dayIndex],
                slots: [...updatedSchedule[dayIndex].slots, {
                    id: Date.now().toString(),
                    startTime: `${newSlot.start_time.replace(':', ' : ')} AM`,
                    endTime: `${newSlot.end_time.replace(':', ' : ')} PM`
                }]
            };

            return await updateAvailability(updatedSchedule);
        } catch (error) {
            console.error('Error adding availability slot:', error);
            return { success: false, error: 'Failed to add availability slot' };
        }
    }, [updateAvailability, validate, errors, setDay, setStartTime, setEndTime, setIsSubmitted]);

    const updateAvailabilitySlot = useCallback(async (dayIndex: number, slotIndex: number, slotData: any, weeklySchedule: DaySchedule[], existingPlans: any[] = [], existingFAQs: any[] = []) => {
        // Set form data for validation
        setDay(slotData.day);
        setStartTime(slotData.start_time);
        setEndTime(slotData.end_time);

        // Validate slot data first
        const isValid = validate();
        if (!isValid) {
            setIsSubmitted(true);
            return { success: false, error: Object.values(errors).join(', ') };
        }

        try {
            const updatedSchedule = [...weeklySchedule];
            const slot = updatedSchedule[dayIndex].slots[slotIndex];
            slot.startTime = `${slotData.start_time.replace(':', ' : ')} AM`;
            slot.endTime = `${slotData.end_time.replace(':', ' : ')} PM`;

            return await updateAvailability(updatedSchedule);
        } catch (error) {
            console.error('Error updating availability slot:', error);
            return { success: false, error: 'Failed to update availability slot' };
        }
    }, [updateAvailability, validate, errors, setDay, setStartTime, setEndTime, setIsSubmitted]);

    const deleteAvailabilitySlot = useCallback(async (dayIndex: number, slotIndex: number, weeklySchedule: DaySchedule[], existingPlans: any[] = [], existingFAQs: any[] = []) => {
        try {
            const updatedSchedule = [...weeklySchedule];
            updatedSchedule[dayIndex].slots.splice(slotIndex, 1);

            return await updateAvailability(updatedSchedule);
        } catch (error) {
            console.error('Error deleting availability slot:', error);
            return { success: false, error: 'Failed to delete availability slot' };
        }
    }, [updateAvailability]);

    const toggleDayAvailability = useCallback(async (dayIndex: number, enabled: boolean, weeklySchedule: DaySchedule[], existingPlans: any[] = [], existingFAQs: any[] = []) => {
        try {
            const updatedSchedule = [...weeklySchedule];
            updatedSchedule[dayIndex] = {
                ...updatedSchedule[dayIndex],
                isEnabled: enabled
            };

            return await updateAvailability(updatedSchedule);
        } catch (error) {
            console.error('Error toggling day availability:', error);
            return { success: false, error: 'Failed to toggle day availability' };
        }
    }, [updateAvailability]);

    return {
        addAvailabilitySlot,
        updateAvailabilitySlot,
        deleteAvailabilitySlot,
        toggleDayAvailability,
        validate,
        errors,
        isSubmitted,
        loading,
        setIsSubmitted,
        setDay,
        setStartTime,
        setEndTime,
    };
};
