"use client";

import React, { useState } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import PlanSummaryCard from "./PlansStep/PlanSummaryCard";
import PlanForm from "./PlansStep/PlanForm";
import PlanActions from "./PlansStep/PlanActions";


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

type PlansStepProps = {
  form: {
    plans: Plan[];
  };
  serviceForm: any;
  isSubmitted: boolean;
};

const MAX_PLANS = 5;

const DEFAULT_PLAN: Plan = {
  title: "",
  price: "",
  currency: "",
  delivery_time_value: "",
  delivery_time_unit: "",
  revision_window: "",
  revision_scope_rules: "",
  number_of_revisions: "",
};

export default function PlansStep({
  form,
  serviceForm,
  isSubmitted,
}: PlansStepProps) {
  const { t } = useTranslation();
  const [newPlan, setNewPlan] = useState<Plan>(DEFAULT_PLAN);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAddPlan = () => {
    if (newPlan.title.trim()) {
      serviceForm.setPlans([...form.plans, { ...newPlan, id: Date.now().toString() }]);
      setNewPlan(DEFAULT_PLAN);
    }
  };

  const handleEditPlan = (index: number) => {
    setEditingIndex(index);
    setNewPlan(form.plans[index]);
  };

  const handleUpdatePlan = () => {
    if (editingIndex !== null && newPlan.title.trim()) {
      const updatedPlans = [...form.plans];
      updatedPlans[editingIndex] = { ...newPlan, id: form.plans[editingIndex].id };
      serviceForm.setPlans(updatedPlans);
      setEditingIndex(null);
      setNewPlan(DEFAULT_PLAN);
    }
  };

  const handleDeletePlan = (index: number) => {
    const updatedPlans = form.plans.filter((_, i) => i !== index);
    serviceForm.setPlans(updatedPlans);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setNewPlan(DEFAULT_PLAN);
  };


  return (
    <div className="space-y-5">
      <div className="space-y-4">
        {form.plans?.map((plan, index) => (
          <PlanSummaryCard
            key={plan.id || index}
            plan={plan}
            index={index}
            onEdit={handleEditPlan}
            onDelete={handleDeletePlan}
          />
        ))}
      </div>

      <div className="relative overflow-hidden rounded-[22px] space-y-4 border border-[#DDE3E7] bg-[#FCFCFD] p-5 md:p-6">
        <div className="pointer-events-none absolute inset-0  rounded-[22px] shadow-[0_0_90px_rgba(53,208,182,0.12)_inset]" />
        
        {!form.plans?.length && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-textColor">
              {t("serviceMarket.myServices.plans.addFirstPlan")}
            </h2>
          </div>
        )}
        
        <PlanForm
          newPlan={newPlan}
          editingIndex={editingIndex}
          onPlanChange={setNewPlan}
        />


        <PlanActions
          editingIndex={editingIndex}
          onAddPlan={handleAddPlan}
          onUpdatePlan={handleUpdatePlan}
          onCancelEdit={handleCancelEdit}
        />

        </div>
    </div>
  );
}