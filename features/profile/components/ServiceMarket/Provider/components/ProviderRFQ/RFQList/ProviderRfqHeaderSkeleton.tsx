"use client";

import React from "react";

export default function ProviderRfqHeaderSkeleton() {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <div className="h-6 w-1 animate-pulse rounded bg-gray-200" />
          <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="mt-1 h-7 w-48 animate-pulse rounded bg-gray-200" />
        <div className="mt-2 h-5 w-96 animate-pulse rounded bg-gray-200" />
      </div>

      <div className="h-11 w-40 animate-pulse rounded-lg bg-gray-200" />
    </div>
  );
}
