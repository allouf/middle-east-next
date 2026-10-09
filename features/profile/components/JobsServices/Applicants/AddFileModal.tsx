"use client";

import React, { useState, useRef } from 'react';
import { Modal } from 'antd';
import { X } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Applicant } from './applicantsTypes';

interface AddFileModalProps {
    isOpen: boolean;
    onClose: () => void;
    applicant: Applicant | null;
    onSubmit?: (applicantId: string | number, files: File[]) => Promise<void> | void;
}

const AddFileModal: React.FC<AddFileModalProps> = ({ isOpen, onClose, applicant, onSubmit }) => {
    const { t } = useTranslation();
    const [files, setFiles] = useState<File[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Reset form when modal opens/closes
    React.useEffect(() => {
        if (isOpen) {
            setFiles([]);
            setIsDragOver(false);
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        if (applicant && onSubmit && files.length > 0) {
            setIsLoading(true);
            try {
                await onSubmit(applicant.id, files);
                onClose();
            } catch (error) {
                console.error("Failed to upload files", error);
            } finally {
                setIsLoading(false);
            }
        } else {
            onClose();
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files) {
            setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    if (!applicant) return null;

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={500}
            closeIcon={<X className="w-5 h-5 text-gray-500" />}
            className="add-file-modal [&_.ant-modal-content]:!p-0 [&_.ant-modal-content]:!rounded-2xl overflow-hidden"
            centered
        >
            <div className="p-8 flex flex-col items-center">
                {/* Profile Avatars */}
                <div className="flex items-center justify-center mb-4">
                    <img src="/profileGroup.png" alt="Profile group" className="h-16 w-auto object-contain" />
                </div>

                {/* Title */}
                <h2 className="text-lg font-semibold text-[#00664F] mb-1">
                    {t('applicants.addFile.title', { defaultValue: 'Add Attachments !' })}
                </h2>
                <p className="text-xs text-gray-400 mb-6">
                    {t('applicants.addFile.subtitle', { defaultValue: 'Upload files for this applicant' })}
                </p>

                {/* File Upload Area */}
                <div
                    className={`w-full border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center mb-4 transition-colors cursor-pointer ${isDragOver ? 'border-[#00664F] bg-[#00664F]/5' : 'border-gray-200 bg-white'
                        }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileSelect}
                    />

                    {files.length > 0 ? (
                        <div className="text-sm text-gray-600">
                            {files.length} file{files.length > 1 ? 's' : ''} selected
                        </div>
                    ) : (
                        <>
                            <button className="border border-gray-200 rounded-md px-4 py-1.5 text-xs text-gray-500 hover:bg-gray-50 transition-colors mb-2">
                                {t('common.addFile', { defaultValue: 'Add File' })}
                            </button>
                            <p className="text-xs text-gray-300">
                                {t('common.dragDrop', { defaultValue: 'Or drag and drop images' })}
                            </p>
                        </>
                    )}
                </div>

                {/* Selected Files List */}
                {files.length > 0 && (
                    <div className="w-full mb-4 space-y-2">
                        {files.map((file, i) => (
                            <div key={i} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg text-sm">
                                <span className="text-gray-700 truncate mr-2">{file.name}</span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                                    className="text-red-400 hover:text-red-600 text-xs shrink-0"
                                >
                                    {t('common.remove', { defaultValue: 'Remove' })}
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Buttons */}
                <div className="flex items-center gap-4 w-full">
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || files.length === 0}
                        className="bg-[#00664F] hover:bg-[#005542] text-white px-8 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                        {isLoading ? t('common.uploading', { defaultValue: 'Uploading...' }) : t('applicants.addFile.submit', { defaultValue: 'Upload' })}
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

export default AddFileModal;
