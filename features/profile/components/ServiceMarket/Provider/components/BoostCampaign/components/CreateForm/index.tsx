"use client";

import { useState, useCallback, useEffect } from "react";
import { Check } from "lucide-react";
import StepIndicator from "@/components/ui/StepIndicator";
import Button from "@/components/ui/Button";
import SectionTitle from "./SectionTitle";
import MainFormFields from "./MainFormFields";
import PlanSelect from "./PlanSelect";
import NoPlans from "./NoPlans";
import PaymentStep from "./Payment";
import { ServiceOffer } from "../../types/boostCampaign.types";
import { useBoostCampaign } from "../../../../hooks/BoostCampaign/useBoostCampaign";
import { boostCampaignService } from "../../../../services/boostCampaign.service";
import { useTranslation } from "@/lib/i18n/useTranslation";

export default function CreateBoostForm({ onClose, onPaymentConfirmed }: { onClose?: () => void; onPaymentConfirmed?: () => void }) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({ service: "", date: "", plan: "" });
  const [selectedService, setSelectedService] = useState<ServiceOffer | null>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const { createCampaign } = useBoostCampaign();

  const handleChange = useCallback((key: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Fetch plans when service is selected
  useEffect(() => {
    const fetchPlans = async () => {
      setLoadingPlans(true);
      try {
        const response = await boostCampaignService.getBoostPlans({
          showMessage: false,
        });

        if (response?.data?.boost_plans) {
          setPlans(response.data.boost_plans);
          // Auto-select first plan if available
          if (response.data.boost_plans.length > 0) {
            handleChange("plan", response.data.boost_plans[0].id.toString());
          }
        } else {
          setPlans([]);
        }
      } catch (error) {
        console.error("Failed to fetch boost plans:", error);
        setPlans([]);
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchPlans();
  }, [handleChange]);

  const handleServiceSelect = useCallback((service: ServiceOffer | null) => {
    setSelectedService(service);
  }, []);

  const handleStepChange = (nextStep: number) => {
    setCurrentStep(nextStep);
  };

  const handleSubmit = async () => {
    // Validate form before proceeding
    if (!form.service || !form.plan) {
      console.log("Validation failed", {
        service: form.service,
        plan: form.plan,
      });
      return; // Don't proceed if form is incomplete
    }

    console.log("Submitting campaign data", {
      service_offer_id: form.service,
      boost_plan_id: form.plan,
    });

    // Submit form data using the hook
    const result = await createCampaign({
      service_offer_id: form.service,
      boost_plan_id: form.plan,
    });

    if (result.ok) {
      // Proceed to payment step on success
      handleStepChange(2);
    } else {
      console.error("Campaign creation failed", result.error);
    }
  };

  const handleConfirmPayment = () => {
    // Handle payment confirmation
    console.log("Payment confirmed", form);
    onPaymentConfirmed?.();
  };

  const getPlanPrice = () => {
    if (!plans || plans.length === 0) return "0.00";
    const selectedPlan = plans.find(p => String(p.id) === String(form.plan));
    return selectedPlan ? `${selectedPlan.currency} ${selectedPlan.base_price}` : "0.00";
  };

  const stepLabels = [
    "Boost Details",
    "Payment",
  ];
  const renderStepContent = () => {
    if (currentStep === 1) {
      const selectedPlan = plans.find(p => String(p.id) === String(form.plan));
      return (
        <div className=" gap-6 lg:gap-8 space-y-12">
          <MainFormFields form={form} onChange={handleChange} onServiceSelect={handleServiceSelect} selectedPlan={selectedPlan} />
          {loadingPlans ? (
            <div className="grid gap-4 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 animate-pulse rounded-[20px] bg-gray-200" />
              ))}
            </div>
          ) : plans && plans.length > 0 ? (
            <PlanSelect
              value={form.plan}
              onChange={(v) => handleChange("plan", v)}
              plans={plans}
            />
          ) : (
            <NoPlans />
          )}
        </div>
      );
    }

    if (currentStep === 2) {
      return (
        <PaymentStep
          planPrice={getPlanPrice()}
          onConfirm={handleConfirmPayment}
          onCancel={onClose}
        />
      );
    }

    return null;
  };

  return (
    <section className="min-h-screen px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        <SectionTitle onBack={onClose} />
        <div className="mx-auto max-w-6xl">
          <StepIndicator
            step={currentStep}
            setStep={handleStepChange}
            totalSteps={2}
            stepLabels={stepLabels}
            onCancel={onClose}
            onFinish={handleConfirmPayment}
            hideSteps={true}
            hideButton={true}
          >
            {renderStepContent()}
          </StepIndicator>
        </div>
        {/* Action Buttons */}
        <div className="flex w-full flex-col sm:flex-row gap-3 justify-center items-center pt-5 mt-auto pb-2">
          {currentStep === 1 && (
            <div className="flex flex-col gap-3 items-center justify-center w-full ">
              <Button
                scale={1.03}
                type="button"
                onClick={handleSubmit}
                unstyled
                disabled={loadingPlans || !form.plan || !plans || plans.length === 0}
                addDisableStyle={true}
                className="bg-blueBtn text-textWhiteColor px-5 py-2 rounded-lg transition hover:bg-blueSiteHover w-full sm:w-[240px]"
              >
                <span className="flex items-center justify-center gap-2">
                  {loadingPlans
                    ? t("common.loading", { defaultValue: "Loading..." })
                    : t("serviceMarket.boostCampaign.create.confirmProceed", { defaultValue: "Confirm & Proceed" })}
                  {!loadingPlans && <Check className="w-5 h-5" />}
                </span>
              </Button>
              {onClose && (
                <Button
                  scale={1.03}
                  type="button"
                  onClick={onClose}
                  unstyled
                  className="text-textColor text-lg hover:text-subTitleColor transition-colors bg-transparent border-none cursor-pointer font-bold px-4 min-w-[140px] text-center"
                >
                  {t("common.cancel", { defaultValue: "Cancel" })}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
