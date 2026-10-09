"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useAlert } from "@/lib/context/AlertProvider";
import useFormData from "@/lib/Hooks/useFormData";
import api from "@/lib/api";
import {
  PROVIDER_MILESTONE_ENDPOINTS,
  SERVICES_PUBLIC_ENDPOINTS,
} from "@/shared/constants/api-endpoints";

import { ServiceItem, CategoryOption } from "../createPage/ServiceTableBody";
import MilestoneFormBody, { parseServiceItem } from "../shared/MilestoneFormBody";
import {
  providerMilestonesService,
  type CreateServiceLinePayload,
  type ProviderMilestoneDetail,
  type ProviderMilestoneServiceLine,
} from "../../../services/provider-milestones.service";

/**
 * Edit version of the create flow. Same form (via shared
 * MilestoneFormBody) but pre-populated from GET /milestones/show/{id}
 * and submits to POST /milestones/update/{id}.
 *
 * Important BE behaviour:
 *   MilestoneService::update() calls milestoneServiceRepository->syncForMilestone
 *   when `services` is present in the payload. That means the services list we
 *   send is the authoritative state — anything missing from it gets deleted.
 *   So adds / removes happen in local state, and a single Save round-trips
 *   the whole thing. No per-line API calls during editing.
 */

function lineToServiceItem(line: ProviderMilestoneServiceLine, index: number): ServiceItem {
  return {
    id: String(line.id),
    no: `Ph.${index + 1}`,
    serviceName: line.service_name,
    category: String(line.service_category_id),
    duration: String(line.duration_days),
    budget: String(line.budget),
    revision: String(line.revision_window_days ?? 0),
  };
}

const EditMilestonePage = () => {
  const { t } = useTranslation();
  const { message } = useAlert();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const milestoneIdParam = searchParams.get("milestoneId");
  const milestoneId = milestoneIdParam ? parseInt(milestoneIdParam, 10) : NaN;

  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);

  const handleGoBack = () => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("tab", "service_market");
    nextParams.set("subTab", "milestone_provider_details");
    nextParams.set("milestoneId", String(milestoneId));
    router.push(`${pathname}?${nextParams.toString()}`);
  };

  const { formData, handleChange, handleArrayChange, errors, handleAddError, setFormData } = useFormData({
    title: "",
    deliveryMode: "",
    modificationDays: "",
    description: "",
    services: [] as ServiceItem[],
  });

  useEffect(() => {
    if (Number.isNaN(milestoneId)) {
      setLoadError(t("providerMilestones.edit.missingId", { defaultValue: "No milestone selected." }));
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setLoadError(null);

    Promise.all([
      providerMilestonesService.show(milestoneId).catch((err) => {
        throw new Error(
          err?.response?.data?.message ||
            t("providerMilestones.edit.loadFailed", { defaultValue: "Couldn't load milestone." }),
        );
      }),
      api.get(SERVICES_PUBLIC_ENDPOINTS.getAllCategories).then((r) => r.data?.data ?? []),
    ])
      .then(([detail, cats]: [ProviderMilestoneDetail, { id: number; name: string }[]]) => {
        if (cancelled) return;
        setCategoryOptions(cats.map((c) => ({ id: String(c.id), name: c.name })));
        setFormData({
          title: detail.title,
          deliveryMode: detail.delivery_model ?? "",
          modificationDays: String(detail.request_modification_days ?? 0),
          description: detail.description ?? "",
          services: detail.services.map((line, idx) => lineToServiceItem(line, idx)),
        });
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setLoadError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [milestoneId]);

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      message.error(t("providerMilestones.edit.titleRequired", { defaultValue: "Title is required." }));
      return;
    }
    if (!formData.deliveryMode) {
      message.error(t("providerMilestones.edit.deliveryModeRequired", { defaultValue: "Pick a delivery model." }));
      return;
    }
    const modDays = parseInt(formData.modificationDays, 10);
    if (Number.isNaN(modDays) || modDays < 0) {
      message.error(
        t("providerMilestones.edit.modDaysRequired", {
          defaultValue: "Request modifications days is required (0 or more).",
        }),
      );
      return;
    }
    if (formData.services.length === 0) {
      message.error(
        t("providerMilestones.edit.noPhases", { defaultValue: "A milestone needs at least one phase." }),
      );
      return;
    }

    const parsedServices: CreateServiceLinePayload[] = [];
    for (const item of formData.services) {
      const parsed = parseServiceItem(item);
      if (!parsed) {
        message.error(
          t("providerMilestones.edit.invalidPhase", {
            defaultValue: "Each phase needs a name, category, duration (≥1), and budget.",
          }),
        );
        return;
      }
      parsedServices.push(parsed);
    }

    setSubmitting(true);
    try {
      await api.post(PROVIDER_MILESTONE_ENDPOINTS.update(milestoneId), {
        title: formData.title.trim(),
        description: formData.description?.trim() || null,
        delivery_model: formData.deliveryMode,
        request_modification_days: modDays,
        services: parsedServices,
      });

      message.success(t("providerMilestones.edit.success", { defaultValue: "Milestone updated." }));
      handleGoBack();
    } catch (err: any) {
      const apiMsg = err?.response?.data?.message;
      const validationErrors = err?.response?.data?.errors;
      if (validationErrors && typeof validationErrors === "object") {
        const firstField = Object.keys(validationErrors)[0];
        const firstMsg = validationErrors[firstField]?.[0];
        message.error(firstMsg || apiMsg || "Validation failed.");
      } else {
        message.error(apiMsg || t("common.errorOccurred", { defaultValue: "Failed to update the milestone." }));
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-[#00664F]" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <AlertCircle className="w-10 h-10 text-red-400" />
        <p className="text-gray-700 text-sm">{loadError}</p>
        <button
          type="button"
          onClick={handleGoBack}
          className="px-5 py-2 bg-[#00664F] text-white rounded-xl font-semibold hover:opacity-90"
        >
          {t("common.goBack", { defaultValue: "Go back" })}
        </button>
      </div>
    );
  }

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
            {t("providerMilestones.edit.title", { defaultValue: "Edit Milestone" })}
          </h1>
        </div>
        <p className="text-gray-500 text-sm md:text-base max-w-2xl">
          {t("providerMilestones.edit.subtitle", {
            defaultValue: "Update the milestone details. Phase changes are saved together with the milestone.",
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
        submitting={submitting}
        submitLabel={t("providerMilestones.edit.submit", { defaultValue: "Save changes" })}
        onSubmit={handleSubmit}
        onCancel={handleGoBack}
        allowRemovePhases={true}
      />
    </div>
  );
};

export default EditMilestonePage;
