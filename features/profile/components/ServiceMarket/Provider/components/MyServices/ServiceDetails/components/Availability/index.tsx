import React, { useState, useEffect } from 'react';
import { ServiceOffer, TimeSlot } from '../../../../../types/provider.types';
import { useTranslation } from '@/lib/i18n/useTranslation';
import AvailabilityCard from './AvailabilityCard';
import AvailabilityForm from './AvailabilityForm';
import { useAvailabilityOperations } from './useAvailabilityOperations';

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

interface AvailableSlot {
    day: string;
    slots: TimeSlot[];
}

interface AvailabilityTabProps {
    offer: ServiceOffer | null;
    onSubmit?: (formData: any) => Promise<{ ok: boolean; error?: string }>;
    triggerEdit?: boolean;
}

const AvailabilityTab = ({ offer, onSubmit, triggerEdit }: AvailabilityTabProps) => {
    const { t } = useTranslation();
    // State for managing which forms are open
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingIndexes, setEditingIndexes] = useState<Set<string>>(new Set()); // Track dayIndex-slotIndex pairs

    // Convert ServiceOffer data to weekly schedule format
    // Initialize with all 7 days of the week
    const [weeklySchedule, setWeeklySchedule] = useState<DaySchedule[]>([
        { day: 'monday', isEnabled: false, slots: [] },
        { day: 'tuesday', isEnabled: false, slots: [] },
        { day: 'wednesday', isEnabled: false, slots: [] },
        { day: 'thursday', isEnabled: false, slots: [] },
        { day: 'friday', isEnabled: false, slots: [] },
        { day: 'saturday', isEnabled: false, slots: [] },
        { day: 'sunday', isEnabled: false, slots: [] },
    ]);

    // State for new slot form
    const [newSlot, setNewSlot] = useState({
        day: "",
        start_time: "",
        end_time: ""
    });

    // Use availability operations hook for API calls
    const { addAvailabilitySlot, updateAvailabilitySlot, deleteAvailabilitySlot, toggleDayAvailability, loading } = useAvailabilityOperations({
        offer,
        onSuccess: () => {
            // Reset forms after successful operations
            setShowAddForm(false);
            setEditingIndexes(new Set());
            setNewSlot({ day: "", start_time: "", end_time: "" });
        }
    });

    // Update weekly schedule when offer changes
    useEffect(() => {
        if (offer?.available_slots) {
            // Initialize with all 7 days
            const scheduleData: DaySchedule[] = [
                { day: 'monday', isEnabled: false, slots: [] },
                { day: 'tuesday', isEnabled: false, slots: [] },
                { day: 'wednesday', isEnabled: false, slots: [] },
                { day: 'thursday', isEnabled: false, slots: [] },
                { day: 'friday', isEnabled: false, slots: [] },
                { day: 'saturday', isEnabled: false, slots: [] },
                { day: 'sunday', isEnabled: false, slots: [] },
            ];
            
            // Populate slots from offer data
            offer?.available_slots?.forEach((dayData: AvailableSlot) => {
                const dayIndex = scheduleData.findIndex(d => d.day === dayData.day.toLowerCase());
                if (dayIndex !== -1 && dayData.slots && dayData.slots.length > 0) {
                    scheduleData[dayIndex] = {
                        ...scheduleData[dayIndex],
                        isEnabled: true,
                        slots: dayData.slots?.map((slot: TimeSlot) => ({
                            id: slot.id?.toString() || Date.now().toString(),
                            startTime: `${slot.start_time?.replace(':', ' : ')} AM`,
                            endTime: `${slot.end_time?.replace(':', ' : ')} PM`
                        })) || []
                    };
                }
            });
            
            setWeeklySchedule(scheduleData);
        } else {
            // If no available slots, reset to default state
            setWeeklySchedule([
                { day: 'monday', isEnabled: false, slots: [] },
                { day: 'tuesday', isEnabled: false, slots: [] },
                { day: 'wednesday', isEnabled: false, slots: [] },
                { day: 'thursday', isEnabled: false, slots: [] },
                { day: 'friday', isEnabled: false, slots: [] },
                { day: 'saturday', isEnabled: false, slots: [] },
                { day: 'sunday', isEnabled: false, slots: [] },
            ]);
        }
    }, [offer]);

    // Trigger edit mode when parent component requests it
    useEffect(() => {
        if (triggerEdit) {
            setShowAddForm(true);
        }
    }, [triggerEdit]);
    const handleAddSlot = () => {
        setShowAddForm(true);
        // Reset new slot form
        setNewSlot({ day: "", start_time: "", end_time: "" });
    };

    const handleAddSlotForDay = (day: string) => {
        setNewSlot({ day: day, start_time: "", end_time: "" });
        setShowAddForm(true);
    };

    const handleCancelAdd = () => {
        setShowAddForm(false);
        setNewSlot({ day: "", start_time: "", end_time: "" });
    };

    const handleCancelEdit = (dayIndex: number, slotIndex: number) => {
        // Remove this day-slot pair from the set of editing indexes
        const editKey = `${dayIndex}-${slotIndex}`;
        setEditingIndexes(prev => {
            const newSet = new Set(prev);
            newSet.delete(editKey);
            return newSet;
        });
    };

    const handleEditSlot = (dayIndex: number, slotIndex: number) => {
        const slot = weeklySchedule[dayIndex].slots[slotIndex];
        setNewSlot({
            day: weeklySchedule[dayIndex].day.toLowerCase(),
            start_time: slot.startTime.replace(' : ', ':').replace(' AM', '').replace(' PM', ''),
            end_time: slot.endTime.replace(' : ', ':').replace(' AM', '').replace(' PM', '')
        });
        // Add this day-slot pair to editing indexes
        const editKey = `${dayIndex}-${slotIndex}`;
        setEditingIndexes(prev => new Set(prev).add(editKey));
    };

    const handleSaveNew = async () => {
        const result = await addAvailabilitySlot(newSlot, weeklySchedule, offer?.plans || [], offer?.faqs || []);
        if (result.success) {
            setShowAddForm(false);
            setNewSlot({ day: "", start_time: "", end_time: "" });
        }
    };

    const handleSaveEdit = async (dayIndex: number, slotIndex: number, slotData: any) => {
        const result = await updateAvailabilitySlot(dayIndex, slotIndex, slotData, weeklySchedule, offer?.plans || [], offer?.faqs || []);
        if (result.success) {
            handleCancelEdit(dayIndex, slotIndex);
        }
    };

    const handleDeleteSlot = async (dayIndex: number, slotIndex: number) => {
        const result = await deleteAvailabilitySlot(dayIndex, slotIndex, weeklySchedule, offer?.plans || [], offer?.faqs || []);
        if (result.success) {
            const updatedSchedule = [...weeklySchedule];
            updatedSchedule[dayIndex].slots.splice(slotIndex, 1);
            setWeeklySchedule(updatedSchedule);
        }
    };

    const handleToggleDay = async (dayIndex: number, enabled: boolean) => {
        const daySchedule = weeklySchedule[dayIndex];
        
        // Update local state first
        const updatedSchedule = weeklySchedule.map((day, index) => 
            index === dayIndex ? { ...day, isEnabled: enabled } : day
        );
        setWeeklySchedule(updatedSchedule);
        
        // If enabling the day and it has no slots, add default slot (12 AM - 12 PM)
        if (enabled && daySchedule.slots.length === 0) {
            const defaultSlot = {
                day: daySchedule.day,
                start_time: "00:00",
                end_time: "12:00"
            };
            const result = await addAvailabilitySlot(defaultSlot, updatedSchedule, offer?.plans || [], offer?.faqs || []);
            if (result.success) {
                setWeeklySchedule(prev => 
                    prev.map((day, index) => 
                        index === dayIndex ? { ...day, isEnabled: enabled, slots: [{ id: Date.now().toString(), startTime: "12 : 00 AM", endTime: "12 : 00 PM" }] } : day
                    )
                );
            }
        } else if (!enabled && daySchedule.slots.length > 0) {
            // If disabling the day, remove all slots
            const result = await toggleDayAvailability(dayIndex, enabled, updatedSchedule, offer?.plans || [], offer?.faqs || []);
            if (result.success) {
                setWeeklySchedule(prev => 
                    prev.map((day, index) => 
                        index === dayIndex ? { ...day, isEnabled: enabled, slots: [] } : day
                    )
                );
            }
        } else {
            const result = await toggleDayAvailability(dayIndex, enabled, updatedSchedule, offer?.plans || [], offer?.faqs || []);
            if (!result.success) {
                // Revert if API call fails
                setWeeklySchedule(weeklySchedule);
            }
        }
    };

    return (
        <div className="border border-[#E9E9E9] rounded-xl bg-white overflow-hidden p-6">
            <div className="flex items-center gap-2 mb-6 text-[#353635] font-semibold">
                <svg className="w-5 h-5 text-[#00664F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {t("serviceMarket.myServices.details.tabs.availability.weeklySchedule")}
            </div>

            {/* Add New Slot Form */}
            {showAddForm && (
                <AvailabilityForm
                    slotData={newSlot}
                    editingIndex={null}
                    title={t("serviceMarket.myServices.details.tabs.availability.addNewSlot")}
                    loading={loading}
                    onSlotChange={(slot) => setNewSlot({ ...slot })}
                    onSave={handleSaveNew}
                    onCancel={handleCancelAdd}
                />
            )}

            {/* Existing Day Cards with Edit Forms */}
            {weeklySchedule.map((daySchedule, dayIndex) => {
                const hasSlots = daySchedule.slots.length > 0;
                const hasEditingSlot = daySchedule.slots.some((_, slotIndex) => {
                    const editKey = `${dayIndex}-${slotIndex}`;
                    return editingIndexes.has(editKey);
                });
                
                return (
                    <div key={daySchedule.day} className="space-y-6">
                        {/* Show edit form if any slot is being edited */}
                        {daySchedule.slots.map((slot, slotIndex) => {
                            const editKey = `${dayIndex}-${slotIndex}`;
                            const isEditing = editingIndexes.has(editKey);
                            
                            if (isEditing) {
                                return (
                                    <div key={slot.id} className="space-y-6">
                                        <AvailabilityForm
                                            slotData={newSlot}
                                            editingIndex={slotIndex}
                                            title={`${t("serviceMarket.myServices.details.tabs.availability.editSlot")}: ${t(`serviceMarket.myServices.details.tabs.availability.days.${daySchedule.day.toLowerCase()}`)}`}
                                            loading={loading}
                                            onSlotChange={(slotData) => {
                                                // Update newSlot state so form reflects changes
                                                setNewSlot({ ...slotData });
                                                // Update the specific slot in the array
                                                setWeeklySchedule(prev => prev.map((day, i) => {
                                                    if (i === dayIndex) {
                                                        return {
                                                            ...day,
                                                            slots: day.slots.map((s, si) => {
                                                                if (si === slotIndex) {
                                                                    return {
                                                                        ...s,
                                                                        startTime: `${slotData.start_time.replace(':', ' : ')} AM`,
                                                                        endTime: `${slotData.end_time.replace(':', ' : ')} PM`
                                                                    };
                                                                }
                                                                return s;
                                                            })
                                                        };
                                                    }
                                                    return day;
                                                }));
                                            }}
                                            onSave={() => handleSaveEdit(dayIndex, slotIndex, newSlot)}
                                            onUpdate={() => handleSaveEdit(dayIndex, slotIndex, newSlot)}
                                            onCancel={() => handleCancelEdit(dayIndex, slotIndex)}
                                        />
                                    </div>
                                );
                            }
                            return null;
                        })}
                        
                        {/* Show day card if not editing */}
                        {!hasEditingSlot && (
                            <AvailabilityCard
                                daySchedule={daySchedule}
                                index={dayIndex}
                                isEditing={false}
                                onToggleDay={handleToggleDay}
                                onEditSlot={handleEditSlot}
                                onDeleteSlot={handleDeleteSlot}
                                onAddSlot={handleAddSlotForDay}
                            />
                        )}
                    </div>
                );
            })}

        </div>
    );
};

export default AvailabilityTab;
