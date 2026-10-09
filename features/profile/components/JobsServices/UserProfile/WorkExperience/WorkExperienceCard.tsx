import React, { useMemo } from 'react'
import { WorkExperience } from './experience'
import { Calendar, Eye } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { Divider, Spin, message } from 'antd'
import { FaArrowRight, FaTrash } from 'react-icons/fa'
import { BriefcaseIcon } from '../../Icons/BriefcaseIcon'
import { ListIcon } from '../../Icons/ListIcon'
import { FiEdit3 } from 'react-icons/fi'
import dayjs from 'dayjs'
import Button from '@/components/ui/Button'

const WorkExperienceCard = ({
    experience,
    handleEditClick,
    handleDeleteClick,
    handleTerminate,
    handleViewDetails,
    isTerminating = false
}: {
    experience: WorkExperience,
    handleEditClick: (exp: WorkExperience) => void,
    handleDeleteClick: (id: string | number) => void,
    handleTerminate: (exp: WorkExperience) => void,
    handleViewDetails: (exp: WorkExperience) => void,
    isTerminating?: boolean
}) => {
    const { t } = useTranslation();
    const [messageApi, contextHolder] = message.useMessage();

    const { durationText, colors } = useMemo(() => {
        const start = dayjs(experience.start_date);
        const end = experience.is_current ? dayjs() : (experience.end_date ? dayjs(experience.end_date) : dayjs());

        const totalMonths = end.diff(start, 'month');
        const years = end.diff(start, 'year');
        const months = end.diff(start.add(years, 'year'), 'month');
        const days = end.diff(start.add(years, 'year').add(months, 'month'), 'day');

        // Format duration text
        const parts = [];
        if (years) parts.push(`${years} ${t('jobs.userProfile.workExperience.years')}`);
        if (months) parts.push(`${months} ${t('jobs.userProfile.workExperience.months')}`);
        if (days && !years) parts.push(`${days} ${t('jobs.userProfile.workExperience.days')}`);

        const text = parts.length > 0 ? parts.join(', ') : t('jobs.userProfile.workExperience.lessThanMonth');


        let colorScheme;
        if (totalMonths < 6) {
            colorScheme = {
                bg: 'bg-[#56E8A70F]',
                text: 'text-[#56E8A7]',
                accent: 'bg-[#00664F33]',
                btnText: 'text-[#00664F]'
            };
        } else if (totalMonths < 12) {
            colorScheme = {
                bg: 'bg-[#FB8A2E0F]',
                text: 'text-[#FB8A2E]',
                accent: 'bg-[#FB8A2E33]',
                btnText: 'text-[#FB8A2E]'
            };
        } else if (totalMonths < 36) {
            colorScheme = {
                bg: 'bg-[#6A45BE0F]',
                text: 'text-[#6A45BE]',
                accent: 'bg-[#6A45BE33]',
                btnText: 'text-[#6A45BE]'
            };
        } else {
            colorScheme = {
                bg: 'bg-[#C62F940F]',
                text: 'text-[#C62F94]',
                accent: 'bg-[#C62F9433]',
                btnText: 'text-[#C62F94]'
            };
        }

        return { durationText: text, colors: colorScheme };
    }, [experience, t]);

    return (

        <div className={`p-4 rounded-[10px] ${colors.bg}`}>
            {/* header  */}
            <div className='flex flex-row gap-2 items-center justify-between'>
                <div className='flex flex-row gap-2 items-center'>
                    <div className="w-12 h-12 bg-[#00664F4D] rounded-full flex items-center justify-center text-blueSite">
                        <BriefcaseIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <div>
                            <h3 className="text-[18px]  text-subTitleColor">{experience.job_title}</h3>
                        </div>
                        <div className="flex flex-row  items-center gap-1 text-textGrayColor ">
                            <span className="flex flex-row  items-center gap-1 ">
                                <Calendar className="w-4 h-4" />
                                {dayjs(experience.start_date).format('DD/MM/YYYY')}
                            </span>
                            <FaArrowRight />
                            <span className="flex flex-row  items-center gap-1 ">
                                <Calendar className="w-4 h-4" />
                                {experience.is_current ? t('jobs.userProfile.workExperience.present') : experience.end_date ? dayjs(experience.end_date).format('DD/MM/YYYY') : ''}
                            </span>
                        </div>
                    </div>
                </div>

                <div className='flex flex-row gap-3'>
                    {/* <Button unstyled scale={1.03} onClick={() => handleViewDetails(experience)}>
                        <Eye className="w-5 h-5 text-blueSite" />
                    </Button> */}
                    <Button unstyled scale={1.03} onClick={() => handleEditClick(experience)}>
                        <FiEdit3 className="w-5 h-5 text-blueSite" />
                    </Button>
                    <Button unstyled scale={1.03} onClick={() => handleDeleteClick(experience.id)}>
                        <FaTrash className="w-4 h-4 text-red-500" />
                    </Button>
                </div>
            </div>

            <Divider className='!my-3' />
            {/* body  */}
            <div>
                <ul className='space-y-2 text-[16px]'>
                    <li className='flex flex-row gap-2 items-center'><ListIcon /> <span className='text-textGrayColor '>{t('jobs.userProfile.workExperience.companyName')} :</span> <span className='text-subTitleColor font-medium'>{experience.company_name}</span></li>
                    <li className='flex flex-row gap-2 items-center'><ListIcon /> <span className='text-textGrayColor'>{t('jobs.userProfile.workExperience.jobDescription')} :</span> <span className='text-subTitleColor font-medium'>{experience.description}</span></li>
                    <li className='flex flex-row gap-2 items-center'><ListIcon /> <span className='text-textGrayColor'>{t('jobs.userProfile.workExperience.fieldOfWork')} :</span> <span className='text-subTitleColor font-medium'>{experience.industry}</span></li>
                </ul>
            </div>
            {/* footer  */}

            <div className='flex flex-row justify-between pt-4'>
                <span className={`text-[16px] font-semibold ${colors.text}`}>
                    {t('jobs.userProfile.workExperience.durationLabel')}: {durationText}
                </span>

                {experience.is_current && (
                    <button
                        type="button"
                        disabled={isTerminating}
                        onClick={() => handleTerminate(experience)}
                        className={`rounded-sm px-3 py-1 ${colors.accent} ${colors.btnText} underline cursor-pointer font-semibold flex items-center gap-2 disabled:opacity-50`}
                    >
                        {isTerminating && <Spin size="small" />}
                        {t('jobs.userProfile.workExperience.termination')}
                    </button>
                )}
            </div>
        </div>

    )
}

export default WorkExperienceCard
