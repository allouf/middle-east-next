import React, { useMemo } from 'react'
import { Languages, Eye } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { Divider } from 'antd'
import { FaTrash } from 'react-icons/fa'
import { ListIcon } from '../../Icons/ListIcon'
import { FiEdit3 } from 'react-icons/fi'
import Button from '@/components/ui/Button'
import { Language } from './language'
import { LanguagesIcon } from '../../Icons/LanguagesIcon'

interface LanguageCardProps {
    language: Language;
    handleEditClick: (language: Language) => void;
    handleDeleteClick: (id: string | number) => void;
    handleViewDetails: (language: Language) => void;
}

const LanguageCard = ({ language, handleEditClick, handleDeleteClick, handleViewDetails }: LanguageCardProps) => {
    const { t } = useTranslation();

    const { levelLabel, colors } = useMemo(() => {
        const level = language.level;
        let label = '';
        let colorScheme;

        switch (level) {
            case 1:
                label = t('jobs.userProfile.languages.levels.beginner', { defaultValue: 'Beginner' });
                colorScheme = {
                    bg: 'bg-[#56E8A70F]',
                    text: 'text-[#56E8A7]',
                    accent: 'bg-[#00664F33]',
                    btnText: 'text-[#00664F]'
                };
                break;
            case 2:
                label = t('jobs.userProfile.languages.levels.elementary', { defaultValue: 'Elementary' });
                colorScheme = {
                    bg: 'bg-[#56E8A70F]',
                    text: 'text-[#56E8A7]',
                    accent: 'bg-[#00664F33]',
                    btnText: 'text-[#00664F]'
                };
                break;
            case 3:
                label = t('jobs.userProfile.languages.levels.intermediate', { defaultValue: 'Intermediate' });
                colorScheme = {
                    bg: 'bg-[#FB8A2E0F]',
                    text: 'text-[#FB8A2E]',
                    accent: 'bg-[#FB8A2E33]',
                    btnText: 'text-[#FB8A2E]'
                };
                break;
            case 4:
                label = t('jobs.userProfile.languages.levels.upper_intermediate', { defaultValue: 'Upper-intermediate' });
                colorScheme = {
                    bg: 'bg-[#6A45BE0F]',
                    text: 'text-[#6A45BE]',
                    accent: 'bg-[#6A45BE33]',
                    btnText: 'text-[#6A45BE]'
                };
                break;
            case 5:
                label = t('jobs.userProfile.languages.levels.advanced_fluent', { defaultValue: 'Advanced / Fluent' });
                colorScheme = {
                    bg: 'bg-[#C62F940F]',
                    text: 'text-[#C62F94]',
                    accent: 'bg-[#C62F9433]',
                    btnText: 'text-[#C62F94]'
                };
                break;
            default:
                label = t('jobs.userProfile.languages.levels.beginner', { defaultValue: 'Beginner' });
                colorScheme = {
                    bg: 'bg-[#56E8A70F]',
                    text: 'text-[#56E8A7]',
                    accent: 'bg-[#00664F33]',
                    btnText: 'text-[#00664F]'
                };
        }

        return { levelLabel: label, colors: colorScheme };
    }, [language.level, t]);

    return (
        <div className={`p-4 rounded-[10px] ${colors.bg}`}>
            {/* header  */}
            <div className='flex flex-row gap-2 items-center justify-between'>
                <div className='flex flex-row gap-2 items-center'>
                    <div className="w-12 h-12 bg-[#00664F4D] rounded-full flex items-center justify-center text-blueSite">
                        <LanguagesIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-[18px] text-subTitleColor font-semibold">{language.language}</h3>
                        <p className={`text-sm font-medium ${colors.text}`}>{levelLabel}</p>
                    </div>
                </div>

                <div className='flex flex-row gap-2'>
                    {/* <Button unstyled scale={1.03} onClick={() => handleViewDetails(language)}>
                        <Eye className="w-5 h-5 text-blueSite" />
                    </Button> */}
                    <Button unstyled scale={1.03} onClick={() => handleEditClick(language)}>
                        <FiEdit3 className="w-5 h-5 text-blueSite" />
                    </Button>
                    <Button unstyled scale={1.03} onClick={() => handleDeleteClick(language.id)}>
                        <FaTrash className="w-4 h-4 text-red-500" />
                    </Button>
                </div>
            </div>

            <Divider className='!my-3' />
            {/* body  */}
            <div>
                <ul className='space-y-2 text-[15px]'>
                    <li className='flex flex-row gap-2 items-center'>
                        <ListIcon />
                        <span className='text-textGrayColor text-sm'>{t('jobs.userProfile.languages.level', { defaultValue: 'Proficiency Level' })} :</span>
                        <span className='text-subTitleColor font-medium'>{levelLabel}</span>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default LanguageCard
