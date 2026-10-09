'use client';

import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { message } from 'antd';
import { useTranslation } from '@/lib/i18n/useTranslation';
import useFormData from '@/lib/Hooks/useFormData';
import usePostData from '@/lib/api/usePostData';
import { ResetPasswordUrl } from '@/shared/constants/urls';
import type { ResetPasswordFormData } from '../types';

export interface UseResetPasswordReturn {
  formData: ResetPasswordFormData;
  handleChange: (field: string) => (input: any) => void;
  handleAddError: (id: string, value: string) => void;
  errors: Record<string, string>;
  isValid: boolean;
  showErrors: boolean;
  handleSubmit: (e?: FormEvent<HTMLFormElement>) => Promise<void>;
  loading: boolean;
  passwordStrength: number;
  passwordSuggestions: string[];
  messageContext: ReactNode;
}

const analyzePassword = (password: string) => {
  let strength = 0;
  const suggestions: string[] = [];

  if (password?.length >= 8) strength++;
  else suggestions.push('auth.pass_conditions.condition_1');

  if (/[A-Z]/.test(password)) strength++;
  else suggestions.push('auth.pass_conditions.condition_2');

  if (/[a-z]/.test(password)) strength++;
  else suggestions.push('auth.pass_conditions.condition_3');

  if (/[0-9]/.test(password)) strength++;
  else suggestions.push('auth.pass_conditions.condition_4');

  if (/[^A-Za-z0-9]/.test(password)) strength++;
  else suggestions.push('auth.pass_conditions.condition_5');

  return { strength, suggestions };
};

export function useResetPassword(): UseResetPasswordReturn {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const contactParam = searchParams?.get('contact') || '';
  const resetTokenParam = searchParams?.get('reset_token') || '';
  const [messageApi, contextHolder] = message.useMessage();

  const {
    formData,
    handleChange,
    handleAddError,
    isValid,
    errors,
    setFormData,
  } = useFormData<ResetPasswordFormData>({
    contact: contactParam,
    reset_token: resetTokenParam,
    new_password: '',
    new_password_confirmation: '',
  });

  const { postData, loading } = usePostData(ResetPasswordUrl);
  const [showErrors, setShowErrors] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordSuggestions, setPasswordSuggestions] = useState<string[]>([]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      contact: contactParam,
      reset_token: resetTokenParam,
    }));
  }, [contactParam, resetTokenParam, setFormData]);

  useEffect(() => {
    const { strength, suggestions } = analyzePassword(formData.new_password || '');
    setPasswordStrength(strength);
    setPasswordSuggestions(suggestions);
  }, [formData.new_password]);

  const handleSubmit = useCallback(
    async (e?: FormEvent<HTMLFormElement>) => {
      if (e) e.preventDefault();

      if (!isValid) {
        setShowErrors(true);
        return;
      }

      await postData(
        {
          ...formData,
          contact: contactParam,
          reset_token: resetTokenParam,
        },
        {
          showMessage: false,
          onSuccess: () => {
            messageApi.success(
              t('auth.buttons.recovery_password')
            );
            router.push('/login');
          },
          onError: () => {
            messageApi.error(t('errors.unknown'));
          },
        }
      );
    },
    [contactParam, formData, isValid, messageApi, postData, resetTokenParam, router, t]
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
    passwordStrength,
    passwordSuggestions,
    messageContext: contextHolder,
  };
}

export default useResetPassword;
