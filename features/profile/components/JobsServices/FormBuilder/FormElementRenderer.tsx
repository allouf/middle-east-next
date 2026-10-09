"use client";

import React, { useState } from 'react';
import { FormElement } from './formBuilderTypes';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { X, ChevronUp, ChevronDown, Pencil } from 'lucide-react';
import { Input, Select, Switch, Radio, Checkbox, TimePicker, Button, Upload, ConfigProvider, DatePicker } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;

interface FormElementRendererProps {
    element: FormElement;
    isPreview?: boolean;
    onUpdateElement?: (updated: FormElement) => void;
}

const FormElementRenderer: React.FC<FormElementRendererProps> = ({
    element,
    isPreview = false,
    onUpdateElement,
}) => {
    const { t } = useTranslation();

    const updateOption = (index: number, value: string) => {
        if (!onUpdateElement || !element.options) return;
        const newOptions = [...element.options];
        newOptions[index] = value;
        onUpdateElement({ ...element, options: newOptions });
    };

    const addOption = () => {
        if (!onUpdateElement) return;
        const newOptions = [...(element.options || []), `Option ${(element.options?.length || 0) + 1}`];
        onUpdateElement({ ...element, options: newOptions });
    };

    const addOtherOption = () => {
        if (!onUpdateElement) return;
        const newOptions = [...(element.options || []), 'Other'];
        onUpdateElement({ ...element, options: newOptions });
    };

    const removeOption = (index: number) => {
        if (!onUpdateElement || !element.options) return;
        const newOptions = element.options.filter((_, i) => i !== index);
        onUpdateElement({ ...element, options: newOptions });
    };

    const moveOption = (index: number, direction: 'up' | 'down') => {
        if (!onUpdateElement || !element.options) return;
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= element.options.length) return;
        const newOptions = [...element.options];
        [newOptions[index], newOptions[newIndex]] = [newOptions[newIndex], newOptions[index]];
        onUpdateElement({ ...element, options: newOptions });
    };

    const [editingOptionIndex, setEditingOptionIndex] = useState<number | null>(null);

    const renderLabel = () => (
        <label className="block text-xs sm:text-sm font-semibold text-[#00664F] mb-2 sm:mb-2 leading-tight">
            {element.label}
            {element.required && isPreview && <span className="text-red-500 ml-1">*</span>}
        </label>
    );

    switch (element.type) {
        case 'short_text':
            return (
                <div className="space-y-2">
                    {renderLabel()}
                    <Input
                        placeholder={element.placeholder}
                        size="large"
                        style={{ borderRadius: 8 }}
                        className="text-sm sm:text-base h-10 sm:h-12"
                        disabled={isPreview}
                    />
                </div>
            );

        case 'long_text':
            return (
                <div className="space-y-2">
                    {renderLabel()}
                    <TextArea
                        placeholder={element.placeholder}
                        rows={3}
                        style={{ borderRadius: 8, resize: 'none' }}
                        className="text-sm sm:text-base"
                        disabled={isPreview}
                    />
                </div>
            );

        case 'yes_no':
            return (
                <div className="space-y-2">
                    {renderLabel()}
                    <Radio.Group className="flex flex-col sm:flex-row gap-3 sm:gap-4" disabled={isPreview}>
                        <Radio value="yes" className="text-sm sm:text-base py-1">
                            {t('formBuilder.yes', 'Yes')}
                        </Radio>
                        <Radio value="no" className="text-sm sm:text-base py-1">
                            {t('formBuilder.no', 'No')}
                        </Radio>
                    </Radio.Group>
                </div>
            );

        case 'single_choice':
            return (
                <div className="space-y-2">
                    {renderLabel()}
                    <ConfigProvider theme={{ token: { colorPrimary: '#00664F' } }}>
                        <Radio.Group disabled={isPreview} className="flex flex-col gap-3 sm:gap-3 w-full">
                            {element.options?.map((option, index) => (
                                <div key={index} className="flex items-start gap-3 sm:gap-3 group/option py-1">
                                    <Radio value={option} className="flex-shrink-0 mt-0.5">
                                        {editingOptionIndex === index && !isPreview ? (
                                            <Input
                                                variant="borderless"
                                                value={option}
                                                onChange={(e) => updateOption(index, e.target.value)}
                                                onBlur={() => setEditingOptionIndex(null)}
                                                onPressEnter={() => setEditingOptionIndex(null)}
                                                autoFocus
                                                className="!p-0 text-xs sm:text-sm text-gray-600 rounded-none"
                                                style={{ boxShadow: 'none' }}
                                            />
                                        ) : (
                                            <span className="text-xs sm:text-sm text-gray-600">{option}</span>
                                        )}
                                    </Radio>
                                    {!isPreview && (
                                        <div className="flex items-center gap-1 sm:gap-2 opacity-0 group-hover/option:opacity-100 transition-opacity ml-auto mt-1">
                                            <button
                                                onClick={() => setEditingOptionIndex(index)}
                                                className="p-1 sm:p-1 text-gray-400 hover:text-[#00664F]"
                                                title="Edit"
                                            >
                                                <Pencil className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => moveOption(index, 'up')}
                                                className="p-1 sm:p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                                disabled={index === 0}
                                            >
                                                <ChevronUp className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => moveOption(index, 'down')}
                                                className="p-1 sm:p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                                disabled={index === (element.options?.length ?? 0) - 1}
                                            >
                                                <ChevronDown className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => removeOption(index)}
                                                className="p-1 sm:p-1 text-red-500 hover:text-red-600"
                                            >
                                                <X className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </Radio.Group>
                    </ConfigProvider>
                    {!isPreview && (
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4">
                            <Button type="link" icon={<PlusOutlined />} onClick={addOption} className="!text-[#00664F] !p-0 !text-xs sm:!text-sm">
                                {t('formBuilder.addOption', 'Add Option')}
                            </Button>
                            <Button type="link" onClick={addOtherOption} className="!text-[#00664F] !p-0 !text-xs sm:!text-sm">
                                {t('formBuilder.addOtherOption', 'Add "Other" Option')}
                            </Button>
                        </div>
                    )}
                </div>
            );

        case 'multiple_choice':
            return (
                <div className="space-y-2">
                    {renderLabel()}
                    <ConfigProvider theme={{ token: { colorPrimary: '#00664F' } }}>
                        <Checkbox.Group disabled={isPreview} className="flex flex-col gap-3 sm:gap-3 w-full">
                            {element.options?.map((option, index) => (
                                <div key={index} className="flex items-start gap-3 sm:gap-3 group/option py-1">
                                    <Checkbox value={option} className="flex-shrink-0 mt-0.5">
                                        {editingOptionIndex === index && !isPreview ? (
                                            <Input
                                                variant="borderless"
                                                value={option}
                                                onChange={(e) => updateOption(index, e.target.value)}
                                                onBlur={() => setEditingOptionIndex(null)}
                                                onPressEnter={() => setEditingOptionIndex(null)}
                                                autoFocus
                                                className="!p-0 text-xs sm:text-sm text-gray-600 rounded-none"
                                                style={{ boxShadow: 'none' }}
                                            />
                                        ) : (
                                            <span className="text-xs sm:text-sm text-gray-600">{option}</span>
                                        )}
                                    </Checkbox>
                                    {!isPreview && (
                                        <div className="flex items-center gap-1 sm:gap-2 opacity-0 group-hover/option:opacity-100 transition-opacity ml-auto mt-1">
                                            <button
                                                onClick={() => setEditingOptionIndex(index)}
                                                className="p-1 sm:p-1 text-gray-400 hover:text-[#00664F]"
                                                title="Edit"
                                            >
                                                <Pencil className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => moveOption(index, 'up')}
                                                className="p-1 sm:p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                                disabled={index === 0}
                                            >
                                                <ChevronUp className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => moveOption(index, 'down')}
                                                className="p-1 sm:p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                                disabled={index === (element.options?.length ?? 0) - 1}
                                            >
                                                <ChevronDown className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => removeOption(index)}
                                                className="p-1 sm:p-1 text-red-500 hover:text-red-600"
                                            >
                                                <X className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </Checkbox.Group>
                    </ConfigProvider>
                    {!isPreview && (
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4">
                            <Button type="link" icon={<PlusOutlined />} onClick={addOption} className="!text-[#00664F] !p-0 !text-xs sm:!text-sm">
                                {t('formBuilder.addOption', 'Add Option')}
                            </Button>
                            <Button type="link" onClick={addOtherOption} className="!text-[#00664F] !p-0 !text-xs sm:!text-sm">
                                {t('formBuilder.addOtherOption', 'Add "Other" Option')}
                            </Button>
                        </div>
                    )}
                </div>
            );

        case 'cv_upload':
            return (
                <div className="space-y-2">
                    {renderLabel()}
                    <Upload.Dragger
                        disabled={isPreview}
                        beforeUpload={() => false}
                        showUploadList={false}
                        style={{ borderRadius: 8, padding: '16px 0 sm:20px 0' }}
                    >
                        <p className="flex flex-col items-center gap-2 sm:gap-2 px-4">
                            <UploadOutlined style={{ fontSize: 20, color: '#999' }} className="sm:!text-xl" />
                            <span className="text-xs sm:text-sm text-gray-500 text-center">
                                {t('formBuilder.addFile', 'Add File')}
                            </span>
                            <span className="text-xs text-gray-400 text-center">
                                {t('formBuilder.dragDropImages', 'Or drag and drop Images ( Upload at least one image )')}
                            </span>
                        </p>
                    </Upload.Dragger>
                </div>
            );

        case 'portfolio_links':
            return (
                <div className="space-y-2">
                    {renderLabel()}
                    <Input
                        placeholder={element.placeholder || 'https://portfolio-link.com'}
                        size="large"
                        type="url"
                        style={{ borderRadius: 8 }}
                        className="text-sm sm:text-base h-10 sm:h-12"
                        disabled={isPreview}
                    />
                </div>
            );

        case 'expected_salary':
            return (
                <div className="space-y-2">
                    {renderLabel()}
                    <Input
                        placeholder={element.placeholder || 'ex.3500$'}
                        size="large"
                        style={{ borderRadius: 8 }}
                        className="text-sm sm:text-base h-10 sm:h-12"
                        disabled={isPreview}
                    />
                </div>
            );

        case 'number':
            return (
                <div className="space-y-2">
                    {renderLabel()}
                    <Input
                        placeholder={element.placeholder || 'ex.25326.434'}
                        size="large"
                        style={{ borderRadius: 8 }}
                        className="text-sm sm:text-base h-10 sm:h-12"
                        disabled={isPreview}
                    />
                </div>
            );

        case 'dropdown':
            return (
                <div className="space-y-2">
                    {renderLabel()}
                    <Select
                        placeholder={element.placeholder || 'Please Select....'}
                        size="large"
                        className="w-full text-sm sm:text-base h-10 sm:h-12"
                        style={{ borderRadius: 8 }}
                        dropdownStyle={{ zIndex: 1200 }}
                        options={element.options?.map(opt => ({ label: opt, value: opt })) || []}
                        disabled={isPreview}
                    />
                    {!isPreview && (
                        <div className="flex flex-col gap-2 mt-3">
                            {/* Inline option editor */}
                            {element.options?.map((option, index) => (
                                <div key={index} className="flex items-center gap-2 group/option">
                                    <span className="text-xs text-gray-400 w-4 flex-shrink-0">{index + 1}.</span>
                                    <Input
                                        value={option}
                                        onChange={(e) => updateOption(index, e.target.value)}
                                        size="small"
                                        className="flex-1 text-xs sm:text-sm"
                                        style={{ borderRadius: 6 }}
                                    />
                                    <button
                                        onClick={() => removeOption(index)}
                                        className="text-red-500 opacity-0 group-hover/option:opacity-100 transition-opacity flex-shrink-0 p-1"
                                    >
                                        <X className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5" />
                                    </button>
                                </div>
                            ))}
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <Button type="link" icon={<PlusOutlined />} onClick={addOption} className="!text-[#00664F] !p-0 !text-xs sm:!text-sm">
                                    {t('formBuilder.addOption', 'Add Option')}
                                </Button>
                                <Button type="link" onClick={addOtherOption} className="!text-[#00664F] !p-0 !text-xs sm:!text-sm">
                                    {t('formBuilder.addOtherOption', 'Add "Other" Option')}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            );

        case 'time':
            return (
                <div className="space-y-2">
                    {renderLabel()}
                    <TimePicker
                        use12Hours
                        format="hh:mm A"
                        size="large"
                        placeholder="HH : MM"
                        style={{ borderRadius: 8, width: '100%', maxWidth: 200 }}
                        popupStyle={{ zIndex: 1200 }}
                        className="text-sm sm:text-base h-10 sm:h-12"
                        disabled={isPreview}
                    />
                </div>
            );
        
        case 'date':
            return (
                <div className="space-y-2">
                    {renderLabel()}
                    <DatePicker
                        size="large"
                        placeholder={element.placeholder || 'Select Date'}
                        style={{ borderRadius: 8, width: '100%' }}
                        popupStyle={{ zIndex: 1200 }}
                        className="text-sm sm:text-base h-10 sm:h-12"
                        disabled={isPreview}
                    />
                </div>
            );

        default:
            return <div className="text-gray-400 text-sm">Unknown element type</div>;
    }
};

export default FormElementRenderer;
