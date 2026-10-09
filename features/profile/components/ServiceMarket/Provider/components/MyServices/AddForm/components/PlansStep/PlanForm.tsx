import React from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectFiled";
import { AlertCircle } from "lucide-react";
import { getCurrencyOptions } from "@/features/profile/components/ServiceMarket/Provider/helpers/currencyHelper";

type Plan = {
  id?: string;
  title: string;
  price: string;
  currency: string;
  delivery_time_value: string;
  delivery_time_unit: string;
  revision_window: string;
  revision_scope_rules: string;
  number_of_revisions: string;
};

type PlanFormProps = {
  newPlan: Plan;
  editingIndex: number | null;
  onPlanChange: (plan: Plan) => void;
};

export default function PlanForm({
  newPlan,
  editingIndex,
  onPlanChange,
}: PlanFormProps) {
  const { t } = useTranslation();

  const deliveryTimeUnits = [
    { id: "minutes", label: t("time.minutes") },
    { id: "hours", label: t("time.hours") },
    { id: "days", label: t("time.days") },
    // { id: "weeks", label: t("time.weeks") },
  ];

  const currencies = getCurrencyOptions(t);

  const updatePlanField = (key: keyof Plan, value: string) => {
    onPlanChange({ ...newPlan, [key]: value });
  };

  return (
    <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.05fr]">
      <div className="space-y-5">
        <InputField
          id={`planTitle-${editingIndex !== null ? editingIndex : 'new'}`}
          label={t("serviceMarket.myServices.plans.planTitle")}
          placeholder={t("serviceMarket.myServices.plans.planTitlePlaceholder")}
          value={newPlan.title}
          onChange={(e: any) => updatePlanField("title", e.target.value)}
          withFieldset
          required
        />

        <InputField
          id={`planPrice-${editingIndex !== null ? editingIndex : 'new'}`}
          label={t("serviceMarket.myServices.plans.planPrice")}
          placeholder={t("serviceMarket.myServices.plans.planPricePlaceholder")}
          value={newPlan.price}
          onChange={(e: any) => updatePlanField("price", e.target.value)}
          withFieldset
          type="numric"
          required
        />

        <SelectField
          id={`currency-${editingIndex !== null ? editingIndex : 'new'}`}
          label={t("serviceMarket.myServices.plans.currency")}
          placeholder={t("serviceMarket.myServices.plans.currencyPlaceholder")}
          value={newPlan.currency}
          onChange={(e: any) => updatePlanField("currency", e.target.value)}
          selectorOptions={currencies}
          labelName="label"
          withFieldset
          required
        />
        
        <InputField
          id={`estimatedDeliveryTime-${editingIndex !== null ? editingIndex : 'new'}`}
          label={t("serviceMarket.myServices.plans.estimatedDeliveryTime")}
          placeholder={t("serviceMarket.myServices.plans.estimatedDeliveryTimePlaceholder")}
          value={newPlan.delivery_time_value}
          onChange={(e: any) => updatePlanField("delivery_time_value", e.target.value)}
          withFieldset
          type="numric"
          // min={0}
          conditions={{ number: { min: 0, message: t("serviceMarket.myServices.plans.deliveryTimeError") } }}
          validate
          required
        />

        <SelectField
          id={`deliveryTimeUnit-${editingIndex !== null ? editingIndex : 'new'}`}
          label={t("serviceMarket.myServices.plans.deliveryTimeUnit")}
          placeholder={t("serviceMarket.myServices.plans.deliveryTimeUnitPlaceholder")}
          value={newPlan.delivery_time_unit}
          onChange={(e: any) => updatePlanField("delivery_time_unit", e.target.value)}
          selectorOptions={deliveryTimeUnits}
          labelName="label"
          withFieldset
          required
        />

        <InputField
          id={`revisionWindow-${editingIndex !== null ? editingIndex : 'new'}`}
          label={t("serviceMarket.myServices.plans.revisionWindow")}
          placeholder={t("serviceMarket.myServices.plans.revisionWindowPlaceholder")}
          value={newPlan.revision_window}
          onChange={(e: any) => updatePlanField("revision_window", e.target.value)}
          withFieldset
          type="numric"
          min={0}
          conditions={{ number: { min: 0, message: t("serviceMarket.myServices.plans.revisionWindowError") } }}
          validate
          required
        />

        <InputField
          id={`numberOfReviews-${editingIndex !== null ? editingIndex : 'new'}`}
          label={t("serviceMarket.myServices.plans.numberOfReviews")}
          placeholder={t("serviceMarket.myServices.plans.numberOfReviewsPlaceholder")}
          value={newPlan.number_of_revisions}
          onChange={(e: any) => updatePlanField("number_of_revisions", e.target.value)}
          withFieldset
          type="numric"
          min={0}
          conditions={{ number: { min: 0, message: t("serviceMarket.myServices.plans.numberOfReviewsError") } }}
          validate
          required
        />
      </div>

      <div className="flex h-full flex-col">
        <div className="flex-1">
          <InputField
            id={`revisionScopeRules-${editingIndex !== null ? editingIndex : 'new'}`}
            label={t("serviceMarket.myServices.plans.revisionScopeRules")}
            placeholder={t("serviceMarket.myServices.plans.revisionScopeRulesPlaceholder")}
            value={newPlan.revision_scope_rules}
            onChange={(e: any) => updatePlanField("revision_scope_rules", e.target.value)}
            type="textarea"
            rows={15}
            withFieldset
            required
          />
        </div>

        <div className="mt-5 rounded-[12px] border border-[#F1E0A5] bg-[#FFF9E8] px-4 py-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-[#F8E9A8] text-[#C7A600]">
              <AlertCircle className="h-5 w-5" />
            </div>

            <div>
              <p className="text-[14px] font-semibold text-[#1F2937]">
                {t("serviceMarket.myServices.plans.majorScopeChange")}
              </p>
              <p className="mt-1 text-[13px] leading-5 text-[#667085]">
                {t("serviceMarket.myServices.plans.majorScopeChangeDescription")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
