import React from "react";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

interface GoBackButtonProps {
  onClick?: () => void;
}

export default function GoBackButton({ onClick }: GoBackButtonProps) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B6B57]"
    >
      <ArrowLeft className="h-4 w-4" />
      {t('serviceMarket.rfq.orderDetails.goBack')}
    </button>
  );
}
