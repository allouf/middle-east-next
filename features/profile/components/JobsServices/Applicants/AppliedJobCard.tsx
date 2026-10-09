import React, { useState, useEffect } from 'react';
import { MapPin, DollarSign, Calendar, Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { JobApplication } from '../types';
import { formatEmploymentType, formatWorkMode } from '../helper';
import { EmploymentType, WorkMode } from '../enums';

import { useTranslation } from '@/lib/i18n/useTranslation';
import { useLocaleDirection } from '@/lib/i18n/useLocaleDirection';

interface AppliedJobCardProps {
  job: JobApplication;
  statusConfig: Record<string, { label: string; key: string; }>;
  onViewDetails?: (jobId: string | number) => void;
  onWithdraw?: (jobId: string | number) => void;
}

import SafeHtml from "@/components/shared/SafeHtml";

const AppliedJobCard: React.FC<AppliedJobCardProps> = ({
  job,
  statusConfig,
  onViewDetails,
  onWithdraw
}) => {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const { isRTL } = useLocaleDirection();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const jobDetails = job.job;
  const employer = jobDetails?.employer;
  const category = jobDetails?.category;

  const statusLabel = t(`jobs.applicationStatus.${job.status}`, { defaultValue: statusConfig[job.status]?.label || job.status });

  return (
    <div className="rounded-[8px] border border-[#3232320D]/5 p-4 xl:p-5 hover:shadow-md transition-shadow">
      <div className='flex flex-row justify-between gap-4'>
        <div className='flex md:flex-row flex-col gap-4 flex-1 overflow-hidden '>
          <div className='flex flex-row justify-between'>
            <div className='w-[70px] h-[70px] relative'>
              <Image
                src={employer?.logo || "https://placehold.co/70x70/00664F/ffffff?text=J"}
                alt={employer?.name || "Company"}
                fill
                className='rounded-full object-cover'
              />
            </div>
            {isMobile && (
              <div className='flex flex-col gap-2'>
                <div className={`px-3 py-2 bg-[#C62F9442] text-[#C62F94] text-[11px] font-medium text-center`}>
                  {statusLabel}
                </div>

                <button
                  className="text-blueSite hover:text-blueSite/80 text-[16px] underline underline-offset-2 font-medium flex flex-row items-center gap-2"
                  onClick={() => onViewDetails?.(job.id)}
                >
                  {t('jobs.viewDetails', { defaultValue: 'View Details' })} {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>
          <div className='space-y-2'>
            <h3 className="font-medium text-subTitleColor text-[16px]">{employer?.name || t('common.na')}</h3>
            <h4 className="font-medium text-blueSite text-[23px]">{jobDetails?.title}</h4>

            {/* Job Details */}
            <div className="flex flex-wrap items-center gap-2 text-gray-600 text-sm mb-3">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-blueSite" />
                <span>{jobDetails?.location?.display || t('common.na')}</span>
              </div>
              <span className="text-gray-400">•</span>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-blueSite" />
                <span>
                  {jobDetails?.employment_type
                    ? formatEmploymentType(t, jobDetails.employment_type as EmploymentType)
                    : t('common.na')}
                </span>
              </div>
              <span className="text-gray-400">•</span>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-blueSite" />
                <span>{jobDetails?.salary_range ? `${jobDetails.salary_range.min} - ${jobDetails.salary_range.max}` : t('common.na')}</span>
              </div>
              <span className="text-gray-400">•</span>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-blueSite" />
                <span>{new Date(job.created_at).toLocaleDateString()}</span>
              </div>
              <span className="text-gray-400">•</span>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-blueSite" />
                <span>
                  {jobDetails?.work_mood
                    ? formatWorkMode(t, jobDetails.work_mood as WorkMode)
                    : t('common.na')}
                </span>
              </div>
            </div>

            {/* Description might not be in the slim object either */}
            {jobDetails?.description && (
              <SafeHtml
                className="space-y-2 text-sm text-textColor mt-2"
                html={typeof jobDetails.description === 'string' ? jobDetails.description : ''}
                config="STRICT"
              />
            
            )}
          </div>  
        </div>

        {/* actions  */}
        {!isMobile && (
          <div className=' flex flex-col gap-2 min-w-[100px]'>
            <div className={`px-3 py-2 bg-[#C62F9442] text-[#C62F94] text-[11px] font-medium text-center`}>
              {statusLabel}
            </div>

            <button
              className="text-blueSite hover:text-blueSite/80 text-[16px] underline underline-offset-2 font-medium flex flex-row items-center gap-2"
              onClick={() => onViewDetails?.(job.id)}
            >
              {t('jobs.viewDetails', { defaultValue: 'View Details' })} {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppliedJobCard;
