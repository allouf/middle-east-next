import React, { useState } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Plus } from "lucide-react";
import PortfolioProjectModal, { ProjectItem, ProjectMode } from "./PortfolioProjectModal";
import { useProviderProject } from "../../hooks/Project/useProviderProject";

/**
 * New Project Card Component
 * 
 * Card component for adding a new project.
 * Opens a modal for project creation when clicked.
 */
interface NewProjectCardProps {}

function NewProjectCard(props: NewProjectCardProps) {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const projectHook = useProviderProject({
    required: {
      title: true,
      description: true,
    },
    onSuccess: () => {
      handleCloseModal();
    },
  });

  // Event handlers
  const handleOpenModal = (): void => {
    setIsModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    projectHook.resetForm();
  };

  const handleSubmit = async (values: ProjectItem): Promise<void> => {
    // Convert ProjectItem to form data format
    projectHook.setTitle(values.title);
    projectHook.setDescription(values.description);
    projectHook.setUrl(values.url || "");
    projectHook.setSortOrder(values.sort_order?.toString() || "0");
    projectHook.setServiceOfferIds(values.service_offer_ids || []);

    // Convert images to File objects (assuming they're already File objects or have originFileObj)
    const imageFiles = values.images
      .map(img => (img as any).originFileObj || img)
      .filter(file => file instanceof File);

    projectHook.setImages(imageFiles);

    const result = await projectHook.createProject(projectHook.preparePayload(imageFiles));
    if (result && result.data) {
      handleCloseModal();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpenModal}
        className="flex h-full min-h-[285px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-[#B8DED5] bg-[#FAFDFC] p-6 text-center transition-all duration-200 hover:bg-[#F3FBF8]"
        aria-label="Create new project"
      >
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#D9F0EA] text-blueSite">
          <Plus className="h-6 w-6" />
        </span>

        <h3 className="text-[16px] font-semibold text-blueSite">{t('serviceMarket.projects.newProject')}</h3>
        <p className="mt-2 text-sm text-textGrayColor">
          {t('serviceMarket.projects.newProjectDescription')}
        </p>
      </button>

      <PortfolioProjectModal
        open={isModalOpen}
        mode="create"
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />
    </>
  );
}

export default NewProjectCard;