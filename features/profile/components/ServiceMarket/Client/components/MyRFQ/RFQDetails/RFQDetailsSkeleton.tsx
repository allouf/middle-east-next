const SkeletonLine = ({ width }: { width: string }) => (
  <div
    className="bg-gray-200 animate-pulse rounded"
    style={{ width, height: "10px" }}
  />
);

export const RFQDetailsSkeleton = () => (
  <section className="w-full p-2 md:p-4">
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-5">
        {/* RFQHeader skeleton */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 animate-pulse rounded-full" />
          <div className="space-y-2 flex-1">
            <SkeletonLine width="200px" />
            <SkeletonLine width="150px" />
          </div>
        </div>

        {/* RequestSummaryCard skeleton */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 md:p-5 space-y-4">
          <SkeletonLine width="140px" />
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 animate-pulse rounded-full w-full" />
            <div className="h-3 bg-gray-200 animate-pulse rounded-full w-[80%]" />
            <div className="h-3 bg-gray-200 animate-pulse rounded-full w-[60%]" />
          </div>
        </div>

        {/* TimeRemainingCard skeleton */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 md:p-5 space-y-4">
          <SkeletonLine width="160px" />
          <div className="flex gap-3">
            <div className="w-16 h-16 bg-gray-200 animate-pulse rounded-lg" />
            <div className="space-y-2 flex-1">
              <SkeletonLine width="100px" />
              <SkeletonLine width="80px" />
            </div>
          </div>
        </div>

        {/* ProjectBriefCard skeleton */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 md:p-5 space-y-4">
          <SkeletonLine width="140px" />
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 animate-pulse rounded-full w-full" />
            <div className="h-3 bg-gray-200 animate-pulse rounded-full w-[90%]" />
            <div className="h-3 bg-gray-200 animate-pulse rounded-full w-[70%]" />
          </div>
        </div>

        {/* InsightsCard skeleton */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 md:p-5 space-y-4">
          <SkeletonLine width="120px" />
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="space-y-2">
                <div className="h-12 bg-gray-200 animate-pulse rounded-lg" />
                <SkeletonLine width="60px" />
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons skeleton */}
        <div className="flex flex-wrap items-center gap-3">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="h-12 w-32 bg-gray-200 animate-pulse rounded-xl" />
          ))}
        </div>
      </div>

      {/* QuotesSidebar skeleton */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 md:p-5 space-y-4">
        <SkeletonLine width="100px" />
        <div className="space-y-3">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-3 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full" />
                <SkeletonLine width="100px" />
              </div>
              <SkeletonLine width="80px" />
              <div className="h-10 bg-gray-200 animate-pulse rounded-lg w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
