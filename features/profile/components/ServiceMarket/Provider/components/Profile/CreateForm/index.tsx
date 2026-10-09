"use client";

import React, { useState } from 'react';
import StepIndicator from '@/components/ui/StepIndicator';
import CreateProviderProfileForm from './CreateProviderProfileForm';
import ProviderVerificationForm from './ProviderVerificationForm';
import HeaderForm from './HeaderForm';
import { useProviderProfile } from "../../../hooks/Profile/useProviderProfile";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useProviderApiStore } from '../../../../stores';

export const CreateForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;
  const { t } = useTranslation();
  const { reset: resetStore } = useProviderApiStore();

  const stepLabels = [
    'Provider Profile',
    'Verification'
  ];

  const profileUpdate = useProviderProfile({
    initial: {
      display_name: "",
      bio: "",
      country_code: "",
      region: "",
      language_ids: [],
      verification_notes: "",
    },
    required: {
      display_name: true,
      bio: true,
      identity_document: currentStep === 2,
      verification_notes: currentStep === 2,
    },
    onSuccess: () => {
      // Reset the store state when profile is successfully created
      resetStore();
    }
  });


  const handleFinish = async () => {
    const result = await profileUpdate.submitForm();
  };
  const handleCancel = () => {
    console.log('Form cancelled');
  };


  return (
    <div className='max-w-7xl mx-auto  my-6'>
      <HeaderForm />

      <StepIndicator
        step={currentStep}
        setStep={(nextStep: number) => {
          console.log("profileUpdate.isValid" , profileUpdate.isValid);
          profileUpdate.setIsSubmitted(true);
          profileUpdate.validate();
          if (!profileUpdate.isValid) {
            profileUpdate.setIsSubmitted(true);
            return;
          }
          setCurrentStep(nextStep);
        }}
        totalSteps={totalSteps}
        stepLabels={stepLabels}
        onCancel={handleCancel}
        onFinish={handleFinish}
        className="w-full my-6 relative overflow-hidden rounded-2xl border border-[#E9ECEF] bg-grayLight p-4 sm:p-6"
        classNameContent="py-6 "
        glow={<>
          <div className="pointer-events-none absolute -top-8 -start-8 h-24 w-24 rounded-full bg-[#00664f]/40 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-8 -end-8 h-24 w-24 rounded-full bg-[#00664f]/40 blur-2xl" />
        </>}
        hideSteps={true}
      >

        {currentStep === 1 && (
          <CreateProviderProfileForm
            profileUpdate={profileUpdate}
            errors={profileUpdate.errors}
            isSubmitted={profileUpdate.isSubmitted}
          />
        )}
        {currentStep === 2 && (
          <ProviderVerificationForm
            profileUpdate={profileUpdate}
            errors={profileUpdate.errors}
          />
        )}
      </StepIndicator>
    </div>
  )
}
