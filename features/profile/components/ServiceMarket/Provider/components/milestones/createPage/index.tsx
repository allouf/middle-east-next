"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useAlert } from "@/lib/context/AlertProvider";
import useFormData from "@/lib/Hooks/useFormData";
import api from "@/lib/api";
import {
  PROVIDER_MILESTONE_ENDPOINTS,
  SERVICES_PUBLIC_ENDPOINTS,
} from "@/shared/constants/api-endpoints";

import { ServiceItem, CategoryOption } from "./ServiceTableBody";
import MilestoneFormBody, { parseServiceItem } from "../shared/MilestoneFormBody";
import type { CreateServiceLinePayload } from "../../../services/provider-milestones.service";

const CreateMilestonePage = () => {
  const { t } = useTranslation();
  const { message } = useAlert();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [submitting, setSubmitting] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const handleGoBack = () => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("tab", "service_market");
    nextParams.set("subTab", "provider_order_milestones");
    router.push(`${pathname}?${nextParams.toString()}`);
  };

  const { formData, handleChange, handleArrayChange, errors, handleAddError } = useFormData({
    title: "",
    deliveryMode: "",
    modificationDays: "",
    description: "",
    services: [] as ServiceItem[],
  });

  // Real categories — backend's StoreMilestoneServiceLineRequest validates
  // service_category_id against service_categories.id, so we MUST use real
  // ids here (not free-text strings like the old mock did).
  useEffect(() => {
    let cancelled = false;
    setCategoriesLoading(true);
    setCategoriesError(null);

    (async () => {
      try {
        const response = await api.get(SERVICES_PUBLIC_ENDPOINTS.getAllCategories);
        if (cancelled) return;
        const cats = response.data?.data ?? [];
        setCategoryOptions(
          cats.map((c: { id: number; name: string }) => ({
            id: String(c.id),
            name: c.name,
          })),
        );
      } catch (err: any) {
        if (cancelled) return;
        setCategoriesError(
          err?.response?.data?.message ||
            t("providerMilestones.create.categoriesFailed", {
              defaultValue: "Couldn't load categories. Refresh to retry.",
            }),
        );
      } finally {
        if (!cancelled) setCategoriesLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [t]);

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      message.error(t("providerMilestones.create.titleRequired", { defaultValue: "Title is required." }));
      return;
    }
    if (!formData.deliveryMode) {
      message.error(
        t("providerMilestones.create.deliveryModeRequired", { defaultValue: "Pick a delivery model." }),
      );
      return;
    }
    const modDays = parseInt(formData.modificationDays, 10);
    if (Number.isNaN(modDays) || modDays < 0) {
      message.error(
        t("providerMilestones.create.modDaysRequired", {
          defaultValue: "Request modifications days is required (0 or more).",
        }),
      );
      return;
    }
    if (formData.services.length === 0) {
      message.error(t("providerMilestones.create.noPhases", { defaultValue: "Add at least one phase." }));
      return;
    }

    const parsedServices: CreateServiceLinePayload[] = [];
    for (const item of formData.services) {
      const parsed = parseServiceItem(item);
      if (!parsed) {
        message.error(
          t("providerMilestones.create.invalidPhase", {
            defaultValue: "Each phase needs a name, category, duration (≥1), and budget.",
          }),
        );
        return;
      }
      parsedServices.push(parsed);
    }

    setSubmitting(true);
    try {
      // BE's StoreMilestoneRequest accepts the service lines IN the create
      // body (via the ValidatesMilestoneServiceLines trait) — single atomic
      // request rather than create-then-loop-add-service-line.
      await api.post(PROVIDER_MILESTONE_ENDPOINTS.create, {
        title: formData.title.trim(),
        description: formData.description?.trim() || null,
        delivery_model: formData.deliveryMode,
        request_modification_days: modDays,
        services: parsedServices,
      });

      message.success(t("providerMilestones.create.success", { defaultValue: "Milestone created." }));
      handleGoBack();
    } catch (err: any) {
      const apiMsg = err?.response?.data?.message;
      const validationErrors = err?.response?.data?.errors;
      if (validationErrors && typeof validationErrors === "object") {
        const firstField = Object.keys(validationErrors)[0];
        const firstMsg = validationErrors[firstField]?.[0];
        message.error(firstMsg || apiMsg || "Validation failed.");
      } else {
        message.error(apiMsg || t("common.errorOccurred", { defaultValue: "Failed to create the milestone." }));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 font-sans mx-auto py-6 px-4 sm:px-6 lg:px-8 max-w-6xl">
      <button
        onClick={handleGoBack}
        className="flex items-center gap-2 text-[#00664F] font-semibold text-[16px] hover:opacity-80 transition-opacity w-fit uppercase tracking-wide"
      >
        <ArrowLeft size={18} className="rtl:-scale-x-100" />
        {t("common.goBack", { defaultValue: "GO BACK" })}
      </button>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-[#00664F] rounded-full"></div>
          <h1 className="text-[24px] md:text-[28px] font-semibold text-subTitleColor m-0">
            {t("providerMilestones.create.title", { defaultValue: "Create New Milestone" })}
          </h1>
        </div>
        <p className="text-gray-500 text-sm md:text-base max-w-2xl">
          {t("providerMilestones.create.subtitle", {
            defaultValue: "Combining multiple services into a single package that the user can call as one block",
          })}
        </p>
      </div>

      <MilestoneFormBody
        formData={formData}
        handleChange={handleChange}
        handleArrayChange={handleArrayChange}
        errors={errors}
        handleAddError={handleAddError}
        categoryOptions={categoryOptions}
        categoriesLoading={categoriesLoading}
        categoriesError={categoriesError}
        submitting={submitting}
        submitLabel={t("providerMilestones.create.submit", { defaultValue: "Create Milestone" })}
        onSubmit={handleSubmit}
        onCancel={handleGoBack}
        allowRemovePhases={false}
      />
    </div>
  );
};

export default CreateMilestonePage;
