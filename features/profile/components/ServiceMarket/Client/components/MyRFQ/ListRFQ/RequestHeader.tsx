import React from "react";
import { useTranslation } from "react-i18next";

interface RequestHeaderProps {
  onCreateNewRFQ?: () => void;
}

export default function RequestHeader({ onCreateNewRFQ }: RequestHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <div className="mb-3 flex items-center gap-3">
          <span className="block h-8 w-[5px] rounded-full bg-blueSite" />
          <h2 className="text-2xl font-bold text-subTitleColor md:text-[28px]">
            {t('serviceMarket.rfq.header.title')}
          </h2>
        </div>

        <p className="text-base text-[#475569] md:text-lg">
          {t('serviceMarket.rfq.header.description')}
        </p>
      </div>
    </div>
  );
}
