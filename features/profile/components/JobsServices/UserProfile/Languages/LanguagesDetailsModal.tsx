"use client";

import React, { useMemo } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Languages, Award, BookOpen, Star, TrendingUp } from "lucide-react";
import { Modal, Button, Tag } from "antd";
import type { Language } from "./language";

interface LanguagesDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: Language | null;
  onEdit?: (record: Language) => void;
}

const FieldCard = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="group relative rounded-xl sm:rounded-2xl border border-grayBorder/50 bg-white p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
      
      <div className="relative flex items-start gap-3 sm:gap-4">
        <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blueSite flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110">
          {icon}
        </div>
        <div className="min-w-0 w-full">
          <p className="text-xs sm:text-sm text-textGrayColor font-medium tracking-wide">{title}</p>
          <div className="mt-1 sm:mt-2 text-subTitleColor font-semibold break-words text-sm sm:text-base leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
};

const LanguagesDetailsModal: React.FC<LanguagesDetailsModalProps> = ({
  isOpen,
  onClose,
  record,
  onEdit,
}) => {
  const { t } = useTranslation();

  const { levelLabel, colors } = useMemo(() => {
    if (!record) return { levelLabel: "", colors: { text: "text-gray-500" } };
    
    const level = record.level;
    let label = '';
    let colorScheme;

    switch (level) {
      case 1:
        label = t('jobs.userProfile.languages.levels.beginner', { defaultValue: 'Beginner' });
        colorScheme = {
          text: 'text-[#56E8A7]',
          bg: 'bg-[#56E8A70F]',
          progress: 'bg-gradient-to-r from-[#00664F] to-[#56E8A7]'
        };
        break;
      case 2:
        label = t('jobs.userProfile.languages.levels.elementary', { defaultValue: 'Elementary' });
        colorScheme = {
          text: 'text-[#56E8A7]',
          bg: 'bg-[#56E8A70F]',
          progress: 'bg-gradient-to-r from-[#00664F] to-[#56E8A7]'
        };
        break;
      case 3:
        label = t('jobs.userProfile.languages.levels.intermediate', { defaultValue: 'Intermediate' });
        colorScheme = {
          text: 'text-[#FB8A2E]',
          bg: 'bg-[#FB8A2E0F]',
          progress: 'bg-gradient-to-r from-[#00664F] to-[#FB8A2E]'
        };
        break;
      case 4:
        label = t('jobs.userProfile.languages.levels.upper_intermediate', { defaultValue: 'Upper-intermediate' });
        colorScheme = {
          text: 'text-[#6A45BE]',
          bg: 'bg-[#6A45BE0F]',
          progress: 'bg-gradient-to-r from-[#00664F] to-[#6A45BE]'
        };
        break;
      case 5:
        label = t('jobs.userProfile.languages.levels.advanced_fluent', { defaultValue: 'Advanced / Fluent' });
        colorScheme = {
          text: 'text-[#C62F94]',
          bg: 'bg-[#C62F940F]',
          progress: 'bg-gradient-to-r from-[#00664F] to-[#C62F94]'
        };
        break;
      default:
        label = t('jobs.userProfile.languages.levels.beginner', { defaultValue: 'Beginner' });
        colorScheme = {
          text: 'text-[#56E8A7]',
          bg: 'bg-[#56E8A70F]',
          progress: 'bg-gradient-to-r from-[#00664F] to-[#56E8A7]'
        };
    }

    return { levelLabel: label, colors: colorScheme };
  }, [record, t]);

  if (!record) return null;

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={{ xs: '95vw', sm: '90vw', md: '85vw', lg: 920 }}
      className="languages-details-modal"
      styles={{
        body: { padding: 0, maxHeight: '90vh', overflowY: 'auto' },
        mask: { backdropFilter: 'blur(8px)' },
      }}
    >
      <div className="overflow-hidden rounded-3xl bg-white">
        {/* Header */}
        <div className="relative px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-7 border-b border-grayBorder/30 bg-white">
          
          <div className="relative flex items-start gap-3 sm:gap-4 md:gap-5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-2xl sm:rounded-3xl bg-blueSite text-white flex items-center justify-center shadow-xl animate-pulse">
              <Languages className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-subTitleColor break-words">
                  {record.language}
                </h2>

                <Tag className="m-0 rounded-full px-2 sm:px-3 md:px-4 py-0.5 sm:py-1 text-xs font-semibold border-0 bg-blueSite/20 text-blueSite shadow-sm">
                  {levelLabel}
                </Tag>
              </div>

              <p className="mt-1 sm:mt-2 text-sm sm:text-base md:text-lg text-textGrayColor break-words font-medium">
                {t('jobs.userProfile.languages.proficiencyLevel', { defaultValue: 'Proficiency Level' })}: {levelLabel}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-7 bg-blueLight/5">
          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6">
            {/* Language Info */}
            <div className="space-y-3 sm:space-y-4 md:space-y-5">
              <FieldCard
                icon={<Languages className="w-5 h-5 sm:w-6 sm:h-6" />}
                title={t('jobs.userProfile.languages.languageName', { defaultValue: 'Language Name' })}
              >
                {record.language}
              </FieldCard>

              <FieldCard
                icon={<Award className="w-5 h-5 sm:w-6 sm:h-6" />}
                title={t('jobs.userProfile.languages.level', { defaultValue: 'Proficiency Level' })}
              >
                <div className="flex items-center gap-3">
                  <span className={`${colors.text} ${colors.bg} px-3 py-1 rounded-full font-medium text-sm`}>
                    {levelLabel}
                  </span>
                  <span className="text-subTitleColor font-semibold text-sm">
                    ({record.level}/5)
                  </span>
                </div>
              </FieldCard>

              <FieldCard
                icon={<TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />}
                title={t('jobs.userProfile.languages.progress', { defaultValue: 'Progress' })}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-3 shadow-inner">
                    <div 
                      className={`h-3 rounded-full bg-blueSite transition-all duration-700 ease-out shadow-lg hover:shadow-xl`}
                      style={{ width: `${(record.level / 5) * 100}%` }}
                    />
                  </div>
                  <span className={`${colors.text} font-bold text-sm min-w-[45px] text-center`}>
                    {Math.round((record.level / 5) * 100)}%
                  </span>
                </div>
              </FieldCard>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
            {onEdit ? (
              <Button
                type="primary"
                className="h-11 sm:h-12 md:h-13 w-full sm:w-auto sm:flex-1 bg-blueSite border-0 hover:!bg-blueSiteHover font-semibold rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] text-sm sm:text-base"
                onClick={() => {
                  onClose();
                  onEdit(record);
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  {t("common.edit", { defaultValue: "Edit" })}
                </span>
              </Button>
            ) : null}

            <Button
              className="h-11 sm:h-12 md:h-13 w-full sm:w-auto sm:flex-1 rounded-xl sm:rounded-2xl border-grayBorder/50 bg-white text-subTitleColor hover:!bg-grayLight hover:!border-blueSite/30 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] text-sm sm:text-base"
              onClick={onClose}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                {t("common.close", { defaultValue: "Close" })}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LanguagesDetailsModal;
