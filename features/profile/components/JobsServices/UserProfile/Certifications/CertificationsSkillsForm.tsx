import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import Button from '@/components/ui/Button';
import useFormData from '@/lib/Hooks/useFormData';
import SelectField from '@/components/ui/SelectFiled';
import GlowLight from '@/components/shered/GlowLight';
import useJobProfileApi from '../useJobProfileApi';

interface SkillsFormData {
  skill_name: string;
}

interface CertificationsSkillsProps {
  onBack?: () => void;
  onSuccess?: () => void;
}

const CertificationsSkillsForm: React.FC<CertificationsSkillsProps> = ({ onBack, onSuccess }) => {
  const { t } = useTranslation();
  const [isSubmittedSkill, setIsSubmittedSkill] = useState(false);
  const { addSkill, contextHolder, loading: apiLoading } = useJobProfileApi();

  // Initial state for skills form
  const initialSkillsData: SkillsFormData = {
    skill_name: ''
  };

  // Skills options
  const skillsOptions = [
    { id: 'javascript', name: t('jobs.userProfile.certificationsSkills.skillList.javascript') },
    { id: 'typescript', name: t('jobs.userProfile.certificationsSkills.skillList.typescript') },
    { id: 'react', name: t('jobs.userProfile.certificationsSkills.skillList.react') },
    { id: 'nodejs', name: t('jobs.userProfile.certificationsSkills.skillList.nodejs') },
    { id: 'python', name: t('jobs.userProfile.certificationsSkills.skillList.python') },
    { id: 'java', name: t('jobs.userProfile.certificationsSkills.skillList.java') },
    { id: 'html_css', name: t('jobs.userProfile.certificationsSkills.skillList.html_css') },
    { id: 'sql', name: t('jobs.userProfile.certificationsSkills.skillList.sql') },
    { id: 'git', name: t('jobs.userProfile.certificationsSkills.skillList.git') },
    { id: 'docker', name: t('jobs.userProfile.certificationsSkills.skillList.docker') },
    { id: 'aws', name: t('jobs.userProfile.certificationsSkills.skillList.aws') },
    { id: 'other', name: t('jobs.userProfile.certificationsSkills.skillList.other') }
  ];

  const {
    formData: skillFormData,
    handleChange: handleSkillChange,
    errors: skillErrors,
    handleAddError: handleSkillAddError,
    isValid: skillValid,
    resetForm: resetSkillForm
  } = useFormData<SkillsFormData>(initialSkillsData);

  const handleSkillSubmit = async () => {
    setIsSubmittedSkill(true);
    if (!skillValid) {
      return;
    }
    try {
      const payload = {
        skill_name: skillFormData.skill_name
      };

      await addSkill(payload, { showMessage: true });

      // Handle success
      if (onSuccess) onSuccess();
      if (onBack) onBack();
    } catch (error) {
      console.error('Failed to save skill:', error);
    }
  };

  const handleCancel = () => {
    resetSkillForm();
    if (onBack) onBack();
  };

  return (
    <div className='pb-5'>
      {contextHolder}

      <div className="w-full bg-[#FCFCFC] rounded-[20px] p-6 relative overflow-hidden">
        <div className='text-[17px] text-[#676767] flex flex-row items-center gap-2 mb-6'>
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
              <g clipPath="url(#clip0_348_2043)">
                <path d="M28.9639 28.9651H21.2402V3.86328H28.9639V28.9651Z" fill="#676767" />
                <path d="M19.3096 28.9641H11.5859V11.5859H19.3096V28.9641Z" fill="#676767" />
                <path d="M9.65527 28.9643H1.93164V17.3789H9.65527V28.9643Z" fill="#676767" />
              </g>
              <defs>
                <clipPath id="clip0_348_2043">
                  <rect width="30.8945" height="30.8945" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </span>
          <span>
            {t('jobs.userProfile.certificationsSkills.skillsTitle')}
          </span>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-1 gap-6'>
          <SelectField
            id="skill_name"
            label={t('jobs.userProfile.certificationsSkills.skills')}
            value={skillFormData.skill_name}
            onChange={handleSkillChange('skill_name')}
            formErrors={skillErrors}
            selectorOptions={skillsOptions}
            placeholder={t('jobs.userProfile.certificationsSkills.skillsPlaceholder')}
            withFieldset
            handleAddError={handleSkillAddError}
            validate
            onSubmit={true}
            isSubmited={isSubmittedSkill}
          />
        </div>

        {/* Skills Action Buttons */}
        <div className="flex gap-4 mt-8 pt-6">
          <Button
            className="px-14 text-white font-somar-semibold py-2 bg-blueSite hover:bg-blueSite/90 rounded-[10px] text-[20px]"
            onClick={handleSkillSubmit}
            disabled={!skillValid || apiLoading}
          >
            {apiLoading ? t('common.confirming') : t('jobs.userProfile.certificationsSkills.confirmSkill')}
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

export default CertificationsSkillsForm;
