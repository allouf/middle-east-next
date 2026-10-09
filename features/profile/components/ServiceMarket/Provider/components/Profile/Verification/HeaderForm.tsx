import { ArrowLeft } from "lucide-react";
import React from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useLocaleDirection } from "@/lib/i18n/useLocaleDirection";

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
  const { isRTL } = useLocaleDirection();
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        {showBackButton && (
          <button
            type="button"
            onClick={onBack}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-blueSite hover:underline"
          >
            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
            {t('buttons.goBack')}
          </button>
        )}
        <div className="p-2 ">
        <div className="flex items-center gap-2 ">
          <div className="h-10 w-2 rounded-full bg-[#0B6B57]" />
          <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
            {title}
          </h1>
        </div>
        <p className="mt-2 text-sm text-gray-500 p-2">
          {description }
        </p>
        </div>
      </div>
    </div>
  );
};

export default HeaderForm;
