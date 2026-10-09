"use client";

import React from "react";

const AdDetailsSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse m-4 md:m-6">
      {/* Breadcrumb Skeleton */}
      <div className="mb-4 md:mb-6">
        <div className="h-3 md:h-4 bg-gray-200 rounded w-24 md:w-32 mb-2"></div>
        <div className="h-3 md:h-4 bg-gray-200 rounded w-20 md:w-24"></div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Title Skeleton */}
          <div className="h-6 md:h-8 bg-gray-200 rounded-lg w-2/3 md:w-3/4"></div>

          {/* Price and Actions */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
            <div className="space-y-2">
              <div className="h-4 md:h-6 bg-gray-200 rounded w-24 md:w-32"></div>
              <div className="h-8 md:h-10 bg-gray-200 rounded-lg w-36 md:w-48"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-8 md:h-10 w-8 md:w-10 bg-gray-200 rounded-full"></div>
              <div className="h-8 md:h-10 w-8 md:w-10 bg-gray-200 rounded-full"></div>
              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
            </div>
          </div>

          {/* Image Gallery Skeleton */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative w-full h-[400px] md:h-[500px] bg-gray-200 rounded-xl"></div>
            
            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-24 h-16 md:w-32 md:h-20 bg-gray-200 rounded-xl flex-shrink-0"></div>
              ))}
            </div>
            
            {/* Image Counter */}
            <div className="flex items-center justify-between">
              <div className="h-6 bg-gray-200 rounded w-20"></div>
              <div className="flex gap-2">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Description Skeleton */}
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              <div className="h-4 bg-gray-200 rounded w-11/12"></div>
            </div>
          </div>

          {/* Details Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              {/* Category */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
              
              {/* Condition */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
              
              {/* Case */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Views */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </div>
              
              {/* Listed Date */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Seller Info */}
        <div className="space-y-6 lg:col-span-2">
          {/* Seller Card Skeleton */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="space-y-4">
              {/* Seller Header */}
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
              
              {/* Contact Buttons */}
              <div className="space-y-3">
                <div className="h-10 bg-gray-200 rounded-lg"></div>
                <div className="h-10 bg-gray-200 rounded-lg"></div>
                <div className="h-10 bg-gray-200 rounded-lg"></div>
              </div>
              
              {/* Phone Toggle */}
              <div className="h-10 bg-gray-200 rounded-lg"></div>
            </div>
          </div>

          {/* Location Skeleton */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </div>

          {/* Safety Tips Skeleton */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-28"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                <div className="h-3 bg-gray-200 rounded w-4/5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Ads Skeleton */}
      <div className="mt-12">
        <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-video bg-gray-200 rounded-lg"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdDetailsSkeleton;
