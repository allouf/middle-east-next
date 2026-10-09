"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { App } from "antd";
import StepIndicator from "@/components/ui/StepIndicator";
import FormHeader from "./components/FormHeader";
import BasicInfoStep from "./components/BasicInfoStep";
import PlansStep from "./components/PlansStep";
import FAQsStep from "./components/FAQsStep";
import AvailabilityStep from "./components/AvailabilityStep";
import { useProviderService } from "../../../hooks/Service/useProviderService";
import { ServiceFormState } from "../../../hooks/Service/useServiceForm";

interface AddFormProps {
  onBack?: () => void;
  serviceId?: number;
  initialData?: Partial<ServiceFormState>;
  onSuccess?: () => void;
}

type StepItem = {
  key: string;
  label: string;
  translationKey?: string;
};

type Option = {
  label: string;
  value: string;
};

export default function AddForm({ onBack, serviceId, initialData, onSuccess }: AddFormProps = {}) {
  const [currentStep, setCurrentStep] = useState(1);
  const { message } = App.useApp();
  const serviceForm = useProviderService({
    initial: initialData,
    required: {
      title: true,
      description: true,
      category: true,
      planTitle: true,
      planPrice: true,
    },
    onSuccess: () => {
      // Handle successful submission - refetch table data
      onSuccess?.();
    }
  });

  const { t } = useTranslation();

  const steps: StepItem[] = [
    { key: "basic", label: t("serviceMarket.myServices.steps.basicInfo"), translationKey: "serviceMarket.myServices.steps.basicInfo" },
    { key: "plans", label: t("serviceMarket.myServices.steps.plans"), translationKey: "serviceMarket.myServices.steps.plans" },
    { key: "faqs", label: t("serviceMarket.myServices.steps.faqs"), translationKey: "serviceMarket.myServices.steps.faqs" },
    { key: "availability", label: t("serviceMarket.myServices.steps.availability"), translationKey: "serviceMarket.myServices.steps.availability" },
  ];

  const stepLabels = [
    t("serviceMarket.myServices.steps.basicInfo"),
    t("serviceMarket.myServices.steps.plans"),
    t("serviceMarket.myServices.steps.faqs"),
    t("serviceMarket.myServices.steps.availability"),
  ];

  const serviceTypeOptions = [
    { value: 'fixed_price', label: t('serviceMarket.myServices.serviceTypes.fixed_price') },
    { value: 'hourly', label: t('serviceMarket.myServices.serviceTypes.hourly') },
    { value: 'project_based', label: t('serviceMarket.myServices.serviceTypes.project_based') },
    { value: 'retainer', label: t('serviceMarket.myServices.serviceTypes.retainer') },
    { value: 'package', label: t('serviceMarket.myServices.serviceTypes.package') },
    { value: 'subscription', label: t('serviceMarket.myServices.serviceTypes.subscription') }
  ];

  const deliveryModelOptions = [
    { value: 'remote', label: t('serviceMarket.myServices.deliveryTypes.remote') },
    { value: 'on_site', label: t('serviceMarket.myServices.deliveryTypes.onsite') },
    { value: 'hybrid', label: t('serviceMarket.myServices.deliveryTypes.hybrid') },
    { value: 'in_person', label: t('serviceMarket.myServices.deliveryTypes.inperson') }
  ];

  const getStepFromErrors = () => {
    const errors = serviceForm.errors || {};
    const basicKeys = ["title", "service_category_id", "type", "delivery_model", "description", "cover", "media"];

    if (Object.keys(errors).some((key) => basicKeys.includes(key))) return 1;
    if (errors.plans) return 2;
    if (errors.faqs) return 3;
    if (errors.available_slots) return 4;

    return currentStep;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep
            form={serviceForm.formData}
            serviceForm={serviceForm}
            serviceTypeOptions={serviceTypeOptions}
            deliveryModelOptions={deliveryModelOptions}
            isSubmitted={serviceForm.isSubmitted}
          />
        );
      case 2:
        return <PlansStep form={serviceForm.formData} serviceForm={serviceForm} isSubmitted={serviceForm.isSubmitted} />;
      case 3:
        return <FAQsStep form={serviceForm.formData} serviceForm={serviceForm} isSubmitted={serviceForm.isSubmitted} />;
      case 4:
        return <AvailabilityStep form={serviceForm.formData} serviceForm={serviceForm} isSubmitted={serviceForm.isSubmitted} />;
      default:
        return null;
    }
  };

  const handleFinish = async () => {
    try {
      const result = await serviceForm.submitBasic(serviceId);
      if (result.ok) {
        onSuccess?.();
        onBack?.();
        return;
      }

      setCurrentStep(getStepFromErrors());

      if (result.error) {
        message.error(t(result.error, { defaultValue: result.error }));
        return;
      }

      message.error(serviceForm.error || t("common.error", { defaultValue: "Something went wrong" }));
    } catch (error) {
      console.error("Error submitting service:", error);
      message.error(t("common.error", { defaultValue: "Something went wrong" }));
    }
  };

  const handleCancel = () => {
    onBack?.();
  };

  return (
    <section className="min-h-screen  px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <FormHeader
          steps={steps}
          currentStep={currentStep - 1}
          onBack={handleCancel}
        />

        <StepIndicator
          step={currentStep}
          setStep={(nextStep: number) => {
            serviceForm.setIsSubmitted(true);
            if (!serviceForm.isValid) {
              serviceForm.setIsSubmitted(true);
              return;
            }
            setCurrentStep(nextStep);
          }}
          totalSteps={4}
          stepLabels={stepLabels}
          onCancel={handleCancel}
          onFinish={handleFinish}
          loading={serviceForm.loading}
          className="min-h-[600px]"
          hideSteps={true}
        >
          {renderStepContent()}
        </StepIndicator>
      </div>
    </section>
  );
}