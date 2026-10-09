import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input, Select, Checkbox, Spin } from 'antd';
import { ArrowLeft, ArrowRight, Search, FileText, PenLine, Trash2 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import FormBuilderModal from './FormBuilder/FormBuilderModal';
import FormPreviewModal from './FormBuilder/FormPreviewModal';
import { apiFieldsToElements } from './FormBuilder/formBuilderTypes';
import useJobsApi from './useJobsApi';
import { JobTemplate } from './types';
import CustomConfirmModal from '@/components/shered/CustomConfirmModal';
import { Eye } from 'lucide-react';

interface TemplateJobPageProps {
    onBack: () => void;
}

const TemplateJobPage: React.FC<TemplateJobPageProps> = ({ onBack }) => {
    const { t, locale } = useTranslation();
    const isRTL = locale === 'ar';
    const { getMyTemplates, deleteTemplate, loading } = useJobsApi();

    const [templates, setTemplates] = useState<JobTemplate[]>([]);
    const [searchText, setSearchText] = useState('');
    const [selectedTemplates, setSelectedTemplates] = useState<(string | number)[]>([]);
    const [isFormBuilderOpen, setIsFormBuilderOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<JobTemplate | null>(null);
    const [fetching, setFetching] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [templateToDelete, setTemplateToDelete] = useState<number | string | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [previewTemplate, setPreviewTemplate] = useState<JobTemplate | null>(null);

    // ─── Fetch templates from API ─────────────────────────────
    const fetchTemplates = useCallback(async () => {
        setFetching(true);
        try {
            const response = await getMyTemplates();
            let raw: any[] = [];
            if (response && response.data && Array.isArray((response.data as any).templates)) {
                raw = (response.data as any).templates;
            } else if (response && response.data && Array.isArray(response.data)) {
                raw = response.data;
            } else if (Array.isArray(response)) {
                raw = response as any[];
            }
            setTemplates(raw);
        } catch (err) {
            console.error('Failed to fetch templates', err);
            setTemplates([]);
        } finally {
            setFetching(false);
        }
    }, [getMyTemplates]);

    useEffect(() => {
        fetchTemplates();
    }, []);

    // ─── Handlers ─────────────────────────────────────────────
    const toggleTemplate = (id: string | number) => {
        setSelectedTemplates(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
    };

    const handleDelete = (id: number | string) => {
        setTemplateToDelete(id);
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (templateToDelete === null) return;
        
        try {
            await deleteTemplate(templateToDelete);
            setTemplates(prev => prev.filter(t => t.id !== templateToDelete));
            setSelectedTemplates(prev => prev.filter(t => t !== templateToDelete));
        } catch (err) {
            console.error('Failed to delete template', err);
        } finally {
            setDeleteConfirmOpen(false);
            setTemplateToDelete(null);
        }
    };

    const cancelDelete = () => {
        setDeleteConfirmOpen(false);
        setTemplateToDelete(null);
    };

    const handleEdit = (template: JobTemplate) => {
        setEditingTemplate(template);
        setIsFormBuilderOpen(true);
    };

    const handleCreate = () => {
        setEditingTemplate(null);
        setIsFormBuilderOpen(true);
    };

    const handleFormBuilderClose = () => {
        setIsFormBuilderOpen(false);
        setEditingTemplate(null);
    };

    const handlePreview = (template: JobTemplate) => {
        setPreviewTemplate(template);
        setIsPreviewOpen(true);
    };

    const handlePreviewClose = () => {
        setIsPreviewOpen(false);
        setPreviewTemplate(null);
    };

    const handleSaved = () => {
        fetchTemplates();
    };

    // ─── Filtering ────────────────────────────────────────────
    const filteredTemplates = templates.filter(template =>
        template.title?.toLowerCase().includes(searchText.toLowerCase())
    );

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        const prefix = t('jobs.template.lastEditedOn', { defaultValue: 'Last Edited On' });
        return `${prefix} ${d.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })}`;
    };

    return (
        <div className="p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <Button
                    type="text"
                    icon={isRTL ? <ArrowRight className="w-4 h-4 text-[#00664F]" /> : <ArrowLeft className="w-4 h-4 text-[#00664F]" />}
                    onClick={onBack}
                    className="flex items-center gap-2 hover:bg-transparent px-0 text-[#00664F] font-medium"
                >
                    <span className="text-sm sm:text-base">{t('buttons.goBack').toUpperCase()}</span>
                </Button>
            </div>
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6'>
                <h1 className="text-lg sm:text-xl text-[#373737] font-medium">{t('jobs.title')} :</h1>
                <Button
                    className="bg-[#00664F] hover:bg-[#005542] text-white px-4 sm:px-6 h-9 sm:h-10 rounded-lg font-medium transition-colors flex items-center gap-2 border-none w-full sm:w-auto justify-center"
                    onClick={handleCreate}
                >
                    <img src={"/addTemplate.svg"} className="w-4 h-4 text-white" />
                    <span className="text-sm sm:text-base">{t('jobs.template.create')}</span>
                </Button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                <Input
                    size='large'
                    className="rounded-full w-full lg:max-w-[300px] px-4 sm:px-6 py-2 text-sm border-[0.5px] border-[#00664F] placeholder:!text-[#00664F] placeholder:font-medium !shadow-none text-blueSite font-medium"
                    placeholder={t('jobs.searchPlaceholder')}
                    prefix={<Search className="w-4 h-4 text-gray-400" />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />

                {/* <div className="flex items-center gap-2 w-full lg:w-auto">
                    <span className="text-[#303333] text-xs sm:text-sm whitespace-nowrap">{t('jobs.sortBy')} :</span>
                    <Select
                        rootClassName='rounded-sm border-[#D4D5D5]'
                        defaultValue="newest"
                        className="w-full lg:w-[180px] flex-1 lg:flex-none"
                        options={[
                            { value: 'newest', label: t('jobs.sort.newest') },
                            { value: 'oldest', label: t('jobs.sort.oldest') },
                        ]}
                    />

                </div> */}
            </div>

            {/* Template List */}
            {fetching ? (
                <div className="flex justify-center items-center py-20">
                    <Spin size="large" />
                </div>
            ) : filteredTemplates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <FileText className="w-10 h-10 sm:w-12 sm:h-12 mb-3" />
                    <p className="text-xs sm:text-sm text-center px-4">{t('jobs.template.noTemplates', 'No templates found')}</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {filteredTemplates.map((template) => {
                        const isSelected = selectedTemplates.includes(template.id);
                        return (
                            <div
                                key={template.id}
                                className={`transition-colors rounded-lg p-3 flex flex-row sm:items-center justify-between gap-3 sm:gap-0 group ${isSelected ? 'bg-[#E6F0EE]' : 'hover:bg-[#E6F0EE] bg-transparent'}`}
                            >
                                <div className="flex items-center gap-3 sm:gap-4">
                                    {/* <Checkbox
                                        checked={isSelected}
                                        onChange={() => toggleTemplate(template.id)}
                                        className="mr-2 [&_.ant-checkbox-inner]:border-[#00664F] [&_.ant-checkbox-checked_.ant-checkbox-inner]:bg-[#00664F] [&_.ant-checkbox-inner]:rounded-[2px]"
                                    /> */}

                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#BFDFD8] flex items-center justify-center text-[#00664F] flex-shrink-0">
                                        <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>

                                    <div className="flex flex-col min-w-0 flex-1">
                                        <h3 className="text-gray-800 font-medium text-sm sm:text-base truncate">{template.title}</h3>
                                        <p className="text-gray-500 text-xs sm:text-xs">{formatDate(template.updated_at || template.created_at)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 sm:gap-3 justify-end">
                                    <Button
                                        type="text"
                                        className="text-[#00664F] hover:text-[#005542] hover:bg-transparent p-2 sm:p-auto"
                                        icon={<Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                                        onClick={() => handlePreview(template)}
                                    />
                                    <Button
                                        type="text"
                                        className="text-[#00664F] hover:text-[#005542] hover:bg-transparent p-2 sm:p-auto"
                                        icon={<PenLine className="w-4 h-4 sm:w-5 sm:h-5" />}
                                        onClick={() => handleEdit(template)}
                                    />
                                    <Button
                                        type="text"
                                        className="text-red-500 hover:text-red-600 hover:bg-transparent p-2 sm:p-auto"
                                        icon={<Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />}
                                        onClick={() => handleDelete(template.id)}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Form Builder Modal */}
            <FormBuilderModal
                isOpen={isFormBuilderOpen}
                onClose={handleFormBuilderClose}
                editTemplate={editingTemplate}
                onSaved={handleSaved}
            />

            {/* Delete Confirmation Modal */}
            <CustomConfirmModal
                open={deleteConfirmOpen}
                onClose={cancelDelete}
                onConfirm={confirmDelete}
                type="danger"
                title={t('jobs.template.deleteConfirmTitle', 'Delete Template')}
                subtitle={t('jobs.template.deleteConfirmMessage', 'Are you sure you want to delete this template? This action cannot be undone.')}
                confirmText={t('buttons.delete', 'Delete')}
                cancelText={t('buttons.cancel', 'Cancel')}
                loading={loading}
            />

            {/* Preview Modal */}
            {previewTemplate && (
                <FormPreviewModal
                    isOpen={isPreviewOpen}
                    onClose={handlePreviewClose}
                    elements={apiFieldsToElements(previewTemplate.fields || [])}
                    templateName={previewTemplate.title || ''}
                />
            )}
        </div>
    );
};

export default TemplateJobPage;
