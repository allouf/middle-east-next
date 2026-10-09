import React from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Plus } from "lucide-react";

type PlanActionsProps = {
  editingIndex: number | null;
  onAddPlan: () => void;
  onUpdatePlan: () => void;
  onCancelEdit: () => void;
};

export default function PlanActions({
  editingIndex,
  onAddPlan,
  onUpdatePlan,
  onCancelEdit,
}: PlanActionsProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap items-center gap-4 pt-2">
      {editingIndex !== null ? (
        <>
          <button
            type="button"
            onClick={onUpdatePlan}
            className="!h-12 !px-10 !text-base !font-semibold bg-[#007A5E] text-white rounded-lg hover:bg-[#00664c] transition-colors"
          >
            <div className="flex items-center gap-2">
              {t('serviceMarket.myServices.plans.updatePlan')}
            </div>
          </button>
          <button
            type="button"
            onClick={onCancelEdit}
            className="!h-12 !px-10 !text-base !font-semibold border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            {t('serviceMarket.myServices.plans.cancel')}
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={onAddPlan}
          className="!h-12 !px-10 !text-base !font-semibold bg-[#007A5E] text-white rounded-lg hover:bg-[#00664c] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {t('serviceMarket.myServices.plans.addPlan')}
          </div>
        </button>
      )}
    </div>
  );
}
