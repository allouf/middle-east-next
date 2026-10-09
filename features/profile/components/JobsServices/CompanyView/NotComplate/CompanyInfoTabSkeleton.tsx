import React from "react";

export default function CompanyInfoTabSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6">
      <div className="relative grid gap-5">
        {/* Logo + Cover Skeleton */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Logo Skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-32 w-full bg-gray-200 rounded-lg animate-pulse" />
          </div>
          
          {/* Cover Skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-32 w-full bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Description Skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="h-24 w-full bg-gray-200 rounded-lg animate-pulse" />
        </div>

        {/* Gallery Skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>

        {/* Actions Skeleton */}
        <div className="mt-6 flex items-center gap-6">
          <div className="h-11 w-40 bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
