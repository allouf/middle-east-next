'use client';

const ProductSkeleton = () => {
    return (
      <div className="flex items-center gap-3 p-3 my-1 rounded-lg border border-gray-200 animate-pulse">
        {/* Image */}
        <div className="w-10 h-10 rounded bg-gray-300" />
  
        {/* Text */}
        <div className="flex-1">
          <div className="h-4 w-3/4 bg-gray-300 rounded" />
        </div>
      </div>
    );
  };

  export default ProductSkeleton;