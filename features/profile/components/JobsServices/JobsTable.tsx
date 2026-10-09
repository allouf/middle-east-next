import React, { useMemo } from 'react';
import { Table, Tag, Select } from 'antd';
import { Eye, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useLocaleDirection } from '@/lib/i18n/useLocaleDirection';
import { Job, PaginationConfig } from './types';
import { JobStatus } from './enums';
import { ColumnsType } from 'antd/es/table';
import { BsEyeFill, BsPencilFill, BsTrashFill } from "react-icons/bs";
import "./JobsTable.css";
import { formatJobStatus } from './helper';

interface JobsTableProps {
    data: Job[];
    loading: boolean;
    pagination: PaginationConfig;
    onPageChange: (page: number, pageSize: number) => void;
    onView: (id: number | string) => void;
    onEdit: (id: number | string) => void;
    onDelete: (id: number | string) => void;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

const ActionBtn = ({
    title,
    onClick,
    color,
    hoverBg,
    children,
}: {
    title: string;
    onClick: () => void;
    color: string;
    hoverBg: string;
    children: React.ReactNode;
}) => (
    <button
        type="button"
        title={title}
        onClick={onClick}
        className={`p-2 rounded-lg transition-colors ${hoverBg}`}
    >
        <span className={`w-4 h-4 inline-flex items-center justify-center ${color}`}>
            {children}
        </span>
    </button>
);

const JobsTable: React.FC<JobsTableProps> = ({
    data,
    loading,
    pagination,
    onPageChange,
    onView,
    onEdit,
    onDelete,
}) => {
    const { t } = useTranslation();
    const { isRTL } = useLocaleDirection();

    const columns: ColumnsType<Job> = useMemo(() => [
        {
            title: t('jobs.table.id'),
            dataIndex: 'id',
            key: 'id',
            width: 70,
            render: (id) => <span className="font-mono text-sm">{id}</span>,
        },
        {
            title: t('jobs.table.title'),
            dataIndex: 'title',
            key: 'title',
            render: (title: string) => (
                <span className="text-gray-700 font-medium">
                    {title}
                </span>
            ),
        },
        {
            title: t('jobs.table.category'),
            dataIndex: 'category',
            key: 'category',
            render: (cat: any) => {
                if (typeof cat === 'object' && cat?.name) return cat.name;
                return cat || '—';
            },
        },
        {
            title: t('jobs.table.workMode'),
            dataIndex: 'work_mode',
            key: 'work_mode',
        },
        {
            title: t('jobs.table.salary'),
            key: 'salary',
            render: (_, record) => {
                if (record.salary_min && record.salary_max) {
                    return `${record.salary_min} - ${record.salary_max}`;
                }
                if (record.salary) return record.salary;
                return '—';
            },
        },
        {
            title: t('jobs.table.currency'),
            dataIndex: 'currency',
            key: 'currency',
            render:(_,record)=>{
                if(record.currency) return record.currency;
                return <p className='w-full text-center'> __ </p>;
            }
        },
        {
            title: t('jobs.table.applicationDate'),
            key: 'application_date',
            render: (_, record) => record.application_deadline || record.application_date || '—',
        },
        {
            title: t('jobs.table.visibility'),
            dataIndex: 'visibility',
            key: 'visibility',
        },
        {
            title: t('jobs.table.expiryDate'),
            key: 'expiry_date',
            render: (_, record) => {
                const date = record.expires_at || record.expiry_date || '—';
                return (
                    <span className={typeof date === 'string' && date.includes('After') ? 'text-red-500 font-medium' : ''}>{date}</span>
                );
            }
        },
        {
            title: t('jobs.table.state'),
            key: 'state',
            render: (_, record) => {
                const state = (record.state || record.status || '') as string;
                let color = 'default';
                let label = state;
                if (state.toUpperCase() === JobStatus.ACTIVE.toUpperCase()) { color = 'success'; label = 'Active'; }
                if (state.toUpperCase() === JobStatus.PAUSED.toUpperCase()) { color = 'warning'; label = 'Paused'; }
                if (state.toUpperCase() === JobStatus.DRAFT.toUpperCase()) { color = 'default'; label = 'Draft'; }
                if (state.toUpperCase() === JobStatus.EXPIRED.toUpperCase()) { color = 'error'; label = 'Expired'; }

                return (
                    <Tag color={color} className="m-0 w-full text-center capitalize border-none">
                        {formatJobStatus(t, label.toUpperCase() ) }
                    </Tag>
                );
            },
        },
        {
            title: t('jobs.table.actions') || '',
            key: 'actions',
            fixed: "right",
            render: (_, record) => (
                <div className="flex items-center gap-1">
                    <ActionBtn
                        title={t('common.view')}
                        onClick={() => onView(record.id)}
                        color="text-[#00664F]"
                        hoverBg="hover:bg-[#00664F]/20"
                    >
                        <BsEyeFill className="w-4 h-4" />
                    </ActionBtn>
                    <ActionBtn
                        title={t('common.edit')}
                        onClick={() => onEdit(record.id)}
                        color="text-[#00664F]"
                        hoverBg="hover:bg-[#00664F]/20"
                    >
                        <BsPencilFill className="w-4 h-4" />
                    </ActionBtn>
                    <ActionBtn
                        title={t('common.delete')}
                        onClick={() => onDelete(record.id)}
                        color="text-[#BF2033]"
                        hoverBg="hover:bg-[#BF2033]/20"
                    >
                        <BsTrashFill className="w-4 h-4" />
                    </ActionBtn>
                </div>
            ),
        },
    ], [t, onView, onEdit, onDelete]);

    const total = pagination.total ?? 0;
    const pageSize = pagination.pageSize ?? 10;
    const current = pagination.current ?? 1;

    const from = total === 0 ? 0 : (current - 1) * pageSize + 1;
    const to = Math.min(current * pageSize, total);

    const isPrevDisabled = current <= 1;
    const isNextDisabled = current * pageSize >= total;

    return (
        <div>
            <div className="bg-white rounded-b-xl shadow-sm overflow-hidden border border-[#00664F33] border-t-0 jobs-table">
                <Table<Job>
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    rowKey="id"
                    scroll={{ x: "max-content" }}
                    pagination={false}
                    className="jobs-table"
                />
            </div>
            <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-700">
                    <span>
                        {from}-{to}
                    </span>
                    <span className="hidden xs:inline">{t("usedMarket.table.of", { defaultValue: "of" })}</span>
                    <span className="xs:hidden">/</span>
                    <span>{total}</span>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <span className="text-emerald-700  sm:inline">
                            {t("usedMarket.table.rowsPerPage", { defaultValue: "Rows per page" })}
                        </span>
                        <Select
                            value={pageSize}
                            onChange={(value) => onPageChange(1, value)}
                            options={PAGE_SIZE_OPTIONS.map((v) => ({ value: v, label: String(v) }))}
                            className="w-16 sm:w-20"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => onPageChange(current - 1, pageSize)}
                            disabled={isPrevDisabled}
                            className="p-1.5 sm:p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        >
                            {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                        </button>

                        <button
                            type="button"
                            onClick={() => onPageChange(current + 1, pageSize)}
                            disabled={isNextDisabled}
                            className="p-1.5 sm:p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        >
                            {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobsTable;
