"use client";

import React from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Image from 'next/image';

interface FormBuilderSaveModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'success' | 'error';
}

const FormBuilderSaveModal: React.FC<FormBuilderSaveModalProps> = ({ isOpen, onClose, type }) => {
    const { t } = useTranslation();

    const isSuccess = type === 'success';

    return (
        <Modal isOpen={isOpen} onClose={onClose} showLine={true}>
            <div className="flex flex-col items-center text-center px-4 py-6">
                {/* Illustration */}
                <div className="relative w-[200px] h-[200px] mb-6">
                    <Image
                        src="/exceeded.png"
                        alt={isSuccess ? 'Success' : 'Error'}
                        fill
                        className="object-contain"
                    />
                </div>

                {/* Title */}
                <h2 className={`text-xl font-bold mb-3 ${isSuccess ? 'text-[#00664F]' : 'text-[#BF2033]'}`}>
                    {isSuccess
                        ? t('formBuilder.save.success.title', 'Successfully published')
                        : t('formBuilder.save.error.title', 'Publishing failed')}
                </h2>

                {/* Description */}
                <p className="text-gray-500 text-sm mb-8 max-w-xs leading-relaxed">
                    {isSuccess
                        ? t('formBuilder.save.success.description', 'it to make a type specimen book. It has survived not only five centuries, but also ially unchanged')
                        : t('formBuilder.save.error.description', 'it to make a type specimen book. It has survived not only five centuries, but also ially unchanged')}
                </p>

                {/* Action Button */}
                <Button
                    onClick={onClose}
                    className="bg-[#00664F] hover:bg-[#005542] text-white px-10 py-3 rounded-lg font-medium transition-colors w-full max-w-xs flex justify-center items-center h-12"
                >
                    {isSuccess
                        ? t('formBuilder.save.goToForm', 'Go to form')
                        : t('formBuilder.save.goToForm', 'Go to form')}
                </Button>
            </div>
        </Modal>
    );
};

export default FormBuilderSaveModal;
