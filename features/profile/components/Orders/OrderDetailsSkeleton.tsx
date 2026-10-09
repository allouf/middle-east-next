const SkeletonLine = ({ width }: { width: string }) => (
    <div
        className="bg-gray-200 animate-pulse rounded"
        style={{ width, height: "10px" }}
    />
);

export const OrderDetailsSkeleton = () => (
    <div className="space-y-4 sm:space-y-5 md:space-y-6 p-4 sm:p-5 md:p-6 lg:p-7 md:pt-[4vh]">
        <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-200 animate-pulse rounded-full" />
            <SkeletonLine width="100px sm:w-120px" />
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="bg-[#E8F2ED] px-4 sm:px-5 md:px-6 py-3 sm:py-4 flex flex-col sm:flex-row md:flex-row lg:flex-row sm:items-center md:items-center lg:items-center sm:justify-between md:justify-between lg:justify-between gap-3 sm:gap-4">
                <div className="space-y-2">
                    <SkeletonLine width="120px sm:w-140px" />
                    <SkeletonLine width="180px sm:w-220px" />
                </div>
                <div className="space-y-1">
                    <SkeletonLine width="70px sm:w-80px" />
                    <SkeletonLine width="80px sm:w-100px" />
                </div>
            </div>
            <div className="px-4 sm:px-5 md:px-6 py-4 sm:py-5 space-y-3 sm:space-y-4">
                <SkeletonLine width="160px sm:w-200px" />
                <div className="space-y-3">
                    <div className="h-2.5 sm:h-3 bg-gray-200 animate-pulse rounded-full w-full" />
                    <div className="h-2.5 sm:h-3 bg-gray-200 animate-pulse rounded-full w-[70%] sm:w-[80%]" />
                </div>
            </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
            <SkeletonLine width="140px" />
            <div className="space-y-3">
                {[...Array(3)].map((_, idx) => (
                    <div key={idx} className="flex gap-2 sm:gap-3 items-center">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-200 animate-pulse rounded-full" />
                        <SkeletonLine width="60% sm:w-70%" />
                    </div>
                ))}
            </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
            <SkeletonLine width="140px sm:w-160px" />
            <div className="space-y-3">
                {[...Array(2)].map((_, idx) => (
                    <div key={idx} className="h-12 sm:h-14 md:h-16 bg-gray-200 animate-pulse rounded" />
                ))}
            </div>
        </div>
    </div>
);
