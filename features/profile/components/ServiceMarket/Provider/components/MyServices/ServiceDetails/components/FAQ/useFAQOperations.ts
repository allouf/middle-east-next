"use client";

import { useCallback } from 'react';
import { useFaqApi } from '../../../../../hooks/Service/useFaqApi';
import { ServiceOffer } from '../../../../../types/provider.types';
import { useFAQForm } from '../../../../../hooks/Service/useFAQForm';
import { useServiceDataStore } from '@/features/profile/components/ServiceMarket/stores';

interface FAQ {
    id: string;
    question: string;
    answer: string;
}

interface UseFAQOperationsProps {
    offer: ServiceOffer | null;
    onSuccess?: () => void;
}

export const useFAQOperations = ({ offer, onSuccess }: UseFAQOperationsProps) => {
    const faqApi = useFaqApi();
    const { triggerFaqRefetch } = useServiceDataStore();

    const {
        formData,
        setQuestion,
        setAnswer,
        errors,
        isSubmitted,
        loading,
        isValid,
        setIsSubmitted,
        handleChange,
        validate,
        resetForm,
        submitForm,
    } = useFAQForm({
        serviceId: offer ? Number(offer.id) : undefined,
        onSuccess: () => {
            onSuccess?.();
            triggerFaqRefetch();
        },
    });

    const addFAQ = useCallback(async (newFAQ: FAQ, existingFAQs: FAQ[], existingPlans: any[] = []) => {
        if (!offer) return false;

        try {
            // Set form data
            setQuestion(newFAQ.question);
            setAnswer(newFAQ.answer);

            // Validate form
            const isValid = validate();
            if (!isValid) {
                setIsSubmitted(true);
                return false;
            }

            // Submit the form (no faqId = add operation)
            const result = await submitForm();
            return result.ok;
        } catch (error) {
            console.error('Error saving FAQ:', error);
            return false;
        }
    }, [offer, setQuestion, setAnswer, submitForm, validate, setIsSubmitted]);

    const updateFAQ = useCallback(async (index: number, faqData: FAQ, existingFAQs: FAQ[], existingPlans: any[] = []) => {
        if (!offer) return false;

        const faqId = existingFAQs[index].id;
        if (!faqId) return false;

        try {
            // Set form data
            setQuestion(faqData.question);
            setAnswer(faqData.answer);

            // Validate form
            const isValid = validate();
            if (!isValid) {
                setIsSubmitted(true);
                return false;
            }

            // Submit the form with faqId for update operation
            const result = await submitForm(Number(faqId));
            return result.ok;
        } catch (error) {
            console.error('Error updating FAQ:', error);
            return false;
        }
    }, [offer, setQuestion, setAnswer, submitForm, validate, setIsSubmitted]);

    const deleteFAQ = useCallback(async (index: number, existingFAQs: FAQ[], existingPlans: any[] = []) => {
        if (!offer) return false;

        try {
            const faqId = existingFAQs[index].id;
            if (!faqId) return false;

            const result = await faqApi.deleteFaq(Number(faqId), {
                showMessage: true,
                onSuccess: () => {
                    onSuccess?.();
                    triggerFaqRefetch();
                },
            });

            return !!result;
        } catch (error) {
            console.error('Error deleting FAQ:', error);
            return false;
        }
    }, [offer, faqApi, onSuccess]);

    return {
        addFAQ,
        updateFAQ,
        deleteFAQ,
        formData,
        errors,
        isSubmitted,
        loading,
        isValid,
        setIsSubmitted,
        handleChange,
        validate,
        resetForm,
        submitForm,
        setQuestion,
        setAnswer,
    };
};
