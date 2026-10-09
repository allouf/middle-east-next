import React from 'react'
import BestSellers from './BestSellers'
import { fetchBestSellerData } from '../api/getBestSellerData';
import { BestSellersResponse } from '../types/type';

const BestSellers_server = async({storeId ,locale}:{storeId:string,locale:string}) => {
      let data: BestSellersResponse | null = null;
        
        try {
          data = await fetchBestSellerData("",locale,storeId) as BestSellersResponse;
          console.log("bestSellers Res",data)
        } catch (error) {
          console.error("Error fetching best sellers:", error);
          return (
            <div className="mb-8">
              <div className="text-red-500 text-center p-4">
                Error loading best sellers. Please try again later.
              </div>
            </div>
          );
        }
    
        if (!data || !data.status || !data.data) {
          return (
            <div className="mb-8">
              <div className="text-gray-500 text-center p-4">
                No best sellers available.
              </div>
            </div>
          );
        }
        
       

  return (
    <div>
        <BestSellers data={data}/>
    </div>
  )
}

export default BestSellers_server;