const CategoriesSkeleton = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full animate-pulse px-4 sm:px-6 py-6 sm:py-8">

      {/* ================= Sidebar ================= */}
      <aside className="hidden md:block md:w-[200px] lg:w-[280px] xl:w-[320px] shrink-0 space-y-6">
        {/* Filters title */}
        <div className="h-6 w-32 bg-gray-200 rounded" />

        {/* Filter blocks */}
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            {[...Array(5)].map((_, j) => (
              <div key={j} className="flex items-center gap-3">
                <div className="w-4 h-4 bg-gray-200 rounded-full" />
                <div className="h-4 w-32 xl:w-40 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ))}
      </aside>

      {/* ================= Products ================= */}
      <main className="flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
          <div className="h-5 w-40 sm:w-48 bg-gray-200 rounded" />
          <div className="h-4 w-28 sm:w-32 bg-gray-200 rounded" />
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="border rounded-xl p-3 sm:p-4 space-y-3"
            >
              {/* Image */}
              <div className="h-[160px] sm:h-[180px] bg-gray-200 rounded-lg" />

              {/* Title */}
              <div className="h-4 w-3/4 bg-gray-200 rounded" />

              {/* Rating */}
              <div className="h-3 w-20 sm:w-24 bg-gray-200 rounded" />

              {/* Price */}
              <div className="h-4 w-16 sm:w-20 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CategoriesSkeleton;
