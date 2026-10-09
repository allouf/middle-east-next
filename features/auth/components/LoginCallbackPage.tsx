'use client';

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { message } from "antd";
import { useTranslation } from "@/lib/i18n/useTranslation";

const LoginCallbackPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const token = searchParams?.get("refresh_token");
    if (token) {
      localStorage.setItem("refresh_token", token);
      message.success(t("loginSuccess"));
      window.opener?.postMessage(
        { type: "LOGIN_SUCCESS" },
        window.location.origin
      );
      setTimeout(() => window.close(), 1500);
    } else {
      message.error(t("loginFailed"));
      if (window.opener) {
        window.opener.postMessage(
          { type: "LOGIN_FAILED" },
          window.location.origin
        );
        window.close();
      } else {
        router.push("/");
      }
    }
  }, [router, searchParams, t]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-subTitleColor text-lg">
        {t("auth.finishing_login")}
      </p>
    </div>
  );
};

export default LoginCallbackPage;
