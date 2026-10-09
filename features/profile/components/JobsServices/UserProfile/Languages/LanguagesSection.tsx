import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Languages } from 'lucide-react';
import useJobProfileApi from '../useJobProfileApi';
import LanguagesForm from './LanguagesForm';
import Button from '@/components/ui/Button';
import { Language } from './language';
import LanguageCard from './LanguageCard';
import LanguagesDetailsModal from './LanguagesDetailsModal';
import { Spin } from 'antd';
import DeleteModal from '@/components/shered/DeleteModel';
import { LanguagesIcon } from '../../Icons/LanguagesIcon';
import ErrorReload from '@/components/shared/ErrorReload';
import LanguagesSkeleton from './LanguagesSkeleton';

const LanguagesSection = () => {
    const { t } = useTranslation();
    const { getLanguages, loading, error } = useJobProfileApi();
    const [languages, setLanguages] = useState<Language[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | number | null>(null);
    const [viewingLanguage, setViewingLanguage] = useState<Language | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const fetchLanguages = useCallback(async () => {
        try {
            const response = await getLanguages<Language[]>();
            if (response && response.data) {
                setLanguages(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch languages:', error);
        }
    }, [getLanguages]);

    useEffect(() => {
        fetchLanguages();
    }, [fetchLanguages]);

    const handleAddClick = () => {
        setEditingLanguage(null);
        setShowForm(true);
    };

    const handleEditClick = (language: Language) => {
        setEditingLanguage(language);
        setShowForm(true);
    };

    const handleDeleteClick = (id: string | number) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleFormBack = () => {
        setShowForm(false);
        setEditingLanguage(null);
    };

    const handleFormSuccess = () => {
        fetchLanguages();
        setShowForm(false);
        setEditingLanguage(null);
    };

    const handleViewDetails = (language: Language) => {
        setViewingLanguage(language);
        setIsDetailsModalOpen(true);
    };

    const handleCloseDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setViewingLanguage(null);
    };

    const handleEditFromDetails = (language: Language) => {
        setIsDetailsModalOpen(false);
        setViewingLanguage(null);
        handleEditClick(language);
    };

    if (showForm) {
        return (
            <LanguagesForm
                onBack={handleFormBack}
                onSuccess={handleFormSuccess}
                initialData={editingLanguage || undefined}
            />
        );
    }

    if (error) {
        return <ErrorReload onRetry={fetchLanguages} />;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3'>
                <h2 className='text-[18px] sm:text-[20px] font-semibold text-subTitleColor'>
                    {t('jobs.userProfile.languages.title', { defaultValue: 'Languages' })}
                </h2>
                <Button
                    unstyled
                    scale={1.03}
                    className='bg-blueSite text-white flex flex-row items-center gap-2 text-[14px] sm:text-[16px] lg:text-[18px] py-2 rounded-md px-3 sm:px-6 lg:px-8 w-full sm:w-auto justify-center'
                    onClick={handleAddClick}
                >
                    {t('jobs.userProfile.languages.addNew', { defaultValue: 'Add language' })}
                </Button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <LanguagesSkeleton />
                    <LanguagesSkeleton />
                </div>
            ) : languages.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {languages.map((language) => (
                        <LanguageCard
                            key={language.id}
                            language={language}
                            handleEditClick={handleEditClick}
                            handleDeleteClick={handleDeleteClick}
                            handleViewDetails={handleViewDetails}
                        />
                    ))}
                </div>
            ) : languages.length === 0 && (
                <div className="bg-[#FCFCFC] rounded-[20px] p-12 flex flex-col items-center justify-center text-center gap-4 border-2 border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                        <LanguagesIcon className="w-8 h-8" />
                    </div>
                    <div className="max-w-md">
                        <h3 className="text-[16px] sm:text-[18px] font-medium text-subTitleColor">
                            {t('jobs.userProfile.languages.noData', { defaultValue: 'No languages added yet' })}
                        </h3>
                        <p className="text-gray-500 text-sm sm:text-base mt-1">
                            {t('jobs.userProfile.languages.addDescription', { defaultValue: 'Add languages you speak to show your communication skills' })}
                        </p>
                    </div>
                </div>
            )}

            {deleteId && (
                <DeleteModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                        setDeleteId(null);
                    }}
                    title={t('jobs.userProfile.languages.deleteTitle', { defaultValue: 'Delete Language' })}
                    description={t('jobs.userProfile.languages.deleteDescription', { defaultValue: 'Are you sure you want to delete this language?' })}
                    url={"/languages/remove"}
                    id={deleteId}
                    refetch={fetchLanguages}
                />
            )}

            {viewingLanguage && (
                <LanguagesDetailsModal
                    isOpen={isDetailsModalOpen}
                    onClose={handleCloseDetailsModal}
                    record={viewingLanguage}
                    onEdit={handleEditFromDetails}
                />
            )}
        </div>
    );
};

export default LanguagesSection;