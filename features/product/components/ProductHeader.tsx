import React from "react";
import ProductRate from "@/components/cards/product/ProductRate";
import verifyIcon from "@/assets/icons/verify.svg";
import { ProductDetails } from "@/features/product/types/type";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface ProductHeaderProps {
  product: ProductDetails;
  price: number;
  priceBefore?: number | null;
  availabilityText: string;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({
  product,
  price,
  priceBefore,
  availabilityText,
}) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      {/* Line 1: Rating */}
      <div className="flex items-start gap-2">
        <ProductRate rating={product?.avg_rating || 0} hideText={true} size={20}/>
        <span className="font-semibold text-subTitleColor text-sm">
          {(product.avg_rating || 0).toFixed(1)}
        </span>
        <span className="text-textColor text-sm">
          ({product.number_of_buys || 0} {t("categories.userBought")})
        </span>
      </div>

      {/* Line 2: Product Name (Right) and Price (Left) */}
      <div className="flex flex-col md:flex-row  items-start justify-between gap-4 flex-wrap">
        {/* Product Name - Right */}
        <div className="flex-1 space-y-1 order-2 md:order-1">
          <h1 className="text-2xl md:text-3xl font-bold text-subTitleColor leading-tight">
            {product.name}
          </h1>
        </div>

        {/* Price - Left */}
        <div className="space-y-1 order-2">
          <p className="text-sm text-textColor">{t("categories.price")}</p>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl md:text-4xl font-bold text-blueSite" >
              ${Number(price || 0).toLocaleString()}
            </span>
            {priceBefore && priceBefore > price && (
              <span className="text-lg text-textColor line-through">
                ${Number(priceBefore).toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Line 3: Listed By (Right) and Quantity (Left) */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-4 flex-wrap">
        {/* Listed By - Right */}
        <div className="space-y-1 flex-1  order-2 md:order-1">
          <p className="text-sm text-start text-textColor">{t("categories.listedBy")}</p>
          <div className="flex items-center gap-2">
            <Link href={`/stores/${product.store.id}/info`}>
              <p className="text-base font-semibold text-subTitleColor hover:underline underline-offset-2 ">
                {product.store?.name || "Company name"}
              </p>
            </Link>
            {product.store?.is_verified !== false && (
              <div className="flex items-center gap-1 text-xs">
                <div className="w-5 h-4 relative">
                 <Image src={verifyIcon} alt="Verified" className=" text-blueSite" />
                </div>
                <span style={{ color: '#0B5C8E' }}>({t("categories.verifiedSeller")})</span>
              </div>
            )}
          </div>
        </div>

        {/* Quantity - Left */}
        <div className="space-y-1 order-1 md:order-2">
          <p className="text-sm text-blueSite" >{t("categories.quantity")} :</p>
          <p className="text-base font-semibold" style={{ color: '#4CAF50' }}>
            {availabilityText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductHeader;
