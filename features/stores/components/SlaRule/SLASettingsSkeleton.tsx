"use client";

const pulse = "animate-pulse bg-gray-200/80 rounded";

const SLASettingsSkeleton = () => {
  return (
    <div className="w-full p-6 bg-white space-y-6">
      {/* Action bar */}
      <div className="flex items-center justify-end">
        <div className={`${pulse} h-10 w-32 rounded-lg`} />
      </div>

      {/* Table header */}
      <div className="grid grid-cols-2 bg-[#d8e7e2] text-textWhiteColor py-3 px-6 font-medium text-lg rounded-t-xl">
        <div className={`${pulse} h-5 w-32 mx-auto`} />
        <div className={`${pulse} h-5 w-28 mx-auto`} />
      </div>

      {/* Rows */}
      <div className="bg-[#FCFCFC] border border-gray-100 rounded-b-xl p-4 space-y-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-2 gap-8 items-center border-b border-[#727272]/20 pb-4 last:border-b-0 last:pb-0"
          >
            <div className={`${pulse} h-10 w-full rounded-lg`} />
            <div className="flex items-center gap-3">
              <div className={`${pulse} h-10 w-full rounded-lg`} />
              <div className="flex gap-2">
                <div className={`${pulse} h-9 w-9 rounded-full`} />
                <div className={`${pulse} h-9 w-9 rounded-full`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SLASettingsSkeleton;
