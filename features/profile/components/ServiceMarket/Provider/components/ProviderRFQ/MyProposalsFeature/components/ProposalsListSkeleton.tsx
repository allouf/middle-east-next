"use client";

import React from "react";

export default function ProposalsListSkeleton() {
  return (
    <>
      {/* Header Skeleton */}
      <div className="mb-6">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="mt-2 h-5 w-96 animate-pulse rounded bg-gray-200" />
      </div>

      {/* Filter Skeleton */}
      <div className="mb-6 flex gap-2">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="h-10 w-24 animate-pulse rounded-full bg-gray-200" />
        ))}
      </div>

      {/* Stats Cards Skeleton */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="flex items-center gap-4 rounded-3xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 animate-pulse" />
            <div className="flex-1">
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
              <div className="mt-2 h-7 w-16 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>

      {/* Proposal Cards Skeleton */}
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            {/* Header Skeleton */}
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="mb-2 h-5 w-32 animate-pulse rounded bg-gray-200" />
                <div className="h-7 w-64 animate-pulse rounded bg-gray-200" />
              </div>
              <div className="h-8 w-20 animate-pulse rounded-full bg-gray-200" />
            </div>

            {/* Customer Info Skeleton */}
            <div className="mb-4 flex items-center gap-3">
              <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
              <div>
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                <div className="mt-1 h-3 w-32 animate-pulse rounded bg-gray-200" />
              </div>
            </div>

            {/* Details Row Skeleton */}
            <div className="flex flex-wrap items-center gap-4 rounded-b-3xl bg-[#F4F4F4] p-5">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
