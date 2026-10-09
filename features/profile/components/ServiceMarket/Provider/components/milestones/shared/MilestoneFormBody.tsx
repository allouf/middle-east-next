"use client";

import React, { useCallback, useMemo, useState } from "react";
import { CalendarDays, Wallet, Box, Loader2, AlertCircle, Trash2 } from "lucide-react";
import GlowLight from "@/components/shered/GlowLight";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectFiled";

import ServiceTableBody, { ServiceItem, CategoryOption } from "../createPage/ServiceTableBody";
import CreateServiceModal from "../createPage/modals/CreateServiceModal";

import { useTranslation } from "@/lib/i18n/useTranslation";
import type { CreateServiceLinePayload } from "../../../services/provider-milestones.service";

/**
 * Shared form body used by CreateMilestonePage and EditMilestonePage.
 * Renders the metadata fields, the service-line table, the summary
 * footer, and the action buttons. Parent owns state + submit logic;
 * this component is presentation + local UI (Add-phase modal,
 * per-row remove button) only.
 */

export const DELIVERY_MODE_OPTIONS = [
  { id: "hybrid", name: "Hybrid" },
  { id: "onsite", name: "Onsite" },
  { id: "remote", name: "Remote" },
];

/**
 * Coerce a local ServiceItem (all strings, FE shape) into the BE's
 * CreateServiceLinePayload (typed numbers). Returns null if any
 * required field is missing or out of range — caller surfaces the
 * error message.
 */
export function parseServiceItem(item: ServiceItem): CreateServiceLinePayload | null {
  const categoryId = parseInt(item.category, 10);
  const durationDays = parseInt(item.duration, 10);
  const budget = parseFloat(item.budget);
  const revisionDays = item.revision ? parseInt(item.revision, 10) : 0;

  if (!item.serviceName.trim()) return null;
  if (Number.isNaN(categoryId) || categoryId <= 0) return null;
  if (Number.isNaN(durationDays) || durationDays < 1) return null;
  if (Number.isNaN(budget) || budget < 0) return null;

  return {
    service_name: item.serviceName.trim(),
    service_category_id: categoryId,
    duration_days: durationDays,
    budget,
    revision_window_days: Number.isNaN(revisionDays) ? 0 : revisionDays,
  };
}

type FormDataShape = {
  title: string;
  deliveryMode: string;
  modificationDays: string;
  description: string;
  services: ServiceItem[];
};

type Props = {
  formData: FormDataShape;
  handleChange: (field: string) => (input: unknown) => void;
  handleArrayChange: (field: "services", data: ServiceItem[]) => void;
  errors: Record<string, string>;
  handleAddError: (id: string, value?: string) => void;

  categoryOptions: CategoryOption[];
  categoriesLoading?: boolean;
  categoriesError?: string | null;

  submitting: boolean;
  submitLabel: string;
  onSubmit: () => void;
  onCancel: () => void;

  /** True for edit, false for create. Renders a Trash icon per phase row. */
  allowRemovePhases?: boolean;
};

export default function MilestoneFormBody({
  formData,
  handleChange,
  handleArrayChange,
  errors,
  handleAddError,
  categoryOptions,
  categoriesLoading = false,
  categoriesError = null,
  submitting,
  submitLabel,
  onSubmit,
  onCancel,
  allowRemovePhases = false,
}: Props) {
  const { t } = useTranslation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleServiceChange = useCallback(
    (index: number, field: keyof ServiceItem, value: string) => {
      const next = [...formData.services];
      next[index] = { ...next[index], [field]: value };
      handleArrayChange("services", next);
    },
    [formData.services, handleArrayChange],
  );

  const handleAddService = useCallback(
    (newServiceData: Partial<ServiceItem>) => {
      const next = [...formData.services];
      const nextNo = next.length + 1;
      next.push({
        id: `new-${Date.now()}-${nextNo}`,
        no: `Ph.${nextNo}`,
        serviceName: newServiceData.serviceName || "",
        category: newServiceData.category || "",
        duration: newServiceData.duration || "",
        budget: newServiceData.budget || "",
        revision: newServiceData.revision || "",
        description: newServiceData.description || "",
      });
      handleArrayChange("services", next);
    },
    [formData.services, handleArrayChange],
  );

  const handleRemoveService = useCallback(
    (index: number) => {
      const next = formData.services.filter((_, i) => i !== index);
      next.forEach((s, idx) => {
        s.no = `Ph.${idx + 1}`;
      });
      handleArrayChange("services", next);
    },
    [formData.services, handleArrayChange],
  );

  const totals = useMemo(() => {
    const totalDays = formData.services.reduce(
      (sum, s) => sum + (parseInt(s.duration, 10) || 0),
      0,
    );
    const totalBudget = formData.services.reduce(
      (sum, s) => sum + (parseFloat(s.budget) || 0),
      0,
    );
    return { totalDays, totalBudget };
  }, [formData.services]);

  return (
    <>
      {/* Metadata card */}
      <div className="relative rounded-[20px] bg-[#FAFAFA] border border-[#E2E8F0] overflow-hidden shadow-sm mt-4 p-6 md:p-8">
        <GlowLight color="#06B187" size="w-[80px] md:w-[120px] h-[60px] md:h-[80px]" opacity="opacity-60" blur="blur-[45px] sm:blur-[60px]" position="top-0 right-0" />
        <GlowLight color="#06B187" size="w-[80px] md:w-[120px] h-[60px] md:h-[80px]" opacity="opacity-60" blur="blur-[45px] sm:blur-[60px]" position="bottom-0 left-0" />

        <div className="flex flex-col lg:flex-row gap-8 relative z-10">
          <div className="flex flex-col gap-6 flex-1">
            <InputField
              id="title"
              label={t("providerMilestones.create.titleField", { defaultValue: "Milestone Title" })}
              placeholder={t("providerMilestones.create.titlePlaceholder", { defaultValue: "Write the title of your package that customers will see..." })}
              value={formData.title}
              onChange={handleChange("title")}
              formErrors={errors}
              handleAddError={handleAddError}
              unstyled
              withFieldset
            />
            <SelectField
              id="deliveryMode"
              label={t("providerMilestones.create.deliveryMode", { defaultValue: "Delivery Mode" })}
              placeholder={t("providerMilestones.create.deliveryModePlaceholder", { defaultValue: "Choose a method for delivering the work." })}
              selectorOptions={DELIVERY_MODE_OPTIONS}
              value={formData.deliveryMode}
              onChange={handleChange("deliveryMode")}
              formErrors={errors}
              handleAddError={handleAddError}
              unstyled
              withFieldset
            />
            <InputField
              id="modificationDays"
              label={t("providerMilestones.create.modDays", { defaultValue: "Request Modifications Days" })}
              placeholder={t("providerMilestones.create.modDaysPlaceholder", { defaultValue: "Number of days the buyer has to request modifications." })}
              value={formData.modificationDays}
              onChange={handleChange("modificationDays")}
              formErrors={errors}
              handleAddError={handleAddError}
              unstyled
              withFieldset
            />
          </div>
          <div className="flex flex-col flex-1 h-full">
            <InputField
              id="description"
              label={t("providerMilestones.create.description", { defaultValue: "Description" })}
              type="textarea"
              placeholder={t("providerMilestones.create.descriptionPlaceholder", { defaultValue: "Describe your process, tools used, and exactly what the client will receive" })}
              value={formData.description}
              onChange={handleChange("description")}
              formErrors={errors}
              handleAddError={handleAddError}
              unstyled
              withFieldset
            />
          </div>
        </div>
      </div>

      {/* Service-line table */}
      <div className="mt-2 w-full border border-gray-200 rounded-[10px] overflow-hidden bg-white shadow-sm">
        <div className="bg-[#00664F] text-white hidden md:grid grid-cols-[50px_2fr_1.5fr_1fr_1fr_1fr_40px] gap-4 p-4 items-center">
          <div className="font-medium text-sm">{t("providerMilestones.table.no", { defaultValue: "No" })}</div>
          <div className="font-medium text-sm">{t("providerMilestones.create.serviceName", { defaultValue: "Service" })}</div>
          <div className="font-medium text-sm">{t("providerMilestones.create.category", { defaultValue: "Category" })}</div>
          <div className="font-medium text-sm">{t("providerMilestones.create.durationCol", { defaultValue: "Duration (days)" })}</div>
          <div className="font-medium text-sm">{t("providerMilestones.create.budgetCol", { defaultValue: "Budget" })}</div>
          <div className="font-medium text-sm">{t("providerMilestones.create.revisionCol", { defaultValue: "Revision (days)" })}</div>
          <div></div>
        </div>

        {categoriesLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-[#00664F]" />
          </div>
        ) : categoriesError ? (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-red-600">
            <AlertCircle className="w-4 h-4" />
            {categoriesError}
          </div>
        ) : formData.services.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-500">
            {t("providerMilestones.create.noPhasesYet", {
              defaultValue: "No phases added yet. Click below to add the first phase.",
            })}
          </div>
        ) : (
          <div className="relative">
            <ServiceTableBody
              services={formData.services}
              categoryOptions={categoryOptions}
              handleServiceChange={handleServiceChange}
            />
            {/* Floating delete buttons (edit mode only). Sit on the trailing
                handle column so they don't disrupt the table grid. */}
            {allowRemovePhases && (
              <div className="absolute top-0 right-3 h-full flex flex-col pointer-events-none">
                {formData.services.map((s, idx) => (
                  <div key={s.id} className="flex-1 flex items-center justify-end pointer-events-auto py-[18px]">
                    <button
                      type="button"
                      onClick={() => handleRemoveService(idx)}
                      aria-label={t("providerMilestones.edit.removePhase", { defaultValue: "Remove phase" })}
                      className="text-red-500 hover:opacity-70 p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="p-4 border-t border-gray-100 flex justify-center">
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            disabled={categoriesLoading || !!categoriesError}
            className="flex items-center gap-2 text-gray-500 hover:text-blueSite transition-colors border border-dashed border-gray-300 rounded-md w-full justify-center py-3 text-sm disabled:opacity-50"
          >
            {t("providerMilestones.create.addPhase", { defaultValue: "Add new phase" })}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </div>

        {/* Summary footer */}
        <div className="bg-[#F3F4F4] p-4 px-6 flex flex-wrap items-center gap-8 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Box className="w-4 h-4 text-blueSite" />
            <span>
              {t("providerMilestones.create.summaryDeliveryModel", { defaultValue: "Delivery Model" })}:{" "}
              <span className="font-semibold text-gray-900 uppercase">{formData.deliveryMode || "—"}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-blueSite" />
            <span>
              {t("providerMilestones.create.summaryTimeline", { defaultValue: "Timeline" })}:{" "}
              <span className="font-semibold text-gray-900">{totals.totalDays} days</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-blueSite" />
            <span>
              {t("providerMilestones.create.summaryBudget", { defaultValue: "Total Budget" })}:{" "}
              <span className="font-bold text-blueSite">${totals.totalBudget.toFixed(2)}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-6 mt-4">
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting || categoriesLoading || !!categoriesError}
          className="bg-blueSite text-white px-8 py-3 rounded-lg hover:bg-[#005240] transition-colors font-medium disabled:opacity-60 inline-flex items-center gap-2"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {submitting ? t("common.processing", { defaultValue: "Processing..." }) : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="text-blueSite font-medium hover:opacity-80 transition-opacity disabled:opacity-60"
        >
          {t("common.cancel", { defaultValue: "Cancel" })}
        </button>
      </div>

      <CreateServiceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAddService={handleAddService}
        categoryOptions={categoryOptions}
      />
    </>
  );
}
