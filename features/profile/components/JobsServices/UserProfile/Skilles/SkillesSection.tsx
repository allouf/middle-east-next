import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import useJobProfileApi from '../useJobProfileApi';
import SkillForm from './SkillForm';
import Button from '@/components/ui/Button';
import { SkillRecord } from './skill';
import { Spin } from 'antd';
import DeleteModal from '@/components/shered/DeleteModel';
import { StarIcon } from '../../Icons/StarIcon';
import { FaTrash } from 'react-icons/fa';
import SkillSkeleton from './SkillSkeleton';
import ErrorReload from '@/components/shared/ErrorReload';

const SkillesSection = () => {
    const { t } = useTranslation();
    const { getSkills, loading, error } = useJobProfileApi();
    const [skills, setSkills] = useState<SkillRecord[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | number | null>(null);

    const fetchSkills = useCallback(async () => {
        try {
            const response = await getSkills<SkillRecord[]>();
            if (response && response.data) {
                setSkills(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch skills:', error);
        }
    }, [getSkills]);

    useEffect(() => {
        fetchSkills();
    }, [fetchSkills]);

    const handleAddClick = () => {
        setEditMode(false);
        setShowForm(true);
    };

    const handleUpdateClick = () => {
        setEditMode(true);
        setShowForm(true);
    };

    const handleDeleteClick = (id: string | number) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleFormBack = () => {
        setShowForm(false);
    };

    const handleFormSuccess = () => {
        fetchSkills();
        setShowForm(false);
    };

    if (showForm) {
        return (
            <SkillForm
                onBack={handleFormBack}
                onSuccess={handleFormSuccess}
                initialSkills={editMode ? skills : undefined}
            />
        );
    }

    if (error) {
        return <ErrorReload onRetry={fetchSkills} />;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3'>
                <h2 className='text-[18px] sm:text-[20px] font-semibold text-subTitleColor'>
                    {t('jobs.userProfile.skills.title')}
                </h2>
                <div className="flex gap-2 sm:gap-4">
                    {skills.length > 0 && (
                        <Button
                            unstyled
                            scale={1.03}
                            className='bg-blueSite text-white flex flex-row items-center gap-2 text-[14px] sm:text-[16px] lg:text-[18px] py-2 rounded-md px-3 sm:px-6 lg:px-8 w-full sm:w-auto justify-center'
                            onClick={handleUpdateClick}
                        >
                            {t('common.edit_skills')}
                        </Button>
                    )}
                    {skills.length === 0 && <Button
                        unstyled
                        scale={1.03}
                        className='bg-blueSite text-white flex flex-row items-center gap-2 text-[14px] sm:text-[16px] lg:text-[18px] py-2 rounded-md px-3 sm:px-6 lg:px-8 w-full sm:w-auto justify-center'
                        onClick={handleAddClick}
                    >
                        {t('jobs.userProfile.skills.addNew')}
                    </Button>}
                </div>
            </div>
            {loading ? (
                <SkillSkeleton />
            ) : skills.length > 0 ? (
                <div className="bg-[#FCFCFC] rounded-[12px] sm:rounded-[16px] lg:rounded-[20px] p-4 sm:p-6 lg:p-8 border border-gray-100 flex flex-wrap gap-3 sm:gap-4">
                    {skills.map((skill) => (
                        <div key={skill.id} className="flex items-center gap-2 sm:gap-3 bg-[#06B1870F] text-subTitleColor px-3 sm:px-4 py-2 sm:py-2.5 rounded-full border border-[#06B1871A]">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#06B1871A] rounded-full flex items-center justify-center text-[#06B187] flex-shrink-0">
                                <StarIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                            </div>
                            <span className="font-semibold capitalize text-[14px] sm:text-[16px] truncate max-w-[120px] sm:max-w-[150px]">{skill.skill_name}</span>
                            <button
                                onClick={() => handleDeleteClick(skill.id)}
                                className="text-red-500 hover:text-red-700 ml-1 sm:ml-2 p-1 transition-colors relative group flex-shrink-0"
                                title={t('common.remove')}
                            >
                                <FaTrash className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                <div className="absolute inset-0 bg-red-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity -z-10 scale-150"></div>
                            </button>
                        </div>
                    ))}
                </div>
            ) : skills.length === 0 && (
                <div className="bg-[#FCFCFC] rounded-[12px] sm:rounded-[16px] lg:rounded-[20px] p-6 sm:p-8 lg:p-12 flex flex-col items-center justify-center text-center gap-4 border-2 border-dashed border-gray-200">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                        <StarIcon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                    </div>
                    <div className="max-w-md">
                        <h3 className="text-[16px] sm:text-[18px] font-medium text-subTitleColor">
                            {t('jobs.userProfile.skills.noData')}
                        </h3>
                        <p className="text-gray-500 text-sm sm:text-base mt-1">
                            {t('jobs.userProfile.skills.addDescription')}
                        </p>
                    </div>
                </div>
            )
            }

            {deleteId && (
                <DeleteModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                        setDeleteId(null);
                    }}
                    title={t('jobs.userProfile.skills.deleteTitle')}
                    description={t('jobs.userProfile.skills.deleteDescription')}
                    url={"/skills/remove"}
                    id={deleteId}
                    refetch={fetchSkills}
                />
            )}
        </div>
    );
};

export default SkillesSection;