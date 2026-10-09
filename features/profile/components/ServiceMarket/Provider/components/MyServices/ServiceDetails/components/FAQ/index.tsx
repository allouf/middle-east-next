import React, { useState, useEffect } from 'react';
import { ServiceOffer } from '../../../../../types/provider.types';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Plus, HelpCircle } from 'lucide-react';
import FAQCard from './FAQCard';
import FAQForm from './FAQForm';
import { useFAQOperations } from './useFAQOperations';
import { useFaqApi } from '../../../../../hooks/Service/useFaqApi';
import { useServiceDataStore } from '@/features/profile/components/ServiceMarket/stores';

interface FAQ {
    id: string;
    question: string;
    answer: string;
    sort_order?: number;
}

interface FAQTabProps {
    offer: ServiceOffer | null;
    onSubmit?: (formData: any) => Promise<{ ok: boolean; error?: string }>;
    triggerEdit?: boolean;
}

const DEFAULT_FAQ: FAQ = {
    id: '',
    question: '',
    answer: '',
};

const FAQTab = ({ offer, onSubmit, triggerEdit }: FAQTabProps) => {
    const { t } = useTranslation();
    // State for managing which forms are open
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingIndexes, setEditingIndexes] = useState<Set<number>>(new Set());

    // Drag and drop state
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    // Convert ServicePlan[] to FAQ[] format
    const [faqs, setFaqs] = useState<FAQ[]>(
        offer?.faqs?.map(faq => ({
            id: faq.id?.toString() || '',
            question: faq.question || '',
            answer: faq.answer || '',
            sort_order: faq.sort_order,
        })) || []
    );

    // State for new FAQ form
    const [newFAQ, setNewFAQ] = useState<FAQ>(DEFAULT_FAQ);

    // Use FAQ operations hook for API calls
    const { addFAQ, updateFAQ, deleteFAQ, isSubmitted, loading } = useFAQOperations({
        offer,
        onSuccess: () => {
            // Reset forms after successful operations
            setShowAddForm(false);
            setEditingIndexes(new Set());
            setNewFAQ(DEFAULT_FAQ);
        }
    });

    // Use FAQ API for direct API calls
    const { updateFaq } = useFaqApi();
    const { triggerFaqRefetch } = useServiceDataStore();

    // Update FAQs when offer changes
    useEffect(() => {
        if (offer?.faqs) {
            setFaqs(offer.faqs.map(faq => ({
                id: faq.id?.toString() || '',
                question: faq.question || '',
                answer: faq.answer || '',
            })));
        }
    }, [offer]);

    // Trigger edit mode when parent component requests it
    useEffect(() => {
        if (triggerEdit) {
            setShowAddForm(true);
        }
    }, [triggerEdit]);

    const handleEditFAQ = (index: number) => {
        // Add this index to the set of editing indexes
        setEditingIndexes(prev => new Set(prev).add(index));
    };

    const handleAddFAQ = () => {
        setShowAddForm(true);
        // Reset new FAQ form
        setNewFAQ(DEFAULT_FAQ);
    };

    const handleCancelAdd = () => {
        setShowAddForm(false);
        setNewFAQ(DEFAULT_FAQ);
    };

    const handleCancelEdit = (index: number) => {
        // Remove this index from the set of editing indexes
        setEditingIndexes(prev => {
            const newSet = new Set(prev);
            newSet.delete(index);
            return newSet;
        });
    };

    const handleSaveNew = async () => {
        const success = await addFAQ(newFAQ, faqs, offer?.plans || []);
        if (success) {
            setShowAddForm(false);
            setNewFAQ(DEFAULT_FAQ);
        }
    };

    const handleSaveEdit = async (index: number, faqData: FAQ) => {
        const success = await updateFAQ(index, faqData, faqs, offer?.plans || []);
        if (success) {
            handleCancelEdit(index);
        }
    };

    const handleDeleteFAQ = async (index: number) => {
        const success = await deleteFAQ(index, faqs, offer?.plans || []);
        if (success) {
            const updatedFAQs = faqs.filter((_, i) => i !== index);
            setFaqs(updatedFAQs);
        }
    };

    // Drag and drop handlers
    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === dropIndex) return;

        const updatedFAQs = [...faqs];
        const [draggedItem] = updatedFAQs.splice(draggedIndex, 1);
        updatedFAQs.splice(dropIndex, 0, draggedItem);

        // Update local state immediately for better UX
        setFaqs(updatedFAQs);
        setDraggedIndex(null);

        // Update sort_order for FAQs that changed position via API
        try {
            // Only update the dragged item and items between old and new positions
            const startIndex = Math.min(draggedIndex, dropIndex);
            const endIndex = Math.max(draggedIndex, dropIndex);

            const updatePromises = updatedFAQs.slice(startIndex, endIndex + 1).map(async (faq, index) => {
                const actualIndex = startIndex + index;
                const formData = new FormData();
                formData.append('question', faq.question);
                formData.append('answer', faq.answer);
                // Preserve existing sort_order if available, otherwise use position
                formData.append('sort_order', faq.sort_order ? String(faq.sort_order) : String(actualIndex + 1));

                return updateFaq(Number(faq.id), formData, {
                    showMessage: false, // Don't show message for each update
                });
            });

            await Promise.all(updatePromises);

            // Trigger refetch to get updated data from backend
            triggerFaqRefetch();
        } catch (error) {
            console.error('Error updating FAQ order:', error);
            // Revert local state on error
            setFaqs(faqs);
        }
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    return (
        <div className="space-y-6">
            
            {/* Add New FAQ Form */}
            {showAddForm && (
                <FAQForm
                    faqData={newFAQ}
                    editingIndex={null}
                    title={t("serviceMarket.myServices.details.tabs.faq.addNewFAQ")}
                    onFAQChange={(faq) => setNewFAQ({ ...faq, id: '' })}
                    onSave={handleSaveNew}
                    onCancel={handleCancelAdd}
                    isSubmitted={isSubmitted}
                    loading={loading}
                />
            )}

            {/* Existing FAQ Cards with Edit Forms */}
            {faqs.map((faq, index) => (
                <div key={faq.id} className="space-y-6">
                    {/* Edit Form for this FAQ */}
                    {editingIndexes.has(index) ? (
                        <FAQForm
                            faqData={faq}
                            editingIndex={index}
                            title={`${t("serviceMarket.myServices.details.tabs.faq.editFAQ")}: ${faq.question}`}
                            onFAQChange={(updatedFaq) => {
                                // Update the FAQ in the array
                                setFaqs(prev => prev.map((f, i) =>
                                    i === index ? { ...updatedFaq, id: f.id } : f
                                ));
                            }}
                            onSave={() => handleSaveEdit(index, faq)}
                            onUpdate={() => handleSaveEdit(index, faq)}
                            onCancel={() => handleCancelEdit(index)}
                            isSubmitted={isSubmitted}
                            loading={loading}
                        />
                    ) : (
                        /* FAQ Card View */
                        <FAQCard
                            faq={faq}
                            index={index}
                            onEdit={handleEditFAQ}
                            onDelete={handleDeleteFAQ}
                            showDragHandle={true}
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onDragEnd={handleDragEnd}
                        />
                    )}
                </div>
            ))}

            {/* Empty State */}
            {faqs.length === 0 && !showAddForm && (
                <div className="text-center py-12">
                    <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        {t("serviceMarket.myServices.details.tabs.faq.noFAQs")}
                    </h3>
                    <p className="text-gray-500 mb-6">
                        {t("serviceMarket.myServices.details.tabs.faq.addFirstFAQ")}
                    </p>
                </div>
            )}
            
        </div>
    );
};

export default FAQTab;
