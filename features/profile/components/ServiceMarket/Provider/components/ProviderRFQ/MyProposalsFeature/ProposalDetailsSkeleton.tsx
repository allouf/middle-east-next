"use client";

import React from "react";
import { SkeletonBox } from "@/components/ui/Loaders/SkeletonBox";

export default function ProposalDetailsSkeleton() {
  return (
    <div className="space-y-6 p-4">
      {/* Header Skeleton */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <SkeletonBox className="h-6 w-32" />
            <SkeletonBox className="h-4 w-24" />
          </div>
          <SkeletonBox className="h-8 w-24 rounded-full" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid gap-6 items-start lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Request Summary */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6">
            <SkeletonBox className="mb-4 h-5 w-32" />
            <div className="space-y-3">
              <SkeletonBox className="h-4 w-full" />
              <SkeletonBox className="h-4 w-3/4" />
              <SkeletonBox className="h-4 w-1/2" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <SkeletonBox className="h-12 w-full" />
              <SkeletonBox className="h-12 w-full" />
            </div>
          </div>

          {/* Time Remaining */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6">
            <SkeletonBox className="mb-4 h-5 w-32" />
            <div className="flex gap-4">
              <SkeletonBox className="h-16 flex-1" />
              <SkeletonBox className="h-16 flex-1" />
              <SkeletonBox className="h-16 flex-1" />
            </div>
          </div>

          {/* Project Brief */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6">
            <SkeletonBox className="mb-4 h-5 w-32" />
            <div className="space-y-3">
              <SkeletonBox className="h-4 w-full" />
              <SkeletonBox className="h-4 w-full" />
              <SkeletonBox className="h-4 w-5/6" />
            </div>
            <SkeletonBox className="mt-4 h-10 w-40" />
          </div>
        </div>

        {/* Right Column - Quote Submission */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6">
          <SkeletonBox className="mb-4 h-5 w-32" />
          <div className="space-y-4">
            <SkeletonBox className="h-12 w-full" />
            <SkeletonBox className="h-12 w-full" />
            <SkeletonBox className="h-24 w-full" />
            <SkeletonBox className="h-12 w-full" />
            <SkeletonBox className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
