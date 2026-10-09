"use client";

import React, { useState } from "react";
import { HiArrowLeft } from "react-icons/hi";
import { FaUserLarge } from "react-icons/fa6";
import { PiBuildingApartmentFill } from "react-icons/pi";
import Button from "@/components/ui/Button";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useLangSwitch } from "@/lib/Hooks/useLangSwitch";
import AuthWrapper from "./AuthWrapper";
import AccountTypeCard from "./AccountTypeCard";
import GoogleLoginButton from "./GoogleLoginButton";
import RegisterUserForm from "./RegisterUserForm";
import RegisterCompanyForm from "./RegisterCompanyForm";
import { ACCOUNT_TYPES, type AccountType } from "../types";

interface RegisterPageProps {
  defaultCountry?: string;
  defaultRegion?: string;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ defaultCountry, defaultRegion }) => {
  const { t } = useTranslation();
  const { currentLang } = useLangSwitch();
  const isRTL = currentLang === "ar";

  const [selectedType, setSelectedType] = useState<AccountType | null>(null);
  const [confirmedType, setConfirmedType] = useState<AccountType | null>(null);

  const handleConfirmType = () => {
    if (!selectedType) return;
    setConfirmedType(selectedType);
  };

  const handleBack = () => {
    setConfirmedType(null);
    setSelectedType(null);
  };

  return (
    <AuthWrapper>
      <div className="w-full h-full">
        {/* ================= SELECT ACCOUNT TYPE ================= */}
        {!confirmedType && (
          <div className="h-full flex flex-col justify-between">
            <header className="mb-6 text-start">
              <h2
                className="
                  text-lg sm:text-xl md:text-2xl lg:text-[34px]
                  font-semibold
                  text-blueSiteHover
                  leading-tight
                  mb-2
                "
              >
                {t("auth.choose_type_register")}
              </h2>

              <p
                className="
                        text-sm sm:text-base
                        text-textColor
                        font-normal
                        max-w-md
                        mx-auto sm:mx-0
                  "
              >
                {t("auth.desc_register")}
              </p>
            </header>


            <div className="w-full flex-1 flex flex-col justify-center items-center">
              <div className="w-full flex flex-col space-y-4">
                <AccountTypeCard
                  type={ACCOUNT_TYPES.USER}
                  icon={<FaUserLarge />}
                  title={t("auth.norm_user")}
                  description={t("auth.desc_norm_user")}
                  selectedType={selectedType}
                  onSelect={setSelectedType}
                  isRTL={isRTL}
                />

                <AccountTypeCard
                  type={ACCOUNT_TYPES.COMPANY}
                  icon={<PiBuildingApartmentFill className="text-3xl" />}
                  title={t("auth.company")}
                  description={t("auth.desc_company")}
                  selectedType={selectedType}
                  onSelect={setSelectedType}
                  isRTL={isRTL}
                />
              </div>

              <div className="mt-8 w-full">
                <Button
                  onClick={handleConfirmType}
                  disabled={!selectedType}
                  unstyled
                  scale={1.05}
                  className="w-full py-3 px-4 bg-blueSite disabled:bg-lightGray text-[16px] text-bold text-textWhiteColor font-semibold rounded-md hover:bg-blueSiteHover transition"
                >
                  {t("buttons.register")}
                </Button>
              </div>

              {/* Divider */}
              <div className="flex items-center justify-center my-8 w-full">
                <div className="border-t-2 border-[#E0E0E0] flex-grow flex-1 h-[2px]" />
                <span className="mx-4 text-textColor">{t("or")}</span>
                <div className="border-t-2 border-[#E0E0E0] flex-grow flex-1" />
              </div>

              <GoogleLoginButton />

              <div className="mt-4 text-[16px] font-regular flex items-center gap-2">
                <span>{t("text.haveAcoount")}</span>
                <Button
                  to="/login"
                  unstyled
                  className="text-blueSite font-medium hover:underline"
                >
                  {t("buttons.login")}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ================= REGISTER FORMS ================= */}
        {confirmedType && (
          <>
            <Button
              onClick={handleBack}
              unstyled
              className="flex items-center text-subTitleColor hover:underline mb-4"
            >
              <HiArrowLeft className={`me-2 ${isRTL ? "rotate-180" : ""}`} />
              {t("buttons.goBack")}
            </Button>

            {confirmedType === ACCOUNT_TYPES.USER && <RegisterUserForm defaultCountry={defaultCountry} defaultRegion={defaultRegion} />}
            {confirmedType === ACCOUNT_TYPES.COMPANY && <RegisterCompanyForm defaultCountry={defaultCountry} defaultRegion={defaultRegion} />}
          </>
        )}
      </div>
    </AuthWrapper>
  );
};

export default RegisterPage;
