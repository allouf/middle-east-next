"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Spin } from "antd";
import type { ProjectItem as CardProjectItem } from "./ProjectCard";
import type { ProjectItem as ModalProjectItem } from "./PortfolioProjectModal";
import SectionHeader from "./SectionHeader";
import FilterSection from "./Filter/FilterSection";
import GridView from "./components/GridView";
import TableView from "./components/TableView";
import PortfolioProjectModal from "./PortfolioProjectModal";
import DeleteModal from "@/components/shered/DeleteModel";
import { useProviderProjectsApi } from "../../hooks/Project/useProviderProjectsApi";
import { ProviderProject } from "../../types/provider.types";
import type { ProjectTag } from "./TagPill";
import { SERVICE_MARKET_ENDPOINTS } from "@/shared/constants/api-endpoints";
import { t } from "i18next";

interface PortfolioProjectsPageProps { }


export default function PortfolioProjectsPage({ }: PortfolioProjectsPageProps) {
  const { loading, error, projects, refetch } = useProviderProjectsApi();
  const [search, setSearch] = useState<string>("");
  const [service, setService] = useState<string>("all");
  const [date, setDate] = useState<string>("last30");
  const [view, setView] = useState<string>("grid");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<CardProjectItem | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "view" | "edit">("create");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [projectToDelete, setProjectToDelete] = useState<ModalProjectItem | null>(null);

  const loadProjects = useCallback(
    (resetPage = false): void => {
      refetch({ search: search.trim() || undefined }, { showMessage: false });
    },
    [refetch, search]
  );

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const convertToProjectItems = useCallback((providerProjects: ProviderProject[]): CardProjectItem[] => {
    // Ensure providerProjects is an array
    if (!Array.isArray(providerProjects)) {
      console.warn('providerProjects is not an array:', providerProjects);
      return [];
    }
    
    return providerProjects.map((project): CardProjectItem => {
      // Generate tags from service offers
      const tags: ProjectTag[] = project.service_offers?.map((offer, index) => ({
        label: offer.title,
        color: index % 2 === 0 ? "text-blue-700" : "text-green-700",
        bg: index % 2 === 0 ? "bg-blue-100" : "bg-green-100",
      })) || [];

      return {
        id: project.id,
        title: project.title,
        description: project.description,
        image: project.images?.[0] || "/images/default-project.jpg",
        tags,
      };
    });
  }, []);

  const projectItems = useMemo(() => convertToProjectItems(projects), [projects, convertToProjectItems]);
  const handleOpenModal = (): void => {
    setIsModalOpen(true);
    setModalMode("create");
    setSelectedProject(null);
  };



  const handleOpenViewModal = (project: CardProjectItem): void => {
    setSelectedProject(project);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const handleRefetchProjects = useCallback((): void => {
    refetch({ search: search.trim() || undefined }, { showMessage: false });
  }, [refetch, search]);

  // Adapt project for modal view
  const adaptProjectForModal = (project: CardProjectItem): any => {
    // Find the original project from projects array to get complete data
    const originalProject = projects.find(p => p.id === project.id);
    
    return {
      id: project.id,
      title: project.title,
      description: project.description,
      url: originalProject?.url || '',
      sort_order: originalProject?.sort_order || 1,
      relatedServices: project.tags.map(tag => tag.label),
      service_offer_ids: originalProject?.service_offers?.map(offer => offer.id) || [],
      images: [{
        uid: `img-${project.id}`,
        name: project.title,
        url: project.image
      }]
    };
  };
  const modalProject =
    modalMode === "create" || !selectedProject
      ? undefined
      : adaptProjectForModal(selectedProject);

  const handleEditFromView = () => {
    setModalMode("edit");
  };

  const handleDeleteProject = (project?: ModalProjectItem | null) => {
    if (project) {
      setProjectToDelete(project);
      setIsDeleteModalOpen(true);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProjectToDelete(null);
  };

  const handleDeleteSuccess = () => {
    handleCloseDeleteModal();
    handleCloseModal();
    handleRefetchProjects();
  };

  return (
    <section className="min-h-screen px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader onOpenModal={handleOpenModal} />

        <FilterSection
          search={search}
          onSearchChange={setSearch}
          service={service}
          onServiceChange={setService}
          date={date}
          onDateChange={setDate}
          view={view}
          onViewChange={setView}
        />

        {loading && (
          <div className="flex justify-center py-12">
            <Spin
              size="large"
              tip="Loading projects..."
              className="[&_.ant-spin-dot-item]:!bg-blueSite"
            />
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() =>
                refetch({ search: search.trim() || undefined }, { showMessage: false })
              }
              type="button"
              className="mt-2 rounded bg-blueSite px-4 py-2 text-white hover:bg-blueSiteHover"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {view === "grid" ? (
              <GridView projects={projectItems} onProjectClick={handleOpenViewModal} />
            ) : (
              <TableView projects={projectItems} onProjectClick={handleOpenViewModal} />
            )}

            {projectItems.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-gray-500">No projects found.</p>
              </div>
            )}
          </>
        )}
        {isModalOpen &&
          <PortfolioProjectModal
            open={isModalOpen}
            mode={modalMode}
            project={modalProject}
            onClose={handleCloseModal}
            refetch={handleRefetchProjects}
            onEditFromView={handleEditFromView}
            onDelete={handleDeleteProject}
          />
        }

        {isDeleteModalOpen &&
          <DeleteModal
            isOpen={isDeleteModalOpen}
            onClose={handleCloseDeleteModal}
            url={SERVICE_MARKET_ENDPOINTS.deleteProject}
            id={projectToDelete?.id || ''}
            onSuccess={handleDeleteSuccess}
            refetch={handleRefetchProjects}
            title={t("serviceMarket.projects.deleteModal.deleteProject")}
            description={t("serviceMarket.projects.deleteModal.deleteProjectDescription")}
            showMessage={true}
          />
        }

      </div>
    </section>
  );
}

