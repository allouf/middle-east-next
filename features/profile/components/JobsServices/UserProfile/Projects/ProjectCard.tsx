import React, { useMemo, useState } from 'react'
import { Folder, Calendar, ExternalLink, Eye } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { Divider } from 'antd'
import { FaArrowRight, FaTrash } from 'react-icons/fa'
import { ListIcon } from '../../Icons/ListIcon'
import { FiEdit3 } from 'react-icons/fi'
import dayjs from 'dayjs'
import Button from '@/components/ui/Button'
import { Project } from './project'
import { FolderIcon } from '../../Icons/FolderIcon'

interface ProjectCardProps {
    project: Project;
    handleEditClick: (project: Project) => void;
    handleDeleteClick: (id: string | number) => void;
    handleViewDetails: (project: Project) => void;
}

const ProjectCard = ({ project, handleEditClick, handleDeleteClick, handleViewDetails }: ProjectCardProps) => {
    const { t } = useTranslation();
    const [expanded, setExpanded] = useState(false);

    const { durationText, colors } = useMemo(() => {
        const start = dayjs(project.start_date);
        const end = project.end_date ? dayjs(project.end_date) : dayjs();

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
    }, [project, t]);

    const showReadMore = (project.description?.length ?? 0) > 100;

    return (
        <div className={`p-4 rounded-[10px] ${colors.bg}`}>
            {/* header  */}
            <div className='flex flex-row gap-2 items-center justify-between'>
                <div className='flex flex-row gap-2 items-center'>
                    <div className="w-12 h-12 bg-[#00664F4D] rounded-full flex items-center justify-center text-blueSite">
                        <FolderIcon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <div>
                            <h3 className="text-[18px] text-subTitleColor line-clamp-1 font-semibold">{project.title}</h3>
                        </div>
                        <div className="flex flex-row items-center gap-1 text-textGrayColor text-sm">
                            <Button unstyled scale={1.03} className='text-textGrayColor underline' to={project.project_url}>
                                Link Project
                            </Button>
                            {/* <span className="flex flex-row items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(project.start_date).toLocaleDateString()}
                            </span>
                            <FaArrowRight className="w-2 h-2" />
                            <span className="flex flex-row items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {project.end_date ? new Date(project.end_date).toLocaleDateString() : t('jobs.userProfile.workExperience.present', { defaultValue: 'Present' })}
                            </span> */}
                        </div>
                    </div>
                </div>

                <div className='flex flex-row gap-2 shrink-0'>
                    {/* <Button unstyled scale={1.03} onClick={() => handleViewDetails(project)}>
                        <Eye className="w-5 h-5 text-blueSite" />
                    </Button> */}
                    <Button unstyled scale={1.03} onClick={() => handleEditClick(project)}>
                        <FiEdit3 className="w-5 h-5 text-blueSite" />
                    </Button>
                    <Button unstyled scale={1.03} onClick={() => handleDeleteClick(project.id)}>
                        <FaTrash className="w-4 h-4 text-red-500" />
                    </Button>
                </div>
            </div>

            <Divider className='!my-3' />
            {/* body  */}
            <div className="flex-1">
                <ul className='space-y-2 text-[15px]'>
                    {project.description && (
                        <li className="flex items-start gap-2">
                            <div className="mt-1.5 shrink-0">
                                <ListIcon />
                            </div>

                            <div className="min-w-0 flex-1">
                                <span className="text-textGrayColor text-sm">
                                    {t("jobs.userProfile.projects.description", { defaultValue: "Description" })}:
                                </span>

                                <div className="mt-1">
                                    <p
                                        className={[
                                            "text-subTitleColor font-medium",
                                            "whitespace-pre-wrap break-words",
                                            "min-w-0 w-full",
                                            expanded ? "" : "line-clamp-2",
                                        ].join(" ")}
                                    >
                                        {project.description}
                                    </p>

                                    {showReadMore && (
                                        <button
                                            type="button"
                                            onClick={() => setExpanded((v) => !v)}
                                            className="text-blueSite hover:text-blueSiteHover text-sm font-medium underline mt-1"
                                        >
                                            {expanded
                                                ? t("common.showLess", { defaultValue: "Show less" })
                                                : t("common.readMore", { defaultValue: "Read more" })}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </li>
                    )}
                </ul>
            </div>

            {/* footer  */}
            {/* <div className='flex flex-row justify-between pt-4 items-center'>
                <span className={`text-sm font-semibold ${colors.text}`}>
                    {t('jobs.userProfile.workExperience.durationLabel', { defaultValue: 'Duration' })}: {durationText}
                </span>

                <button
                    type="button"
                    className={`rounded-md px-3 py-1 ${colors.accent} ${colors.btnText} underline cursor-pointer font-semibold text-sm`}
                    onClick={() => project.project_url && window.open(project.project_url, '_blank')}
                >
                    {t('common.details', { defaultValue: 'Details' })}
                </button>
            </div> */}
        </div>
    )
}

export default ProjectCard
