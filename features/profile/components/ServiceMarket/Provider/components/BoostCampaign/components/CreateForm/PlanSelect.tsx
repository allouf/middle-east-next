"use client";

import { Radio, ConfigProvider } from "antd";
import { useState, useEffect } from "react";
import { RefreshCw, Clock, Layers } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { ServicePlan } from "../../types/boostCampaign.types";

interface Plan {
  id: string;
  title: string;
  price: string;
  range: string;
  type: string;
  duration: string;
  recommended?: boolean;
}

interface BoostPlan {
  id: number;
  name: string;
  base_price: string;
  currency: string;
  duration_days: number;
  targeting: {
    show_sponsored_badge: boolean;
    search_rank_multiplier: number;
  };
  is_active: boolean;
}

interface PlanSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  plans?: BoostPlan[];
}

export default function PlanSelect({ value, onChange, plans: apiPlans = [] }: PlanSelectProps) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string>(value || (apiPlans[0]?.id?.toString() || ""));

  useEffect(() => {
    if (value) {
      setSelected(value);
    } else if (apiPlans.length > 0) {
      setSelected(apiPlans[0].id.toString());
    }
  }, [value, apiPlans]);
  const plans: Plan[] = apiPlans.map((plan, index) => ({
    id: plan.id.toString(),
    title: plan.name,
    price: `${plan.currency} ${plan.base_price}`,
    range: plan.targeting?.search_rank_multiplier ? `${(plan.targeting.search_rank_multiplier * 100).toFixed(0)}x Boost` : "Standard",
    type: plan.targeting?.show_sponsored_badge ? "Sponsored" : "Standard",
    duration: `${plan.duration_days} Days`,
    recommended: index === 1 && apiPlans.length > 1,
  }));

  const handleChange = (v: string) => {
    setSelected(v);
    onChange?.(v);
  };

  const featureRows = (
    plan: Plan
  ): { id: string; icon: typeof RefreshCw; label: string; value: string }[] => [
      {
        id: "range",
        icon: RefreshCw,
        label: t("serviceMarket.boostCampaign.create.targetingRange", { defaultValue: "Targeting range" }),
        value: plan.range,
      },
      {
        id: "type",
        icon: Layers,
        label: t("serviceMarket.boostCampaign.create.type", { defaultValue: "Type" }),
        value: plan.type,
      },
      {
        id: "duration",
        icon: Clock,
        label: t("serviceMarket.boostCampaign.create.duration", { defaultValue: "Duration" }),
        value: plan.duration,
      },
    ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {plans.map((plan) => {
        const isSelected = selected === plan.id;
        return (
          <label
            key={plan.id}
            className={`relative flex cursor-pointer flex-col rounded-[20px] border bg-white px-4 py-5 transition-all duration-200 ease-in-out ${isSelected
                ? "border-2 border-blueSite bg-blueSite/12 shadow-[0_20px_40px_rgba(33,85,62,0.25)]"
                : "border-2 border-[#BFC9C4] bg-white hover:border-lightGreen/50"
              }`}
          >
            {plan.recommended && (
              <span className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-lightGreen bg-blueSite px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white shadow-sm">
                {t("serviceMarket.boostCampaign.create.recommended", { defaultValue: "Recommended" })}
              </span>
            )}

            <div className="flex items-start justify-between gap-4 border-b border-grayLight2 pb-5">
              <div>
                <p className="text-lg font-semibold text-[#1A1A1A]">{plan.title}</p>
                <p className={`text-3xl font-semibold ${isSelected ? "text-lightGreen" : "text-[#0F172A]"}`}>{plan.price}</p>
              </div>
              <div className="pt-1">
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: isSelected ? "#00664f" : "#878585",
                    },
                  }}
                >
                  <Radio
                    checked={isSelected}
                    onChange={() => handleChange(plan.id)}
                  />
                </ConfigProvider>
              </div>
            </div>

            <div className="mt-6 space-y-3 text-sm text-[#475569]">
              {featureRows(plan).map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.id} className="flex items-center gap-2">
                    <Icon size={16} className="text-lightGreen" />
                    <span>
                      {feature.label} <b className="text-[#0F172A]">{feature.value}</b>
                    </span>
                  </div>
                );
              })}
            </div>
          </label>
        );
      })}
    </div>
  );
}
