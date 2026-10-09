import { useLocaleDirection } from "@/lib/i18n/useLocaleDirection";

import { Box, Check, Circle, ClipboardList, Handshake,Truck } from "lucide-react";
import { JSX } from "react";


export const StepTimeline = ({
  steps,
}: {
  steps: { key: string; label: string; completed: boolean; active: boolean }[];
}) => {
   const { isRTL } = useLocaleDirection();
  const primary = "#0B7C5C";
  const muted = "#b7d4c6";

  const circleSize = 36;
  const radius = circleSize / 2;

  const activeIndex = steps.findIndex((s) => s.active);
  const highestCompleted = steps
    .map((s, idx) => (s.completed ? idx : -1))
    .reduce((a, b) => Math.max(a, b), -1);
  const progressIndex = Math.max(activeIndex >= 0 ? activeIndex : 0, highestCompleted, 0);
  const progressRatio = steps.length > 1 ? progressIndex / (steps.length - 1) : 0;
  const progressWidthCalc = `calc((100% - ${circleSize}px) * ${progressRatio})`;

  const stepIcons: Record<string, JSX.Element> = {
    placed: <ClipboardList size={32} strokeWidth={1.5} />,
    seller_confirmed: <Box size={32} strokeWidth={1.5} />,
    in_progress: <Truck size={32} strokeWidth={1.5} />,
    fulfilled: <Truck size={32} strokeWidth={1.5} />,
    completed: <Handshake size={32} strokeWidth={1.5} />,
  };

  return (
    <div className="space-y-4 w-full sm:w-[90%] md:w-[80%] lg:w-[70%] mx-auto px-2">
      <div className="relative h-3 sm:h-4">
        <div
          className="absolute inset-y-0 bg-[rgba(11,124,92,0.25)] rounded-full w-[85%] sm:w-[80%] h-[6px] sm:h-[8px]"
          style={{ 
            left: "50%", 
            right: radius, 
            transform: "translateX(-50%)",
            ...(isRTL && {
              left: radius,
              right: "50%",
              transform: "translateX(50%)"
            })
          }}
        />
        <div
          className="absolute inset-y-10 bg-[rgba(11,124,92,0.9)] rounded-full transition-all"
          style={{ 
            left: radius, 
            width: progressWidthCalc, 
            maxWidth: `calc(85% - ${circleSize}px)`,
            ...(isRTL && {
              right: radius,
              left: "auto",
              transform: `scaleX(-1)`,
              transformOrigin: isRTL ? "right center" : "left center"
            })
          }}
        />
        <div className={`relative flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          {steps.map((step) => {
            const stateClass = step.completed
              ? "bg-blueSite border-blueSite text-white"
              : step.active
                ? "border-blueSite border-blueSite text-white"
                : "bg-white border-[rgba(11,124,92,0.85)] text-[rgba(11,124,92,0.85)]";

            return (
              <div
                key={step.key}
                className="flex flex-col items-center flex-1 min-w-[50px] sm:min-w-[60px] md:min-w-[70px] mt-[-8px]"
              >
                <div
                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-[3px] flex items-center justify-center shadow-sm ${stateClass}`}
                >
                  {step.completed ? <Check size={12} className="sm:size-[14px]" /> : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={`grid grid-cols-5 gap-1 sm:gap-2 text-center ${isRTL ? 'direction-rtl' : ''}`}>
        {steps.map((step) => {
          const activeColor = step.completed || step.active ? primary : "#9CA3AF";
          return (
            <div key={step.key} className={`flex flex-col items-center ${isRTL ? 'text-right' : ''}`}>
              <div
                className="w-12 h-10 sm:w-14 sm:h-11 md:w-16 md:h-12 rounded-md flex items-center justify-center"
                style={{
                  borderColor: step.completed || step.active ? primary : muted,
                  color: activeColor,
                }}
              >
                <div className="scale-75 sm:scale-90 md:scale-100">
                  {stepIcons[step.key] || <Circle size={14} />}
                </div>
              </div>
              <span
                className="text-xs sm:text-sm font-medium mt-1 px-1 break-words"
                style={{ 
                  color: step.completed || step.active ? "#191C1F" : "#30333388",
                  direction: isRTL ? 'rtl' : 'ltr',
                  textAlign: isRTL ? 'right' : 'center'
                }}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};