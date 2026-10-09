import { ArrowLeft } from "lucide-react";
import React from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface HeaderFormProps {
  title?: string;
  description?: string;
  onBack?: () => void;
  showBackButton?: boolean;
}

const HeaderForm = ({ 
  title,
  description,
  onBack,
  showBackButton = true 
}: HeaderFormProps) => {
  const { t } = useTranslation();
  return (
    <div className="border-s-4 border-blueSite ps-4">
      {showBackButton && (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-blueSite hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('buttons.goBack')}
        </button>
      )}

      <div>
        <h2 className="text-[30px] font-bold leading-tight text-textColor">
          {title || t('serviceMarket.createProfile.title')}
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-textGrayColor">
          {description || t('serviceMarket.createProfile.description')}
        </p>
      </div>
    </div>
  );
};

export default HeaderForm;