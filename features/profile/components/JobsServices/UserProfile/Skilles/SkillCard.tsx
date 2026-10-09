import React from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { FaTrash } from 'react-icons/fa';
import { FiEdit3 } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import { SkillRecord } from './skill';
import { AwardIcon } from '../../Icons/AwardIcon';

interface SkillCardProps {
    skill: SkillRecord;
    handleEditClick: (skill: SkillRecord) => void;
    handleDeleteClick: (id: string | number) => void;
}

const SkillCard = ({ skill, handleEditClick, handleDeleteClick }: SkillCardProps) => {
    const { t } = useTranslation();

    return (
        <div className="p-4 rounded-[10px] bg-[#06B1870F] border border-[#06B1871A] flex flex-row items-center justify-between">
            <div className='flex flex-row gap-3 items-center'>
                <div className="w-10 h-10 bg-[#06B1871A] rounded-full flex items-center justify-center text-[#06B187]">
                    <AwardIcon className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-[17px] text-subTitleColor font-semibold capitalize">{skill.skill_name}</h3>
                </div>
            </div>

            <div className='flex flex-row gap-2'>
                <Button unstyled scale={1.03} onClick={() => handleEditClick(skill)}>
                    <FiEdit3 className="w-4 h-4 text-blueSite" />
                </Button>
                <Button unstyled scale={1.03} onClick={() => handleDeleteClick(skill.id)}>
                    <FaTrash className="w-4 h-4 text-red-500" />
                </Button>
            </div>
        </div>
    );
};

export default SkillCard;
