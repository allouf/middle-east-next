'use client';

import { useState, useCallback, useEffect, ReactNode } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { message } from 'antd';
import { useAuth } from '@/lib/context/AuthContext';
import { useTranslation } from '@/lib/i18n/useTranslation';
import useFormData from '@/lib/Hooks/useFormData';
import usePostData from '@/lib/api/usePostData';
import { registerUser, registerCompany } from '@/shared/constants/urls';
import type { RegisterUserFormData, RegisterCompanyFormData, RegisterUserRequest, RegisterCompanyRequest, AccountType } from '../types';

// Step required fields for user registration
const USER_STEP_FIELDS: Record<number, string[]> = {
  1: ['name', 'contact'],
  2: ['country_code', 'region', 'region_name', 'password', 'confirm_password', 'agree_terms'],
};

// Step required fields for company registration
const COMPANY_STEP_FIELDS: Record<number, string[]> = {
  1: ['name', 'company_name', 'contact'],
  2: ['country_code', 'region', 'region_name', 'password', 'confirm_password'],
  3: ['agree_terms'],
};

export interface UseRegisterFormReturn {
  // Form state
  formData: Record<string, any>;
  handleChange: (field: string) => (input: any) => void;
  handleArrayChange: (field: string, value: any) => void;
  errors: Record<string, string>;
  handleAddError: (id: string, value: string) => void;
  isValid: boolean;
  showErrors: boolean;
  messageContext: ReactNode;
  
  // Step management
  currentStep: number;
  setCurrentStep: (step: number) => void;
  totalSteps: number;
  isCurrentStepValid: () => boolean;
  
  // Submission
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  loading: boolean;
  
  // Referral modal
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  handleAcceptRef: () => void;
  handleRejectRef: () => void;
}

export function useRegisterUserForm(): UseRegisterFormReturn {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { setAuthData } = useAuth();
  const locale = (params?.locale as string) || 'en';
  const [messageApi, contextHolder] = message.useMessage();

  const [currentStep, setCurrentStep] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [isReferralHandled, setIsReferralHandled] = useState(false);
  const [shouldSubmit, setShouldSubmit] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const ref = searchParams.get('ref');

  const {
    formData,
    handleChange,
    handleAddError,
    handleArrayChange: rawHandleArrayChange,
    isValid,
    errors,
  } = useFormData<RegisterUserFormData>();

  const handleArrayChange = (field: string, value: any) => {
    rawHandleArrayChange(field as keyof RegisterUserFormData, value);
  };

  const { postData, loading } = usePostData(registerUser);

  const handleAcceptRef = useCallback(() => {
    handleChange('ref_code')({ target: { value: ref } });
    setIsReferralHandled(true);
    setModalOpen(false);
    setShouldSubmit(true);
  }, [ref, handleChange]);

  const handleRejectRef = useCallback(() => {
    handleChange('ref_code')({ target: { value: '' } });
    setIsReferralHandled(true);
    setModalOpen(false);
    setShouldSubmit(true);
  }, [handleChange]);

  const isCurrentStepValid = useCallback(() => {
    const requiredFields = USER_STEP_FIELDS[currentStep] || [];
    const hasEmptyRequired = requiredFields.some(
      (field) => !formData[field as keyof RegisterUserFormData] || formData[field as keyof RegisterUserFormData] === ''
    );
    if (hasEmptyRequired) return false;
    const hasErrors = requiredFields.some((field) => errors?.[field]);
    return !hasErrors;
  }, [currentStep, formData, errors]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
      console.log('handleSubmit');

    if (e) e.preventDefault();

    if (!isCurrentStepValid()) {
      console.log('Invalid form data1');
      setShowErrors(true);
      messageApi.error(t('form.fill_required'));
      return;
    }

    if (ref && !isReferralHandled) {
        console.log('Invalid form data2');
      setModalOpen(true);
      return;
    }

    try {
      const payload: RegisterUserRequest = {
        name: formData.name,
        contact: formData.contact,
        password: formData.password,
        country_code: formData.country_code,
        region: formData.region_name || formData.region,
        ref_code: formData.ref_code,
      };

      postData(payload, {
        showMessage: false,
        onSuccess: (res: any) => {
          const userData = res?.data;
          const tokens = { access_token: '', refresh_token: '' };
          const user = {
            email: userData.email,
            is_verified: userData.is_verified ?? false,
            role: userData.role ?? 'consumer',
          };
          setAuthData({ tokens, user });  
          const contact = userData.email || formData.contact;
          const contactQuery = contact ? `?contact=${encodeURIComponent(contact)}` : '';
          router.push(`/${locale}/verify${contactQuery}`);
          messageApi.success(t('registrationSuccess'));
        },
      });
    } catch (err: any) {
      console.error('Registration failed:', err);
      messageApi.error(err?.response?.data?.message || t('registrationFailed'));
    }
  }, [formData, ref, isReferralHandled, postData, setAuthData, router, locale, t, messageApi]);

  // Auto-submit after referral handling
  useEffect(() => {
    if (shouldSubmit && isReferralHandled) {
      setShouldSubmit(false);
      handleSubmit();
    }
  }, [shouldSubmit, isReferralHandled, handleSubmit]);

  return {
    formData,
    handleChange,
    handleArrayChange,
    errors,
    handleAddError,
    isValid,
    showErrors,
    currentStep,
    setCurrentStep,
    totalSteps: 2,
    isCurrentStepValid,
    handleSubmit,
    loading,
    modalOpen,
    setModalOpen,
    handleAcceptRef,
    handleRejectRef,
    messageContext: contextHolder,
  };
}

export function useRegisterCompanyForm(): UseRegisterFormReturn {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { setAuthData } = useAuth();
  const locale = (params?.locale as string) || 'en';
  const [messageApi, contextHolder] = message.useMessage();

  const [currentStep, setCurrentStep] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [isReferralHandled, setIsReferralHandled] = useState(false);
  const [shouldSubmit, setShouldSubmit] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const ref = searchParams?.get('ref') || '';

  const {
    formData,
    handleChange,
    handleAddError,
    handleArrayChange: rawHandleArrayChange,
    isValid,
    errors,
  } = useFormData<RegisterCompanyFormData>();

  const handleArrayChange = (field: string, value: any) => {
    rawHandleArrayChange(field as keyof RegisterCompanyFormData, value);
  };

  const { postData, loading } = usePostData(registerCompany);

  const handleAcceptRef = useCallback(() => {
    handleChange('ref_code')({ target: { value: ref } });
    setIsReferralHandled(true);
    setModalOpen(false);
    setShouldSubmit(true);
  }, [ref, handleChange]);

  const handleRejectRef = useCallback(() => {
    handleChange('ref_code')({ target: { value: '' } });
    setIsReferralHandled(true);
    setModalOpen(false);
    setShouldSubmit(true);
  }, [handleChange]);

  const isCurrentStepValid = useCallback(() => {
    const requiredFields = COMPANY_STEP_FIELDS[currentStep] || [];
    const hasEmptyRequired = requiredFields.some(
      (field) => !formData[field as keyof RegisterCompanyFormData] || formData[field as keyof RegisterCompanyFormData] === ''
    );
    if (hasEmptyRequired) return false;
    const hasErrors = requiredFields.some((field) => errors?.[field]);
    return !hasErrors;
  }, [currentStep, formData, errors]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!isCurrentStepValid()) {
      setShowErrors(true);
      messageApi.error(t('form.fill_required'));
      return;
    }

    if (ref && !isReferralHandled) {
      setModalOpen(true);
      return;
    }

    try {
      const payload: RegisterCompanyRequest = {
        name: formData.name,
        contact: formData.contact,
        password: formData.password,
        country_code: formData.country_code,
        region: formData.region_name || formData.region,
        company_name: formData.company_name,
        registration_no: formData.registration_no,
        vat_tax_id: formData.vat_tax_id,
        // @ts-ignore
        logo: formData.logo,
        // @ts-ignore
        trade_license: formData.trade_license,
        website: formData.website,
        ref_code: formData.ref_code,
      };

      postData(payload, {
        showMessage: false,
        onSuccess: (res: any) => {
          const userData = res?.data;
          const user = {
            email: userData.email,
            is_verified: userData.is_verified ?? false,
            role: userData.role ?? 'consumer',
          };
          const tokens = { access_token: '', refresh_token: '' };
          setAuthData({ tokens, user });
          const contact = userData.email || formData.contact;
          const contactQuery = contact ? `?contact=${encodeURIComponent(contact)}` : '';
          router.push(`/${locale}/verify${contactQuery}`);
          messageApi.success(t('registrationSuccess'));
        },
      });
    } catch (err: any) {
      console.error('Registration failed:', err);
      messageApi.error(err?.response?.data?.message || t('registrationFailed') || t('errors.unknown'));
    }
  }, [formData, ref, isReferralHandled, postData, setAuthData, router, locale, t, messageApi]);

  // Auto-submit after referral handling
  useEffect(() => {
    if (shouldSubmit && isReferralHandled) {
      setShouldSubmit(false);
      handleSubmit();
    }
  }, [shouldSubmit, isReferralHandled, handleSubmit]);

  return {
    formData,
    handleChange,
    handleArrayChange,
    errors,
    handleAddError,
    isValid,
    showErrors,
    currentStep,
    setCurrentStep,
    totalSteps: 3,
    isCurrentStepValid,
    handleSubmit,
    loading,
    modalOpen,
    setModalOpen,
    handleAcceptRef,
    handleRejectRef,
    messageContext: contextHolder,
  };
}

export default useRegisterUserForm;






