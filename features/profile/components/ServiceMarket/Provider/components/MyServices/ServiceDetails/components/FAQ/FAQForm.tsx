"use client";

import React from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import FAQEditForm from './FAQEditForm';

interface FAQData {
    question: string;
    answer: string;
}

interface FAQFormProps {
    faqData: FAQData;
    editingIndex: number | null;
    title: string;
    isSubmitted:boolean;
    loading?: boolean;
    onFAQChange: (faq: FAQData) => void;
    onSave: () => void;
    onCancel: () => void;
    onUpdate?: () => void;
}

const FAQForm: React.FC<FAQFormProps> = ({
    faqData,
    editingIndex,
    title,
    isSubmitted,
    loading = false,
    onFAQChange,
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
            <FAQEditForm
                faqData={faqData}
                editingIndex={editingIndex}
                onFAQChange={onFAQChange}
                onAdd={editingIndex === null ? onSave : undefined}
                onUpdate={editingIndex !== null ? onUpdate : undefined}
                onCancel={onCancel}
                isSubmitted={isSubmitted}
                loading={loading}
            />
        </div>
    );
};

export default FAQForm;
