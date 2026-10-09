import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Edit2, Trash2, Calendar, Briefcase, Building2 } from 'lucide-react';
import useJobProfileApi from '../useJobProfileApi';
import WorkExperienceForm from './WorkExperienceForm';
import Button from '@/components/ui/Button';
import GlowLight from '@/components/shered/GlowLight';
import { CiCirclePlus } from 'react-icons/ci';
import { WorkExperience } from './experience';
import WorkExperienceCard from './WorkExperienceCard';
import WorkExperienceDetailsModal from './WorkExperienceDetailsModal';
import { Spin } from 'antd';
import DeleteModal from '@/components/shered/DeleteModel';
import ErrorReload from '@/components/shared/ErrorReload';
import WorkExperienceSkeleton from './WorkExperienceSkeleton';



const WorkExperienceSection = () => {
    const { t } = useTranslation();
    const { getWorkExperiences, updateWorkExperience, loading, error } = useJobProfileApi();

    const [experiences, setExperiences] = useState<WorkExperience[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingExperience, setEditingExperience] = useState<WorkExperience | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | number | null>(null);
    const [terminatingId, setTerminatingId] = useState<string | number | null>(null);
    const [viewingExperience, setViewingExperience] = useState<WorkExperience | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const handleTerminate = async (exp: WorkExperience) => {
        try {
            setTerminatingId(exp.id);
            const today = new Date().toISOString().split('T')[0];
            await updateWorkExperience(exp.id, {
                ...exp,
                is_current: false,
                end_date: today
            });
            fetchExperiences();
        } catch (error) {
            console.error('Failed to terminate position:', error);
        } finally {
            setTerminatingId(null);
        }
    };

    const fetchExperiences = useCallback(async () => {
        try {
            const response = await getWorkExperiences<WorkExperience[]>();
            if (response && response.data) {
                setExperiences(response.data);
            }
            console.log("response", response)
        } catch (error) {
            console.error('Failed to fetch work experiences:', error);
        }
    }, [getWorkExperiences]);

    useEffect(() => {
        fetchExperiences();
    }, [fetchExperiences]);

    const handleAddClick = () => {
        setEditingExperience(null);
        setShowForm(true);
    };

    const handleEditClick = (exp: WorkExperience) => {
        setEditingExperience(exp);
        setShowForm(true);
    };

    const handleDeleteClick = (id: string | number) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleFormBack = () => {
        setShowForm(false);
        setEditingExperience(null);
    };

    const handleFormSuccess = () => {
        fetchExperiences();
        setShowForm(false);
        setEditingExperience(null);
    };

    const handleViewDetails = (exp: WorkExperience) => {
        setViewingExperience(exp);
        setIsDetailsModalOpen(true);
    };

    const handleCloseDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setViewingExperience(null);
    };

    const handleEditFromDetails = (exp: WorkExperience) => {
        setIsDetailsModalOpen(false);
        setViewingExperience(null);
        handleEditClick(exp);
    };

    if (showForm) {
        return (
            <WorkExperienceForm
                onBack={handleFormBack}
                onSuccess={handleFormSuccess}
                initialData={editingExperience || undefined}
            />
        );
    }

    if (error) {
        return <ErrorReload onRetry={fetchExperiences} />;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3'>
                <h2 className='text-[18px] sm:text-[20px] font-semibold text-subTitleColor'>
                    {t('jobs.userProfile.workExperience.title')}
                </h2>
                <Button
                    unstyled
                    scale={1.03}
                    className='bg-blueSite text-white flex flex-row items-center gap-2 text-[14px] sm:text-[16px] lg:text-[18px] py-2 rounded-md px-3 w-full sm:w-auto justify-center'
                    onClick={handleAddClick}
                >
                    {/* <CiCirclePlus className="w-6 h-6" /> */}
                    {t('jobs.userProfile.workExperience.addMoreBtn', { defaultValue: 'Add work experience' })}
                </Button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <WorkExperienceSkeleton />
                    <WorkExperienceSkeleton />
                </div>
            ) : experiences.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {experiences.map((exp) => (
                        <WorkExperienceCard
                            key={exp.id}
                            experience={exp}
                            handleEditClick={handleEditClick}
                            handleDeleteClick={handleDeleteClick}
                            handleTerminate={handleTerminate}
                            handleViewDetails={handleViewDetails}
                            isTerminating={terminatingId === exp.id}
                        />
                    ))}
                </div>
            ) : experiences.length === 0 && (
                <div className="bg-[#FCFCFC] rounded-[12px] sm:rounded-[16px] lg:rounded-[20px] p-6 sm:p-8 lg:p-12 flex flex-col items-center justify-center text-center gap-4 border-2 border-dashed border-gray-200">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                        <Briefcase className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                    </div>
                    <div className="max-w-md">
                        <h3 className="text-[16px] sm:text-[18px] font-medium text-subTitleColor">
                            {t('jobs.userProfile.workExperience.noData', { defaultValue: 'No work experience added yet' })}
                        </h3>
                        <p className="text-gray-500 text-sm sm:text-base mt-1">
                            {t('jobs.userProfile.workExperience.addDescription', { defaultValue: 'Add your professional experience to stand out to employers' })}
                        </p>
                    </div>
                </div>
            )}

            {/* <div className="mt-4">
                <Button
                    unstyled
                    className='text-blueSite flex flex-row items-center gap-2 text-[20px] py-2 hover:underline'
                    onClick={handleAddClick}
                >
                    <CiCirclePlus className="w-6 h-6" />
                    {t('jobs.userProfile.workExperience.addMore', { defaultValue: 'Add more practical experience' })}
                </Button>
            </div> */}

            {deleteId && (
                <DeleteModal
                    isOpen={isDeleteModalOpen}
                    title={t('jobs.userProfile.workExperience.deleteTitle', { defaultValue: 'Delete work experience' })}
                    description={t('jobs.userProfile.workExperience.deleteDescription', { defaultValue: 'Are you sure you want to delete this work experience?' })}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                        setDeleteId(null);
                    }}
                    url={"/work-experiences/remove"}
                    id={deleteId}
                    refetch={fetchExperiences}
                />
            )}

            {viewingExperience && (
                <WorkExperienceDetailsModal
                    isOpen={isDetailsModalOpen}
                    onClose={handleCloseDetailsModal}
                    record={viewingExperience}
                    onEdit={handleEditFromDetails}
                />
            )}
        </div>
    );
};

export default WorkExperienceSection;
