"use client";

import React, { useState } from 'react';
import { Modal } from 'antd';
import { X, Star } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Applicant } from './applicantsTypes';

interface AddRatingModalProps {
    isOpen: boolean;
    onClose: () => void;
    applicant: Applicant | null;
    onSubmit?: (applicantId: string | number, rating: number, review: string) => Promise<void> | void;
}

const AddRatingModal: React.FC<AddRatingModalProps> = ({ isOpen, onClose, applicant, onSubmit }) => {
    const { t } = useTranslation();
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [review, setReview] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Reset form when modal opens/closes
    React.useEffect(() => {
        if (isOpen) {
            setRating(0);
            setHovered(0);
            setReview('');
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        if (applicant && onSubmit) {
            setIsLoading(true);
            try {
                await onSubmit(applicant.id, rating, review);
                onClose();
            } catch (error) {
                console.error("Failed to submit rating", error);
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
            className="add-rating-modal [&_.ant-modal-content]:!p-0 [&_.ant-modal-content]:!rounded-2xl overflow-hidden"
            centered
        >
            <div className="p-8 flex flex-col items-center">
                {/* Profile Avatars */}
                <div className="flex items-center justify-center mb-4">
                    <img src="/profileGroup.png" alt="Profile group" className="h-16 w-auto object-contain" />
                </div>

                {/* Title */}
                <h2 className="text-lg font-semibold text-[#00664F] mb-1">
                    {t('applicants.addRating.title', { defaultValue: 'Add Your Rating !' })}
                </h2>
                <p className="text-xs text-gray-400 mb-6">
                    {t('applicants.addRating.subtitle', { defaultValue: 'You Can Add Attachments !' })}
                </p>

                {/* Stars */}
                <div className="flex gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onMouseEnter={() => setHovered(star)}
                            onMouseLeave={() => setHovered(0)}
                            onClick={() => setRating(star)}
                            className="transition-transform hover:scale-110"
                        >
                            <Star
                                className={`w-8 h-8 transition-colors ${star <= (hovered || rating)
                                    ? 'text-[#E8B84B] fill-[#E8B84B]'
                                    : 'text-gray-300'
                                    }`}
                            />
                        </button>
                    ))}
                </div>

                {/* Review Input */}
                <div className="w-full mb-6">
                    <label className="text-sm font-semibold text-[#00664F] mb-2 block">
                        {t('applicants.addRating.addReview', { defaultValue: 'Add A Review' })}
                    </label>
                    <input
                        type="text"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder={t('applicants.addRating.placeholder', { defaultValue: 'Add a description of the employee.' })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-600 placeholder:text-gray-300 focus:outline-none focus:border-[#00664F] transition-colors"
                    />
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-4 w-full">
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-[#00664F] hover:bg-[#005542] text-white px-8 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                        {isLoading ? t('common.saving', { defaultValue: 'Saving...' }) : t('applicants.addRating.submit', { defaultValue: 'Add Review' })}
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

export default AddRatingModal;
