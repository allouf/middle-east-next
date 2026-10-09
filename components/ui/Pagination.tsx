"use client";

import React, { FC, useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "antd";
import type { MenuProps } from "antd";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  rowsPerPage?: number;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
}

const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  rowsPerPage = 10,
  onRowsPerPageChange,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Rows per page options
  const rowsPerPageOptions = [
    { label: '10', value: 10 },
    { label: '20', value: 20 },
    { label: '50', value: 50 },
    { label: '100', value: 100 },
  ];

  const handleRowsPerPageChange = (value: number) => {
    if (onRowsPerPageChange) {
      onRowsPerPageChange(value);
    }
  };

  const pageNumbers = useMemo<number[]>(() => {
    if (totalPages < 1) return [];

    // On mobile, show fewer page numbers
    const maxVisiblePages = isMobile ? 3 : 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let start = Math.max(1, currentPage - halfVisible);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);
    
    // Adjust if we're near the end
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, totalPages, isMobile]);

  // Hide pagination when there is only a single page
  // if (totalPages <= 1) {
  //   return null;
  // }


  // if (totalPages <= 1) {
  //   return null;
  // }


  /* ------------------ URL handler ------------------ */
  const changePage = (page: number) => {
    if (page < 1 || page > totalPages) return;

    // 1️⃣ إذا تم تمرير handler من الخارج
    if (onPageChange) {
      onPageChange(page);
      return;
    }

    // 2️⃣ وإلا → حدّث URL مباشرة
    const params = new URLSearchParams(searchParams?.toString());
    params.set("page", String(page));

    router.push(`?${params.toString()}`, {
      scroll: false,
    });
  };

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center mt-4 gap-2 sm:gap-4">
      {/* Rows per page selector - only show when callback is provided */}
      {onRowsPerPageChange && (
        <div className="flex items-center gap-2 order-2 sm:order-1">
          <span className="text-xs sm:text-sm text-gray-600">{t("ads_feature.ad_details.rows_per_page") || "Rows per page"}:</span>
          <Select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            options={rowsPerPageOptions}
            size={isMobile ? "small" : "middle"}
            style={{ width: isMobile ? 70 : 80 }}
          />
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex justify-center items-center space-x-1 sm:space-x-2 order-1 sm:order-2">
        {/* Previous */}
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => changePage(currentPage - 1)}
          className={`w-6 h-6 sm:w-8 sm:h-8 rounded shadow text-xs sm:text-sm font-medium transition-all ${currentPage === 1
            ? "bg-gray-200 text-textColor cursor-not-allowed"
            : "bg-white text-subTitleColor hover:bg-gray-100"
            }`}
        >
          &laquo;
        </button>

        {/* Pages */}
        {pageNumbers.map((pageNum) => (
          <button
            type="button"
            key={pageNum}
            onClick={() => changePage(pageNum)}
            className={`w-6 h-6 sm:w-8 sm:h-8 rounded shadow text-xs sm:text-sm font-medium transition-all ${currentPage === pageNum
              ? "bg-blueSite text-textWhiteColor"
              : "bg-white text-subTitleColor hover:bg-gray-100"
              }`}
          >
            {pageNum}
          </button>
        ))}

        {/* Next */}
        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => changePage(currentPage + 1)}
          className={`w-6 h-6 sm:w-8 sm:h-8 rounded shadow text-xs sm:text-sm font-medium transition-all ${currentPage === totalPages
            ? "bg-gray-200 text-textColor cursor-not-allowed"
            : "bg-white text-subTitleColor hover:bg-gray-100"
            }`}
        >
          &raquo;
        </button>
      </div>
    </div>
  );
};

export default Pagination;
