import React from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useLocaleDirection } from "@/lib/i18n/useLocaleDirection";
import Button from "@/components/ui/Button";
import { ArrowLeft, ArrowRight, PlusCircle } from "lucide-react";

/**
 * Section Header Component
 * 
 * Header section for the portfolio projects page.
 * Includes back navigation, title, description, and add project button.
 */
interface SectionHeaderProps {
  onOpenModal: () => void;
}

function SectionHeader({ onOpenModal }: SectionHeaderProps) {
  const { t } = useTranslation();
  const { isRTL } = useLocaleDirection();

  // Event handlers
  const handleGoBack = (): void => {
    // TODO: Implement navigation logic
    console.log('Navigate back');
  };

  const handleAddProject = (): void => {
    onOpenModal();
  };

  // Choose arrow icon based on direction
  const ArrowIcon = isRTL ? ArrowRight : ArrowLeft;


  return (
    <>
      <button
        type="button"
        onClick={handleGoBack}
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-blueSite hover:underline sm:mb-5"
        aria-label="Go back to previous page"
      >
        <ArrowIcon className="h-4 w-4" />
        {t('buttons.goBack')}
      </button>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between lg:gap-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-balck sm:text-3xl lg:text-4xl">
            {t('serviceMarket.projects.title')}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-textGrayColor sm:mt-3 sm:text-base lg:text-lg">
            {t('serviceMarket.projects.description')}
          </p>
        </div>

        <div className="flex-shrink-0">
          <Button
            onClick={handleAddProject}
            className="w-full  flex justify-center  text-center !h-11 !px-4 !text-sm !font-medium sm:w-auto  lg:!h-12  lg:!text-base !rounded-md" 
          >
            <PlusCircle className="h-4 w-4 m-2" />
            <span className="hidden sm:inline">{t('serviceMarket.projects.addProject')}</span>
            <span className="sm:hidden">{t('serviceMarket.projects.addProject').split(' ')[0]}</span>
          </Button>
        </div>
      </div>
    </>
  );
}

export default SectionHeader;
