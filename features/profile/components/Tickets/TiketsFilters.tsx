'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Select, DatePicker, Tooltip, Button } from 'antd';
import { RotateCcw } from 'lucide-react';
import dayjs, { Dayjs } from 'dayjs';
import type { DatePreset, SortBy } from '@/types/type';
import { TicketStatusFilter } from '@/features/stores/types/supportTikets';

type Props = {
    datePreset: DatePreset;
    setDatePreset: (v: DatePreset) => void;

    dateFrom: string;
    setDateFrom: (v: string) => void;

    dateTo: string;
    setDateTo: (v: string) => void;

    statusFilter: TicketStatusFilter;
    setStatusFilter: (v: TicketStatusFilter) => void;

    onReset?: () => void;

    sortBy?: SortBy;
    setSortBy?: (v: SortBy) => void;
};

const STATUS_LABELS: Record<TicketStatusFilter, string> = {
    all: 'tickets.statusAll',
    OPEN: 'tickets.statusOpen',
    ANSWERED: 'tickets.statusAnswered',
    RESOLVED: 'tickets.statusResolved',
    ESCALATED: 'tickets.statusEscalated',
    UNDER_REVIEW: 'tickets.statusUnderReview',
    CLOSED: 'tickets.statusClosed',
};

const toDayjs = (v: string): Dayjs | null => (v ? dayjs(v) : null);

const TiketsFilters: React.FC<Props> = ({
    datePreset,
    setDatePreset,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    statusFilter,
    setStatusFilter,
    onReset,
    sortBy,
    setSortBy,
}) => {
    const { t } = useTranslation();

    const handleReset = () => {
        if (onReset) return onReset();
        setDatePreset('all');
        setDateFrom('');
        setDateTo('');
        setStatusFilter('all');
        setSortBy?.('latest');
    };

    const showSort = Boolean(sortBy && setSortBy);

    const selectClass = "w-full sm:w-[210px] [&_.ant-select-selector]:!bg-[#F6F6F6] [&_.ant-select-selector]:!border-black/10 hover:[&_.ant-select-selector]:!border-black/15 [&_.ant-select-selector]:!h-[42px] [&_.ant-select-selection-item]:text-[13.5px] [&_.ant-select-selection-item]:text-[#6B7280] [&_.ant-select-selection-item]:leading-[40px] [&.ant-select-focused_.ant-select-selector]:!border-[var(--SiteColor)] [&.ant-select-focused_.ant-select-selector]:!shadow-none";

    const datePickerClass = "w-full sm:w-[210px] h-[42px] bg-[#F6F6F6] border-black/10 hover:border-black/15 focus-within:border-[var(--SiteColor)] focus-within:shadow-none text-[13.5px]";

    return (
        <div className="mb-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Left */}
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    {/* Status */}
                    <Select
                        value={statusFilter}
                        className={selectClass}
                        popupClassName="!text-[13.5px]"
                        onChange={(value) => setStatusFilter(value as TicketStatusFilter)}
                        aria-label={t('filters.status')}
                        options={[
                            { value: 'all', label: t('tickets.statusAll') },
                            { value: 'OPEN', label: t('tickets.statusOpen') },
                            { value: 'ANSWERED', label: t('tickets.statusAnswered') },
                            { value: 'RESOLVED', label: t('tickets.statusResolved') },
                            { value: 'ESCALATED', label: t('tickets.statusEscalated') },
                            { value: 'UNDER_REVIEW', label: t('tickets.statusUnderReview') },
                            { value: 'CLOSED', label: t('tickets.statusClosed') },
                        ]}
                    />

                    {/* Date preset */}
                    <Select
                        value={datePreset}
                        className={selectClass}
                        popupClassName="!text-[13.5px]"
                        onChange={(value) => setDatePreset(value as DatePreset)}
                        aria-label={t('filters.filterByDate')}
                        options={[
                            { value: 'all', label: t('filters.all') },
                            { value: 'today', label: t('filters.today') },
                            { value: 'last7', label: t('filters.last7') },
                            { value: 'last30', label: t('filters.last30') },
                            { value: 'custom', label: t('filters.custom') },
                        ]}
                    />

                    {/* Custom date row */}
                    {datePreset === 'custom' && (
                        <div className="flex flex-col sm:flex-row gap-3 mt-3 sm:mt-0 w-full sm:w-auto">
                            <DatePicker
                                format="YYYY-MM-DD"
                                placeholder={t('filters.date_from')}
                                value={toDayjs(dateFrom)}
                                onChange={(_, dateString) => setDateFrom(dateString as string)}
                                className={datePickerClass}
                            />
                            <DatePicker
                                format="YYYY-MM-DD"
                                placeholder={t('filters.date_to')}
                                value={toDayjs(dateTo)}
                                onChange={(_, dateString) => setDateTo(dateString as string)}
                                className={datePickerClass}
                            />
                        </div>
                    )}
                </div>

                {/* Right */}
                <div className="flex items-center gap-2 mt-3 lg:mt-0 w-full lg:w-auto lg:ml-auto">
                    {showSort && (
                        <>
                            <span className="text-[13.5px] text-[#6B7280]">
                                {t('filters.sort_by')}:
                            </span>
                            <Select
                                value={sortBy}
                                className="w-[170px] [&_.ant-select-selector]:!bg-[#F6F6F6] [&_.ant-select-selector]:!border-black/10 hover:[&_.ant-select-selector]:!border-black/15 [&_.ant-select-selector]:!h-[42px] [&_.ant-select-selection-item]:text-[13.5px] [&_.ant-select-selection-item]:text-[#6B7280] [&_.ant-select-selection-item]:leading-[40px] [&.ant-select-focused_.ant-select-selector]:!border-[var(--SiteColor)] [&.ant-select-focused_.ant-select-selector]:!shadow-none"
                                popupClassName="!text-[13.5px]"
                                onChange={(value) => setSortBy?.(value as SortBy)}
                                aria-label={t('filters.sort_by')}
                                options={[
                                    { value: 'latest', label: t('filters.sort.newest') },
                                    { value: 'oldest', label: t('filters.sort.oldest') },
                                ]}
                            />
                        </>
                    )}

                    <Tooltip title={t('filters.reset_all')}>
                        <Button
                            type="text"
                            onClick={handleReset}
                            aria-label={t('filters.reset_all')}
                            className="w-[42px] h-[42px] rounded-xl bg-[#F6F6F6] border border-black/10 hover:!bg-[#EFEFEF] hover:!border-black/10 flex items-center justify-center p-0"
                            icon={<RotateCcw size={20} color="var(--SiteColor)" />}
                        />
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};

export default TiketsFilters;
