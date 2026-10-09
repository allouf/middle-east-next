import React from 'react'
import PopularCategories from './PopularCategories'
import { fetchCategoriesData } from '../api/getCategoriesData'
import { CategoriesResponse } from '../types/type';



const PopularCategories_srver = async({storeId ,locale}:{storeId:string,locale:string}) => {
    let data: CategoriesResponse | null = null;
    
    try {
      data = await fetchCategoriesData("",locale,storeId) as CategoriesResponse |null;
      console.log("categories Res",data)
    } catch (error) {
      console.error("Error fetching categories:", error);
      return (
        <div className="mb-8">
          <div className="text-red-500 text-center p-4">
            Error loading categories. Please try again later.
          </div>
        </div>
      );
    }

    if (!data || !data.status || !data.data) {
      return (
        <div className="mb-8">
          <div className="text-gray-500 text-center p-4">
            No categories available.
          </div>
        </div>
      );
    }


  return (
      <div className="mb-8">
        <PopularCategories resData={data}/>
      </div>
  )
}

export default PopularCategories_srver;