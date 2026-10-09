import GlowLight from '@/components/shered/GlowLight'
import InputField from '@/components/ui/InputField'
import MultiInputField from '@/components/ui/MultiInputField'
import useFormData from '@/lib/Hooks/useFormData'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { Trash2, FileText, FileArchive, Image as ImageIcon } from 'lucide-react'
import React from 'react'

export interface OrderAttachmentsProps {
    formData: any;
    handleChange: (field: string) => (input: any) => void;
    errors: any;
    handleAddError: (id: string, value?: string) => void;
    handleArrayChange: (field: string, data: any) => void;
    isSubmited: boolean;
}

const AttachmentIcon = ({ className }: { className?: string }) => (
    <svg 
        width="18" 
        height="16" 
        viewBox="0 0 18 16" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path 
            d="M0 10V8H7V10H0ZM0 6V4H11V6H0ZM0 2V0H11V2H0ZM9 16V12.925L14.525 7.425C14.675 7.275 14.8417 7.16667 15.025 7.1C15.2083 7.03333 15.3917 7 15.575 7C15.775 7 15.9667 7.0375 16.15 7.1125C16.3333 7.1875 16.5 7.3 16.65 7.45L17.575 8.375C17.7083 8.525 17.8125 8.69167 17.8875 8.875C17.9625 9.05833 18 9.24167 18 9.425C18 9.60833 17.9667 9.79583 17.9 9.9875C17.8333 10.1792 17.725 10.35 17.575 10.5L12.075 16H9ZM10.5 14.5H11.45L14.475 11.45L14.025 10.975L13.55 10.525L10.5 13.55V14.5ZM14.025 10.975L13.55 10.525L14.475 11.45L14.025 10.975Z" 
            fill="currentColor"
        />
    </svg>
);

const OrderAttachments = ({
    formData,
    handleChange,
    errors,
    handleAddError,
    handleArrayChange,
    isSubmited
}: OrderAttachmentsProps) => {
    const {t} = useTranslation()

    const FileCard = ({ file, onRemove }: { file: any, onRemove: () => void }) => {
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

  return (
    <div className='relative rounded-[20px] bg-[#FAFAFA] border border-[#E2E8F0] overflow-hidden  shadow-sm mt-6 '>
    <GlowLight
        color="#06B187"
        size="w-[55px]  h-[40px]"
        opacity="opacity-80"
        blur="blur-[35px] sm:blur-[35px]"
        position="top-0 right-0"
    />
    <GlowLight
        color="#06B187"
        size="w-[50px]  h-[40px]"
        opacity="opacity-80"
        blur="blur-[35px] sm:blur-[35px]"
        position="bottom-0 left-0"
    />
    <div className='p-6'>
        <div className='flex flex-row gap-4 pb-6'>
            <div className="flex items-center justify-center p-2 rounded-lg bg-[#15803D1A] border border-green-100">
                 <AttachmentIcon className="w-5 h-5 text-blueSite" />
            </div>
            <div>
                <h3 className="text-[18px] font-bold text-subTitleColor">
                    {t('orderDetails.attachments', { defaultValue: 'Attachments & Deliverables' })}
                </h3>  
             </div>
            </div>
        <div className='flex flex-col gap-4'>
         <InputField
            id="note"
            label={t('orders.labels.note', { defaultValue: 'Add Your Note' })}
            type="textarea"
            placeholder={t('orders.notePlaceHolder', {
                defaultValue: 'Write a description of your lorem ipsum dollor ....',
            })}
            value={formData.note}
            onChange={handleChange('note')}
            unstyled
            withFieldset
            required
            validate
            formErrors={errors}
            handleAddError={handleAddError}
            isSubmited={isSubmited}
            onSubmit={true}
        /> 
        <MultiInputField
            id="files"
            label={t('orders.labels.attached', { defaultValue: 'Attached Files' })}
            type="file"
      
            values={formData.files}
            onChange={(val)=>handleArrayChange("files",val)}
            unstyled
            withFieldset
            required
            validate
            formErrors={errors}
            handleAddError={handleAddError}
            isSubmited={isSubmited}
            onSubmit={true}
            showList={false}
        />
        {formData.files && formData.files.length > 0 && (
            <div className="flex flex-wrap items-center gap-4 mt-2">
                {formData.files.map((file: any, index: number) => (
                    <FileCard 
                        key={index} 
                        file={file} 
                        onRemove={() => {
                            const nextFiles = formData.files.filter((_: any, i: number) => i !== index);
                            handleArrayChange("files", nextFiles);
                        }} 
                    />
                ))}
            </div>
        )}
        </div>

    </div>
        
    </div>
  )
}

export default OrderAttachments