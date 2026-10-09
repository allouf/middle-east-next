import React from "react";

const LoaderPage = ({ type = "content", count = 3 }) => {
  const pulse = "animate-pulse bg-gray-300 rounded";

  if (type === "store") {
    return (
      <div className="p-6 space-y-6">
        <div className={`${pulse} h-56 w-full rounded-lg`}></div>

        <div className="w-full bg-white rounded-2xl shadow-md p-6 space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className={`${pulse} w-32 h-32 rounded-full`}></div>

            <div className="flex-1 space-y-4 w-full">
              <div className={`${pulse} h-8 w-1/3`}></div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`${pulse} w-5 h-5 rounded`}></div>
                  ))}
                </div>
                <div className={`${pulse} h-4 w-12`}></div>
              </div>
            </div>
          </div>

          <div className="space-y-2 mt-6">
            <div className={`${pulse} h-5 w-32`}></div>
            <div className={`${pulse} h-4 w-full`}></div>
            <div className={`${pulse} h-4 w-5/6`}></div>
            <div className={`${pulse} h-4 w-4/6`}></div>
          </div>
        </div>
      </div>
    );
  }
  if (type === "stores") {
    return (
      <div className="p-4 md:p-6">
        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className={`${pulse} h-6 w-40`} />

          <div className="flex gap-3 w-full md:w-auto">
            <div className={`${pulse} h-10 w-full md:w-48 rounded-lg`} />
            <div className={`${pulse} h-10 w-10 rounded-lg`} />
            <div className={`${pulse} h-10 w-10 rounded-lg`} />
            <div className={`${pulse} h-10 w-10 rounded-lg`} />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm p-4 space-y-3"
            >
              <div className={`${pulse} h-32 w-full rounded-lg`} />

              <div className={`${pulse} h-5 w-3/4`} />

              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className={`${pulse} w-4 h-4 rounded`} />
                  ))}
                </div>
                <div className={`${pulse} h-4 w-10`} />
              </div>

              <div className={`${pulse} h-4 w-1/2`} />

              <div className="flex items-center gap-2">
                <div className={`${pulse} w-4 h-4 rounded`} />
                <div className={`${pulse} h-4 w-5/6`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "product" || type === "products") {
    return (
      <div className="py-10">
        <div className="mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-6 gap-4">
            {[...Array(count)].map((_, i) => (
              <div
                key={i}
                className="relative border border-gray-300 rounded-lg sm:p-3 p-[6px] animate-pulse"
              >
                <div
                  className={`${pulse} absolute top-2 left-2 h-5 w-16 rounded-sm`}
                ></div>

                <div className="w-full relative bg-gray-100 rounded-[10px] mb-2">
                  <div
                    className={`${pulse} w-full sm:h-[200px] h-[113px] rounded-lg`}
                  ></div>
                </div>

                <div className="flex items-center gap-1 mt-1 mb-2">
                  {[...Array(5)].map((_, idx) => (
                    <div key={idx} className={`${pulse} w-4 h-4 rounded`}></div>
                  ))}
                </div>

                <div className="space-y-2 mt-2">
                  <div className={`${pulse} sm:h-4 h-3 w-full`}></div>
                  <div className={`${pulse} sm:h-4 h-3 w-3/4`}></div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <div className={`${pulse} h-5 w-20`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "categories") {
    return (
      <div className="py-4">
        <div className="relative px-9">
          <div className="flex gap-6 overflow-hidden">
            {[...Array(count)].map((_, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 bg-[#FAFAFA] rounded-full flex items-center justify-center mb-3">
                  <div
                    className={`${pulse} w-16 h-16 sm:w-20 sm:h-20 rounded-full`}
                  />
                </div>
                <div className={`${pulse} h-3 w-16 rounded`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "home-main-banner") {
    return (
      <div className="relative w-full min-h-[330px] md:min-h-[500px] rounded-2xl overflow-hidden bg-gray-100">
        <div className={`${pulse} absolute inset-0 opacity-60`}></div>

        <div className="absolute top-6 end-6 mt-1 z-10">
          <div
            className={`${pulse} bg-white w-20 h-20 sm:w-24 sm:h-24 rounded-full`}
          ></div>
        </div>

        <div className="relative z-10 h-full flex flex-col md:flex-row justify-between px-6 md:px-10 py-8 gap-4">
          <div className="flex-1 space-y-4 max-w-[70%]">
            <div className={`${pulse} h-6 sm:h-10 w-3/4`}></div>
            <div className={`${pulse} h-4 sm:h-5 w-full`}></div>
            <div className={`${pulse} h-4 sm:h-5 w-5/6`}></div>
            <div className="mt-6">
              <div
                className={`${pulse} h-10 sm:h-11 w-32 sm:w-40 rounded-lg`}
              ></div>
            </div>
          </div>

          <div className="flex items-end justify-end md:justify-start flex-1">
            <div
              className={`${pulse} w-36 sm:w-56 md:w-72 h-32 sm:h-40 md:h-48 rounded-xl`}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "home-featured-banner") {
    return (
      <div className="relative rounded-2xl overflow-hidden min-h-[240px] bg-[#323232] text-white p-4 sm:p-6 md:p-8 animate-pulse">
        <div className="absolute -top-24 -left-10 w-40 h-40 bg-[#E6F0ED]0 opacity-40 blur-3xl rounded-full"></div>

        <div className="relative z-10 flex flex-col justify-between h-full">
          <div className="space-y-3">
            <div className="h-3 sm:h-4 w-20 sm:w-28 bg-gray-500 rounded"></div>
            <div className="h-5 sm:h-7 w-3/4 bg-gray-500 rounded"></div>
            <div className="h-8 sm:h-9 w-28 sm:w-32 bg-gray-500 rounded-md"></div>
          </div>

          <div className="absolute sm:bottom-0 sm:end-4 -bottom-3 -end-6">
            <div className="w-24 sm:w-28 md:w-40 h-20 sm:h-24 md:h-28 bg-gray-500 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "home-bottom-banner") {
    return (
      <div className="relative rounded-2xl overflow-hidden min-h-[240px] bg-gray-900 text-white sm:p-6 p-3 md:p-8 animate-pulse">
        <div className="h-5 w-20 bg-yellow-400 rounded mb-3"></div>

        <div className="h-5 sm:h-7 w-3/4 bg-gray-700 rounded mb-4"></div>

        <div className="h-8 w-28 bg-gray-700 rounded-md mb-4"></div>

        <div className="absolute end-4 top-1/4">
          <div className="w-20 sm:w-24 md:w-32 h-20 sm:h-24 md:h-28 bg-gray-700 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (type === "community") {
    return (
      <div className="mx-auto h-screen p-4 space-y-4 overflow-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden group animate-pulse p-4 space-y-4">
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-gray-300 rounded"></div>
          <div className="flex justify-between mt-2">
            <div className="flex space-x-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 bg-gray-300 rounded"></div>
              ))}
            </div>
            <div className="h-8 bg-gray-300 rounded w-1/5"></div>
          </div>
        </div>

        <div className="flex space-x-4 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex flex-col items-center space-y-2">
              <div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse"></div>
              <div className="h-2 bg-gray-300 rounded w-10"></div>
            </div>
          ))}
        </div>

        {[1, 2].map((item) => (
          <div
            key={item}
            className="bg-white rounded-xl shadow-lg overflow-hidden group animate-pulse"
          >
            <div className="p-4 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="space-y-1">
                  <div className="h-3 bg-gray-300 rounded w-24"></div>
                  <div className="h-2 bg-gray-300 rounded w-16"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-300 rounded w-3/4 mt-2"></div>
              <div className="h-40 bg-gray-300 rounded mt-2"></div>
              <div className="flex justify-between mt-3">
                <div className="h-4 bg-gray-300 rounded w-16"></div>
                <div className="h-4 bg-gray-300 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (type === "table") {
    return (
      <div className="overflow-x-auto rounded-xl shadow-md border border-black p-4">
        {/* Table Header */}
        <div className="grid grid-cols-6 gap-4 mb-4 border-b pb-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`${pulse} h-4 w-full`}
            ></div>
          ))}
        </div>

        {/* Table Rows */}
        <div className="space-y-4">
          {[...Array(count)].map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid grid-cols-6 gap-4 items-center"
            >
              {[...Array(6)].map((_, colIndex) => (
                <div
                  key={colIndex}
                  className={`${pulse} h-6 w-full`}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-w-6xl p-6 space-y-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-md p-4 space-y-4 animate-pulse"
        >
          <div className="flex items-center space-x-3">
            <div className={`${pulse} w-10 h-10 rounded-full`}></div>
            <div>
              <div className={`${pulse} h-3 w-24 mb-1`}></div>
              <div className={`${pulse} h-2 w-16`}></div>
            </div>
          </div>
          <div className={`${pulse} h-4 w-3/4`}></div>
          <div className={`${pulse} h-40 w-full rounded-lg`}></div>
        </div>
      ))}
    </div>
  );
};

export default LoaderPage;

