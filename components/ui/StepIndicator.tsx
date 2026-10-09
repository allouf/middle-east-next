"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Button from "./Button";
import { ArrowLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils/index";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useLocaleDirection } from "@/lib/i18n/useLocaleDirection";

interface StepIndicatorProps {
  step: number;
  setStep: (step: number) => void;
  totalSteps: number;
  children: React.ReactNode;
  glow?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  stepLabels?: string[];
  onCancel?: () => void;
  wrapperButton?: string;
  onSaveDraft?: () => void;
  margin?: string;
  className?: string;
  classNameContent?: string;
  variant?: 'default' | 'circular';
  onFinish?: () => void;
  hideSteps?: boolean;
  hideButton?: boolean;
}

const StepIndicator = ({
  step,
  setStep,
  totalSteps,
  children,
  glow,
  loading = false,
  disabled = false,
  stepLabels = [],
  onCancel,
  wrapperButton,
  onSaveDraft,
  margin = "mb-4",
  className,
  classNameContent,
  variant = 'default',
  onFinish,
  hideSteps = false,
  hideButton = false,
}: StepIndicatorProps): React.ReactNode => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const stepElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const { t } = useTranslation();
  const { dir, isRTL } = useLocaleDirection();

  // GSAP Animation for step transitions
  useEffect(() => {
    // Kill previous timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    // Create new timeline
    const tl = gsap.timeline();
    timelineRef.current = tl;

    // Animate content transition
    if (contentRef.current) {
      tl.fromTo(
        contentRef.current,
        {
          opacity: 0,
          y: 30,
          scale: 0.98
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power3.out"
        }
      );
    }

    // Animate step indicators
    stepElementsRef.current.forEach((stepEl, index) => {
      if (stepEl) {
        const stepNumber = index + 1;
        const isActive = stepNumber === step;
        const isCompleted = stepNumber < step;

        if (isActive) {
          // Active step animation
          tl.fromTo(
            stepEl,
            {
              scale: 0.7,
              opacity: 0.4
            },
            {
              scale: 1.1,
              opacity: 1,
              duration: 0.4,
              ease: "back.out(1.3)"
            },
            "-=0.2"
          ).to(stepEl, {
            scale: 1,
            duration: 0.3,
            ease: "power3.out"
          });
        } else if (isCompleted) {
          // Completed step animation
          tl.fromTo(
            stepEl,
            {
              scale: 1
            },
            {
              scale: 0.85,
              duration: 0.2,
              ease: "power2.inOut"
            },
            "-=0.1"
          ).to(stepEl, {
            scale: 1,
            duration: 0.2,
            ease: "power2.inOut"
          });
        }
      }
    });

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [step]);

  // Smooth scroll to top after step change
  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 300); // Wait for animation to start

    return () => clearTimeout(timer);
  }, [step]);
  const hasCancel = step === 1 && Boolean(onCancel);

  // Render Default Diamond Style
  const renderDefaultSteps = () => (
    <div
      ref={scrollRef}
      className="flex items-baseline w-full !overflow-visible no-scrollbar px-2 sm:px-4 md:px-8 lg:px-16 justify-center pt-2"
    >
      {steps.map((s, index) => (
        <React.Fragment key={s}>
          {/* STEP ITEM */}
          <div
            id={`step-${s}`}
            ref={(el) => { stepElementsRef.current[index] = el; }}
            className="flex flex-col items-center justify-center flex-shrink-0 w-[60px] sm:w-[70px] md:w-[80px] lg:w-[90px]"
          >
            {/* NUMBER + IMAGE */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
              {/* STEP DIAMOND */}
              <div
                className={cn(
                  "relative flex items-center justify-center rotate-45 border-2 rounded-md transition-all duration-300",
                  "w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9",
                  "p-0",
                  step === s
                    ? "bg-[#005D48] border-[#005D48] text-textWhiteColor shadow-lg"
                    : step > s
                      ? "bg-[#005D48] border-[#005D48] text-textWhiteColor"
                      : "bg-white border-[#005D48] text-[#005D48]"
                )}
              >
                <span className="transform -rotate-45 font-semibold text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] xl:text-base leading-none absolute inset-0 flex items-center justify-center">
                  {s}
                </span>
              </div>
            </div>

            {/* LABEL */}
            {stepLabels[index] && (
              <span
                className={cn(
                  "mt-1 sm:mt-2 text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm max-w-[60px] sm:max-w-[70px] md:max-w-[80px] lg:max-w-[90px] text-center leading-tight break-words",
                  step === s || step > s
                    ? "text-[#00664F] font-bold"
                    : "text-[#4F4F4F]/60"
                )}
              >
                {stepLabels[index]}
              </span>
            )}
          </div>

          {/* CONNECTOR */}
          {index < steps.length - 1 && (
            <div className="flex items-center flex-1 relative pb-3 sm:pb-4 md:pb-5">
              <div
                className={cn(
                  "absolute w-full h-[1px] sm:h-[2px] top-0",
                  "before:content-[''] before:absolute before:top-1/2 before:start-0 before:-translate-y-1/2 before:size-4 sm:before:size-6 md:before:size-8 before:border-e-2 before:border-t-2 ",
                  "after:content-['']  after:absolute  after:top-1/2  after:end-0    after:-translate-y-1/2  after:size-4 sm:after:size-6 md:after:size-8 after:border-s-2 after:border-b-2 ",
                  isRTL
                    ? "before:translate-x-[1rem] sm:before:translate-x-[1.5rem] md:before:translate-x-[2.2rem] after:-translate-x-[1rem] sm:after:-translate-x-[1.5rem] md:after:-translate-x-[2.2rem] after:-rotate-45 before:-rotate-45"
                    : "before:-translate-x-[1rem] sm:before:-translate-x-[1.5rem] md:before:-translate-x-[2.2rem] after:translate-x-[1rem] sm:after:translate-x-[1.5rem] md:after:translate-x-[2.2rem] after:rotate-45 before:rotate-45",
                  index === 0 || step > s
                    ? "bg-[#005f4b] before:border-[#005f4b] after:border-[#005f4b]"
                    : "bg-[#EFE7EC] before:border-[#EFE7EC] after:border-[#EFE7EC]"
                )}
              ></div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  // Render Circular Style
  const renderCircularSteps = () => (
    <div
      ref={scrollRef}
      className="flex items-start w-full md:w-1/2 !overflow-visible no-scrollbar px-4 sm:px-0 justify-center pt-2 mx-auto"
    >
      {steps.map((s, index) => {
        const isCompleted = step > s;
        const isActive = step === s;
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={s}>
            {/* STEP ITEM */}
            <div
              id={`step-${s}`}
              ref={(el) => { stepElementsRef.current[index] = el; }}
              className="flex flex-col items-center justify-start flex-shrink-0 z-10 relative mb-6"
            >
              {/* CIRCLE + ICON/NUMBER */}
              <div className="flex items-center justify-center">
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full border-2 transition-all duration-300 mt-1",
                    "w-5 h-5",
                    isActive || isCompleted
                      ? "bg-[#005D48] border-[#005D48] text-white"
                      : "bg-white border-3 border-[#005D48] text-[#005D48]"
                  )}
                >
                  {isCompleted && (
                    <Check className="w-3 h-3" />
                  )}
                </div>
              </div>

              {/* LABEL */}
              {stepLabels[index] && (
                <span
                  className={cn(
                    "mt-2 text-xs text-center leading-tight absolute top-6 sm:top-8 w-32",
                    isActive || isCompleted
                      ? "text-[#005D48] font-bold"
                      : "text-[#4F4F4F]"
                  )}
                >
                  {stepLabels[index]}
                </span>
              )}
            </div>

            {/* CONNECTOR */}
            {!isLast && (
              <div className="flex-1 self-start mt-2.5 sm:mt-3 -mx-2 h-[4px] bg-gray-200 relative rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-300",
                    step > s ? "bg-[#005D48] w-full" : "w-0"
                  )}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  return (
    <div className={`flex flex-col ${className} `} dir={dir}>
      {/* Steps UI */}
      {!hideSteps && (
        <div
          className={`flex flex-col items-center justify-center w-full ${margin}`}
        >
          {variant === 'circular' ? renderCircularSteps() : renderDefaultSteps()}
        </div>
      )}
      {glow && <>{glow}</>}
      {/* STEP CONTENT */}
      <div ref={contentRef} className={`flex-1 ${classNameContent}`}>{children}</div>
      {!hideButton && (
        <div className={`flex flex-col sm:flex-row w-full gap-3 justify-between items-center pt-5 mt-auto pb-2 ${wrapperButton}`}>
          {/* Step 1 */}
          {step === 1 && (
            <div className="flex flex-col sm:flex-row gap-3 items-center w-full">
              <div className="flex flex-col sm:flex-row items-center w-full">
                <Button
                  scale={1.03}
                  type={step === totalSteps && !onFinish ? "submit" : "button"}
                  onClick={
                    step === totalSteps
                      ? onFinish
                      : () => {
                        setStep(step + 1);
                      }
                  }
                  disabled={step === totalSteps ? loading || disabled : disabled}
                  unstyled
                  className={`
                    bg-blueBtn
                    text-textWhiteColor
                    px-5 py-2 rounded-lg
                    transition hover:bg-blueSiteHover
                    w-full text-[16px] 2xl:text-[16px]
                    disabled:bg-red!important
                    disabled:text-textWhiteColor!important max-w-[200px]
                    ${hasCancel ? "sm:w-[240px]" : ""}
                  `}
                >
                  {loading
                    ? t("buttons.submitting")
                    : step === totalSteps
                      ? t("buttons.confirm")
                      : t("buttons.next")}
                </Button>

                {/* Save as Draft - Only show on last step */}
                {step === totalSteps && onSaveDraft && (
                  <Button
                    scale={1.03}
                    type="button"
                    onClick={() => {
                      onSaveDraft();
                    }}
                    unstyled
                    className="bg-white border-2 border-[#32A5EF] text-[#32A5EF] w-full sm:w-[240px] px-5 py-2 rounded-lg transition hover:bg-[#E6F0ED]"
                  >
                    {t("buttons.save_as_draft")}
                  </Button>
                )}
                {/* Cancel Button (optional) */}
                {onCancel && (
                  <Button
                    scale={1.03}
                    unstyled
                    type="button"
                    onClick={onCancel}
                    className="text-textColor text-[18px] 2xl:text-[20px] underline hover:text-subTitleColor transition-colors bg-transparent border-none cursor-pointer text-base font-normal px-4 min-w-[140px] text-center"
                  >
                    {t("buttons.cancel")}
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Step > 1 */}
          {step > 1 && (
            <div className="flex flex-col sm:flex-row gap-3 items-center w-full">
              {/* Previous */}
              <Button
                scale={1.03}
                type="button"
                unstyled
                onClick={() => setStep(step - 1)}
                className="bg-[#E6F0ED] text-[16px] 2xl:text-[16px] text-blueBtn w-full sm:w-[180px] px-5 py-2 rounded-lg transition hover:bg-[#E6F0ED]/80"
              >
                {t("buttons.previous")}
              </Button>

              {/* Next / Confirm */}
              <div className="flex flex-col sm:flex-row gap-3 items-center w-full sm:w-auto">
                <Button
                  scale={1.03}
                  type={step === totalSteps && !onFinish ? "submit" : "button"}
                  onClick={
                    step === totalSteps
                      ? onFinish
                      : (e) => {
                        e?.preventDefault();
                        e?.stopPropagation();
                        setStep(step + 1);
                      }
                  }
                  disabled={step === totalSteps ? loading || disabled : disabled}
                  unstyled
                  className="bg-blueBtn w-full text-textWhiteColor px-5 py-2 rounded-lg transition hover:bg-blueSiteHover text-[16px] 2xl:text-[16px] sm:w-[180px]"
                >
                  {step === totalSteps
                    ? loading
                      ? t("buttons.submitting")
                      : t("buttons.confirm")
                    : t("buttons.next")}
                </Button>

                {/* Save as Draft - Only show on last step */}
                {step === totalSteps && onSaveDraft && (
                  <Button
                    scale={1.03}
                    type="button"
                    onClick={() => {
                      onSaveDraft();
                    }}
                    unstyled
                    className="bg-white border-2 border-blueBtn text-blueBtn w-full sm:w-[180px] px-5 py-2 rounded-lg transition underline underline-offset-4 font-semibold"
                  >
                    {t("buttons.save_as_draft")}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StepIndicator;
