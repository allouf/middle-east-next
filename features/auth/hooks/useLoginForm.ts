'use client';

import { useState, useCallback, FormEvent, ReactNode, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { message } from 'antd';
import { AxiosError } from 'axios';
import { useAuth } from '@/lib/context/AuthContext';
import { playErrorSound } from '@/lib/utils/playSound';
import { useTranslation } from '@/lib/i18n/useTranslation';
import useFormData from '@/lib/Hooks/useFormData';
import type { LoginFormData, ErrorMapKey } from '../types';
import { ERROR_MAP } from '../types';

const initialFormState: LoginFormData = {
  contact: '',
  password: '',
};

export interface UseLoginFormReturn {
  formData: LoginFormData;
  handleChange: (field: string) => (input: any) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  loading: boolean;
  showErrors: boolean;
  isValid: boolean;
  errors: Record<string, string>;
  handleAddError: (id: string, value: string) => void;
  messageContext: ReactNode;
}

export function useLoginForm(): UseLoginFormReturn {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [messageApi, contextHolder] = message.useMessage();
  
  const { formData, handleChange, isValid, errors, handleAddError } =
    useFormData<LoginFormData>(initialFormState);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [showErrors, setShowErrors] = useState<boolean>(false);

  // Prefill from URL query (?email=&password=)
  useEffect(() => {
    const emailOrPhone = searchParams.get("email") || searchParams.get("contact") || "";
    const password = searchParams.get("password") || "";

    if (emailOrPhone || password) {
      handleChange("contact")({
        target: { value: emailOrPhone },
      });
      handleChange("password")({
        target: { value: password },
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!isValid) {
      setShowErrors(true);
      return;
    }

    try {
      setLoading(true);
      const user = await login(formData.contact, formData.password);

      messageApi.success(t("loginSuccess"));

      if (user?.is_verified === false || user?.is_verified === "false") {
        const search = new URLSearchParams({
          contact: user.email || formData.contact,
        }).toString();
        router.push(`/verify?${search}`);
      } else {
        router.push('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      playErrorSound();

      // Type-safe Axios error handling
      const axiosError = err as AxiosError<{ message?: string }>;
      const backendMessage = axiosError.response?.data?.message as ErrorMapKey | undefined;
      const isNetworkError = axiosError.code === "ERR_NETWORK";

      const errorKey = isNetworkError
        ? "errors.network"
        : (backendMessage && ERROR_MAP[backendMessage]) || "errors.unknown";

      messageApi.error(t(errorKey) || t("loginFailed"));
    } finally {
      setLoading(false);
    }
  }, [formData, isValid, login, router, t, messageApi]);

  return {
    formData,
    handleChange,
    handleSubmit,
    loading,
    showErrors,
    isValid,
    errors,
    handleAddError,
    messageContext: contextHolder,
  };
}

export default useLoginForm;

