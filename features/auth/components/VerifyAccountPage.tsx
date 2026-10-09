"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useAuth } from "@/lib/context/AuthContext";
import AuthWrapper from "./AuthWrapper";
import { useOtpVerification } from "../hooks/useOtpVerification";
import { send_otp, verify_account } from "@/shared/constants/urls";

const VerifyAccountPage: React.FC = () => {
  const searchParams = useSearchParams();
  const contact = searchParams?.get("contact") || "";
  const router = useRouter();
  const { setAuthData } = useAuth();
  const { t } = useTranslation();

  const {
    otp,
    verifying,
    sendingOtp,
    timeLeft,
    statusMessage,
    verifyError,
    messageContext,
    handleChange,
    handleKeyDown,
    handleVerify,
    handleResend,
    formatTime,
  } = useOtpVerification({
    contact,
    verifyEndpoint: verify_account,
    resendEndpoint: send_otp,
    timerKey: "verify_otp_timer",
    onVerified: (res) => {
      const payload = (res as any)?.data ?? res;
      const user = payload?.user;
      const tokens = payload?.tokens || { access_token: "", refresh_token: "" };

      if (user) setAuthData({ tokens, user });
      router.push("/");
    },
  });

  useEffect(() => {
    const firstInput = document.getElementById("otp-0") as HTMLInputElement | null;
    firstInput?.focus();
  }, []);

  return (
    <AuthWrapper>
      {messageContext}

      <div className="flex h-full w-full flex-col justify-center space-y-6">
        <div className="mb-7 space-y-2">
          <h2 className="text-3xl font-bold text-blueSite sm:text-4xl">
            {t("auth.verify_account")}
          </h2>

          <p className="text-textColor">
            {t(statusMessage || "auth.sent_verification")}{" "}
            <span className="font-semibold text-subTitleColor">
              {contact || t("auth.contact_placeholder")}
            </span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="w-full space-y-6">
          {/* OTP Inputs */}
          <div className="mt-4 flex flex-row flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mx-auto">
              {otp.map((digit, index) => (
                <div
                  key={index}
                  className={`flex-1 aspect-square border-2 ${digit ? "bg-blueLight border-blueSite" : "border-gray-300"
                    } transition-all duration-300 rounded-lg flex items-center justify-center`}
                >
                  <input
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-8 h-8 md:w-13 md:h-13 text-center text-lg sm:text-xl font-semibold bg-transparent focus:outline-none transition-all border-b-2 border-b-bgGray"
                  />
                </div>
              ))}
            </div>

          {verifyError && (
            <p className="text-center text-sm text-red-500">
              {verifyError?.message || t("verification_faild_message")}
            </p>
          )}

          <p className="pt-6 text-center font-medium text-[#1C2419] sm:pt-10">
            <span className="text-[#B5B5B5]">{t("auth.expire_otp")} </span>
            {formatTime(timeLeft)}
          </p>

          <div className="space-y-3">
            <Button
              type="submit"
              unstyled
              disabled={timeLeft <= 0 || verifying}
              className={`w-full rounded-lg py-3 font-medium text-textWhiteColor transition-all ${timeLeft <= 0 || verifying
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-blueBtn shadow-md hover:bg-blueSiteHover"
                }`}
            >
              {verifying ? t("auth.buttons.verifying") : t("auth.buttons.verify_otp")}
            </Button>

            <div className="flex items-center justify-center gap-2 py-4">
              <div className="text-sm text-[#1C2419]">
                {t("auth.did_not_receive_code")}
              </div>

              <button
                type="button"
                onClick={handleResend}
                disabled={timeLeft > 0 || sendingOtp}
                className={[
                  "text-sm font-bold text-blueSite",
                  timeLeft > 0 || sendingOtp ? "cursor-not-allowed opacity-60" : "hover:underline",
                ].join(" ")}
              >
                {sendingOtp
                  ? t("auth.buttons.sending")
                  : timeLeft <= 0
                    ? t("auth.buttons.resend_code")
                    : `${t("auth.wait_resend")} ${formatTime(timeLeft)} `}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AuthWrapper>
  );
};

export default VerifyAccountPage;
