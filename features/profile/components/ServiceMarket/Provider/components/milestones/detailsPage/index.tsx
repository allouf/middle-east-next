"use client";

import React, { useCallback, useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Pencil, Trash2, Loader2, AlertCircle } from "lucide-react";
import { Popconfirm } from "antd";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useAlert } from "@/lib/context/AlertProvider";
import {
  providerMilestonesService,
  type ProviderMilestoneDetail,
} from "../../../services/provider-milestones.service";

const DELIVERY_MODEL_LABEL: Record<string, string> = {
  hybrid: "Hybrid",
  onsite: "Onsite",
  remote: "Remote",
};

const MilestoneDetailsPage = () => {
  const { t } = useTranslation();
  const { message } = useAlert();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const milestoneIdParam = searchParams.get("milestoneId");
  const milestoneId = milestoneIdParam ? parseInt(milestoneIdParam, 10) : NaN;

  const [data, setData] = useState<ProviderMilestoneDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useCallback(
    (subTab: string, extra?: Record<string, string>) => {
      const nextParams = new URLSearchParams(searchParams.toString());
      nextParams.set("tab", "service_market");
      nextParams.set("subTab", subTab);
      if (extra) {
        Object.entries(extra).forEach(([k, v]) => nextParams.set(k, v));
      } else {
        nextParams.delete("milestoneId");
      }
      router.push(`${pathname}?${nextParams.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const handleGoBack = () => navigate("provider_order_milestones");
  const handleEdit = () =>
    navigate("edit_milestone", { milestoneId: String(milestoneId) });

  const handleDelete = async () => {
    if (Number.isNaN(milestoneId)) return;
    setDeleting(true);
    try {
      await providerMilestonesService.remove(milestoneId);
      message.success(
        t("providerMilestones.deleted", { defaultValue: "Milestone deleted." }),
      );
      navigate("provider_order_milestones");
    } catch (err: any) {
      message.error(
        err?.response?.data?.message ||
          t("providerMilestones.deleteFailed", {
            defaultValue: "Couldn't delete the milestone. It may have active orders.",
          }),
      );
    } finally {
      setDeleting(false);
    }
  };

  const loadDetail = useCallback(async () => {
    if (Number.isNaN(milestoneId)) {
      setError(
        t("providerMilestones.detail.missingId", {
          defaultValue: "No milestone selected.",
        }),
      );
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await providerMilestonesService.show(milestoneId);
      setData(result);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          t("providerMilestones.detail.loadFailed", {
            defaultValue: "Couldn't load this milestone.",
          }),
      );
    } finally {
      setLoading(false);
    }
  }, [milestoneId, t]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-2">
        <Loader2 className="w-10 h-10 animate-spin text-[#00664F]" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <AlertCircle className="w-10 h-10 text-red-400" />
        <p className="text-gray-700 text-sm">{error}</p>
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
    <div className="w-full flex flex-col font-sans mx-auto py-6 px-4 sm:px-6 lg:px-8 max-w-[1100px]">
      <button
        onClick={handleGoBack}
        className="flex items-center gap-2 text-[#00664F] font-semibold text-[15px] hover:opacity-80 transition-opacity w-fit uppercase tracking-wide mb-8"
      >
        <ArrowLeft size={18} strokeWidth={2.5} className="rtl:-scale-x-100" />
        {t("common.goBack", { defaultValue: "GO BACK" })}
      </button>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Left: summary */}
        <div className="w-full lg:w-[45%] flex flex-col gap-6">
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 md:p-8 shadow-[0px_2px_8px_rgba(0,0,0,0.02)] relative overflow-hidden">
            <div className="bg-[#1D4A41] text-white text-[10px] font-bold px-3 py-1.5 rounded-full w-fit mb-5 tracking-widest uppercase shadow-sm">
              {data.activation_status
                ? t("providerMilestones.detail.activeBadge", { defaultValue: "Active" })
                : t("providerMilestones.detail.inactiveBadge", { defaultValue: "Inactive" })}
            </div>

            <h1 className="text-[26px] md:text-[32px] font-extrabold text-[#003B2F] leading-tight mb-5">
              {data.title}
            </h1>

            <p className="text-[#848484] text-[14px] leading-relaxed mb-8 whitespace-pre-line">
              {data.description || t("providerMilestones.detail.noDescription", { defaultValue: "No description provided." })}
            </p>

            <h3 className="text-[17px] font-bold text-[#1A1A1A] mb-5">
              {t("providerMilestones.detail.summary", { defaultValue: "Summary" })}
            </h3>

            <div className="flex flex-col gap-4">
              <SummaryRow
                label={t("providerMilestones.detail.deliveryModel", { defaultValue: "Delivery Model" })}
                value={
                  data.delivery_model
                    ? DELIVERY_MODEL_LABEL[data.delivery_model] ?? data.delivery_model
                    : "—"
                }
              />
              <SummaryRow
                label={t("providerMilestones.detail.requestModifications", { defaultValue: "Request Modifications" })}
                value={`${data.request_modification_days ?? 0} days`}
              />
              <SummaryRow
                label={t("providerMilestones.detail.totalBudget", { defaultValue: "Total Budget" })}
                value={`$${data.total_budget.toFixed(2)}`}
              />
              <SummaryRow
                label={t("providerMilestones.detail.totalDuration", { defaultValue: "Total Duration" })}
                value={`${data.duration_days} days`}
              />
            </div>
          </div>

          <div className="flex items-center gap-6 mt-4 pl-2">
            <button
              type="button"
              onClick={handleEdit}
              className="bg-[#00664F] text-white px-8 py-3.5 rounded-xl hover:bg-[#005240] transition-colors font-bold text-[15px] shadow-sm"
            >
              {t("providerMilestones.detail.edit", { defaultValue: "Edit Milestone" })}
            </button>
            <Popconfirm
              title={t("providerMilestones.deleteConfirmTitle", {
                defaultValue: "Delete this milestone template?",
              })}
              description={t("providerMilestones.deleteConfirmDesc", {
                defaultValue: "Buyers won't be able to order it. This can't be undone.",
              })}
              okText={t("common.delete", { defaultValue: "Delete" })}
              cancelText={t("common.cancel", { defaultValue: "Cancel" })}
              okButtonProps={{ danger: true, loading: deleting }}
              onConfirm={handleDelete}
            >
              <button
                type="button"
                disabled={deleting}
                className="text-[#E74C3C] font-semibold text-[15px] border-b-2 border-[#E74C3C] pb-0.5 hover:opacity-80 transition-opacity disabled:opacity-50"
              >
                {t("common.delete", { defaultValue: "Delete" })}
              </button>
            </Popconfirm>
          </div>
        </div>

        {/* Right: phase roadmap */}
        <div className="w-full lg:w-[55%] flex flex-col">
          <div className="flex items-center justify-between mb-8 pr-2">
            <h2 className="text-[26px] font-bold text-[#003B2F]">
              {t("providerMilestones.detail.roadmap", { defaultValue: "Project Roadmap" })}
            </h2>
            <button
              type="button"
              onClick={handleEdit}
              className="text-[#00664F] font-bold text-[13px] hover:opacity-80 border-b-2 border-[#00664F] pb-0.5"
            >
              + {t("providerMilestones.detail.addService", { defaultValue: "Edit phases" })}
            </button>
          </div>

          {data.services.length === 0 ? (
            <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-8 text-center">
              <p className="text-gray-500 text-sm">
                {t("providerMilestones.detail.noPhases", {
                  defaultValue: "No phases added yet.",
                })}
              </p>
            </div>
          ) : (
            <div className="relative border-l-[1.5px] border-[#E2E8F0] ml-[7px] flex flex-col gap-8 pb-4">
              {data.services.map((line) => (
                <div key={line.id} className="relative pl-8">
                  <div className="absolute left-[-7.5px] top-4 w-[14px] h-[14px] rounded-full border-2 border-[#00664F] bg-white z-10"></div>

                  <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-[0px_2px_8px_rgba(0,0,0,0.02)]">
                    <div className="flex justify-between items-start mb-6 gap-3 flex-wrap">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-gray-400 tracking-widest uppercase mb-1.5">
                          {t("providerMilestones.detail.phaseName", { defaultValue: "Phase" })}
                        </span>
                        <h3 className="text-[17px] font-bold text-[#003B2F]">
                          {line.service_name}
                        </h3>
                        {line.category && (
                          <span className="text-[12px] text-gray-500 mt-1">{line.category.name}</span>
                        )}
                      </div>
                      <div className="flex gap-8 text-right">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-gray-400 tracking-widest uppercase mb-1.5">
                            {t("providerMilestones.detail.budget", { defaultValue: "Budget" })}
                          </span>
                          <span className="text-[14px] font-bold text-[#003B2F]">
                            ${line.budget.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-gray-400 tracking-widest uppercase mb-1.5">
                            {t("providerMilestones.detail.duration", { defaultValue: "Duration" })}
                          </span>
                          <span className="text-[14px] font-bold text-[#003B2F]">
                            {line.duration_days} days
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-4 mt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-gray-400 font-semibold italic">
                          {t("providerMilestones.detail.revisionWindow", { defaultValue: "Revision window" })}
                        </span>
                        <span className="text-[12px] font-bold text-[#003B2F] ml-2">
                          {line.revision_window_days ?? 0} days
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle2 className="w-5 h-5 text-white fill-[#00664F]" />
      <span className="text-[14px] text-gray-700">
        {label}: <span className="font-bold text-gray-900">{value}</span>
      </span>
    </div>
  );
}

export default MilestoneDetailsPage;
