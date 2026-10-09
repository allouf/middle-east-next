import React, { useState, useEffect } from "react";

import { Heart, RefreshCcw, Copy, AlertCircle } from "lucide-react";

import { FaFacebookF, FaTwitter, FaPinterest } from "react-icons/fa";

import { useTranslation } from "@/lib/i18n/useTranslation";

import ShareActions from "./ShareActions";



interface ProductQuantityProps {

  id: number | string;

  quantity: number;

  handleQuantityChange: (delta: number) => void;

  handleAddToCart: () => void;

  handleBuyNow?: () => void;

  handleAddToCompare?: () => void;

  isAddingToCart: boolean;

  isInWishlist: boolean;

  isInCompare?: boolean;

  isTogglingWishlist: boolean;

  handleToggleWishlist: () => void;

  availabilityText: string;

  availableStock?: number;

  loadingWishList: boolean

}



export const ProductQuantity: React.FC<ProductQuantityProps> = ({

  id,

  quantity,

  handleQuantityChange,

  handleAddToCart,

  isAddingToCart,

  isInWishlist,

  isInCompare,

  isTogglingWishlist,

  handleToggleWishlist,

  availabilityText,

  handleBuyNow,

  handleAddToCompare,

  availableStock = 999999,

  loadingWishList

}) => {

  const { t } = useTranslation();

  const onBuyNow = handleBuyNow || handleAddToCart;

  const isMaxQuantity = quantity >= availableStock;

  const [showNotification, setShowNotification] = useState<boolean>(false);



  // Auto-hide notification after 3 seconds

  useEffect(() => {

    if (showNotification) {

      const timer = setTimeout(() => {

        setShowNotification(false);

      }, 3000);

      return () => clearTimeout(timer);

    }

  }, [showNotification]);



  const handlePlusClick = () => {

    if (isMaxQuantity) {

      setShowNotification(true);

    } else {

      handleQuantityChange(1);

    }

  };



  return (

    <>

      <div className="space-y-3 sm:space-y-4">

        {/* Quantity and Action Buttons in one line */}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 relative">

          {/* Quantity */}

          <div className="relative">

            {/* Notification Tooltip */}

            {showNotification && (

              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 animate-fade-in-down sm:hidden">

                <div className="bg-red-50 border border-red-200 rounded-lg px-2 py-1.5 shadow-lg flex items-center gap-1.5 whitespace-nowrap relative">

                  <AlertCircle className="w-3 h-3 text-red-600 flex-shrink-0" />

                  <span className="text-xs font-medium text-red-700">

                    {t('product.maximumStockReached', { count: availableStock })}

                  </span>

                  {/* Arrow pointing down */}

                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">

                    <div className="w-2 h-2 bg-red-50 border-r border-b border-red-200 transform rotate-45"></div>

                  </div>

                </div>

              </div>

            )}

            {showNotification && (

              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 animate-fade-in-down hidden sm:block">

                <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 shadow-lg flex items-center gap-2 whitespace-nowrap relative">

                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />

                  <span className="text-sm font-medium text-red-700">

                    {t('product.maximumStockReached', { count: availableStock })}

                  </span>

                  {/* Arrow pointing down */}

                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">

                    <div className="w-2 h-2 bg-red-50 border-r border-b border-red-200 transform rotate-45"></div>

                  </div>

                </div>

              </div>

            )}



            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-full max-w-[150px] sm:max-w-[180px]">

              <button

                onClick={() => handleQuantityChange(-1)}

                disabled={quantity <= 1}

                className="w-1/3 px-1 sm:px-3 py-2 text-sm sm:text-base font-semibold text-subTitleColor hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"

              >

                -

              </button>

              <span className="w-1/3 px-1 sm:px-3 py-2 text-sm sm:text-base font-semibold bg-white text-center border-x border-gray-300">

                {quantity}

              </span>

              <button

                onClick={handlePlusClick}

                className="w-1/3 px-1 sm:px-3 py-2 text-sm sm:text-base font-semibold text-subTitleColor hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"

              >

                +

              </button>

            </div>

          </div>



          {/* Add to Cart Button */}

          <button

            onClick={handleAddToCart}

            disabled={isAddingToCart}

            className="flex-1 min-w-[120px] sm:min-w-[140px] flex items-center justify-center text-blueSite bg-blueLight border border-blueSite font-bold gap-2 px-4 sm:px-6 py-2.5 text-xs sm:text-sm rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"

          >

            {isAddingToCart ? (

              <>

                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />

                {t('product.adding')}

              </>

            ) :

              t('product.addToCart')

            }

          </button>



          {/* Buy Now Button */}

          <button

            onClick={onBuyNow}

            disabled={isAddingToCart}

            className="flex-1 min-w-[120px] sm:min-w-[140px] flex text-white bg-blueSite items-center justify-center gap-2 px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"



          >

            {t('product.buyNow')}

          </button>

        </div>



        {/* Second Line: Add to Wishlist, Add to Compare, Share */}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-700">

          {/* Add to Wishlist */}

          <button

            onClick={handleToggleWishlist}

            disabled={isTogglingWishlist}

            className="flex items-center gap-1.5 sm:gap-2 hover:text-red-600 transition-colors justify-start sm:justify-center py-1"

          >





            <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isInWishlist ? 'fill-red-600 text-red-600' : ''}`} />

            <span className="whitespace-nowrap"> {isTogglingWishlist ? t("cart.updating") : t("product.addToWishlist")}</span>

          </button>



          {/* Add to Compare */}

          <button

            onClick={handleAddToCompare}

            className={`flex items-center gap-1.5 sm:gap-2 transition-colors justify-start sm:justify-center py-1 ${isInCompare ? 'text-blue-600' : 'hover:text-blue-600'}`}

          >

            <RefreshCcw className={`w-4 h-4 sm:w-5 sm:h-5 ${isInCompare ? 'text-blue-600' : ''}`} />

            <span className="whitespace-nowrap">{isInCompare ? t('product.inCompare') : t('product.addToCompare')}</span>

          </button>



          {/* Share product */}

          <div className="flex items-center gap-1.5 sm:gap-2 justify-start sm:justify-center py-1">

            <ShareActions productId={id} />

          </div>

        </div>

      </div>

    </>

  );

};



export default ProductQuantity;

