import React from "react";
import { BadgeCheck, WalletCards, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function RFQBenefitsCard() {
  const { t } = useTranslation();

  const items = [
    {
      icon: <BadgeCheck className="h-4 w-4 sm:h-5 sm:w-5 text-[#D1FADF]" />,
      text: t('serviceMarket.rfq.createForm.benefits.connect'),
    },
    {
      icon: <WalletCards className="h-4 w-4 sm:h-5 sm:w-5 text-[#D1FADF]" />,
      text: t('serviceMarket.rfq.createForm.benefits.compare'),
    },
    {
      icon: <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-[#D1FADF]" />,
      text: t('serviceMarket.rfq.createForm.benefits.escrow'),
    },
  ];

  return (
    <div className="rounded-[12px] sm:rounded-[14px] bg-[linear-gradient(135deg,#064E3B_0%,#065F46_45%,#0B6B57_100%)] p-4 sm:p-5 md:p-7 text-white shadow-[0_10px_30px_rgba(0,0,0,0.14)]">
      <h3 className="mb-4 sm:mb-6 text-[16px] sm:text-[18px] font-bold">{t('serviceMarket.rfq.createForm.benefits.title')}</h3>

      <div className="space-y-4 sm:space-y-5">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-2 sm:gap-3">
            <span className="mt-0.5">{item.icon}</span>
            <p className="text-[13px] sm:text-[14px] leading-5 sm:leading-6 text-white/90">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
