const pulse = "animate-pulse bg-gray-200/80 rounded";

const TrashedSkeleton = () => {
  return (
    <div className="space-y-6 p-6 md:p-7 md:pt-[4vh]">
      {/* Header */}
      <div className="space-y-2">
        <div className={`${pulse} h-7 w-56`} />
        <div className={`${pulse} h-4 w-80`} />
      </div>

      {/* Search + sort */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className={`${pulse} h-11 w-full md:w-72 rounded-lg`} />
        <div className="flex gap-2">
          <div className={`${pulse} h-11 w-32 rounded-lg`} />
          <div className={`${pulse} h-11 w-32 rounded-lg`} />
        </div>
      </div>

      {/* List */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, idx) => (
          <div
            key={idx}
            className="bg-white border border-[#E8EFEA] rounded-2xl p-4 shadow-sm space-y-3"
          >
            <div className="flex justify-between items-center">
              <div className={`${pulse} h-5 w-32`} />
              <div className={`${pulse} h-8 w-8 rounded-full`} />
            </div>
            <div className={`${pulse} h-4 w-48`} />
            <div className="flex items-center justify-between">
              <div className={`${pulse} h-4 w-28`} />
              <div className={`${pulse} h-4 w-16`} />
            </div>
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

export default TrashedSkeleton;
