import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import Button from '@/components/ui/Button';
import useFormData from '@/lib/Hooks/useFormData';
import MultiSelectFieldWithSearch from '@/components/ui/MultiSelectFieldWithSearch';
import GlowLight from '@/components/shered/GlowLight';
import useJobProfileApi from '../useJobProfileApi';
import { SkillRecord } from './skill';
import { StarIcon } from '../../Icons/StarIcon';

interface SkillsFormData {
    skills: (string | number)[];
}

interface SkillFormProps {
    onBack?: () => void;
    onSuccess?: () => void;
    initialSkills?: SkillRecord[];
}

const SkillForm: React.FC<SkillFormProps> = ({ onBack, onSuccess, initialSkills }) => {
    const { t } = useTranslation();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { addSkill, updateSkill, loading } = useJobProfileApi();

    const initialFormData: SkillsFormData = {
        skills: []
    };

    const {
        formData,
        setFormData,
        handleArrayChange,
        errors,
        handleAddError,
        isValid,
        resetForm
    } = useFormData<SkillsFormData>(initialFormData);

    useEffect(() => {
        if (initialSkills) {
            setFormData({
                skills: initialSkills.map(s => (s as any).skill_id || s.id)
            });
        }
    }, [initialSkills, setFormData]);

    const handleSubmit = async () => {
        setIsSubmitted(true);
        if (!isValid) return;

        if (!formData.skills || formData.skills.length === 0) {
            handleAddError('skills', t("errorRequired"));
            return;
        }

        try {
            const payload = {
                items: formData.skills.map(id => ({ skill_id: Number(id) }))
            };

            console.log("paload", payload);
            if (initialSkills && initialSkills.length > 0) {
                await updateSkill(payload, { showMessage: true });
            } else {
                await addSkill(payload, { showMessage: true });
            }

            if (onSuccess) {
               onSuccess()
            }
            if (onBack) {
                onBack()
            }
        } catch (error) {
            console.error('Failed to save skill:', error);
        }
    };

    const handleCancel = () => {
        resetForm();
        if (onBack) onBack();
    };

    return (
        <div className='pb-5'>

            <div className="w-full bg-[#FCFCFC] rounded-[20px] p-6 relative overflow-hidden">
                <div className='text-[17px] text-[#676767] flex flex-row items-center gap-2 mb-6'>
                    <span>
                        <StarIcon className="w-5 h-5" />
                    </span>
                    <span>
                        {t('jobs.userProfile.certificationsSkills.skillsTitle')}
                    </span>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-1 gap-6'>
                    <MultiSelectFieldWithSearch
                        id="skills"
                        label={t('jobs.userProfile.certificationsSkills.skills')}
                        values={formData.skills}
                        onChange={(val) => handleArrayChange("skills", val)}
                        url="/skills/available"
                        enabled={true}
                        unstyled
                        required
                        validate={true}
                        formErrors={errors}
                        handleAddError={handleAddError}
                        isSubmited={isSubmitted}
                        onSubmit={true}

                    />
                </div>

                <div className="flex gap-4 mt-8 pt-6">
                    <Button 
                        unstyled
                        className="px-20 text-white font-somar-semibold  py-2 bg-blueSite hover:bg-blueSite/90 rounded-[10px] text-[20px]"
                        onClick={handleSubmit}
                        disabled={!isValid || loading}
                    >
                        {loading ? t('common.confirming') : t('jobs.userProfile.certificationsSkills.confirm')}
                    </Button>
                    <Button
                        className="px-6 py-2 text-blueSite underline underline-offset-2 text-[20px]"
                        unstyled
                        onClick={handleCancel}
                    >
                        {t('common.cancel')}
                    </Button>
                </div>

                <GlowLight
                    color="#06B187"
                    size="w-[55px]  h-[40px]"
                    opacity="opacity-80"
                    blur="blur-[35px] sm:blur-[35px]"
                    position="top-0 right-0"
                />
                <GlowLight
                    color="#06B187"
                    size="w-[50px]  h-[40px]"
                    opacity="opacity-80"
                    blur="blur-[35px] sm:blur-[35px]"
                    position="bottom-0 left-0"
                />
            </div>
        </div>
    );
};

export default SkillForm;
