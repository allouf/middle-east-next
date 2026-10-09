"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Plus, Loader2, AlertCircle, Layers } from "lucide-react";
import ProviderMilestoneTable from "./components/ProviderMilestoneTable";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useAlert } from "@/lib/context/AlertProvider";
import {
  providerMilestonesService,
  type ProviderMilestoneListItem,
} from "../../services/provider-milestones.service";

const MilestonesPage = () => {
  const { t } = useTranslation();
  const { message } = useAlert();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [items, setItems] = useState<ProviderMilestoneListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const page = await providerMilestonesService.list({ perPage: 50 });
      setItems(page.milestones);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          t("providerMilestones.loadFailed", { defaultValue: "Failed to load your milestone templates." }),
      );
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  const handleCreateNewMilestone = () => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("tab", "service_market");
    nextParams.set("subTab", "create_milestone");
    router.push(`${pathname}?${nextParams.toString()}`);
  };

  const handleView = (id: number) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("tab", "service_market");
    nextParams.set("subTab", "milestone_provider_details");
    nextParams.set("milestoneId", String(id));
    router.push(`${pathname}?${nextParams.toString()}`);
  };

  const handleEdit = (id: number) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("tab", "service_market");
    nextParams.set("subTab", "edit_milestone");
    nextParams.set("milestoneId", String(id));
    router.push(`${pathname}?${nextParams.toString()}`);
  };

  // Optimistic update — flip the row immediately, revert on failure. The
  // backend toggle returns the updated row but we don't actually need it
  // unless the API also adjusts other fields (it doesn't, per
  // MilestoneListResource).
  const handleToggleActivation = async (id: number, next: boolean) => {
    const previous = items;
    setItems((prev) =>
      prev.map((m) => (m.id === id ? { ...m, activation_status: next } : m)),
    );
    try {
      await providerMilestonesService.toggleActivation(id);
      message.success(
        next
          ? t("providerMilestones.activated", { defaultValue: "Milestone activated." })
          : t("providerMilestones.deactivated", { defaultValue: "Milestone deactivated." }),
      );
    } catch (err: any) {
      setItems(previous);
      message.error(
        err?.response?.data?.message ||
          t("providerMilestones.toggleFailed", {
            defaultValue: "Couldn't update activation. Please try again.",
          }),
      );
    }
  };

  const handleDelete = async (id: number) => {
    const previous = items;
    setItems((prev) => prev.filter((m) => m.id !== id));
    try {
      await providerMilestonesService.remove(id);
      message.success(
        t("providerMilestones.deleted", { defaultValue: "Milestone deleted." }),
      );
    } catch (err: any) {
      setItems(previous);
      message.error(
        err?.response?.data?.message ||
          t("providerMilestones.deleteFailed", {
            defaultValue: "Couldn't delete the milestone. It may have active orders.",
          }),
      );
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 font-sans mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-blueSite rounded-full"></div>
            <h1 className="text-[24px] md:text-[28px] font-semibold text-subTitleColor m-0">
              {t("providerMilestones.title", { defaultValue: "My Milestones" })}
            </h1>
          </div>
          <p className="text-gray-500 text-sm md:text-base max-w-2xl">
            {t("providerMilestones.subtitle", {
              defaultValue:
                "Integrating various services into a unified package that users can access as a single entity",
            })}
          </p>
        </div>

        <button
          onClick={handleCreateNewMilestone}
          className="flex items-center justify-center gap-2 bg-blueSite text-white text-[14px] px-5 py-2.5 rounded-lg hover:bg-blueSiteHover transition-colors font-medium whitespace-nowrap"
        >
          <Plus size={18} />
          {t("providerMilestones.createNew", { defaultValue: "Create New Milestone" })}
        </button>
      </div>

      <div className="mt-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <Loader2 className="w-10 h-10 animate-spin text-[#00664F]" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <AlertCircle className="w-10 h-10 text-red-400" />
            <p className="text-gray-700 text-sm">{error}</p>
            <button
              type="button"
              onClick={loadList}
              className="px-5 py-2 bg-[#00664F] text-white rounded-xl font-semibold hover:opacity-90"
            >
              {t("common.retry", { defaultValue: "Retry" })}
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white border border-gray-200 rounded-xl">
            <Layers className="w-10 h-10 text-gray-300" />
            <p className="text-gray-500 text-sm">
              {t("providerMilestones.empty", {
                defaultValue: "You haven't created any milestone templates yet.",
              })}
            </p>
            <button
              type="button"
              onClick={handleCreateNewMilestone}
              className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 bg-[#00664F] text-white font-semibold rounded-xl hover:opacity-90"
            >
              <Plus size={16} />
              {t("providerMilestones.createNew", { defaultValue: "Create New Milestone" })}
            </button>
          </div>
        ) : (
          <ProviderMilestoneTable
            data={items}
            onToggleActivation={handleToggleActivation}
            onDelete={handleDelete}
            onView={handleView}
            onEdit={handleEdit}
          />
        )}
      </div>
    </div>
  );
};

export default MilestonesPage;
