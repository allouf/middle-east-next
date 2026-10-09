import React from "react";

const ProfileSkeletonLoader = () => {
  const pulse = "animate-pulse bg-gray-200/80 rounded";

  return (
    <div className="flex flex-col md:flex-row md:pt-0 gap-6">
      {/* Sidebar */}
      <aside className="hidden md:flex w-[260px] flex-col gap-4">
        <div className={`${pulse} h-10 w-3/4`} />
        {[...Array(7)].map((_, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className={`${pulse} h-5 w-5 rounded-full`} />
            <div className={`${pulse} h-4 w-32`} />
          </div>
        ))}
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-white rounded-2xl border border-[#E8EFEA] p-6 shadow-sm space-y-7">
        {/* Header */}
        <div className="space-y-3">
          <div className={`${pulse} h-7 w-48`} />
          <div className={`${pulse} h-4 w-80`} />
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-5">
          {[...Array(5)].map((_, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 pb-3 border-b border-[#E8EFEA] min-w-[120px]"
            >
              <div className={`${pulse} h-8 w-8 rounded-full`} />
              <div className={`${pulse} h-4 w-20`} />
            </div>
          ))}
        </div>

        {/* Search + sort bar */}
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className={`${pulse} h-12 w-full rounded-xl`} />
          <div className={`${pulse} h-12 w-48 rounded-xl`} />
        </div>

        {/* Cards like orders list */}
        <div className="space-y-4">
          {[...Array(3)].map((_, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#F9FBFA] p-5 shadow-sm border border-[#E8EFEA] space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-6">
                    <div className={`${pulse} h-5 w-20`} />
                    <div className={`${pulse} h-7 w-28 rounded-md`} />
                  </div>
                  <div className={`${pulse} h-4 w-64`} />
                  <div className={`${pulse} h-4 w-52`} />
                </div>
                <div className="flex md:flex-col gap-4 items-start md:items-end">
                  <div className={`${pulse} h-10 w-32 rounded-lg`} />
                  <div className={`${pulse} h-5 w-28`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProfileSkeletonLoader;
