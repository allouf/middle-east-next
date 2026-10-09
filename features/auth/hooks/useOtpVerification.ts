'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { message } from 'antd';
import { useTranslation } from '@/lib/i18n/useTranslation';
import usePostData from '@/lib/api/usePostData';

export interface UseOtpVerificationOptions {
  contact?: string | null;
  verifyEndpoint: string;
  resendEndpoint: string;
  timerKey: string;
  initialDuration?: number;
  onVerified?: (response?: any) => void;
}

export interface UseOtpVerificationReturn {
  otp: string[];
  timeLeft: number;
  verifying: boolean;
  sendingOtp: boolean;
  statusMessage: string;
  verifyError: any;
  messageContext: ReactNode;
  handleChange: (value: string, index: number) => void;
  handleKeyDown: (event: KeyboardEvent<HTMLInputElement>, index: number) => void;
  handleVerify: (e?: FormEvent<HTMLFormElement>) => Promise<void>;
  handleResend: () => Promise<void>;
  formatTime: (seconds?: number) => string;
}

export function useOtpVerification({
  contact,
  verifyEndpoint,
  resendEndpoint,
  timerKey,
  initialDuration = 600,
  onVerified,
}: UseOtpVerificationOptions): UseOtpVerificationReturn {
  const { t } = useTranslation();
  const contactValue = contact || '';
  const otpSentRef = useRef(false);
  const storageKey = contactValue ? `${timerKey}_${contactValue}` : timerKey;
  const [messageApi, contextHolder] = message.useMessage();

  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [timeLeft, setTimeLeft] = useState(() =>
    contactValue ? initialDuration : 0
  );
  const [statusMessage, setStatusMessage] = useState('');

  const {
    postData: verifyOtp,
    loading: verifying,
    error: verifyError,
  } = usePostData(verifyEndpoint);

  const { postData: sendOtp, loading: sendingOtp } = usePostData(resendEndpoint);

  useEffect(() => {
    otpSentRef.current = false;
    setOtp(Array(6).fill(''));
    setStatusMessage('');
    setTimeLeft(contactValue ? initialDuration : 0);
  }, [contactValue, initialDuration]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!contactValue) {
      setTimeLeft(0);
      return;
    }

    const savedExpiry = localStorage.getItem(storageKey);
    const now = Date.now();
    const remaining = savedExpiry
      ? Math.floor((Number(savedExpiry) - now) / 1000)
      : 0;

    if (savedExpiry && remaining > 0) {
      setTimeLeft(remaining);
      otpSentRef.current = true;
      return;
    }

    // Expired or no existing timer: reset and send a fresh OTP once
    if (savedExpiry) {
      localStorage.removeItem(storageKey);
    }
    if (otpSentRef.current) return;

    otpSentRef.current = true;
    const expiryTime = Date.now() + initialDuration * 1000;
    localStorage.setItem(storageKey, expiryTime.toString());
    setTimeLeft(initialDuration);
    sendOtp(
      { contact: contactValue },
      {
        showMessage: false,
        onSuccess: () => setStatusMessage('auth.sent_verification'),
      }
    );
  }, [contactValue, initialDuration, resendEndpoint, sendOtp, storageKey]);

  useEffect(() => {
    if (timeLeft <= 0 || !contactValue) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 0 && typeof window !== 'undefined') {
          localStorage.removeItem(storageKey);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [contactValue, storageKey, timeLeft]);

  const formatTime = useCallback(
    (seconds: number = timeLeft) => {
      const safeSeconds = Math.max(0, seconds);
      const m = Math.floor(safeSeconds / 60)
        .toString()
        .padStart(2, '0');
      const s = (safeSeconds % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
    },
    [timeLeft]
  );

  const focusInput = (index: number) => {
    if (typeof document === 'undefined') return;
    const input = document.getElementById(`otp-${index}`) as HTMLInputElement | null;
    input?.focus();
  };

  const handleChange = useCallback(
    (value: string, index: number) => {
      if (/^[0-9]?$/.test(value)) {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < otp.length - 1) {
          focusInput(index + 1);
        }
      }
    },
    [otp]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>, index: number) => {
      if (e.key === 'Backspace' && !otp[index] && index > 0) {
        focusInput(index - 1);
      }
    },
    [otp]
  );

  const handleVerify = useCallback(
    async (e?: FormEvent<HTMLFormElement>) => {
      if (e) e.preventDefault();

      if (!contactValue) {
        messageApi.warning(t('auth.contact_required'));
        return;
      }

      const code = otp.join('');
      if (code.length !== 6) {
        messageApi.warning(t('messages.invalid_code_message'));
        return;
      }

      await verifyOtp(
        { contact: contactValue, code },
        {
          showMessage: false,
          onSuccess: (res) => {
            messageApi.success(
              t('auth.success_verify') ||
                t('messages.verification_success_message')
            );
            if (typeof window !== 'undefined') {
              localStorage.removeItem(storageKey);
            }
            onVerified?.(res);
          },
          onError: (err) => {
            const apiMessage =
              err?.response?.data?.message ||
              err?.message ||
              t('verification_faild_message') ||
              t('errors.unknown');
            messageApi.error(apiMessage);
          },
        }
      );
    },
    [contactValue, messageApi, onVerified, otp, timerKey, t, verifyOtp]
  );

  const handleResend = useCallback(async () => {
    if (timeLeft > 0) return;

    if (!contactValue) {
      messageApi.warning(t('auth.contact_required'));
      return;
    }
    setOtp(Array(6).fill(''));
    setTimeLeft(initialDuration);

    if (typeof window !== 'undefined') {
      const expiryTime = Date.now() + initialDuration * 1000;
      localStorage.setItem(storageKey, expiryTime.toString());
    }

    await sendOtp(
      { contact: contactValue },
      {
        showMessage: false,
        onSuccess: () => {
          setStatusMessage('auth.resent_verification');
          messageApi.info(t('auth.resent_verification'));
        },
        onError: (err) => {
          const apiMessage =
            err?.response?.data?.message ||
            err?.message ||
            t('errors.unknown');
          messageApi.error(apiMessage);
        },
      }
    );
  }, [contactValue, initialDuration, messageApi, sendOtp, storageKey, timeLeft, t]);

  return {
    otp,
    timeLeft,
    verifying,
    sendingOtp,
    statusMessage,
    verifyError,
    messageContext: contextHolder,
    handleChange,
    handleKeyDown,
    handleVerify,
    handleResend,
    formatTime,
  };
}

export default useOtpVerification;
