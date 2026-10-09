import React from "react";
import { ChevronDown, ArrowLeft, ArrowRight } from "lucide-react";
import { useLocaleDirection } from "@/lib/i18n/useLocaleDirection";
import { useTranslation } from "react-i18next";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  total,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: PaginationProps) {
  const { isRTL } = useLocaleDirection();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between">
      <p className="text-sm text-[#0B6B57]">
        {total === 0
          ? t('serviceMarket.rfq.pagination.noResults')
          : `${(currentPage - 1) * rowsPerPage + 1}-${Math.min(
              currentPage * rowsPerPage,
              total
            )} ${t('serviceMarket.rfq.pagination.of')} ${total} ${t('serviceMarket.rfq.pagination.results')}`}
      </p>

      <div className="flex items-center gap-4 self-end">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-[#0B6B57]">{t('serviceMarket.rfq.pagination.rowsPerPage')}</span>
          <div className="relative">
            <select
              value={rowsPerPage}
              onChange={(e) => {
                onRowsPerPageChange(Number(e.target.value));
              }}
              className="h-10 appearance-none rounded-lg bg-[#E5F0E9] px-4 pr-9 text-sm font-medium text-blueSite outline-none"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-blueSite"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#006B57] text-white disabled:cursor-not-allowed disabled:opacity-50"
            disabled={currentPage === 1}
          >
            {isRTL ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
          </button>

          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#006B57] text-white disabled:cursor-not-allowed disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            {isRTL ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}
