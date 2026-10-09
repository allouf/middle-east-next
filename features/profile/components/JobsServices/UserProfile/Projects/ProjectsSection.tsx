import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Folder } from 'lucide-react';
import useJobProfileApi from '../useJobProfileApi';
import ProjectsForm from './ProjectsForm';
import Button from '@/components/ui/Button';
import { Project } from './project';
import ProjectCard from './ProjectCard';
import ProjectsDetailsModal from './ProjectsDetailsModal';
import { Spin } from 'antd';
import DeleteModal from '@/components/shered/DeleteModel';
import ErrorReload from '@/components/shared/ErrorReload';
import ProjectSkeleton from './ProjectSkeleton';

const ProjectsSection = () => {
    const { t } = useTranslation();
    const { getProjects, loading, error } = useJobProfileApi();
    const [projects, setProjects] = useState<Project[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | number | null>(null);
    const [viewingProject, setViewingProject] = useState<Project | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const fetchProjects = useCallback(async () => {
        try {
            const response = await getProjects<Project[]>();
            if (response && response.data) {
                setProjects(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        }
    }, [getProjects]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleAddClick = () => {
        setEditingProject(null);
        setShowForm(true);
    };

    const handleEditClick = (project: Project) => {
        setEditingProject(project);
        setShowForm(true);
    };

    const handleDeleteClick = (id: string | number) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleFormBack = () => {
        setShowForm(false);
        setEditingProject(null);
    };

    const handleFormSuccess = () => {
        fetchProjects();
        setShowForm(false);
        setEditingProject(null);
    };

    const handleViewDetails = (project: Project) => {
        setViewingProject(project);
        setIsDetailsModalOpen(true);
    };

    const handleCloseDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setViewingProject(null);
    };

    const handleEditFromDetails = (project: Project) => {
        setIsDetailsModalOpen(false);
        setViewingProject(null);
        handleEditClick(project);
    };

    if (showForm) {
        return (
            <ProjectsForm
                onBack={handleFormBack}
                onSuccess={handleFormSuccess}
                initialData={editingProject || undefined}
            />
        );
    }

    if (error) {
        return <ErrorReload onRetry={fetchProjects} />;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3'>
                <h2 className='text-[18px] sm:text-[20px] font-semibold text-subTitleColor'>
                    {t('jobs.userProfile.projects.title', { defaultValue: 'Projects' })}
                </h2>
                <Button
                    unstyled
                    scale={1.03}
                    className='bg-blueSite text-white flex flex-row items-center gap-2 text-[14px] sm:text-[16px] lg:text-[18px] py-2 rounded-md px-3 sm:px-6 lg:px-8 w-full sm:w-auto justify-center'
                    onClick={handleAddClick}
                >
                    {t('jobs.userProfile.projects.addNew', { defaultValue: 'Add project' })}
                </Button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <ProjectSkeleton />
                    <ProjectSkeleton />
                </div>
            ) : projects.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            handleEditClick={handleEditClick}
                            handleDeleteClick={handleDeleteClick}
                            handleViewDetails={handleViewDetails}
                        />
                    ))}
                </div>
            ) : !loading && projects.length === 0 && (
                <div className="bg-[#FCFCFC] rounded-[12px] sm:rounded-[16px] lg:rounded-[20px] p-6 sm:p-8 lg:p-12 flex flex-col items-center justify-center text-center gap-4 border-2 border-dashed border-gray-200">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                        <Folder className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                    </div>
                    <div className="max-w-md">
                        <h3 className="text-[16px] sm:text-[18px] font-medium text-subTitleColor">
                            {t('jobs.userProfile.projects.noData', { defaultValue: 'No projects added yet' })}
                        </h3>
                        <p className="text-gray-500 text-sm sm:text-base mt-1">
                            {t('jobs.userProfile.projects.addDescription', { defaultValue: 'Add your projects to showcase your skills and experience' })}
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
                    title={t('jobs.userProfile.projects.deleteTitle', { defaultValue: 'Delete Project' })}
                    description={t('jobs.userProfile.projects.deleteDescription', { defaultValue: 'Are you sure you want to delete this project?' })}
                    url={"/projects/remove"}
                    id={deleteId}
                    refetch={fetchProjects}
                />
            )}

            {viewingProject && (
                <ProjectsDetailsModal
                    isOpen={isDetailsModalOpen}
                    onClose={handleCloseDetailsModal}
                    record={viewingProject}
                    onEdit={handleEditFromDetails}
                />
            )}
        </div>
    );
};

export default ProjectsSection;