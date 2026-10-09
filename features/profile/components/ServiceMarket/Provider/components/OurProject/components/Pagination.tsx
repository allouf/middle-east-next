"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";

/**
 * Pagination Component
 * 
 * Handles pagination controls with previous/next navigation
 * and displays current page information.
 */
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  // Computed values
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  // Event handlers
  const handlePrevious = (): void => {
    if (canGoPrev) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = (): void => {
    if (canGoNext) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="mt-6 flex flex-col gap-3 text-sm text-textGrayColor sm:flex-row sm:items-center sm:justify-between">
      <span>
        {startIndex} - {endIndex} of {totalItems}
      </span>

      <div className="flex items-center gap-2 self-end">
        <button
          type="button"
          disabled={!canGoPrev}
          onClick={handlePrevious}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-grayBorder bg-white text-textColor transition hover:border-blueSite hover:text-blueSite disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <button
          type="button"
          disabled={!canGoNext}
          onClick={handleNext}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-blueSite text-white transition hover:bg-blueSiteHover disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          <ArrowLeft className="h-4 w-4 rotate-180" />
        </button>
      </div>
    </div>
  );
}
