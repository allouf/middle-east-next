const pulse = "animate-pulse bg-gray-200/80 rounded";

const StoreManagementSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className={`${pulse} h-7 w-56`} />
        <div className={`${pulse} h-4 w-80`} />
      </div>

      {/* Toolbar / filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className={`${pulse} h-10 w-full md:w-64 rounded-lg`} />
        <div className="flex gap-2 flex-wrap">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`${pulse} h-10 w-28 rounded-lg`} />
          ))}
        </div>
      </div>

      {/* Content cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-[#E8EFEA] p-5 shadow-sm space-y-3"
          >
            <div className={`${pulse} h-32 w-full rounded-xl`} />
            <div className={`${pulse} h-5 w-2/3`} />
            <div className={`${pulse} h-4 w-1/2`} />
            <div className="flex gap-2">
              <div className={`${pulse} h-9 w-24 rounded-lg`} />
              <div className={`${pulse} h-9 w-24 rounded-lg`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreManagementSkeleton;
