const pulse = "animate-pulse bg-gray-200/80 rounded";

const MyStoresSkeleton = () => {
  return (
    <div className="space-y-6 p-6 md:p-7 md:pt-[4vh]">
      {/* Header */}
      <div className="space-y-3">
        <div className={`${pulse} h-7 w-56`} />
        <div className={`${pulse} h-4 w-80`} />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className={`${pulse} h-11 w-full md:w-72 rounded-lg`} />
        <div className="flex gap-2 flex-wrap">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`${pulse} h-11 w-32 rounded-lg`} />
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white border border-[#E8EFEA] rounded-2xl p-5 shadow-sm space-y-4"
          >
            <div className={`${pulse} h-32 w-full rounded-xl`} />
            <div className="space-y-2">
              <div className={`${pulse} h-5 w-2/3`} />
              <div className={`${pulse} h-4 w-1/2`} />
            </div>
            <div className="flex items-center justify-between">
              <div className={`${pulse} h-8 w-24 rounded-lg`} />
              <div className="flex gap-2">
                <div className={`${pulse} h-10 w-10 rounded-full`} />
                <div className={`${pulse} h-10 w-10 rounded-full`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyStoresSkeleton;
