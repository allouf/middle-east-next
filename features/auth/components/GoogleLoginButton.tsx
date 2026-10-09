"use client";

import React, { useEffect, useCallback, ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/lib/context/AuthContext";
import Button from "@/components/ui/Button";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { getGoogleAuthUrl } from "../api/client.api";
import DynamicMessage, { MessageType } from "@/lib/utils/notification";

interface GoogleLoginButtonProps {
  className?: string;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ className }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { refreshAccessToken } = useAuth();
  const [msg, setMsg] = useState<null | { type: MessageType; content: ReactNode }>(null);
  /** Handle Google Login Popup */
  const handleGoogleSignIn = useCallback(() => {
    const googleAuthUrl = getGoogleAuthUrl();

    const width = 500;
    const height = 600;
    const left = window.screenX + (window.innerWidth - width) / 2;
    const top = window.screenY + (window.innerHeight - height) / 2;

    const authWindow = window.open(
      googleAuthUrl,
      "_blank",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (!authWindow) {
      setMsg({
        type: "error",
        content: <>{t("popupBlocked")} <br /> {t("enablePopupsToContinue")}</>,
      });
    }
  }, [t]);

  /** Listen for message from popup (Google login success) */
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // Safety check
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === "LOGIN_SUCCESS") {
        setMsg({
          type: "success",
          content: <>{t("googleLoginSuccess")} <br /> {t("redirectingToProfile")}</>,
        });
        await refreshAccessToken();
        router.push("/");
      }

      if (event.data?.type === "LOGIN_FAILED") {
        setMsg({
          type: "error",
          content: <>{t("googleLoginFailed")} <br /> {t("tryAgain")}</>,
        });
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [router, refreshAccessToken, t]);

  return (
    <div className={`flex justify-center w-full ${className || ""}`}>
      {msg && (
        <DynamicMessage
          type={msg.type}
          content={msg.content}
        />
      )}
      <Button
        unstyled
        type="button"
        onClick={handleGoogleSignIn}
        className="flex items-center text-base md:text-lg  justify-center gap-2 py-3 px-16 text-gray-800 bg-bgGray transition-all duration-300 w-full rounded-md"
      >
        <FcGoogle size={24} />
        {t('auth.signInWithGoogle')}
      </Button>
    </div>
  );
};

export default GoogleLoginButton;
