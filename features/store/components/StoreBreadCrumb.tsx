"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react'

const StoreBreadCrumb = ({storeId}:{storeId:string}) => {
          const router = useRouter();
          const searchParamsHook = useSearchParams();
          
          const openStoreDetails =  searchParamsHook.get("Details") === "true";

    
          const toggleDetails = () => {
            const currentDetails =  searchParamsHook.get("Details"); 
            console.log("paramsj",currentDetails)
            if (currentDetails === "true") {
              router.push(`/stores/${storeId}/info?Details=false`, {
        scroll: false,
      });
            } else {
              router.push(`/stores/${storeId}/info?Details=true`, {
        scroll: false,
      });
            }
          };
  return (
    <div className="mb-4 flex items-center text-sm text-subTitleColor">
            <button
                onClick={() => toggleDetails()}
                className="font-medium text-blueBtn hover:underline"
            >
                Store Details
            </button>
            <span className="mx-2">{">"}</span>
            <span className="font-medium text-subTitleColor">Policies</span>
    </div>
  )
}

export default StoreBreadCrumb