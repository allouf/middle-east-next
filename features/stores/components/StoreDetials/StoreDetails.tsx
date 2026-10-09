'use client';

import StoreWrapper from "./StoreWrapper";
import Categories from "./Categories";
import Products from "./Products";

interface StoreDetailsProps {
  storeId?: string;
}

const StoreDetails = ({ storeId: _storeId }: StoreDetailsProps) => {
  return (
    <StoreWrapper>
      <Categories />
      <Products />
      <div className="w-full h-[2px] bg-blue-200 mt-1 rounded-full" />
    </StoreWrapper>
  );
};

export default StoreDetails;
