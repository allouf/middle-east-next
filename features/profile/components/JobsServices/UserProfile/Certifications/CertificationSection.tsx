import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Award } from 'lucide-react';
import useJobProfileApi from '../useJobProfileApi';
import CertificationForm from './CertificationForm';
import Button from '@/components/ui/Button';
import { CertificationRecord } from './certification';
import CertificationCard from './CertificationCard';
import { Spin } from 'antd';
import DeleteModal from '@/components/shered/DeleteModel';
import { AwardIcon } from '../../Icons/AwardIcon';
import ErrorReload from '@/components/shared/ErrorReload';
import CertificationSkeleton from './CertificationSkeleton';
import CertificationDetailsModal from './CertificationDetailsModal';

const CertificationSection = () => {
    const { t } = useTranslation();
    const { getCertifications, loading, error } = useJobProfileApi();
    const [certifications, setCertifications] = useState<CertificationRecord[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingCertification, setEditingCertification] = useState<CertificationRecord | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | number | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [viewingCertification, setViewingCertification] = useState<CertificationRecord | null>(null);

    const fetchCertifications = useCallback(async () => {
        try {
            const response = await getCertifications<CertificationRecord[]>();
            if (response && response.data) {
                setCertifications(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch certifications:', error);
        }
    }, [getCertifications]);

    useEffect(() => {
        fetchCertifications();
    }, [fetchCertifications]);

    const handleAddClick = () => {
        setEditingCertification(null);
        setShowForm(true);
    };

    const handleEditClick = (cert: CertificationRecord) => {
        setEditingCertification(cert);
        setShowForm(true);
    };

    const handleDeleteClick = (id: string | number) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleFormBack = () => {
        setShowForm(false);
        setEditingCertification(null);
    };

    const handleFormSuccess = () => {
        fetchCertifications();
        setShowForm(false);
        setEditingCertification(null);
    };

    const handleViewClick = (cert: CertificationRecord) => {
        setViewingCertification(cert);
        setIsDetailsModalOpen(true);
    };

    const handleDetailsModalClose = () => {
        setIsDetailsModalOpen(false);
        setViewingCertification(null);
    };

    if (showForm) {
        return (
            <CertificationForm
                onBack={handleFormBack}
                onSuccess={handleFormSuccess}
                initialData={editingCertification || undefined}
            />
        );
    }

    if (error) {
        return <ErrorReload onRetry={fetchCertifications} />;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3'>
                <h2 className='text-[18px] sm:text-[20px] font-semibold text-subTitleColor'>
                    {t('jobs.userProfile.certifications.title')}
                </h2>
                <Button
                    unstyled
                    scale={1.03}
                    className='bg-blueSite text-white flex flex-row items-center gap-2 text-[14px] sm:text-[16px] lg:text-[18px] py-2 rounded-md px-3 sm:px-6 lg:px-8 w-full sm:w-auto justify-center'
                    onClick={handleAddClick}
                >
                    {t('jobs.userProfile.certifications.addNew')}
                </Button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <CertificationSkeleton />
                    <CertificationSkeleton />
                </div>
            ) : certifications.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {certifications.map((cert) => (
                        <CertificationCard
                            key={cert.id}
                            certification={cert}
                            handleEditClick={handleEditClick}
                            handleDeleteClick={handleDeleteClick}
                            handleViewClick={handleViewClick}
                        />
                    ))}
                </div>
            ) : certifications.length === 0 && (
                <div className="bg-[#FCFCFC] rounded-[12px] sm:rounded-[16px] lg:rounded-[20px] p-6 sm:p-8 lg:p-12 flex flex-col items-center justify-center text-center gap-4 border-2 border-dashed border-gray-200">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                        <AwardIcon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                    </div>
                    <div className="max-w-md">
                        <h3 className="text-[16px] sm:text-[18px] font-medium text-subTitleColor">
                            {t('jobs.userProfile.certifications.noData')}
                        </h3>
                        <p className="text-gray-500 text-sm sm:text-base mt-1">
                            {t('jobs.userProfile.certifications.addDescription')}
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
                    title={t('jobs.userProfile.certifications.deleteTitle')}
                    description={t('jobs.userProfile.certifications.deleteDescription')}
                    url={"/certifications/remove"}
                    id={deleteId}
                    refetch={fetchCertifications}
                />
            )}

            <CertificationDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={handleDetailsModalClose}
                record={viewingCertification}
                onEdit={handleEditClick}
            />
        </div>
    );
};

export default CertificationSection;