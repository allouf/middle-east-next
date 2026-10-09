"use client";

import React from 'react';
import { JobFormData } from '../types';
import { ExperienceLevel, EmploymentType } from '../enums';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useLocaleDirection } from '@/lib/i18n/useLocaleDirection';
import { formatCurrency } from '../helper';

interface PreviewJobProps {
    data: JobFormData;
    onBack: () => void;
    onSubmit: () => void;
    onSaveDraft: () => void;
}

import SafeHtml from "@/components/shared/SafeHtml";

const PreviewJob: React.FC<PreviewJobProps> = ({ data, onBack, onSubmit, onSaveDraft }) => {
    const { t } = useTranslation();
    const {isRTL} = useLocaleDirection();
    const handleConfirm = () => {
        onSubmit(); // Usually publishes
    };

    const handleSaveDraft = () => {
        onSaveDraft();
    };

   // console.log("job preview",data)

    return (
        <div className="w-full p-6">
            <div className="mb-6">
                <button
                    onClick={onBack}
                    className="flex items-center text-[#00664F] hover:underline gap-2 font-medium uppercase text-sm"
                >
                    {isRTL?<ArrowRight className="w-4 h-4" />:<ArrowLeft className="w-4 h-4" />}
                    {t("buttons.goBack", "GO BACK")}
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Column: Job Description */}
                <div className="flex-1">
                    <h1 className="text-2xl font-medium text-[#18191C] mb-1">{data.title}</h1>
                    <p className="text-[#18191C] font-semibold mb-6">{data.categoryName}</p>

                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-[#18191C] mb-2">{t('jobs.details.jobDescription', { defaultValue: 'Job Description :' })}</h3>
                        <SafeHtml className="text-[#424242] text-sm leading-relaxed whitespace-pre-line" html={data.description || ''}
                            config="MODERATE" />
                    </div>
                    {/* <p className='text-[#424242] text-sm'>Want to work with us? You're in good company!</p> */}
                </div>

                {/* Right Column: Job Overview Card */}
                <div className="w-full lg:w-[430px]">
                    <div>
                        <div className="flex justify-between items-start mb-6 bg-white rounded-xl border-2 border-[#E7F0FA] p-6 pb-6 shadow-sm">
                            <div className="w-full flex justify-between items-center">
                                <div className="text-center w-1/2 border-r-2 border-[#E7F0FA] pr-4">
                                    <p className="text-xs font-medium text-[#18191C] uppercase">{t('jobs.details.salary', { defaultValue: 'Salary' })}  {data.currency && formatCurrency(t,data.currency )} </p>
                                    <p className="text-[#00664F] text-lg font-bold">
                                        {data.hideSalary ? "Hidden" : `${data.salaryMin} - ${data.salaryMax}`}
                                    </p>
                                    {/* <p className="text-xs text-[#767F8C]">Yearly salary</p> */}
                                </div>
                                <div className="text-center w-1/2 pl-4">
                                    <div className="flex justify-center mb-1 text-[#00664F]">
                                        <img src={"/MapTrifold.svg"} className="w-6 h-6" alt="location" />
                                    </div>
                                    <p className="text-sm font-medium text-[#18191C]">{t('jobs.details.jobLocation', { defaultValue: 'Job Location' })}</p>
                                    <p className="text-[#767F8C] text-sm">{data.city}, {data.country}</p>
                                </div>
                            </div>
                        </div>

                        <div className='bg-white rounded-xl border-2 border-[#E7F0FA] p-6 shadow-sm'>
                            <h3 className="text-md font-medium text-[#18191C] mb-5">{t('jobs.details.jobOverview', { defaultValue: 'Job Overview' })}</h3>

                            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                {/* Visibility Duration */}
                                <div>
                                    <div className="text-[#00664F] mb-2"><img src={"/CalendarBlank.svg"} className="w-6 h-6" alt="duration" /></div>
                                    <p className="text-[10px] text-[#767F8C] uppercase mb-[2px]">{t('jobs.details.visibilityDuration', { defaultValue: 'VISIBILITY DURATION :' })}</p>
                                    <p className="text-sm text-[#18191C] font-medium">{data.visibilityDuration || '30 DAYS'}</p>
                                </div>

                                {/* Application Date */}
                                <div>
                                    <div className="text-[#00664F] mb-2"><img src={"/Timer.svg"} className="w-6 h-6" alt="deadline" /></div>
                                    <p className="text-[10px] text-[#767F8C] uppercase mb-[2px]">{t('jobs.details.applicationDate', { defaultValue: 'APPLICATION DATE:' })}</p>
                                    <p className="text-sm text-[#18191C] font-medium">
                                        {data.applicationDeadline ? new Date(data.applicationDeadline).toLocaleDateString() : '-'}
                                    </p>
                                </div>

                                {/* Experience Level */}
                                <div>
                                    <div className="text-[#00664F] mb-2"><img src={"/Stack.svg"} className="w-6 h-6" alt="level" /></div>
                                    <p className="text-[10px] text-[#767F8C] uppercase mb-[2px]">{t('jobs.details.experienceLevel', { defaultValue: 'EXPERINCE LEVEL:' })}</p>
                                    <p className="text-sm text-[#18191C] font-medium">{data.experienceLevel || ExperienceLevel.JUNIOR}</p>
                                </div>

                                {/* Work Mode */}
                                <div>
                                    <div className="text-[#00664F] mb-2"><img src={"/Wallet.svg"} className="w-6 h-6" alt="mode" /></div>
                                    <p className="text-[10px] text-[#767F8C] uppercase mb-[2px]">{t('jobs.details.workMode', { defaultValue: 'WORK MODE :' })}</p>
                                    <p className="text-sm text-[#18191C] font-medium">{data.workMode}</p>
                                </div>

                                {/* Category */}
                                <div>
                                    <div className="text-[#00664F] mb-2"><img src={"/briefcase.svg"} className="w-6 h-6" alt="category" /></div>
                                    <p className="text-[10px] text-[#767F8C] uppercase mb-[2px]">{t('jobs.details.category', { defaultValue: 'CATEGORY :' })}</p>
                                    <p className="text-sm text-[#18191C] font-medium">{data.categoryName}</p>
                                </div>

                                {/* Employment Type */}
                                <div>
                                    <div className="text-[#00664F] mb-2"><img src={"/briefcase.svg"} className="w-6 h-6" alt="type" /></div>
                                    <p className="text-[10px] text-[#767F8C] uppercase mb-[2px]">{t('jobs.details.employmentType', { defaultValue: 'EMPLOYMENT TYPE :' })}</p>
                                    <p className="text-sm text-[#18191C] font-medium">{data.employmentType || EmploymentType.FULL_TIME}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex flex-col gap-3">
                        <Button
                            scale={1.02}
                            onClick={handleConfirm}
                            className="w-full flex justify-center bg-[#00664F] hover:bg-[#005542] text-white py-3 rounded-lg font-medium transition-colors text-base"
                        >
                            {t('jobs.publish.confirm', { defaultValue: 'Confirm Publish' })}
                        </Button>
                        <Button
                            scale={1.02}
                            onClick={handleSaveDraft}
                            className="w-full flex justify-center text-center border-2 border-blueSite bg-white !text-blueSite hover:bg-blueSite/10 py-3 rounded-lg font-medium transition-colors text-base"
                        >
                            {t('jobs.publish.saveDraft', { defaultValue: 'Save as draft' })}
                        </Button>

                        <button
                            onClick={onBack}
                            className='text-[#BF2033] font-semibold border-b border-[#BF2033] w-fit mx-auto mt-2 text-sm pb-0.5 hover:opacity-80'
                        >
                            {t("buttons.cancel", "Cancel")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreviewJob;
