export const ViewDetailsSkeleton = () => {
    return (
        <div className="p-6">
            {/* back button */}
            <div className="mb-4 flex items-center gap-2">
                <div className="h-5 w-5 rounded bg-gray-200 animate-pulse" />
                <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                {/* LEFT skeleton */}
                <div className="w-full md:w-[52%]">
                    {/* thumbnails */}
                    <div className="mb-3 rounded-lg bg-gray-100 p-2">
                        <div className="flex gap-2 overflow-x-auto">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-12 w-16 flex-none rounded-md bg-gray-200 animate-pulse"
                                />
                            ))}
                        </div>
                    </div>

                    {/* main image */}
                    <div className="relative overflow-hidden rounded-xl bg-gray-100">
                        <div className="h-[260px] sm:h-[360px] lg:h-[420px] w-full bg-gray-200 animate-pulse" />
                        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
                            <div className="h-4 w-16 rounded bg-white/70 animate-pulse" />
                            <div className="flex gap-2">
                                <div className="h-8 w-8 rounded-full bg-white/70 animate-pulse" />
                                <div className="h-8 w-8 rounded-full bg-white/70 animate-pulse" />
                            </div>
                        </div>
                    </div>

                    {/* actions */}
                    <div className="mt-4 space-y-3">
                        <div className="h-12 w-full rounded-lg bg-gray-200 animate-pulse" />
                        <div className="h-12 w-full rounded-lg bg-gray-200 animate-pulse" />
                    </div>
                </div>

                {/* RIGHT skeleton */}
                <div className="w-full md:w-[48%]">
                    <div className=" bg-white px-5 py-4">
                        {/* title + badge + price */}
                        <div className="flex items-start justify-between gap-6">
                            <div className="min-w-0 flex-1">
                                <div className="h-4 w-[85%] rounded bg-gray-200 animate-pulse" />
                                <div className="mt-2 h-4 w-[65%] rounded bg-gray-200 animate-pulse" />
                                <div className="mt-3 h-6 w-20 rounded bg-red-100 animate-pulse" />
                            </div>

                            <div className="shrink-0 text-right">
                                <div className="h-3 w-10 rounded bg-gray-200 animate-pulse ml-auto" />
                                <div className="mt-2 h-5 w-24 rounded bg-gray-200 animate-pulse ml-auto" />
                            </div>
                        </div>

                        {/* description */}
                        <div className="mt-5">
                            <div className="h-3 w-24 rounded bg-gray-200 animate-pulse" />
                            <div className="mt-3 space-y-2">
                                <div className="h-3 w-full rounded bg-gray-200 animate-pulse" />
                                <div className="h-3 w-[92%] rounded bg-gray-200 animate-pulse" />
                                <div className="h-3 w-[70%] rounded bg-gray-200 animate-pulse" />
                            </div>
                        </div>

                        {/* meta row */}
                        <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="h-4 w-4 rounded bg-gray-200 animate-pulse" />
                                    <div className="h-3 w-24 rounded bg-gray-200 animate-pulse" />
                                </div>
                            ))}
                        </div>

                        <div className="my-4 border-t border-gray-200" />

                        {/* location */}
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded bg-gray-200 animate-pulse" />
                            <div className="h-3 w-40 rounded bg-gray-200 animate-pulse" />
                        </div>
                        <div className="mt-3 h-3 w-full rounded bg-gray-200 animate-pulse" />
                        <div className="mt-2 h-3 w-[85%] rounded bg-gray-200 animate-pulse" />

                        <div className="my-4 border-t border-gray-200" />

                        {/* rejection reason */}
                        <div className="h-3 w-32 rounded bg-red-100 animate-pulse" />
                        <div className="mt-3 space-y-2">
                            <div className="h-3 w-full rounded bg-gray-200 animate-pulse" />
                            <div className="h-3 w-[88%] rounded bg-gray-200 animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
