import React from "react";
import { useTranslation } from "react-i18next";

export default function HelpCard() {
  const { t } = useTranslation();

  return (
    <div className="rounded-[22px] bg-[linear-gradient(135deg,#320909_0%,#401010_45%,#4E120D_100%)] p-5 text-white">
      <h3 className="text-[20px] font-bold">{t('serviceMarket.rfq.orderDetails.needHelp')}</h3>
      <p className="mt-2 text-sm leading-6 text-white/75">
        {t('serviceMarket.rfq.orderDetails.supportDescription')}
      </p>

      <button
        type="button"
        className="mt-4 text-sm font-bold text-[#FF9B47] transition hover:opacity-90"
      >
        {t('serviceMarket.rfq.orderDetails.contactSupport')} →
      </button>
    </div>
  );
}
