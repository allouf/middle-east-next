import React from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useLocaleDirection } from "@/lib/i18n/useLocaleDirection";
import Button from "@/components/ui/Button";
import { ArrowLeft, Check } from "lucide-react";

type StepItem = {
  key: string;
  label: string;
  translationKey?: string;
};

type FormHeaderProps = {
  steps: StepItem[];
  currentStep: number;
  onBack?: () => void;
};

export default function FormHeader({ steps, currentStep, onBack }: FormHeaderProps) {
  const { t } = useTranslation();
  const { isRTL } = useLocaleDirection();

  return (
    <div className="flex flex-col lg:flex-row  items-start lg:items-center gap-6 lg:gap-8">
      <div className="w-full lg:w-auto">
        <Button
            onClick={onBack}
            className="text-lg font-medium text-textColor underline underline-offset-4"
            unstyled
          >
            <div className="flex items-center gap-2">
              <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
              {t('serviceMarket.myServices.common.goBack')}
            </div>
          </Button>
        <div className="mb-6 lg:mb-8">
          <div className="mb-3 flex items-center gap-3">
            <span className="inline-block h-8 lg:h-12 w-1 rounded-full bg-blueSite" />
            <h2 className="text-[20px] lg:text-[24px] font-bold leading-none text-blueSite">
              {t('serviceMarket.myServices.create.title')}
            </h2>
          </div>
          <p className="ps-4 text-[16px] lg:text-[22px] text-textGrayColor">
            {t('serviceMarket.myServices.create.description')}
          </p>
        </div>
        </div>

        <div className="lg:flex-1 space-y-6">

          <div className="flex items-center justify-center w-full">


            <div className="flex w-full items-center justify-center overflow-x-auto">
              <div className="flex min-w-max items-center justify-center ">
                {steps.map((step, index) => {
                  const isCompleted = index < currentStep;
                  const isCurrent = index === currentStep;
                  const isLast = index === steps.length - 1;

                  return (
                    <div
                      key={step.key}
                      className="relative flex min-w-[140px] flex-col items-center"
                    >
                      {/* top line + circle */}
                      <div className="relative flex w-full items-center justify-center">
                        {/* left line */}
                        {index !== 0 && (
                          <div
                            className={`absolute start-0 top-1/2 h-[2px] lg:h-[3px] w-1/2 -translate-y-1/2 ${isCompleted || isCurrent
                              ? "bg-blueSite"
                              : "bg-[#D9E9E5]"
                              }`}
                          />
                        )}

                        {/* right line */}
                        {!isLast && (
                          <div
                            className={`absolute end-0 top-1/2 h-[2px] lg:h-[3px] w-1/2 -translate-y-1/2 ${index < currentStep
                              ? "bg-blueSite"
                              : "bg-[#D9E9E5]"
                              }`}
                          />
                        )}

                        {/* circle */}
                        <div
                          className={`relative z-10 flex h-3 w-3 lg:h-4 lg:w-4 items-center justify-center rounded-full border-2 ${isCompleted
                            ? "border-blueSite bg-blueSite"
                            : isCurrent
                              ? "border-blueSite bg-white"
                              : "border-blueSite bg-white"
                            }`}
                        >
                          {isCompleted && (
                            <Check className="h-2.5 w-2.5 lg:h-3.5 lg:w-3.5 text-white" strokeWidth={3} />
                          )}
                        </div>
                      </div>

                      {/* label */}
                      <p
                        className={`mt-2 lg:mt-3 text-center text-xs lg:text-sm font-semibold leading-4 lg:leading-5 ${isCompleted || isCurrent
                          ? "text-blueSite"
                          : "text-[#7B7B7B]"
                          }`}
                      >
                        {step.translationKey ? t(step.translationKey) : step.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
