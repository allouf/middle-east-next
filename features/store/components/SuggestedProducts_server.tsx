import React from 'react'
import SuggestedProducts from './suggestedProducts'
import { fetchSuggestedProducts } from '../api/getSuggestedProductsData';
import { SuggestedProductsResponse } from '../types/type';

const SuggestedProducts_server = async ({storeId ,locale}:{storeId:string,locale:string}) => {

      let data: SuggestedProductsResponse | null;
                
                try {
                  data = await fetchSuggestedProducts("",locale,storeId) ;
                  console.log("suggested products Res",data)
                } catch (error) {
                  console.error("Error fetching suggested products:", error);
                  return (
                    <div className="mb-8">
                      <div className="text-red-500 text-center p-4">
                        Error loading suggested products. Please try again later.
                      </div>
                    </div>
                  );
                }
            
                if (!data || !data.status || !data.data) {
                  return (
                    <div className="mb-8">
                      <div className="text-gray-500 text-center p-4">
                        No suggested products available.
                      </div>
                    </div>
                  );
                }
                
               
        
  return (
      <div>
        <SuggestedProducts data={data}/>
    </div>
  )
}

export default SuggestedProducts_server