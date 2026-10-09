import React from 'react';
import { Select, DatePicker, Input, InputNumber } from 'antd';
import { Search, Plus, ShoppingBag, Pause, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { JobFilterState, JobCategory } from './types';
import Button from '@/components/ui/Button';
import { WorkMode, JobStatus } from './enums';

interface JobsFiltersProps {
    filters: JobFilterState;
    categories: JobCategory[];
    onFilterChange: (filters: Partial<JobFilterState>) => void;
    onApplyFilters: () => void;
    onAddJob: () => void;
    onApplicants: () => void;
}

const JobsFilters: React.FC<JobsFiltersProps> = ({
    filters,
    categories,
    onFilterChange,
    onApplyFilters,
    onAddJob,
    onApplicants,
}) => {
    const { t } = useTranslation();

    return (
        <div>
            {/* Top Row - Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-6 py-4">
                {/* Filter by Category */}
                <div>
                    <Select
                        size='large'
                        className="w-full bg-[#FAFAFA] rounded-[4px] text-base [&_.ant-select-selection-placeholder]:!text-[#454545] [&_.ant-select-selection-placeholder]:!font-normal [&_*]:!text-xs sm:[&_*]:!text-sm"
                        variant="borderless"
                        placeholder={t('jobs.filter.category')}
                        allowClear
                        value={filters.category}
                        onChange={(value) => onFilterChange({ category: value })}
                        options={categories.map((cat) => ({
                            value: String(cat.id),
                            label: cat.name,
                        }))}
                    />
                </div>

                {/* Filter by Work Mode */}
                <div>
                    <Select
                        size='large'
                        className="w-full bg-[#FAFAFA] rounded-[4px] text-base [&_.ant-select-selection-placeholder]:!text-[#454545] [&_.ant-select-selection-placeholder]:!font-normal [&_*]:!text-xs sm:[&_*]:!text-sm"
                        variant="borderless"
                        placeholder={t('jobs.filter.workMode')}
                        allowClear
                        value={filters.workMode}
                        onChange={(value) => onFilterChange({ workMode: value })}
                        options={[
                            { value: WorkMode.REMOTE, label: t('jobs.workMode.remote') },
                            { value: WorkMode.ONSITE, label: t('jobs.workMode.onsite') },
                            { value: WorkMode.HYBRID, label: t('jobs.workMode.hybrid') },
                        ]}
                    />
                </div>

                {/* Filter by Application Date */}
                <div>
                    <DatePicker
                        size='large'
                        className="w-full bg-[#FAFAFA]  rounded-[4px] text-base [&_.ant-picker-input_>input::placeholder]:!text-[#454545] [&_.ant-picker-input_>input::placeholder]:!font-normal [&_*]:!text-xs sm:[&_*]:!text-sm"
                        variant="borderless"
                        placeholder={t('jobs.filter.applicationDate')}
                        onChange={(date, dateString) => onFilterChange({ applicationDate: dateString as string })}
                    />
                </div>

                {/* Filter by Salary Range */}
                <div className="flex items-center gap-2 md:col-span-2">
                    <InputNumber
                        size='large'
                        className="w-full lg:min-w-[150px] bg-[#FAFAFA] rounded-[4px] text-xs sm:text-sm [&_input::placeholder]:!text-[#454545] [&_input::placeholder]:!font-normal"
                        variant="borderless"
                        placeholder={t('jobs.filter.minSalary')}
                        min={0}
                        value={filters.minSalary ? Number(filters.minSalary) : undefined}
                        onChange={(value) => onFilterChange({ minSalary: value != null ? String(value) : null })}
                    />
                    <span className="text-gray-400 text-xs sm:text-sm">-</span>
                    <InputNumber
                        size='large'
                        className="w-full lg:min-w-[150px] bg-[#FAFAFA] rounded-[4px] text-xs sm:text-sm [&_input::placeholder]:!text-[#454545] [&_input::placeholder]:!font-normal"
                        variant="borderless"
                        placeholder={t('jobs.filter.maxSalary')}
                        min={0}
                        value={filters.maxSalary ? Number(filters.maxSalary) : undefined}
                        onChange={(value) => onFilterChange({ maxSalary: value != null ? String(value) : null })}
                    />
                </div>
            </div>


            {/* Bottom Row - Search and Actions */}
            <div className="flex flex-col sm:flex-row gap-3 bg-[#FCFCFC] rounded-t-xl border border-[#00664F33] border-b-0 p-4 sm:p-6">
                {/* Search Input */}
                <div className="flex-1">
                    <Input
                        size='large'
                        className="rounded-full max-w-[300px] sm:max-w-[350px] w-full px-4 sm:px-6 py-2 text-xs sm:text-sm border-[0.5px] border-[#00664F] placeholder:!text-[#00664F] placeholder:font-medium !shadow-none text-blueSite font-medium"
                        placeholder={t('jobs.searchPlaceholder')}
                        value={filters.search}
                        onChange={(e) => onFilterChange({ search: e.target.value })}
                        onPressEnter={onApplyFilters}
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex  items-center gap-2 sm:gap-3 flex-wrap">
                    <div className="bg-[#cadeda] text-[#00664F] px-3 sm:px-4 h-8 flex items-center justify-center rounded-md font-medium text-xs sm:text-sm min-w-[80px] sm:min-w-[100px]">
                        {t("jobs.filter.status")}
                    </div>
                    <Select
                        variant="borderless"
                        value={filters.status}
                        onChange={(value) => onFilterChange({ status: value })}
                        placeholder={t('jobs.status.all')}
                        allowClear
                        className="w-[100px] sm:w-[120px] [&_.ant-select-selection-placeholder]:!text-[#454545] [&_.ant-select-selection-placeholder]:!font-normal [&_.ant-select-selector]:!h-8 [&_.ant-select-selection-item]:!line-height-[30px] [&_*]:!text-xs sm:[&_*]:!text-sm"
                        popupRender={(menu) => <div className="p-1">{menu}</div>}
                        options={[
                            {
                                value: JobStatus.ACTIVE,
                                label: (
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span className="text-xs sm:text-sm">{t('jobs.status.active')}</span>
                                    </div>
                                )
                            },
                            {
                                value: JobStatus.PAUSED,
                                label: (
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <Pause className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span className="text-xs sm:text-sm">{t('jobs.status.paused')}</span>
                                    </div>
                                )
                            },
                            {
                                value: JobStatus.DRAFT,
                                label: (
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span className="text-xs sm:text-sm">{t('jobs.status.draft')}</span>
                                    </div>
                                )
                            },
                            {
                                value: JobStatus.CLOSED,
                                label: (
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span className="text-xs sm:text-sm">{t('jobs.status.closed')}</span>
                                    </div>
                                )
                            },
                            {
                                value: JobStatus.EXPIRED,
                                label: (
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span className="text-xs sm:text-sm">{t('jobs.status.expired')}</span>
                                    </div>
                                )
                            }
                        ]}
                    />
                </div>
                <Button
                unstyled
                    onClick={onAddJob}
                    className="bg-[#00664F] hover:bg-[#005542] text-white px-4 sm:px-6 h-8 rounded-md font-medium transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm"
                >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className=" sm:inline">{t('jobs.addJob')}</span>
                    {/* <span className="sm:hidden">{t('jobs.addJobShort', { defaultValue: 'Add' })}</span> */}
                </Button>
            </div>
        </div>
    );
};

export default JobsFilters;
