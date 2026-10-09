import React from "react";
import { FaLightbulb } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { RequestDetail } from "../../../types/Rfq";

interface InsightsCardProps {
  requestDetail?: RequestDetail | null;
}

const InsightsCard = ({ requestDetail }: InsightsCardProps) => {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-[#DFCE13] bg-[#FEFCE8] p-5">
      <div className="flex items-start gap-4">
        <span className="inline-flex p-2 h-10 w-10 items-center justify-center rounded-full bg-[#FEF9C3] text-[#DFCE13]">
          <FaLightbulb className="h-5 w-5" />
        </span>

        <div>
          <h3 className="text-[18px] font-bold text-[.#0F172A]">{t('serviceMarket.rfq.details.insightsCard.title')}</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-[#475569]">
            <li>
              {t('serviceMarket.rfq.details.insightsCard.tip1')}
            </li>
            <li>
              {t('serviceMarket.rfq.details.insightsCard.tip2')}
            </li>
            <li>
              {t('serviceMarket.rfq.details.insightsCard.tip3')}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InsightsCard;