import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Link2 } from 'lucide-react';
import useJobProfileApi from '../useJobProfileApi';
import LinksForm from './LinksForm';
import Button from '@/components/ui/Button';
import { LinkRecord } from './link';
import LinkCard from './LinkCard';
import { Spin } from 'antd';
import DeleteModal from '@/components/shered/DeleteModel';
import { LinkIcon } from '../../Icons/LinkIcon';
import ErrorReload from '@/components/shared/ErrorReload';
import LinksSkeleton from './LinksSkeleton';
import LinksDetailsModal from './LinksDetailsModal';

const LinksSection = () => {
    const { t } = useTranslation();
    const { getLinks, loading, error } = useJobProfileApi();
    const [links, setLinks] = useState<LinkRecord[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingLink, setEditingLink] = useState<LinkRecord | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | number | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [viewingLink, setViewingLink] = useState<LinkRecord | null>(null);

    const fetchLinks = useCallback(async () => {
        try {
            const response = await getLinks<LinkRecord[]>();
            if (response && response.data) {
                setLinks(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch links:', error);
        }
    }, [getLinks]);

    useEffect(() => {
        fetchLinks();
    }, [fetchLinks]);

    const handleAddClick = () => {
        setEditingLink(null);
        setShowForm(true);
    };

    const handleEditClick = (link: LinkRecord) => {
        setEditingLink(link);
        setShowForm(true);
    };

    const handleDeleteClick = (id: string | number) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleFormBack = () => {
        setShowForm(false);
        setEditingLink(null);
    };

    const handleFormSuccess = () => {
        fetchLinks();
        setShowForm(false);
        setEditingLink(null);
    };

    const handleViewClick = (link: LinkRecord) => {
        setViewingLink(link);
        setIsDetailsModalOpen(true);
    };

    const handleDetailsModalClose = () => {
        setIsDetailsModalOpen(false);
        setViewingLink(null);
    };

    if (showForm) {
        return (
            <LinksForm
                onBack={handleFormBack}
                onSuccess={handleFormSuccess}
                initialData={editingLink || undefined}
            />
        );
    }

    if (error) {
        return <ErrorReload onRetry={fetchLinks} />;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3'>
                <h2 className='text-[18px] sm:text-[20px] font-semibold text-subTitleColor'>
                    {t('jobs.userProfile.links.title')}
                </h2>
                <Button
                    unstyled
                    scale={1.03}
                    className='bg-blueSite text-white flex flex-row items-center gap-2 text-[14px] sm:text-[16px] lg:text-[18px] py-2 rounded-md px-3 sm:px-6 lg:px-8 w-full sm:w-auto justify-center'
                    onClick={handleAddClick}
                >
                    {t('jobs.userProfile.links.addNew')}
                </Button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <LinksSkeleton />
                    <LinksSkeleton />
                </div>
            ) : links.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {links.map((link) => (
                        <LinkCard
                            key={link.id}
                            link={link}
                            handleEditClick={handleEditClick}
                            handleDeleteClick={handleDeleteClick}
                            handleViewClick={handleViewClick}
                        />
                    ))}
                </div>
            ) : links.length === 0 && (
                <div className="bg-[#FCFCFC] rounded-[12px] sm:rounded-[16px] lg:rounded-[20px] p-6 sm:p-8 lg:p-12 flex flex-col items-center justify-center text-center gap-4 border-2 border-dashed border-gray-200">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                        <LinkIcon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                    </div>
                    <div className="max-w-md">
                        <h3 className="text-[16px] sm:text-[18px] font-medium text-subTitleColor">
                            {t('jobs.userProfile.links.noData')}
                        </h3>
                        <p className="text-gray-500 text-sm sm:text-base mt-1">
                            {t('jobs.userProfile.links.addDescription')}
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
                    title={t('jobs.userProfile.links.deleteTitle')}
                    description={t('jobs.userProfile.links.deleteDescription')}
                    url={"/links/remove"}
                    id={deleteId}
                    refetch={fetchLinks}
                />
            )}

            <LinksDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={handleDetailsModalClose}
                record={viewingLink}
                onEdit={handleEditClick}
            />
        </div>
    );
};

export default LinksSection;