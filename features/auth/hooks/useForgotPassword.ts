'use client';

import { useCallback, useState, type FormEvent, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { message } from 'antd';
import { useTranslation } from '@/lib/i18n/useTranslation';
import useFormData from '@/lib/Hooks/useFormData';
import usePostData from '@/lib/api/usePostData';
import { passwordForget } from '@/shared/constants/urls';
import type { ForgotPasswordFormData } from '../types';

export interface UseForgotPasswordReturn {
  formData: ForgotPasswordFormData;
  handleChange: (field: string) => (input: any) => void;
  handleAddError: (id: string, value: string) => void;
  errors: Record<string, string>;
  isValid: boolean;
  showErrors: boolean;
  handleSubmit: (e?: FormEvent<HTMLFormElement>) => Promise<void>;
  loading: boolean;
  messageContext: ReactNode;
}

const INITIAL_STATE: ForgotPasswordFormData = {
  contact: '',
};

export function useForgotPassword(): UseForgotPasswordReturn {
  const { t } = useTranslation();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  const {
    formData,
    handleChange,
    handleAddError,
    isValid,
    errors,
  } = useFormData<ForgotPasswordFormData>(INITIAL_STATE);

  const { postData, loading } = usePostData(passwordForget);
  const [showErrors, setShowErrors] = useState(false);

  const handleSubmit = useCallback(
    async (e?: FormEvent<HTMLFormElement>) => {
      if (e) e.preventDefault();

      if (!isValid) {
        setShowErrors(true);
        return;
      }

      await postData(
        { contact: formData.contact },
        {
          showMessage: false,
          onSuccess: () => {
            messageApi.success(
              t('auth.sent_verification')
            );
        router.push(`/verification-code?contact=${formData.contact}`);
          },
          onError: () => {
            messageApi.error(t('errors.unknown'));
          },
        }
      );
    },
    [formData.contact, isValid, messageApi, postData, router, t]
  );

  return {
    formData,
    handleChange,
    handleAddError,
    errors,
    isValid,
    showErrors,
    handleSubmit,
    loading,
    messageContext: contextHolder,
  };
}

export default useForgotPassword;
