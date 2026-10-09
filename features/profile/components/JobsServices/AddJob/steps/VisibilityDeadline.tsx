import React from 'react';
import { JobFormData } from '../../types';
import { useTranslation } from '@/lib/i18n/useTranslation';
import SelectField from '@/components/ui/SelectFiled';
import InputField from '@/components/ui/InputField';

interface VisibilityDeadlineProps {
    data: JobFormData;
    updateData: (data: Partial<JobFormData>) => void;
    errors?: Record<string, string>;
}

const VisibilityDeadline: React.FC<VisibilityDeadlineProps> = ({ data, updateData, errors = {} }) => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                {/* Application Deadline */}
                <InputField
                    id="applicationDeadline"
                    label={t("jobs.applicationDeadline", "Application Deadline")}
                    placeholder={t("jobs.selectDeadline", "Choose a job application deadline...")}
                    type="datetime-local"
                    withFieldset
                    value={data.applicationDeadline || ''}
                    onChange={(e: any) => {
                        const val = e?.target?.value !== undefined ? e.target.value : e;
                        updateData({ applicationDeadline: val || null });
                    }}
                    error={errors.applicationDeadline}
                />

                {/* Job Visibility Duration */}
                {/* <SelectField
                    id="visibilityDuration"
                    label={t("jobs.visibilityDuration", "Job Visibility Duration")}
                    placeholder={t("jobs.selectVisibility", "Choose the ad display duration...")}
                    withFieldset
                    selectorOptions={[
                        { name: t("jobs.visibility.7days", "7 Days"), id: "7days" },
                        { name: t("jobs.visibility.14days", "14 Days"), id: "14days" },
                        { name: t("jobs.visibility.30days", "30 Days"), id: "30days" },
                        { name: t("jobs.visibility.60days", "60 Days"), id: "60days" },
                        { name: t("jobs.visibility.90days", "90 Days"), id: "90days" },
                    ]}
                    value={data.visibilityDuration}
                    onChange={(e) => updateData({ visibilityDuration: e.target.value })}
                /> */}
            </div>
        </div>
    );
};

export default VisibilityDeadline;
