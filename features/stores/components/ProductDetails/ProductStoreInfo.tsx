'use client';

import React from "react";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { Store } from "lucide-react";
import Button from '@/components/ui/Button';

interface ProductStoreInfoProps {
  store: any;
}

const ProductStoreInfo: React.FC<ProductStoreInfoProps> = ({ store }) => {

  return (


    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white border border-gray-200 overflow-hidden flex items-center justify-center">
            {store?.logo ? (
              <img
                src={store.logo}
                alt={store.name}
                className="w-full h-full object-contain p-1"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blueSite to-blueSite flex items-center justify-center text-textWhiteColor">
                <Store className="w-6 h-6" />
              </div>
            )}
          </div>

          <div>
            <p className="text-xs text-textColor">Sold by</p>

            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{store?.name}</h3>
              <BsFillPatchCheckFill className="text-blueIcons" />
            </div>
            <p className="text-xs text-textColor">Authorized reseller</p>
          </div>
        </div>

        <Button
          to={`/ecommerce/stores_Info/${store.id}`}
          unstyled
          className="px-4 py-2 text-sm text-blueSite font-semibold border border-blueSite bg-white rounded-lg hover:bg-[#E6F0ED] transition"
        >
          Visit Store
        </Button>
      </div>
    </div>
  );

}

export default ProductStoreInfo;
