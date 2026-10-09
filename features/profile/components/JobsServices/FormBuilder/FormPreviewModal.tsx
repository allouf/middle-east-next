"use client";

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { FormElement } from './formBuilderTypes';
import FormElementRenderer from './FormElementRenderer';
import { motion, AnimatePresence } from 'framer-motion';
import { AiOutlineClose } from 'react-icons/ai';

interface FormPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    elements: FormElement[];
    templateName: string;
}

const FormPreviewModal: React.FC<FormPreviewModalProps> = ({
    isOpen,
    onClose,
    elements,
    templateName,
}) => {
    const { t } = useTranslation();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !isOpen) return null;

    const content = (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={onClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="relative bg-white rounded-[24px] shadow-2xl max-w-2xl max-h-[90vh] w-full overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.25, ease: 'easeInOut' } }}
                    >
                        {/* Close Button */}
                        <motion.button
                            type="button"
                            onClick={onClose}
                            className="absolute top-4 right-4 z-30 bg-white/90 backdrop-blur-md border border-transparent rounded-full p-2 text-blueBtn transition-all duration-300"
                            aria-label="Close modal"
                            whileHover={{ scale: 1.2, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <AiOutlineClose size={18} />
                        </motion.button>

                        <div className="p-8 max-h-[85vh] overflow-y-auto">
                            {/* Go Back */}
                            <button
                                onClick={onClose}
                                className="flex items-center gap-2 text-[#00664F] font-medium text-sm mb-4 hover:underline"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                {t('buttons.goBack', 'GO BACK')}
                            </button>

                            {/* Template Name */}
                            <h2 className="text-xl font-bold text-[#00664F] mb-6">{templateName}</h2>

                            {/* Form elements preview */}
                            <div className="flex flex-col gap-5">
                                {elements.map(element => (
                                    <div key={element.id}>
                                        <FormElementRenderer
                                            element={element}
                                            isPreview={true}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Submit button */}
                            {/* {elements.length > 0 && (
                                <div className="mt-8">
                                    <button className="flex items-center gap-2 bg-[#00664F] text-white px-8 py-2.5 rounded-lg text-sm font-medium hover:bg-[#005542] transition-colors">
                                        <Send className="w-4 h-4" />
                                        {t('formBuilder.submit', 'Submit')}
                                    </button>
                                </div>
                            )} */}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return createPortal(content, document.body);
};

export default FormPreviewModal;
