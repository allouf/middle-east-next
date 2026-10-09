"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { HiChevronRight } from "react-icons/hi";

export type BreadcrumbItem = {
  label: React.ReactNode;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;

  /** On small screens show: first > ... > last */
  collapseOnMobile?: boolean;
};

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  className,
  collapseOnMobile = true,
}) => {
  const safeItems = items ?? [];
  if (!safeItems.length) return null;

  const { first, last, middleCount } = useMemo(() => {
    const firstItem = safeItems[0];
    const lastItem = safeItems[safeItems.length - 1];
    return {
      first: firstItem,
      last: lastItem,
      middleCount: Math.max(0, safeItems.length - 2),
    };
  }, [safeItems]);

  return (
    <nav
      aria-label="Breadcrumb"
      className={[
        "mb-4",
        "flex items-center",
        "text-xs sm:text-sm md:text-base",
        "flex-wrap",
        "gap-y-2",
        "min-w-0",
        className ?? "",
      ].join(" ")}
    >
      {/* Desktop / non-collapsed */}
      <div
        className={[
          "hidden sm:flex items-center flex-wrap gap-y-2 min-w-0",
          collapseOnMobile ? "" : "flex",
        ].join(" ")}
      >
        {safeItems.map((item, index) => {
          const isLast = index === safeItems.length - 1;
          const key =
            typeof item.label === "string" ? `${item.label}-${index}` : index;

          return (
            <div key={key} className="flex items-center min-w-0">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-blueSite hover:underline font-medium truncate max-w-[10rem] sm:max-w-[14rem] md:max-w-none"
                  title={typeof item.label === "string" ? item.label : undefined}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="text-gray-700 font-semibold truncate max-w-[12rem] sm:max-w-[18rem] md:max-w-none"
                  aria-current={isLast ? "page" : undefined}
                  title={typeof item.label === "string" ? item.label : undefined}
                >
                  {item.label}
                </span>
              )}

              {!isLast && (
                <HiChevronRight className="mx-2 text-gray-400 shrink-0" size={16} />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile collapsed */}
      {collapseOnMobile && safeItems.length > 2 && (
        <div className="flex sm:hidden items-center min-w-0">
          {/* First */}
          {first.href ? (
            <Link
              href={first.href}
              className="text-blue-600 hover:underline font-medium truncate max-w-[8rem]"
              title={typeof first.label === "string" ? first.label : undefined}
            >
              {first.label}
            </Link>
          ) : (
            <span className="text-gray-700 font-semibold truncate max-w-[8rem]">
              {first.label}
            </span>
          )}

          <HiChevronRight className="mx-2 text-gray-400 shrink-0" size={16} />

          {/* Ellipsis */}
          <span className="text-gray-400 shrink-0">…</span>

          <HiChevronRight className="mx-2 text-gray-400 shrink-0" size={16} />

          {/* Last */}
          <span
            className="text-gray-700 font-semibold truncate max-w-[10rem]"
            aria-current="page"
            title={typeof last.label === "string" ? last.label : undefined}
          >
            {last.label}
          </span>

          {/* screen reader info */}
          <span className="sr-only">{` (${middleCount} hidden items)`}</span>
        </div>
      )}

      {/* Mobile not collapsed (<= 2 items) */}
      {collapseOnMobile && safeItems.length <= 2 && (
        <div className="flex sm:hidden items-center flex-wrap gap-y-2 min-w-0">
          {safeItems.map((item, index) => {
            const isLast = index === safeItems.length - 1;

            return (
              <div key={index} className="flex items-center min-w-0">
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="text-blue-600 hover:underline font-medium truncate max-w-[10rem]"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className="text-gray-700 font-semibold truncate max-w-[12rem]"
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                )}

                {!isLast && (
                  <HiChevronRight className="mx-2 text-gray-400 shrink-0" size={16} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default Breadcrumbs;
