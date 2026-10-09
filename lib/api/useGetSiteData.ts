'use client';

import { useState, useEffect, useCallback, useMemo } from "react";
import api from "./index";
import useSelectionStore from "../store/useSelectionStore";


const useGetSiteData = ({
  
  url,
  successMessage = null,
  search = "",
  paginate = false,

}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { selectedCountry, selectedGovernorate, selectedCategory } =
    useSelectionStore();
  // const data = useMemo(() => resData?.data || {}, [resData]);


  // ✅ Use the provided targetKey instead of guessing

  const refetch = useCallback((page=1) => {
    setLoading(true);
    setError(null);

    const params = {
      ...(paginate && { paginate: true, page }),
      ...(search && { "contains[name]": search }),
      ...(selectedCountry?.id && { country_id: selectedCountry.id }),
      ...(selectedGovernorate?.id && { region_id: selectedGovernorate.id }),
      ...(selectedCategory?.id && { category_id: selectedCategory.id }),
    };

    console.log("params",params)
    api
      .get(url, { params })
      .then((response) => {
        
        setData(response.data);
        // if (successMessage) {
        //   toast.success(successMessage);
        // }
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.message || err.message || "Unknown error";
        setError(errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [
    url,
    
    search,
    paginate,
    selectedCountry?.id,
    selectedGovernorate?.id,
    selectedCategory?.id,
    // successMessage,
  ]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
};

export default useGetSiteData;
