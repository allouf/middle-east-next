"use client";

import React, { useEffect, useState } from "react";
import { Layers, FileText, Paperclip } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useAlert } from "@/lib/context/AlertProvider";
import useFormData from "@/lib/Hooks/useFormData";
import api from "@/lib/api";
import { SERVICES_PUBLIC_ENDPOINTS } from "@/shared/constants/api-endpoints";
import { ServiceItem, CategoryOption } from "../createPage/ServiceTableBody";
import MilestoneFormBody, { parseServiceItem } from "../shared/MilestoneFormBody";
import {
  providerMilestoneOrderService,
  type ProviderMilestoneOrder,
} from "./service";

type Props = {
  order: ProviderMilestoneOrder;
  onSuccess: (updated: ProviderMilestoneOrder) => void;
};

/**
 * Inline form rendered when the provider opens a status=Negotiation order.
 * Reuses the same MilestoneFormBody as the standalone Create / Edit pages.
 *
 * Atomically: POST /provider-orders/{orderId}/define-milestone with
 * { title, description, delivery_model, request_modification_days, services[] }.
 * Backend:
 *   - creates a real Milestone template in this provider's library
 *   - copies its services into service_offer_order_phases on this order
 *   - sets orderable_type/_id + current_phase_id
 *   - flips status Negotiation -> PendingPayment
 *
 * On success the parent ProviderMilestoneOrderPage receives the updated
 * order shape (now with phases + cursor) and re-renders the regular
 * phase-cards view — the buyer's per-phase pay flow takes over from there.
 */
export default function NegotiationDefineForm({ order, onSuccess }: Props) {
  const { t } = useTranslation();
  const { message } = useAlert();

  const [submitting, setSubmitting] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const { formData, handleChange, handleArrayChange, errors, handleAddError } = useFormData({
    title: "",
    deliveryMode: "",
    modificationDays: "",
    description: "",
    services: [] as ServiceItem[],
  });

  // Real categories — backend's StoreMilestoneServiceLineRequest validates
  // service_category_id against service_categories.id, so we MUST use real ids.
  useEffect(() => {
    let cancelled = false;
    setCategoriesLoading(true);
    setCategoriesError(null);

    (async () => {
      try {
        const response = await api.get(SERVICES_PUBLIC_ENDPOINTS.getAllCategories);
        if (cancelled) return;
        const cats = response.data?.data ?? [];
        setCategoryOptions(cats.map((c: { id: number; name: string }) => ({ id: String(c.id), name: c.name })));
      } catch (err: any) {
        if (cancelled) return;
        setCategoriesError(
          err?.response?.data?.message ||
            t("providerMilestoneOrder.negotiation.categoriesFailed", {
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
      message.error(
        t("providerMilestoneOrder.negotiation.titleRequired", { defaultValue: "Title is required." }),
      );
      return;
    }
    if (!formData.deliveryMode) {
      message.error(
        t("providerMilestoneOrder.negotiation.deliveryModeRequired", {
          defaultValue: "Pick a delivery model.",
        }),
      );
      return;
    }
    const modDays = parseInt(formData.modificationDays, 10);
    if (Number.isNaN(modDays) || modDays < 0) {
      message.error(
        t("providerMilestoneOrder.negotiation.modDaysRequired", {
          defaultValue: "Request modifications days is required (0 or more).",
        }),
      );
      return;
    }
    if (formData.services.length === 0) {
      message.error(
        t("providerMilestoneOrder.negotiation.noPhases", { defaultValue: "Add at least one phase." }),
      );
      return;
    }

    const parsedServices = [];
    for (const item of formData.services) {
      const parsed = parseServiceItem(item);
      if (!parsed) {
        message.error(
          t("providerMilestoneOrder.negotiation.invalidPhase", {
            defaultValue: "Each phase needs a name, category, duration (≥1), and budget.",
          }),
        );
        return;
      }
      parsedServices.push(parsed);
    }

    setSubmitting(true);
    try {
      const updated = await providerMilestoneOrderService.defineMilestone(order.id, {
        title: formData.title.trim(),
        description: formData.description?.trim() || null,
        delivery_model: formData.deliveryMode,
        request_modification_days: modDays,
        services: parsedServices,
      });

      message.success(
        t("providerMilestoneOrder.negotiation.success", {
          defaultValue: "Milestone defined. The buyer can now pay the first phase.",
        }),
      );
      onSuccess(updated);
    } catch (err: any) {
      const apiMsg = err?.response?.data?.message;
      const validationErrors = err?.response?.data?.errors;
      if (validationErrors && typeof validationErrors === "object") {
        const firstField = Object.keys(validationErrors)[0];
        const firstMsg = validationErrors[firstField]?.[0];
        message.error(firstMsg || apiMsg || "Validation failed.");
      } else {
        message.error(
          apiMsg ||
            t("common.errorOccurred", {
              defaultValue: "Couldn't define the milestone. Try again.",
            }),
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const referencedOffer = (order as any).reference_service_offer ?? null;
  const requirements = (order as any).requirements ?? null;
  const buyerNotes: string | null = requirements?.notes ?? null;

  return (
    <div className="p-6 space-y-6 bg-[#FCFCFC]">
      {/* Negotiation banner — what the buyer wants */}
      <div className="rounded-2xl border border-[#00664F33] bg-[#00664F0A] p-5">
        <div className="flex items-center gap-2 mb-2">
          <Layers className="w-5 h-5 text-[#00664F]" />
          <span className="text-xs uppercase tracking-wider font-bold text-[#00664F]">
            {t("providerMilestoneOrder.negotiation.badge", { defaultValue: "Negotiation" })}
          </span>
        </div>
        <h2 className="text-lg font-bold text-subTitleColor mb-1">
          {t("providerMilestoneOrder.negotiation.title", {
            defaultValue: "The buyer requested milestone-based payment",
          })}
        </h2>
        <p className="text-sm text-gray-600">
          {t("providerMilestoneOrder.negotiation.description", {
            defaultValue:
              "Define the phases (each with duration, budget, and category). On submit, the buyer can pay phase 1 to kick off the work.",
          })}
        </p>

        {referencedOffer && (
          <div className="mt-3 pt-3 border-t border-[#00664F33] flex items-start gap-2">
            <FileText className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
            <p className="text-sm text-gray-700">
              {t("providerMilestoneOrder.negotiation.referenceOffer", { defaultValue: "Referenced offer" })}:{" "}
              <span className="font-semibold">{referencedOffer.title ?? `#${referencedOffer.id}`}</span>
            </p>
          </div>
        )}

        {buyerNotes && (
          <div className="mt-3 pt-3 border-t border-[#00664F33] flex items-start gap-2">
            <Paperclip className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
            <div className="text-sm text-gray-700">
              <p className="font-semibold mb-0.5">
                {t("providerMilestoneOrder.negotiation.buyerNotes", { defaultValue: "Buyer's notes" })}
              </p>
              <p className="text-gray-600 whitespace-pre-line">{buyerNotes}</p>
            </div>
          </div>
        )}
      </div>

      {/* Reusable milestone form (same as create + edit pages) */}
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
        submitLabel={t("providerMilestoneOrder.negotiation.submit", {
          defaultValue: "Define milestone & request payment",
        })}
        onSubmit={handleSubmit}
        onCancel={() => {
          /* No cancel target — stays on the same page. UX could refine this. */
        }}
        allowRemovePhases={false}
      />
    </div>
  );
}
