import React, { useMemo, useState } from 'react'
import { GraduationCap, Calendar } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { Divider } from 'antd'
import { FaArrowRight, FaTrash, FaEye } from 'react-icons/fa'
import { ListIcon } from '../../Icons/ListIcon'
import { FiEdit3 } from 'react-icons/fi'
import dayjs from 'dayjs'
import Button from '@/components/ui/Button'
import { AcademicRecord } from './academic'
import { AcademicIcon } from '../../Icons/AcademicIcon'
import { formatDegreeType } from '../../helper'

interface AcademicCardProps {
    record: AcademicRecord;
    handleEditClick: (record: AcademicRecord) => void;
    handleDeleteClick: (id: string | number) => void;
    handleViewDetails?: (record: AcademicRecord) => void;
}

const AcademicCard = ({ record, handleEditClick, handleDeleteClick, handleViewDetails }: AcademicCardProps) => {
    const { t } = useTranslation();
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    const { durationText, colors } = useMemo(() => {
        const start = dayjs(record.start_date);
        const end = record.is_current ? dayjs() : (record.end_date ? dayjs(record.end_date) : dayjs());

        const totalMonths = end.diff(start, 'month');
        const years = end.diff(start, 'year');
        const months = end.diff(start.add(years, 'year'), 'month');
        const days = end.diff(start.add(years, 'year').add(months, 'month'), 'day');

        // Format duration text
        const parts = [];
        if (years) parts.push(`${years} ${t('jobs.userProfile.workExperience.years', { defaultValue: 'years' })}`);
        if (months) parts.push(`${months} ${t('jobs.userProfile.workExperience.months', { defaultValue: 'months' })}`);
        if (days && !years) parts.push(`${days} ${t('jobs.userProfile.workExperience.days', { defaultValue: 'days' })}`);

        const text = parts.length > 0 ? parts.join(', ') : t('jobs.userProfile.workExperience.lessThanMonth', { defaultValue: 'less than a month' });

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
    }, [record, t]);

    return (
        <div className={`p-4 rounded-[10px] ${colors.bg}`}>
            {/* header  */}
            <div className='flex flex-row gap-2 items-center justify-between'>
                <div className='flex flex-row gap-2 items-center'>
                    <div className="w-12 h-12 bg-[#00664F4D] rounded-full flex items-center justify-center text-blueSite">
                        <AcademicIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <div>
                            <h3 className="text-[18px] text-subTitleColor line-clamp-1 first-letter:uppercase">{formatDegreeType(t, record.degree_type)}</h3>
                        </div>
                        <div className="flex flex-row items-center gap-1 text-textGrayColor">
                            <span className="flex flex-row items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {dayjs(record.start_date).format('DD/MM/YYYY')}
                            </span>
                            <FaArrowRight />
                            <span className="flex flex-row items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {record.is_current ? t('jobs.userProfile.workExperience.present', { defaultValue: 'Present' }) : record.end_date ? dayjs(record.end_date).format('DD/MM/YYYY') : ''}
                            </span>
                        </div>
                    </div>
                </div>

                <div className='flex flex-row gap-3'>
                    {/* {handleViewDetails && (
                        <Button unstyled scale={1.03} onClick={() => handleViewDetails(record)}>
                            <FaEye className="w-4 h-4 text-blueSite" />
                        </Button>
                    )} */}
                    <Button unstyled scale={1.03} onClick={() => handleEditClick(record)}>
                        <FiEdit3 className="w-5 h-5 text-blueSite" />
                    </Button>
                    <Button unstyled scale={1.03} onClick={() => handleDeleteClick(record.id)}>
                        <FaTrash className="w-4 h-4 text-red-500" />
                    </Button>
                </div>
            </div>

            <Divider className='!my-3' />
            {/* body  */}
            <div>
                <ul className='space-y-2 text-[16px]'>
                    <li className='flex flex-row gap-2 items-center'><ListIcon /> <span className='text-textGrayColor'>{t('jobs.userProfile.academicCertificates.university', { defaultValue: 'University Name' })} :</span> <span className='text-subTitleColor font-medium'>{record.university_name}</span></li>
                    <li className='flex flex-row gap-2 items-center'><ListIcon /> <span className='text-textGrayColor'>{t('jobs.userProfile.academicCertificates.specialization', { defaultValue: 'Specialization' })} :</span> <span className='text-subTitleColor font-medium'>{record.major}</span></li>

                    {record.description && (
                        <li className='flex flex-col gap-2 items-start'>
                            <div className='flex flex-row gap-2 items-center w-full'>
                                <ListIcon /> 
                                <span className='text-textGrayColor'>{t('jobs.userProfile.academicCertificates.description', { defaultValue: 'Description' })} :</span>
                            </div>
                            <div className='ml-6'>
                                <span className={`text-subTitleColor font-medium ${isDescriptionExpanded ? '' : 'line-clamp-1'}`}>
                                    {record.description}
                                </span>
                                {record.description.length > 100 && (
                                    <button
                                        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                        className='text-blueSite underline ml-2 text-sm font-medium hover:text-blue-600 transition-colors'
                                    >
                                        {isDescriptionExpanded ? t('common.readLess', { defaultValue: 'Read Less' }) : t('common.readMore', { defaultValue: 'Read More' })}
                                    </button>
                                )}
                            </div>
                        </li>
                    )}
                    {/* {record.is_current && record.expected_graduation_date && (
                        <li className='flex flex-row gap-2 items-center'><ListIcon /> <span className='text-textGrayColor'>{t('jobs.userProfile.academicCertificates.expectedGraduation', { defaultValue: 'Expected Graduation' })} :</span> <span className='text-subTitleColor font-medium'>{new Date(record.expected_graduation_date).toLocaleDateString()}</span></li>
                    )} */}
                </ul>
            </div>
            {/* footer  */}
            {/* <div className='flex flex-row justify-between pt-4'>
                <span className={`text-[16px] font-semibold ${colors.text}`}>
                    {t('jobs.userProfile.workExperience.durationLabel', { defaultValue: 'Duration' })}: {durationText}
                </span>
                <button type="button" className={`rounded-sm px-3 py-1 ${colors.accent} ${colors.btnText} underline cursor-pointer font-semibold`}>
                    {t('common.details', { defaultValue: 'Details' })}
                </button>
            </div> */}
        </div>
    )
}

export default AcademicCard
