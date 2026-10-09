'use client';

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import { useTranslation } from "@/lib/i18n/useTranslation";
import AuthWrapper from "./AuthWrapper";
import { useOtpVerification } from "../hooks/useOtpVerification";
import { passwordVerifyOtp, send_otp } from "@/shared/constants/urls";

const VerificationCodePage: React.FC = () => {
  const searchParams = useSearchParams();
  const contact = searchParams?.get("contact") || "";
  const router = useRouter();
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
    verifyEndpoint: passwordVerifyOtp,
    resendEndpoint: `${send_otp}?contact=${contact}`,
    timerKey: "verify_otp_timer_reset",
    onVerified: (res) => {
      const payload = (res as any)?.data ?? res;
      const resetToken = payload?.data?.reset_token ?? payload?.reset_token;
      router.push(`/reset-password?contact=${contact}&reset_token=${resetToken}`);
    },
  });

  useEffect(() => {
    const firstInput = document.getElementById("otp-0") as HTMLInputElement | null;
    firstInput?.focus();
  }, []);

  return (
    <AuthWrapper>
      {messageContext}
      <div className="w-full flex flex-col justify-center items-center">
        <div className="w-full bg-white space-y-6">
          <header className="text-start space-y-2">
            <h2 className="text-[18px] sm:text-[24px] md:text-[35px] font-semibold text-blueSiteHover">
              {t("auth.forget_password")}
            </h2>
            <p className="text-textColor text-sm leading-relaxed">
              {t(statusMessage || "auth.descriptionForget_password")}
            </p>
          </header>

          <form onSubmit={handleVerify}>
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

            <p className="text-textColor font-medium mt-8 text-[18px] text-center">
              {t("auth.code_expires")} :{" "}
              <span className="text-subTitleColor">{formatTime(timeLeft)}</span>
            </p>

            {verifyError && (
              <p className="text-red-500 text-sm mt-3 text-center">
                {verifyError?.response?.data?.message ||
                  verifyError?.message ||
                  t("verification_faild_message")}
              </p>
            )}

            <div className="mt-6 space-y-3">
              <Button
                type="submit"
                scale={1.05}
                disabled={verifying || timeLeft <= 0}
                className={`w-full py-3 text-[18px] text-textWhiteColor rounded-lg font-semibold transition-all ${verifying || timeLeft <= 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blueBtn hover:bg-blueSiteHover"
                  }`}
                unstyled
              >
                {verifying
                  ? t("auth.buttons.verifying")
                  : t("auth.buttons.verify_otp")}
              </Button>

              <div className="flex flex-row justify-center gap-1 text-center">
                <p>{t("auth.resend_text")} :</p>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={sendingOtp || timeLeft > 0}
                  className={`text-blueBtn font-medium transition-all ${timeLeft > 0
                    ? "cursor-not-allowed opacity-60"
                    : "hover:text-blueSiteHover underline underline-offset-2"
                    }`}
                >
                  {timeLeft > 0
                    ? `${t("auth.wait_resend")} ${formatTime(timeLeft)}`
                    : t("auth.buttons.resend_code")}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default VerificationCodePage;
