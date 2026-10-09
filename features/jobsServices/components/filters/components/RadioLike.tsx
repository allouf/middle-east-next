"use client";

import { Option } from "@/features/jobsServices/types/jobs.types";
import { TFunction } from "i18next";


export default function RadioLike({
  value,
  options,
  onPick,
  loading,
  t,
}: {
  value: string;
  options: Option[];
  onPick: (v: string) => void;
  loading?: boolean;
  t: TFunction
}) {
  return (
    <div className={`flex flex-col gap-3 py-2 transition-opacity ${loading ? 'opacity-60' : ''}`}>
      {options.map((o) => {
        const active = value === o.value;
        const isCurrentlyLoading = active && loading;
        
        return (
          <label 
            key={o.value} 
            className={`flex items-center gap-2.5 cursor-pointer group transition-all ${
              isCurrentlyLoading ? 'cursor-not-allowed opacity-70' : ''
            }`}
          >
            <div className={`relative w-5 h-5 border-[1.5px]  flex items-center justify-center transition-all ${
              isCurrentlyLoading 
                ? 'border-gray-300 bg-gray-50' 
                : active 
                  ? 'border-[#00664F]' 
                  : 'border-emerald-500/40 group-hover:border-[#00664F]'
            }`}>
              <input 
                type="radio" 
                className="sr-only" 
                checked={active} 
                onChange={() => !loading && onPick(o.value)}
                disabled={loading}
              />
              {isCurrentlyLoading ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-[#00664F] rounded-full animate-spin"></div>
              ) : active ? (
                <svg className="w-5  h-5 text-white bg-blueSite" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : null}
            </div>

            <span className={`text-sm font-medium transition-all ${
              isCurrentlyLoading 
                ? 'text-gray-400 animate-pulse' 
                : 'text-[#353635]'
            }`}>
              {t(o.labelKey)}
              {isCurrentlyLoading && (
                <span className="ml-2 inline-flex items-center">
                  <div className="w-2 h-2 bg-[#00664F] rounded-full animate-ping"></div>
                </span>
              )}
            </span>
          </label>
        );
      })}
    </div>
  );
}
