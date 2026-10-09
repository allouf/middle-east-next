"use client";

const pulse = "animate-pulse bg-gray-200/80 rounded";

const UpdateStoreSkeleton = () => {
  return (
    <div className="mx-auto h-full mb-4">
      <div className="space-y-8">
        {/* Cover + logo area */}
        <div className="relative w-full h-52 md:h-64 rounded-2xl overflow-hidden border border-[#E8EFEA]">
          <div className={`${pulse} absolute inset-0`} />
          <div className="absolute -bottom-10 left-6 flex items-center gap-4">
            <div className={`${pulse} h-20 w-20 rounded-full border-4 border-white`} />
            <div className="space-y-2">
              <div className={`${pulse} h-5 w-40`} />
              <div className={`${pulse} h-4 w-28`} />
            </div>
          </div>
        </div>
        <div className="px-8">

          {/* Form sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className={`${pulse} h-4 w-24`} />
                <div className={`${pulse} h-11 w-full rounded-lg`} />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className={`${pulse} h-4 w-28`} />
                <div className={`${pulse} h-11 w-full rounded-lg`} />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className={`${pulse} h-4 w-32`} />
                <div className="space-y-2">
                  {[...Array(2)].map((_, j) => (
                    <div key={j} className={`${pulse} h-10 w-full rounded-lg`} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className={`${pulse} h-4 w-32`} />
                <div className={`${pulse} h-24 w-full rounded-lg`} />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className={`${pulse} h-4 w-28`} />
                <div className={`${pulse} h-11 w-full rounded-lg`} />
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <div className={`${pulse} h-11 w-32 rounded-lg`} />
            <div className={`${pulse} h-11 w-28 rounded-lg`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateStoreSkeleton;
