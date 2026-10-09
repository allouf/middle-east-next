"use client";

import React, { useState } from 'react';
import { useTranslation } from "@/lib/i18n/useTranslation";
import GlowLight from '@/components/shered/GlowLight';
import InputField from '@/components/ui/InputField';
import MultiInputField from '@/components/ui/MultiInputField';
import { Trash2, FileText, FileArchive, Image as ImageIcon } from 'lucide-react';

interface OrderRequirementsCardProps {
  note: string;
  files: File[];
  onNoteChange: (val: string) => void;
  onFilesChange: (val: File[]) => void;
}

export const FileCard = ({ file, onRemove }: { file: any, onRemove: () => void }) => {
    const fileName = file?.name || (typeof file === 'string' ? file.split('/').pop() : 'file');
    const extension = fileName?.split('.').pop()?.toLowerCase();
    const isImage = ['jpg', 'jpeg', 'png', 'svg', 'webp', 'gif'].includes(extension);

    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (isImage) {
            if (typeof file === 'string') {
                setPreviewUrl(file);
            } else if (file instanceof File || file instanceof Blob) {
                const objectUrl = URL.createObjectURL(file);
                setPreviewUrl(objectUrl);
                return () => URL.revokeObjectURL(objectUrl);
            } else if (file?.url) {
                setPreviewUrl(file.url);
            }
        }
    }, [file, isImage]);

    if (isImage) {
        return (
            <div className="flex items-center justify-between p-3 bg-white border border-[#E2E8F0] rounded-xl shadow-sm min-w-[250px] max-w-[300px]">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="flex-shrink-0">
                        <img 
                            src={previewUrl || ''} 
                            alt={fileName} 
                            className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
                        />
                    </div>
                    <span className="text-[14px] font-medium text-[#334155] truncate" title={fileName}>
                        {fileName}
                    </span>
                </div>
                <button 
                    type="button" 
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className="text-[#94A3B8] hover:text-red-500 transition-colors shrink-0 p-1"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        );
    }

    const getIcon = () => {
        if (['pdf'].includes(extension)) return { icon: <FileText size={20} className="text-blue-600" />, bg: 'bg-blue-50' };
        if (['zip', 'rar', '7z'].includes(extension)) return { icon: <FileArchive size={20} className="text-green-600" />, bg: 'bg-green-50' };
        if (['jpg', 'jpeg', 'png', 'svg', 'webp'].includes(extension)) return { icon: <ImageIcon size={20} className="text-purple-600" />, bg: 'bg-purple-50' };
        return { icon: <FileText size={20} className="text-gray-600" />, bg: 'bg-gray-50' };
    };

    const { icon, bg } = getIcon();

    return (
        <div className="flex items-center justify-between p-3 bg-white border border-[#E2E8F0] rounded-xl shadow-sm min-w-[250px] max-w-[300px]">
            <div className="flex items-center gap-3 overflow-hidden">
                <div className={`p-2 rounded-lg flex-shrink-0 ${bg}`}>
                    {icon}
                </div>
                <span className="text-[14px] font-medium text-[#334155] truncate" title={fileName}>
                    {fileName}
                </span>
            </div>
            <button 
                type="button" 
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                }}
                className="text-[#94A3B8] hover:text-red-500 transition-colors shrink-0 p-1"
            >
                <Trash2 size={18} />
            </button>
        </div>
    );
};

const OrderRequirementsCard: React.FC<OrderRequirementsCardProps> = ({
  note,
  files,
  onNoteChange,
  onFilesChange,
}) => {
  const { t } = useTranslation();
  const [errors, setErrors] = useState({});

  const handleAddError = (id: string, value?: string) => {
    setErrors((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="relative rounded-[20px] bg-[#FAFAFA] border border-[#E2E8F0] overflow-hidden shadow-sm mb-6">
      <GlowLight
          color="#06B187"
          size="w-[55px] h-[40px]"
          opacity="opacity-80"
          blur="blur-[35px] sm:blur-[35px]"
          position="top-0 right-0"
      />
      <GlowLight
          color="#06B187"
          size="w-[50px] h-[40px]"
          opacity="opacity-80"
          blur="blur-[35px] sm:blur-[35px]"
          position="bottom-0 left-0"
      />
      
      <div className="p-6 pb-8">
        <div className="flex flex-row gap-4 mb-6">
            <div className="flex items-center justify-center p-2 rounded-lg bg-[#15803D1A] border border-green-100">
                 <FileTextIcon className="w-5 h-5 text-blueSite" />
            </div>
            <div>
                <h3 className="text-[18px] xl:text-[20px] font-bold text-subTitleColor">
                    Order Requirements
                </h3>
                <p className="text-[14px] text-textGrayColor">
                    Please provide the Provider/seller with all the details to begin work.
                </p>
             </div>
        </div>

        <div className="flex flex-col gap-6">
            <InputField
                id="note"
                label="Service Notes"
                type="textarea"
                placeholder="Write a detailed description of what you want from the seller... For example: preferred colors, similar examples, extras..."
                value={note}
                onChange={(e: any) => onNoteChange(e?.target?.value !== undefined ? e.target.value : e)}
                unstyled
                withFieldset
                required
                validate
                formErrors={errors}
                handleAddError={handleAddError}
                isSubmited={false}
                onSubmit={false}
            /> 
            <MultiInputField
                id="files"
                label="Attached Files (Optional)"
                type="file"
                values={files}
                onChange={onFilesChange}
                unstyled
                withFieldset
                formErrors={errors}
                handleAddError={handleAddError}
                isSubmited={false}
                onSubmit={false}
                showList={false}
            />
            {files && files.length > 0 && (
                <div className="flex flex-wrap items-center gap-4 mt-2">
                    {files.map((file: any, index: number) => (
                        <FileCard 
                            key={index} 
                            file={file} 
                            onRemove={() => {
                                const nextFiles = files.filter((_: any, i: number) => i !== index);
                                onFilesChange(nextFiles);
                            }} 
                        />
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

const FileTextIcon = ({ className }: { className?: string }) => (
    <svg 
        width="18" 
        height="22" 
        viewBox="0 0 16 20" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path fillRule="evenodd" clipRule="evenodd" d="M10 0H2C0.9 0 0.01 0.9 0.01 2L0 18C0 19.1 0.89 20 1.99 20H14C15.1 20 16 19.1 16 18V6L10 0ZM2 18V2H9V7H14V18H2ZM4 15H12V16H4V15ZM4 11H12V12.5H4V11ZM4 7H9V8.5H4V7Z" fill="currentColor"/>
    </svg>
);

export default OrderRequirementsCard;
