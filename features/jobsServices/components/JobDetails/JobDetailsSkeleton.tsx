import React from "react";

export default function JobDetailsSkeleton() {
  return (
    <div className="bg-white min-h-screen">
      {/* Page Header Banner Skeleton */}
      <section className="relative overflow-hidden w-fill border border-emerald-100 rounded-none border-b border-emerald-100">
        <div className="absolute inset-0 bg-emerald-50/70" />
        <div
          className="absolute -top-10 right-0 h-32 sm:h-40 w-1/2 sm:w-2/3 pointer-events-none"
          style={{
            backgroundImage: "url('/bgBack.png')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center right",
            backgroundSize: "cover",
          }}
          aria-hidden="true"
        />

        <div className="relative">
          {/* Back Button Skeleton */}
          <div className="flex flex-col items-start mb-2 px-4 sm:px-6 md:px-8 lg:px-16 py-4 sm:py-6">
            <div className="inline-flex m-2 sm:m-4 items-center gap-2 h-6 w-20 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Title and Breadcrumb Skeleton */}
          <div className="flex flex-col sm:flex-row bg-[#00664F33] px-4 sm:px-6 md:px-8 lg:px-36 h-auto sm:h-10 items-center justify-between gap-3 py-3 sm:py-0">
            <div className="h-5 w-1/3 bg-gray-200 rounded animate-pulse" />
            <div className="flex items-start text-start gap-1 text-xs">
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
              <span className="mx-1">/</span>
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              <span className="mx-1">/</span>
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Skeleton */}
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="p-5 md:p-8 lg:p-10 mb-8">
          <div className="grid lg:grid-cols-[1.2fr,0.8fr] gap-8 lg:gap-12">

            {/* Left Column - Job Details */}
            <div className="flex flex-col gap-6">
              {/* Job Title and Basic Info */}
              <div className="space-y-4">
                <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="flex items-center gap-4">
                  <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                  <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>

              {/* Company Info */}
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
                  <div className="flex-1">
                    <div className="h-5 w-1/2 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="space-y-3">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>

              {/* Requirements */}
              <div className="space-y-3">
                <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-3">
                <div className="h-6 w-36 bg-gray-200 rounded animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Application Card */}
            <div className="flex flex-col gap-6">
              {/* Application Form Card */}
              <div className="border rounded-lg p-6 space-y-4">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />

                {/* Salary Info */}
                <div className="space-y-2">
                  <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
                </div>

                {/* Job Type and Location */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-36 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>

                {/* Apply Button */}
                <div className="pt-4">
                  <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse" />
                </div>
              </div>

              {/* Similar Jobs */}
              <div className="border rounded-lg p-6 space-y-4">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="border-b pb-3 last:border-b-0">
                      <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse mb-2" />
                      <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mb-1" />
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
