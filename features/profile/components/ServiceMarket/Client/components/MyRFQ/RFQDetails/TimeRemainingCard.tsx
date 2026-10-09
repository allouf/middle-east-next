import React from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { RequestDetail } from "../../../types/Rfq";
import SectionCard from "./SectionCard";
import SoftIcon from "./SoftIcon";

type CountdownBoxProps = {
  value: string;
  label: string;
};

const CountdownBox = ({ value, label }: CountdownBoxProps) => {
  return (
    <div className="text-center">
      <div className="text-[28px] font-bold leading-none text-[#FF4D4F]">
        {value}
      </div>
      <div className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-[#667085]">
        {label}
      </div>
    </div>
  );
};

interface TimeRemainingCardProps {
  requestDetail?: RequestDetail | null;
}

const TimeRemainingCard = ({ requestDetail }: TimeRemainingCardProps) => {
  const { t } = useTranslation();

  // Calculate time remaining from deadline_date
  const getTimeRemaining = () => {
    if (!requestDetail?.deadline_date) return null;

    const deadline = new Date(requestDetail.deadline_date);
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();

    if (diff <= 0) {
      return { expired: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const totalHours = Math.floor(diff / (1000 * 60 * 60));

    return { expired: false, days, hours, minutes, totalHours };
  };

  const timeRemaining = getTimeRemaining();

  return (
    <SectionCard className="p-5 md:p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <SoftIcon>
            <Image src="/timeDate.svg" alt="Time" width={20} height={20} />
          </SoftIcon>

          <div>
            <h3 className="text-[16px] font-bold text-[#1F2937]">
              {t('serviceMarket.rfq.details.timeRemaining.title')}
            </h3>
            <p className="mt-2 text-sm text-[#98A2B3]">
              {timeRemaining?.expired ? (
                <span className="font-semibold text-[#F04438]">{t('serviceMarket.rfq.details.timeRemaining.expired')}</span>
              ) : (
                <>
                  {timeRemaining?.totalHours && timeRemaining.totalHours > 100 ? (
                    <span className="font-semibold text-[#344054]">{Math.floor(timeRemaining.totalHours / 24)} {t('serviceMarket.rfq.details.timeRemaining.days')}</span>
                  ) : timeRemaining?.totalHours ? (
                    <span className="font-semibold text-[#344054]">{timeRemaining.totalHours} {t('serviceMarket.rfq.details.timeRemaining.hour')} {timeRemaining.minutes} {t('serviceMarket.rfq.details.timeRemaining.mins')}</span>
                  ) : null} {t('serviceMarket.rfq.details.timeRemaining.description')}
                </>
              )}
            </p>
          </div>
        </div>

        {timeRemaining && !timeRemaining.expired ? (
          <div className="flex items-center gap-6 md:gap-8">
            <CountdownBox value={String(timeRemaining.days).padStart(2, '0')} label={t('serviceMarket.rfq.details.timeRemaining.days')} />
            <CountdownBox value={String(timeRemaining.hours).padStart(2, '0')} label={t('serviceMarket.rfq.details.timeRemaining.hours')} />
            <CountdownBox value={String(timeRemaining.minutes).padStart(2, '0')} label={t('serviceMarket.rfq.details.timeRemaining.mins')} />
          </div>
        ) : (
          <div className="text-[18px] font-bold text-[#F04438]">
            {t('serviceMarket.rfq.details.timeRemaining.expiredText')}
          </div>
        )}
      </div>
    </SectionCard>
  );
};

export default TimeRemainingCard;