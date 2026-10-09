'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface ReferralPromptProps {
  onAccept: () => void;
  onReject: () => void;
}

const ReferralPrompt: React.FC<ReferralPromptProps> = ({ onAccept, onReject }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row items-center justify-center p-6">
      <div className="w-[150px] h-[150px] md:w-[200px] md:h-[200px] mr-0 md:mr-10 mb-6 md:mb-0 flex-shrink-0">
        <img
          src="/QuestionCircle.png"
          alt="QuestionCircle"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="text-center md:text-start max-w-md">
        <h2 className="text-2xl md:text-3xl font-bold text-blueSite mb-4">
          {t("referrals.titlelink")}
        </h2>
        <p className="text-lg text-subTitleColor mb-8">
          {t("referrals.description")}
        </p>
        <div className="flex justify-center md:justify-start gap-4">
          <Button
            unstyled
            type="button"
            onClick={onReject}
            className="w-1/2 px-6 py-2 bg-gray-100 text-subTitleColor rounded-md font-medium hover:bg-gray-200 transition"
          >
            {t("buttons.no")}
          </Button>
          <Button
            unstyled
            type="button"
            onClick={onAccept}
            className="w-1/2 px-6 py-2 bg-blueBtn text-textWhiteColor rounded-md font-medium hover:bg-blueSiteHover transition"
          >
            {t("buttons.yes")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReferralPrompt;

