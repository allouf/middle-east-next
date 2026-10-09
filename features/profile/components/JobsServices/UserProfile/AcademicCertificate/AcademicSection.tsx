import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { GraduationCap } from 'lucide-react';
import useJobProfileApi from '../useJobProfileApi';
import AcademicCertificates from './AcademicCertificates';
import Button from '@/components/ui/Button';
import { AcademicRecord } from './academic';
import AcademicCard from './AcademicCard';
import DeleteModal from '@/components/shered/DeleteModel';
import ErrorReload from '@/components/shared/ErrorReload';
import AcademicSkeleton from './AcademicSkeleton';
import AcademicDetailsModal from './AcademicDetailsModal';

const AcademicSection = () => {
    const { t } = useTranslation();
    const { getEducations, loading, error } = useJobProfileApi();
    const [records, setRecords] = useState<AcademicRecord[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingRecord, setEditingRecord] = useState<AcademicRecord | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | number | null>(null);
    const [selectedRecord, setSelectedRecord] = useState<AcademicRecord | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const fetchRecords = useCallback(async () => {
        try {
            const response = await getEducations<AcademicRecord[]>();
            if (response && response.data) {
                setRecords(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch academic records:', error);
        }
    }, [getEducations]);

    useEffect(() => {
        fetchRecords();
    }, [fetchRecords]);

    const handleAddClick = () => {
        setEditingRecord(null);
        setShowForm(true);
    };

    const handleEditClick = (record: AcademicRecord) => {
        setEditingRecord(record);
        setShowForm(true);
    };

    const handleDeleteClick = (id: string | number) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleFormBack = () => {
        setShowForm(false);
        setEditingRecord(null);
    };

    const handleFormSuccess = () => {
        fetchRecords();
        setShowForm(false);
        setEditingRecord(null);
    };

    const handleViewDetails = (record: AcademicRecord) => {
        setSelectedRecord(record);
        setIsDetailsModalOpen(true);
    };

    const handleCloseDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setSelectedRecord(null);
    };

    if (showForm) {
        return (
            <AcademicCertificates
                onBack={handleFormBack}
                onSuccess={handleFormSuccess}
                initialData={editingRecord || undefined}
            />
        );
    }

    if (error) {
        return <ErrorReload onRetry={fetchRecords} />;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3'>
                <h2 className='text-[18px] sm:text-[20px] font-semibold text-subTitleColor'>
                    {t('jobs.userProfile.academicCertificates.title', { defaultValue: 'Academic Certificates' })}
                </h2>
                <Button
                    unstyled
                    scale={1.03}
                    className='bg-blueSite text-white flex flex-row items-center gap-2 text-[14px] sm:text-[16px] lg:text-[18px] py-2 rounded-md px-3 w-full sm:w-auto justify-center'
                    onClick={handleAddClick}
                >
                    {t('jobs.userProfile.academicCertificates.addNew', { defaultValue: 'Add academic certificate' })}
                </Button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <AcademicSkeleton />
                    <AcademicSkeleton />
                </div>
            ) : records.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {records.map((record) => (
                        <AcademicCard
                            key={record.id}
                            record={record}
                            handleEditClick={handleEditClick}
                            handleDeleteClick={handleDeleteClick}
                            handleViewDetails={handleViewDetails}
                        />
                    ))}
                </div>
            ) : records.length === 0 && (
                <div className="bg-[#FCFCFC] rounded-[12px] sm:rounded-[16px] lg:rounded-[20px] p-6 sm:p-8 lg:p-12 flex flex-col items-center justify-center text-center gap-4 border-2 border-dashed border-gray-200">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                        <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                    </div>
                    <div className="max-w-md">
                        <h3 className="text-[16px] sm:text-[18px] font-medium text-subTitleColor">
                            {t('jobs.userProfile.academicCertificates.noData', { defaultValue: 'No academic certificates added yet' })}
                        </h3>
                        <p className="text-gray-500 text-sm sm:text-base mt-1">
                            {t('jobs.userProfile.academicCertificates.addDescription', { defaultValue: 'Add your educational background to complete your profile' })}
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
                    title={t('jobs.userProfile.academicCertificates.deleteTitle', { defaultValue: 'Delete academic certificate' })}
                    description={t('jobs.userProfile.academicCertificates.deleteDescription', { defaultValue: 'Are you sure you want to delete this academic certificate?' })}
                    url={"/educations/remove"}
                    id={deleteId}
                    refetch={fetchRecords}
                />
            )}

            {/* Details Modal */}
            <AcademicDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={handleCloseDetailsModal}
                record={selectedRecord}
                onEdit={handleEditClick}
            />
        </div>
    );
};

export default AcademicSection;