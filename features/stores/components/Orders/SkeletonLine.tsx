
const SkeletonLine = ({ width }: { width: string }) => (
  <div className="bg-gray-200 animate-pulse rounded" style={{ width, height: "10px" }} />
);

export const OrderDetailsSkeleton = () => (
  <div className="px-6 md:px-10 py-6 space-y-6">
    {/* Back button */}
    <div className="flex items-center gap-2">
      <div className="w-5 h-5 bg-gray-200 animate-pulse rounded-full" />
      <SkeletonLine width="140px" />
    </div>

    {/* Summary bar */}
    <div className="bg-[#E8F2ED] px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="space-y-2">
        <SkeletonLine width="160px" />
        <SkeletonLine width="240px" />
        <SkeletonLine width="180px" />
      </div>
      <div className="space-y-2 text-right mt-3 md:mt-0">
        <SkeletonLine width="110px" />
        <SkeletonLine width="150px" />
      </div>
    </div>

    {/* Timeline section */}
    <div className="px-6 py-4 space-y-4">
      <SkeletonLine width="180px" />
      <div className="space-y-3">
        <div className="relative h-3">
          <div className="absolute inset-0 bg-gray-100 rounded-full" />
          <div className="absolute inset-y-0 left-0 bg-gray-300 animate-pulse rounded-full w-1/2" />
        </div>
        <div className="grid grid-cols-5 gap-4 text-center">
          {[...Array(5)].map((_, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <div className="w-16 h-12 bg-gray-200 animate-pulse rounded-md" />
              <SkeletonLine width="90px" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
