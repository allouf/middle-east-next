import React from "react";

export default function CompanyProfileSkeleton() {
  return (
    <div className='px-4 py-8 md container max-w-7xl mx-auto space-y-8'>
      {/* Company Cover Header Skeleton */}
      <div className="relative h-64 md:h-80 bg-gray-200 rounded-lg overflow-hidden animate-pulse">
        {/* Cover Image Skeleton */}
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        
        {/* Company Logo Skeleton */}
        <div className="absolute bottom-4 left-6">
          <div className="w-20 h-20 bg-gray-300 rounded-full border-4 border-white shadow-lg animate-pulse" />
        </div>
        
        {/* Company Name Skeleton */}
        <div className="absolute bottom-4 left-32">
          <div className="h-6 w-48 bg-gray-300 rounded animate-pulse" />
        </div>
      </div>

      {/* Company Profile Intro Skeleton */}
      <div className="bg-white rounded-lg p-6 space-y-4">
        <div className="space-y-3">
          <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse" />
        </div>
        
        {/* About Section */}
        <div className="space-y-2">
          <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Team Section */}
        <div className="space-y-2">
          <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="flex gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Company Opportunities Grid Skeleton */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white border rounded-lg p-4 space-y-3">
              {/* Job Title */}
              <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
              
              {/* Company Name */}
              <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
              
              {/* Job Details */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-28 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
              
              {/* Salary and Posted Date */}
              <div className="flex justify-between items-center pt-2">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
              
              {/* Apply Button */}
              <div className="pt-2">
                <div className="h-8 w-full bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-2 pt-4">
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Company Gallery Mosaic Skeleton */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
        
        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>

      {/* Company Team Slider Skeleton */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
        </div>
        
        {/* Team Members */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="text-center space-y-3">
              {/* Team Member Avatar */}
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto animate-pulse" />
              
              {/* Team Member Name */}
              <div className="h-4 w-3/4 bg-gray-200 rounded mx-auto animate-pulse" />
              
              {/* Team Member Role */}
              <div className="h-3 w-2/3 bg-gray-200 rounded mx-auto animate-pulse" />
            </div>
          ))}
        </div>
        
        {/* Slider Controls */}
        <div className="flex justify-center gap-2">
          <div className="h-2 w-8 bg-gray-200 rounded animate-pulse" />
          <div className="h-2 w-8 bg-gray-200 rounded animate-pulse" />
          <div className="h-2 w-8 bg-gray-200 rounded animate-pulse" />
          <div className="h-2 w-8 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
