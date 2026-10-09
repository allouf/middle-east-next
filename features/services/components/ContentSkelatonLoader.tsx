import React from 'react'

const ContentSkelatonLoader = () => {
  return (
    <main className="flex-1">
      {/* Products grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="border rounded-lg p-3 space-y-3"
          >
            {/* Image */}
            <div className="h-[180px] bg-gray-200 rounded" />

            {/* Title */}
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />

            {/* Rating */}
            <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />

            {/* Price */}
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </main>
  )
}

export default ContentSkelatonLoader
