"use client";

import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { App } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { useTranslation } from "@/lib/i18n/useTranslation";
import Modal from "@/components/ui/Modal";
import FormContent from "./components/FormContent";
import ViewContent from "./components/ViewContent";
import { useProjectForm } from "../../hooks/Project/useProjectForm";
import { providerProjectsService } from "../../services/provider-projects.service";
import { ProjectFormState } from "../../types";

export type ProjectMode = "create" | "edit" | "view";

export type ProjectImage = {
  uid: string;
  name: string;
  url: string;
};

export type ProjectItem = {
  id?: number | string;
  title: string;
  description: string;
  url?: string;
  sort_order?: number;
  service_offer_ids?: number[];
  relatedServices?: string[];
  images: ProjectImage[];
};

interface PortfolioProjectModalProps {
  open: boolean;
  mode: ProjectMode;
  project?: ProjectItem | null;
  onClose: () => void;
  onSubmit?: (values: ProjectItem) => void;
  onDelete?: (project?: ProjectItem | null) => void;
  onEditFromView?: () => void;
  refetch: () => void;
}

const SERVICE_OPTIONS = [
  { label: "Ui / Ux", value: "Ui / Ux" },
  { label: "Front-End", value: "Front-End" },
  { label: "Back-End", value: "Back-End" },
  { label: "Branding", value: "Branding" },
  { label: "Research", value: "Research" },
  { label: "QA", value: "QA" },
  { label: "Development", value: "Development" },
] as const;

const EMPTY_FORM: ProjectItem = {
  title: "",
  description: "",
  url: "",
  sort_order: 1,
  service_offer_ids: [],
  images: [],
};

const TAG_COLORS: Record<string, string> = {
  Branding: "bg-[#FFF3D6] text-[#C69214] border-[#F5D88A]",
  Research: "bg-[#FFE6F2] text-[#C94C86] border-[#F3B7D0]",
  QA: "bg-[#E8F0FF] text-[#5A78D1] border-[#C6D5FF]",
  Development: "bg-[#E8F8E8] text-[#4E9E59] border-[#BFE5C5]",
  "Ui / Ux": "bg-[#DFF3EE] text-[#00664F] border-[#B9DDD4]",
  "Front-End": "bg-[#DFF3EE] text-[#00664F] border-[#B9DDD4]",
  "Back-End": "bg-[#DFF3EE] text-[#00664F] border-[#B9DDD4]",
};

const mapImagesToUploadFiles = (images: ProjectImage[]): UploadFile[] =>
  images.map((img, index) => ({
    uid: img.uid || `${index}`,
    name: img.name || `image-${index + 1}`,
    status: "done" as const,
    url: img.url,
  }));

const mapUploadFilesToImages = (files: UploadFile[]): ProjectImage[] =>
  files.map((file, index) => ({
    uid: file.uid || `${index}`,
    name: file.name || `image-${index + 1}`,
    url: file.url || (file.thumbUrl as string) || "",
  }));

const convertProjectToFormState = (project?: ProjectItem | null): Partial<ProjectFormState> => {
  if (!project) return {};

  return {
    title: project.title || "",
    description: project.description || "",
    url: project.url || "",
    sort_order: project.sort_order?.toString() || "",
    service_offer_ids: project.service_offer_ids || [],
    images: project.images
      .map(img => (img as any).originFileObj || img)
      .filter((file): file is File => file instanceof File),
  };
};

export default function PortfolioProjectModal({
  open,
  mode,
  project,
  onClose,
  onDelete,
  onEditFromView,
  refetch,
}: PortfolioProjectModalProps) {
  const { t } = useTranslation();
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isCreate = mode === "create";

  const { message: messageApi } = App.useApp();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const refetchRef = useRef(refetch);
  const onCloseRef = useRef(onClose);
  refetchRef.current = refetch;
  onCloseRef.current = onClose;

  const formHook = useProjectForm({
    initial: convertProjectToFormState(project),
    required: {
      title: true,
      description: true,
    },
  });

  // Create form object from formHook data for UI components
  const form = useMemo(() => ({
    id: project?.id,
    title: formHook.formData.title,
    description: formHook.formData.description,
    url: formHook.formData.url,
    sort_order: Number(formHook.formData.sort_order) || 1,
    service_offer_ids: formHook.formData.service_offer_ids,
    relatedServices: project?.relatedServices || [],
    images: fileList.length > 0
      ? mapUploadFilesToImages(fileList)
      : project?.images || [],
  }), [formHook.formData, fileList, project]);

  useEffect(() => {
    if (!open) return;

    const initialData = project
      ? {
        ...project,
        url: project.url || "",
        relatedServices: project.relatedServices || [],
        images: project.images || [],
      }
      : EMPTY_FORM;

    setFileList(mapImagesToUploadFiles(initialData.images || []));
    setGalleryIndex(0);
  }, [open, project]);

  const modalTitle = useMemo(() => {
    if (isCreate) return t('serviceMarket.projects.addProject');
    if (isEdit) return t('serviceMarket.projects.editProject');
    return form.title || t('serviceMarket.projects.projectDetails');
  }, [isCreate, isEdit, form.title, t]);

  const visibleThumbs = useMemo(() => {
    const maxThumbs = 8;
    return form.images.slice(galleryIndex, galleryIndex + maxThumbs);
  }, [form.images, galleryIndex]);

  const canPrev = galleryIndex > 0;
  const canNext = galleryIndex + 8 < form.images.length;

  const handleChangeField = useCallback((key: keyof ProjectItem, value: any) => {
    switch (key) {
      case 'title':
        formHook.setTitle(value);
        break;
      case 'description':
        formHook.setDescription(value);
        break;
      case 'url':
        formHook.setUrl(value || "");
        break;
      case 'sort_order':
        formHook.setSortOrder(value || 1);
        break;
      case 'service_offer_ids':
        formHook.setServiceOfferIds(value || []);
        break;
      case 'images':
        // Handle image changes - update fileList state
        if (Array.isArray(value)) {
          const uploadFiles: UploadFile[] = value.map((file, index) => ({
            uid: `-${Date.now()}-${index}`,
            name: file instanceof File ? file.name : String(file),
            status: 'done' as const,
            originFileObj: file instanceof File ? (file as any) : undefined,
          }));
          setFileList(uploadFiles);
        }
        break;
    }
  }, [formHook]);

  const handleSubmit = useCallback(async () => {
    if (isView) return;

    formHook.setIsSubmitted(true);

    const imageFiles: File[] = fileList
      .map(file => file.originFileObj)
      .filter((file): file is any => file != null)
      .filter(file => file && typeof file === 'object' && 'size' in file && 'type' in file);

    if (imageFiles.length > 0) {
      formHook.setImages(imageFiles);
    }

    if (!formHook.validate()) return;

    const payload = formHook.preparePayload(imageFiles);

    setLoading(true);
    try {
      let result;
      if (isEdit && project?.id) {
        result = await providerProjectsService.updateProject(Number(project.id), payload);
      } else {
        result = await providerProjectsService.createProject(payload);
      }

      if (result) {
        messageApi.success(result.message || 'Project saved successfully.');
        formHook.resetForm();
        refetchRef.current();
        if (isCreate) {
          setFileList([]);
          onCloseRef.current();
        }
      }
    } catch (error) {
      console.error('Submit error:', error);
      messageApi.error('Failed to save project. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [fileList, isEdit, isCreate, isView, project?.id, formHook, messageApi]);

  const handleDelete = useCallback(() => {
    if (project?.id) {
      onDelete?.(project);
    }
  }, [project, onDelete]);

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      showLine={false}
      padding="p-0"
      className="!rounded-[36px] "
      classNameContent="relative !p-0 overflow-y-scroll max-h-[calc(100vh-100px)]"
      style={{ maxWidth: isView ? 1100 : 900, zIndex: 50 }}
    >
      <div className="relative rounded-3xl bg-white p-6 md:p-8 w-full h-full">
        {isView ? (
          <ViewContent
            form={form}
            visibleThumbs={visibleThumbs}
            canPrev={canPrev}
            canNext={canNext}
            onPrev={() => setGalleryIndex((prev) => Math.max(prev - 1, 0))}
            onNext={() =>
              setGalleryIndex((prev) =>
                Math.min(prev + 1, Math.max(form.images.length - 8, 0))
              )
            }
            onEditFromView={onEditFromView}
            onDelete={handleDelete}
          />
        ) : (
          <FormContent
            title={modalTitle}
            isEdit={isEdit}
            form={form}
            fileList={fileList}
            onChangeField={handleChangeField}
            onCancel={onClose}
            onSubmit={handleSubmit}
            loading={loading}
            errors={formHook.errors}
            isSubmited={formHook.isSubmitted}
          />
        )}
      </div>
    </Modal>
  );
}

export { SERVICE_OPTIONS, TAG_COLORS };