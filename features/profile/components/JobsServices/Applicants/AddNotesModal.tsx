"use client";

import React, { useState } from 'react';
import { Modal } from 'antd';
import { X, ChevronDown } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Applicant } from './applicantsTypes';

interface AddNotesModalProps {
    isOpen: boolean;
    onClose: () => void;
    applicant: Applicant | null;
    onSubmit?: (applicantId: string | number, note: string) => Promise<void> | void;
}

const AddNotesModal: React.FC<AddNotesModalProps> = ({ isOpen, onClose, applicant, onSubmit }) => {
    const { t } = useTranslation();
    const [note, setNote] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Reset form when modal opens/closes
    React.useEffect(() => {
        if (isOpen) {
            setNote('');
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        if (applicant && onSubmit && note.trim()) {
            setIsLoading(true);
            try {
                await onSubmit(applicant.id, note);
                onClose();
            } catch (error) {
                console.error("Failed to submit note", error);
            } finally {
                setIsLoading(false);
            }
        } else {
            onClose();
        }
    };

    if (!applicant) return null;

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={500}
            closeIcon={<X className="w-5 h-5 text-gray-500" />}
            className="add-notes-modal [&_.ant-modal-content]:!p-0 [&_.ant-modal-content]:!rounded-2xl overflow-hidden"
            centered
        >
            <div className="p-8 flex flex-col items-center">
                {/* Profile Avatars */}
                <div className="flex items-center justify-center mb-4">
                    <img src="/profileGroup.png" alt="Profile group" className="h-16 w-auto object-contain" />
                </div>

                {/* Title */}
                <h2 className="text-lg font-semibold text-[#00664F] mb-1">
                    {t('applicants.addNotes.title', { defaultValue: 'Add Your Notes !' })}
                </h2>
                <p className="text-xs text-gray-400 mb-6">
                    {t('applicants.addNotes.subtitle', { defaultValue: 'Write a note for this applicant' })}
                </p>

                {/* Note Input */}
                <div className="w-full mb-6">
                    <label className="text-sm font-semibold text-gray-800 mb-2 block">
                        {t('applicants.addNotes.label', { defaultValue: 'The Notes' })}
                    </label>
                    <div className="relative">
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder={t('applicants.addNotes.placeholder', { defaultValue: 'Write the note  you want ....' })}
                            rows={4}
                            className="w-full border border-gray-200 rounded-lg px-4 py-3 pr-10 text-sm text-gray-600 placeholder:text-gray-300 focus:outline-none focus:border-[#00664F] transition-colors resize-none"
                        />
                        <ChevronDown className="w-4 h-4 text-gray-300 absolute right-3 top-3.5" />
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-4 w-full">
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || !note.trim()}
                        className="bg-[#00664F] hover:bg-[#005542] text-white px-8 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                        {isLoading ? t('common.saving', { defaultValue: 'Saving...' }) : t('applicants.addNotes.submit', { defaultValue: 'Add note' })}
                    </button>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
                    >
                        {t('common.cancel', { defaultValue: 'Cancel' })}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default AddNotesModal;
