"use client";

import React from "react";

const ServiceDetailsSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse m-4 md:m-6 max-w-[1400px] mx-auto px-4 py-6 sm:px-6 sm:py-6 md:px-[80px] md:py-8">
      {/* Breadcrumb Skeleton */}
      <div className="mb-6">
        <div className="h-4 bg-gray-200 rounded w-64"></div>
      </div>

      {/* Header Section Skeleton */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col gap-2">
          <div className="h-8 bg-gray-200 rounded-lg w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="h-16 bg-gray-50 rounded-lg w-full"></div>
      </div>

      {/* Gallery Section Skeleton */}
      <div className="mb-12">
        <div className="space-y-4">
          {/* Thumbnails */}
          <div className="flex gap-4 overflow-x-auto p-4 border border-gray-100 rounded-xl">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-24 h-16 md:w-32 md:h-20 bg-gray-200 rounded-xl flex-shrink-0"></div>
            ))}
          </div>
          {/* Main Image */}
          <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] bg-gray-200 rounded-xl"></div>
          {/* Navigation/Counter */}
          <div className="flex items-center justify-between mt-2">
            <div className="h-6 bg-gray-200 rounded w-20"></div>
            <div className="flex gap-2">
              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Left Column Skeleton */}
        <div className="lg:col-span-2 space-y-10">
          <div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-11/12"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
          {/* Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-50 rounded-lg"></div>
            ))}
          </div>
        </div>

        {/* Right Column Skeleton */}
        <div className="lg:col-span-1">
          <div className="h-[400px] bg-gray-50 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-14 w-14 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-16"></div>
                <div className="h-5 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 rounded-xl"></div>
              <div className="h-12 bg-gray-200 rounded-xl"></div>
              <div className="h-10 bg-gray-200 rounded-lg"></div>
              <div className="h-10 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Items Skeleton */}
      <div className="mt-20">
        <div className="flex items-center justify-between mb-8">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="h-6 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-80 bg-gray-50 rounded-xl"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsSkeleton;
