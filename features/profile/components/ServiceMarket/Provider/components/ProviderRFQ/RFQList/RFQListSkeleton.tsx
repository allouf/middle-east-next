"use client";

import React from "react";
import ProviderRfqHeaderSkeleton from "./ProviderRfqHeaderSkeleton";

export default function RFQListSkeleton() {
  return (
    <>
      {/* Header Skeleton */}
      <ProviderRfqHeaderSkeleton />

      {/* Request Count Skeleton */}
      <div className="mb-6">
        <div className="h-8 w-16 animate-pulse rounded bg-gray-200" />
        <div className="ml-2 mt-1 h-6 w-24 animate-pulse rounded bg-gray-200" />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_300px]">
        {/* RFQ List Skeleton */}
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="rounded-xl bg-white p-5 shadow-sm">
              {/* Header Skeleton */}
              <div className="mb-3 flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-1 h-4 w-32 animate-pulse rounded bg-gray-200" />
                  <div className="mt-1 h-6 w-64 animate-pulse rounded bg-gray-200" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-20 animate-pulse rounded-full bg-gray-200" />
                  <div className="h-10 w-20 animate-pulse rounded-lg bg-gray-200" />
                </div>
              </div>

              {/* Category Badge Skeleton */}
              <div className="mb-4">
                <div className="h-6 w-24 animate-pulse rounded-full bg-gray-200" />
              </div>

              {/* Details Row Skeleton */}
              <div className="mb-4 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
                </div>
              </div>

              {/* Description Skeleton */}
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>

        {/* Filter Sidebar Skeleton */}
        <div className="space-y-4 rounded-xl bg-white p-5 shadow-sm">
          <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
          <div className="space-y-3">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-10 w-full animate-pulse rounded bg-gray-200" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
