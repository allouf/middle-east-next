import React from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import {
  RefreshCcw,
  Clock3,
  ShieldCheck,
  CircleDollarSign,
  Pencil,
  Trash2,
} from "lucide-react";
import { formatCurrency } from "@/features/profile/components/ServiceMarket/Provider/helpers/currencyHelper";

type Plan = {
  id?: string;
  title: string;
  description?: string;
  price: string;
  currency: string;
  delivery_time_value: string;
  delivery_time_unit: string;
  revision_window: string;
  revision_scope_rules: string;
  number_of_revisions: string;
};

type PlanSummaryCardProps = {
  plan: Plan;
  index: number;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
};

export default function PlanSummaryCard({
  plan,
  index,
  onEdit,
  onDelete,
}: PlanSummaryCardProps) {
  const { t } = useTranslation();

  const formatDelivery = (plan: Plan) => {
    if (!plan.delivery_time_value) return t("serviceMarket.myServices.plans.zeroDays");
    return `${plan.delivery_time_value} ${plan.delivery_time_unit || t("serviceMarket.myServices.plans.daysUnit")}`;
  };

  const formatPrice = (plan: Plan) => {
    if (!plan.price) return t("serviceMarket.myServices.plans.zeroPrice");
    const currencyLabel = plan.currency ? formatCurrency(t, plan.currency) : t("serviceMarket.myServices.plans.dollarSymbol");
    return `${plan.price} ${currencyLabel}`;
  };

  return (
    <div className="rounded-[12px] border bg-white px-5 py-5 transition-all border-grayBorder">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-[18px] font-semibold text-black">
            {plan.title}
          </h3>
          {(plan.description || plan.revision_scope_rules) && (
            <p className="mt-1 line-clamp-2 text-[14px] text-subTitleColor">
              {plan.description || plan.revision_scope_rules}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => onEdit(index)}
            className="text-[#007A5E] transition hover:opacity-80"
            aria-label={t("serviceMarket.myServices.plans.editPlan")}
          >
            <Pencil className="h-[17px] w-[17px]" strokeWidth={2.2} />
          </button>

          <button
            type="button"
            onClick={() => onDelete(index)}
            className="text-[#D92D20] transition hover:opacity-80"
            aria-label={t("serviceMarket.myServices.plans.deletePlan")}
          >
            <Trash2 className="h-[17px] w-[17px]" strokeWidth={2.2} />
          </button>
        </div>
      </div>

      <div className="mt-4 border-t border-[#E9ECEF] pt-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[14px] text-subTitleColor">
          <div className="flex items-center gap-2 ">
            <RefreshCcw className="h-4 w-4 text-[#0A7B61]" />
            <span className="">
              {t("serviceMarket.myServices.plans.revisionsLabel")}
              <span className="px-1 font-semibold text-[#344054] ">
                {plan.number_of_revisions}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-[#0A7B61]" />
            <span>
              {t("serviceMarket.myServices.plans.estimatedDelivery")}
              <span className="px-1 font-semibold text-[#344054]">
                {formatDelivery(plan)}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#0A7B61]" />
            <span>
              {t("serviceMarket.myServices.plans.requestModifications")}
              <span className="px-1 font-semibold text-[#344054]">
                {plan.revision_window}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <CircleDollarSign className="h-4 w-4 text-[#0A7B61]" />
            <span>
              {t("serviceMarket.myServices.plans.planPriceLabel")}
              <span className="px-1 text-[16px] font-bold text-[#007A5E]">
                {formatPrice(plan)}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
