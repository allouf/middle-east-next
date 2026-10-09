"use client";
import React from "react";

export default function ActionButtons({
  filterLabel,
  resetLabel,
  onFilter,
  onReset,
  loading = false,
}: {
  filterLabel: string;
  resetLabel: string;
  onFilter: () => void;
  onReset: () => void;
  loading?: boolean;
}) {
  return (
    <div className="pt-4 space-y-4">
      <button
        className="w-full bg-[#00664F] text-white py-3.5 rounded-2xl font-bold tracking-tight hover:bg-[#00523F] transition shadow-md"
        onClick={onFilter}
      >
        {filterLabel}
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={onReset}
          disabled={loading}
          className={`
            relative text-sm font-bold uppercase tracking-wider transition-all duration-300
            ${loading 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-red-500 hover:text-red-600 hover:scale-105'
            }
          `}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-flex">
                <span className="w-2 h-2 bg-red-400 rounded-full animate-ping"></span>
                <span className="w-2 h-2 bg-red-400 rounded-full animate-ping animation-delay-200"></span>
                <span className="w-2 h-2 bg-red-400 rounded-full animate-ping animation-delay-400"></span>
              </span>
              <span className="animate-pulse">Resetting...</span>
            </span>
          ) : (
            <>
              <span className="relative">
                {resetLabel}
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-red-500 transform scale-x-0 hover:scale-x-100 transition-transform origin-left"></span>
              </span>
              <span className="ml-1 inline-block transform hover:rotate-180 transition-transform duration-300">↻</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
