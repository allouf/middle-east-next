import React from 'react'
import DiscountedProducts from './DiscountedProducts';
import { fetchDiscountProducts } from '../api/getDiscountProducts';
import { DiscountProductsResponse } from '../types/type';

const DiscountProducts_server = async({storeId ,locale}:{storeId:string,locale:string}) => {
     let data: DiscountProductsResponse | null = null;
            
            try {
              data = await fetchDiscountProducts("",locale,storeId) as DiscountProductsResponse;
              console.log("discount products Res",data)
            } catch (error) {
              console.error("Error fetching discount products:", error);
              return (
                <div className="mb-8">
                  <div className="text-red-500 text-center p-4">
                    Error loading discount products. Please try again later.
                  </div>
                </div>
              );
            }
        
            if (!data || !data.status || !data.data) {
              return (
                <div className="mb-8">
                  <div className="text-gray-500 text-center p-4">
                    No discount products available.
                  </div>
                </div>
              );
            }
            
            if(data.data.length===0)
                return
    
  return (
     <div>
        <DiscountedProducts data={data}/>
    </div>
  )
}

export default DiscountProducts_server;