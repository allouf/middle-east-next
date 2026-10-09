import { CloseCircleOutlined } from "@ant-design/icons";
import { FiShoppingCart } from "react-icons/fi";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import Image from "next/image";
import { CompareProduct } from "@/lib/store/useCompareStore";

const isUnavailable = (p: any) => p.availability_status === "unavailable";

const getCartBtnClass = (status: any) => {
    const base =
        "flex-1 bg-blueSite flex gap-1 md:gap-2 justify-center items-center px-1 md:px-2 h-8 md:h-10 rounded-md uppercase text-white text-xs font-bold tracking-wider transition-all disabled:!bg-[#ADB7BC]";
    if (status === "in_stock" || status === "low_stock")
        return `${base} bg-[#00664F] hover:bg-[#00664F]/80 border-none`;
    return `${base} border-none`;
};

import { useTranslation } from "@/lib/i18n/useTranslation";

export default function SlotHeader({
    product,
    onRemove,
    onAddToCart,
    onToggleWishlist,
    cartLoading,
    wishlistLoading,
    inWishlist,
}: {
    product: CompareProduct;
    onRemove: () => void;
    onAddToCart: () => void;
    onToggleWishlist: () => void;
    cartLoading: boolean;
    wishlistLoading: boolean;
    inWishlist: boolean;
}) {
    const { t } = useTranslation();

    // console.log("product", product.gallery[0]?.file_path);

    return (
        <>
            <button
                className="block mx-auto text-red-400 hover:text-red-500 transition-colors"
                onClick={onRemove}
                aria-label={t("compareProducts.removeProduct")}
            >
                <CloseCircleOutlined style={{ fontSize: "20px" }} />
            </button>

            <div className="h-32 md:h-48 flex items-center justify-center mb-4 md:mb-6 relative w-full">
                <Image
                    src={product.image || "/dummy/prod21.png"}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain"
                />
            </div>

            <h3 className="text-xs md:text-sm font-normal text-gray-800 h-8 md:h-12 overflow-hidden mb-3 md:mb-4 leading-relaxed">
                {product.name}
            </h3>

            <div className="flex gap-1 md:gap-2">
                <button
                    disabled={isUnavailable(product) || cartLoading}
                    onClick={onAddToCart}
                    className={getCartBtnClass(product.availability_status)}
                >
                    {t("compareProducts.addToCart")} <FiShoppingCart size={14} className="hidden sm:block" />
                </button>

                <button
                    onClick={onToggleWishlist}
                    disabled={wishlistLoading}
                    className="size-8 md:size-10 flex items-center justify-center rounded-md border-2 border-[#B0D0C8] hover:bg-[#B0D0C8] transition-all disabled:!bg-[#ADB7BC]"
                    aria-label={inWishlist ? t("compareProducts.removeFromWishlist") : t("compareProducts.addToWishlist")}
                >
                    {inWishlist ? (
                        <IoHeart className="text-[#00664F] " size={14} />
                    ) : (
                        <IoHeartOutline className="text-[#00664F] " size={14} />
                    )}
                </button>
            </div>
        </>
    );
}
