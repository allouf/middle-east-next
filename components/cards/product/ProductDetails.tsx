'use client';

import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useCartStore from "@/lib/store/useCartStore";
import useCartApi from "@/features/cart/hook/useCartApi";
import useWishlistStore from "@/lib/store/useWishlistStore";
import useWishlistApi from "@/lib/api/useWishlistApi";
import useCompareStore from "@/lib/store/useCompareStore";


import {
    ProductDetails as ProductDetailsType,
    ProductDetailsData,
    SelectedBundleProduct,
} from "@/features/product/types/type";

import { useTranslation } from "@/lib/i18n/useTranslation";
import useApp from "antd/es/app/useApp";
import ProductImages from "@/features/product/components/ProductImages";
import ProductHeader from "@/features/product/components/ProductHeader";
import ProductDelivery from "@/features/stores/components/ProductDetails/ProductDelivery";
import ProductQuantity from "@/features/product/components/ProductQuantity";
import ProductDescriptionSpecs from "@/features/product/components/ProductDescriptionSpecs";

interface ProductDetailsProps {
    productId?: string;
    resData?: ProductDetailsData;
    setCloseModal?: (v: boolean) => void;
}

const ProductDetails = ({ productId, resData, setCloseModal }: ProductDetailsProps) => {
    const { message } = useApp();
    const { t } = useTranslation();
    const router = useRouter();
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
    const [selectedVariantId, setSelectedVariantId] = useState<number | string | null>(null);
    const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});
    const { addToCart, fetchCart } = useCartApi();
    const { addToWishlist, removeFromWishlist } = useWishlistApi();
    const setCart = useCartStore((s) => s.setCart);
    const getWishlistItemId = useWishlistStore((s) => s.getWishlistItemId);
    const addItem = useWishlistStore((s) => s.addItem);
    const removeItem = useWishlistStore((s) => s.removeItem);
    const updateWishlistItemId = useWishlistStore((s) => s.updateWishlistItemId);
    const isInCompare = useCompareStore((s) => s.isInCompare(resData?.product?.id, selectedVariantId));
    const addToCompareStore = useCompareStore((s) => s.addItem);
    const removeFromCompareStore = useCompareStore((s) => s.removeItem);

    const product = useMemo<ProductDetailsType | null>(
        () => resData?.product ?? null,
        [resData]
    );


    const isInWishlist = useWishlistStore((s) => s.isInWishlist(product?.id!));


    useEffect(() => {
        if (product?.variants && product.variants.length > 0) {
            const activeVariant =
                product.variants.find((v) => v.is_active) || product.variants[0];
            setSelectedVariantId(activeVariant.id);
            const initialOptions: Record<number, string> = {};
            activeVariant.option_values?.forEach((ov) => {
                initialOptions[ov.option_id] = ov.value;
            });
            setSelectedOptions(initialOptions);
        } else if (product?.options && product.options.length > 0) {
            const initialOptions: Record<number, string> = {};
            product.options.forEach((opt) => {
                if (opt.values && opt.values.length > 0) {
                    initialOptions[opt.id] = opt.values[0].value;
                }
            });
            setSelectedOptions(initialOptions);
        }
    }, [product]);


    const selectedVariant = useMemo(() => {
        if (!product?.variants || product.variants.length === 0) return null;
        const directMatch = product.variants.find(
            (v) => v.id === selectedVariantId
        );
        if (directMatch) return directMatch;
        // If options were changed, try to find variant by option values
        if (selectedOptions && Object.keys(selectedOptions).length > 0) {
            return product.variants.find((variant) =>
                variant.option_values?.every(
                    (ov) => selectedOptions[ov.option_id] === ov.value
                )
            );
        }
        return null;
    }, [product?.variants, selectedVariantId, selectedOptions]);


    const displayPrice = useMemo(() => {
        if (selectedVariant?.price) return selectedVariant.price;
        return product?.price || 0;


    }, [selectedVariant?.price, product?.price]);


    const priceBeforeDiscount = useMemo(() => {
        if (product?.price_before_discount && product?.price_before_discount > 0) {
            return product.price_before_discount;
        }
        return null;
    }, [product?.price_before_discount]);


    const discountPercent = useMemo(() => {
        if (priceBeforeDiscount && displayPrice < priceBeforeDiscount) {
            const diff = priceBeforeDiscount - displayPrice;
            return Math.round((diff / priceBeforeDiscount) * 100);
        }
        if (product?.discount_type === "percentage" && product.discount_value) {
            return Math.round(product.discount_value);
        }
        return undefined;
    }, [
        displayPrice,
        priceBeforeDiscount,
        product?.discount_type,
        product?.discount_value,
    ]);
    // Get available stock
    const availableStock = useMemo(() => {
        if (selectedVariant?.stock !== undefined && selectedVariant.stock !== null) {
            return selectedVariant.stock;
        }
        if (product?.stock !== undefined && product.stock !== null) {
            return product.stock;
        }
        // If no stock info, assume unlimited (or return a large number)
        return 999999;
    }, [selectedVariant?.stock, product?.stock]);


    // Reset quantity when variant or stock changes if current quantity exceeds available stock
    useEffect(() => {
        setQuantity((prev) => {
            if (prev > availableStock && availableStock > 0) {
                return availableStock;
            } else if (availableStock === 0) {
                return 1; // Keep at 1 even if out of stock (will be handled by add to cart validation)
            }
            return prev; // Keep current quantity if it's valid
        });
    }, [availableStock, selectedVariant?.id]);


    // Reset when variant changes or stock changes
    const handleQuantityChange = (delta: number) => {
        setQuantity((prev) => {
            const newQuantity = prev + delta;
            // Ensure quantity is at least 1 and at most available stock
            return Math.max(1, Math.min(availableStock, newQuantity));
        });
    };


    const handleAddToCart = async (selectedBundleProducts?: SelectedBundleProduct[] | null) => {
        setIsAddingToCart(true);
        try {
            // If bundle products are selected, add all of them
            if (selectedBundleProducts && selectedBundleProducts.length > 0) {
                // Get items from the first package
                const packageItems = product?.packages?.[0]?.items || [];

                // Filter selected items (excluding main product which is handled separately)
                const selectedItems = packageItems.filter((item) =>
                    selectedBundleProducts.find((sp) => sp.id === item.id && sp.selected)
                );
                // Check if main product is selected
                const mainProductSelected = selectedBundleProducts.find(
                    (sp) => sp.id === `main-${product?.id}` && sp.selected
                );
                // Add main product first if selected (use quantity 1 for bundle)
                if (mainProductSelected) {
                    await addToCart(
                        {
                            product_id: Number(productId),
                            product_variant_id: (selectedVariant?.id || product.variants?.[0]?.id || null) as number,
                            quantity: 1,
                        },
                        {
                            showMessage: false,
                            onSuccess: () => {
                            },
                            onError: (err: any) => {
                                if (err.status === 401) {
                                    message.error(t('messages.unauthorized'));
                                    router.push("/login")
                                } else {
                                    const errorMessage =
                                        err.response?.data?.message ||
                                        err.message ||
                                        "Failed to remove item from wishlist";
                                    message.error(errorMessage);
                                }
                            }
                        }
                    );
                }
                // Add each selected package item to cart
                for (const item of selectedItems) {
                    await addToCart(
                        {
                            product_id: item.product.id,
                            product_variant_id: item.variant_id as number,
                            quantity: item.quantity,
                        },
                        {
                            showMessage: false,
                            onSuccess: () => {
                                message.success(t('product.productsAddedToCart'));
                            },
                            onError: (err: any) => {
                                if (err.status === 401) {
                                    message.error(t('messages.unauthorized'));
                                    router.push("/login")
                                } else {
                                    const errorMessage =
                                        err.response?.data?.message ||
                                        err.message ||
                                        "Failed to remove item from wishlist";
                                    message.error(errorMessage);
                                }
                            }
                        }
                    );
                }
                // Refresh cart after adding all
                const cartResponse = await fetchCart();
                if (cartResponse.status && cartResponse.data) {
                    setCart(cartResponse.data);
                }
            } else {
                // Add main product to cart
                const productId = product?.id;
                if (!productId) {
                    message.error(t('product.productIdNotFound'));
                    return;
                }
                await addToCart(
                    {
                        product_id: productId,
                        product_variant_id:
                            selectedVariant?.id || product.variants?.[0]?.id || 1,
                        quantity: quantity,
                    },
                    {
                        showMessage: true,
                        onSuccess: async () => {
                            const cartResponse = await fetchCart();
                            if (cartResponse.status && cartResponse.data) {
                                setCart(cartResponse.data as any);
                            }
                            // message.success(t('product.productsAddedToCart'));

                        },
                        onError: (err: any) => {
                            if (err.status === 401) {
                                message.error(t('messages.unauthorized'));
                                router.push("/login")
                            } else {
                                const errorMessage =
                                    err.response?.data?.message ||
                                    err.message ||
                                    "Failed to remove item from wishlist";
                                message.error(errorMessage);
                            }
                        }
                    }
                );
            }
            setTimeout(() => {
                setCloseModal?.(false);
            }, 3000);

        } catch (err: any) {
            console.error("Failed to add to cart:", err);

            let errorMessage =
                err?.response?.data?.message ||
                err?.message ||
                t('failedToAddToCart', { defaultValue: 'Failed to add item to cart' });

            if (errorMessage === 'Unauthenticated.') {
                errorMessage = t('unauthenticated', {
                    defaultValue: 'Please log in to continue',
                });
            }

            // message.error(errorMessage);
        } finally {
            setIsAddingToCart(false);
        }

    };

    const handleBuyNow = async () => {
        try {
            await handleAddToCart();
            setCloseModal?.(false);

        } catch (err: any) {
            console.error("Buy now failed:", err);
            if (err?.status === 401) {
                message.error(t('messages.unauthorized'));
                router.push("/login")
            }
        } finally {
            router.push("/cart");
        }
    };

    const handleAddToCompare = () => {
        if (!product) return;

        if (isInCompare) {
            removeFromCompareStore(product.id);
            message.success(t("product.removedFromCompare"));
            return;
        }

        const compareProduct = {
            id: selectedVariant?.id || product.id, // Unique key
            product_id: (product as any).product_id || product.id,
            variant_id: selectedVariant?.id || ((product as any).product_id ? product.id : null),
            name: product.name + (selectedVariant ? ` - ${selectedVariant.sku}` : ""),
            price: selectedVariant?.price || product.price,
            image: selectedVariant?.image || product.gallery?.[0]?.file_path || "/dummy/prod21.png",
            category: product.category,
            store: product.store,
            avg_rating: product.avg_rating,
            total_left_in_stock: selectedVariant?.stock ?? (product as any).total_left_in_stock,
            status: product.status,
            price_before_discount: product.price_before_discount,
            discount_value: product.discount_value,
            discount_type: product.discount_type as string | undefined,
            availability_status: (product as any).availability_status,
            number_of_buys: (product as any).number_of_buys,
            reviews: (product as any).reviews || 0,
        };

        const added = addToCompareStore(compareProduct);
        if (added) {
            message.success(t("product.addedToCompare"));
        } else {
            message.error(t("product.compareError"));
        }
    };


    const handleToggleWishlist = async () => {
        if (isTogglingWishlist) return;
        const inWishlist = isInWishlist;
        setIsTogglingWishlist(true);
        try {
            if (inWishlist) {
                // Remove from wishlist
                const wishlistItemId = getWishlistItemId(product?.id);
                if (wishlistItemId) {
                    await removeFromWishlist(wishlistItemId, {
                        showMessage: false,
                        onSuccess: () => {
                            removeItem(product?.id);
                            message.success(t("product.removedFromWishlist", { name: product?.name }));
                        },
                        onError: (err) => {
                            if (err.status === 401) {
                                message.error(t('messages.unauthorized'));
                                router.push("/login")
                            } else {
                                const errorMessage =
                                    err.response?.data?.message || err.message || "Failed to remove item from wishlist";
                                message.error(errorMessage);
                            }
                        }
                    });
                } else {
                    // Fallback: remove from local state only
                    removeItem(product?.id);
                    message.success(t("product.removedFromWishlist", { name: product?.name }));
                }
            } else {
                // Add to wishlist
                await addToWishlist(
                    product?.id!, // Pass product_id directly (will be converted to FormData)
                    {
                        showMessage: false,
                        onSuccess: () => {
                            // Add to local state
                            addItem({
                                id: product?.id!,
                                wishlistItemId: product?.id!, // Use product ID (same as product ID based on API response)
                                title: product?.name,
                                categoryPath: product?.category
                                    ? [product.category.name]
                                    : ["Electronic"],
                                company: product?.store?.name || "Company name",
                                verified: true,
                                options: {},
                                price: Number(product?.price || 0),
                                newPrice: Number(product?.price || 0),
                                image:
                                    product?.gallery && product?.gallery.length > 0
                                        ? product?.gallery[0].file_path
                                        : "/dummy/prod21.png",
                                badge:
                                    product?.discount_value && product?.discount_value > 0
                                        ? "SALE"
                                        : undefined,
                                stock: product?.status === "active" ? 12 : 0,
                                rating: product?.avg_rating || 0,
                            });
                            // Update wishlist item ID
                            updateWishlistItemId(product?.id!, product?.id!);
                            message.success(t("product.addedToWishlist", { name: product?.name }));
                        },
                        onError: (err: any) => {
                            if (err.status === 401) {
                                message.error(t('messages.unauthorized'));
                                router.push("/login")
                            } else {
                                const errorMessage =
                                    err.response?.data?.message || err.message || "Failed to remove item from wishlist";
                                message.error(errorMessage);
                            }
                        }
                    }
                );
            }
        } catch (err) {
            console.error("Failed to toggle wishlist:", err);
        } finally {
            setIsTogglingWishlist(false);
        }
    };


    const images =
        product?.gallery && product?.gallery.length > 0
            ? product?.gallery.map(item => ({
                ...item,
                file_type: "image" as const
            }))
            : [{ id: 1, file_path: "/dummy/prod21.png", file_type: "image" as const }];


    const colorMap: Record<string, string> = {
        red: "#ef4444",
        blue: "#2563eb",
        green: "#22c55e",
        purple: "#7c3aed",
        yellow: "#f59e0b",
        black: "#111827",
        white: "#f9fafb",
        gray: "#9ca3af",
        grey: "#9ca3af",
        pink: "#ec4899",
        orange: "#f97316",
    };


    const handleSelectOption = (optionId: number, value: string) => {
        const nextOptions = { ...selectedOptions, [optionId]: value };
        setSelectedOptions(nextOptions);
        if (product?.variants && product.variants.length > 0) {
            const matchedVariant = product.variants.find((variant) =>
                variant.option_values?.every(
                    (ov) => nextOptions[ov.option_id] === ov.value
                )
            );
            if (matchedVariant) {
                setSelectedVariantId(matchedVariant.id);
            }
        }
    };
    console.log("selected variant", selectedVariant)
    const availabilityText =
        selectedVariant?.stock && selectedVariant.stock > 0
            ? t('product.inStockCount', { count: selectedVariant.stock })
            : product?.status === "active"
                ? t('product.inStockCount', { count: selectedVariant?.stock || 0 })
                : t('product.outOfStock');


    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <p className="text-gray-600 font-semibold mb-4">
                    {t('product.productNotFound')}
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-blueSite text-white font-medium py-2 px-6 rounded transition"
                >
                    {t('product.retry')}
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-[90%]">
            <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
                {/* Breadcrumb */}
                <div className="flex flex-row items-center justify-between">
                    {/* <Breadcrumb product={product} /> */}


                </div>


                {/* Main Content */}
                <div className=" mb-8">
                    <div className="grid lg:grid-cols-[1.05fr,0.95fr] gap-8 lg:gap-12">
                        {/* Product Images with Zoom */}
                        <ProductImages
                            images={images}
                            selectedImage={selectedImage}
                            setSelectedImage={setSelectedImage}
                            name={product.name}
                            discountPercent={discountPercent}
                        />
                        {/* product Info */}
                        <div className="flex flex-col gap-6">
                            {/* Product Header */}
                            <ProductHeader
                                product={product}
                                price={displayPrice}
                                priceBefore={priceBeforeDiscount}
                                availabilityText={availabilityText}
                            />
                            {/* Line 4: Colors */}
                            {product.options &&
                                product.options.some((opt) =>
                                    opt.name.toLowerCase().includes("color")
                                ) && (
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-sm font-medium text-blueSite" >
                                            {t('product.colors')} :
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                            {product.options
                                                .filter((opt) => opt.name.toLowerCase().includes("color"))
                                                .map((colorOption) =>
                                                    colorOption.values?.map((val) => {
                                                        const isSelected =
                                                            selectedOptions[colorOption.id] === val.value;
                                                        const colorValue =
                                                            colorMap[val.value?.toLowerCase()] || "#e5e7eb";
                                                        return (
                                                            <button
                                                                key={val.id}
                                                                onClick={() =>
                                                                    handleSelectOption(colorOption.id, val.value)
                                                                }
                                                                className={`2xl:w-10 2xl:h-10 w-8 h-8 rounded-full border-2 transition-all ${isSelected
                                                                    ? "border-blueSiteHover shadow-lg"
                                                                    : "border-gray-200 hover:border-gray-300"
                                                                    }`}
                                                                style={{ backgroundColor: colorValue }}
                                                                aria-label={val.value}
                                                            />
                                                        );
                                                    })
                                                )}
                                        </div>
                                    </div>
                                )}
                            {/* Line 5: Sizes */}
                            {product.options &&
                                product.options.some((opt) =>
                                    opt.name.toLowerCase().includes("size")
                                ) && (
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-sm font-medium text-blueSite" >
                                            {t('product.sizes')} :
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                            {product.options
                                                .filter((opt) => opt.name.toLowerCase().includes("size"))
                                                .map((sizeOption) =>
                                                    sizeOption.values?.map((val) => {
                                                        const isSelected =
                                                            selectedOptions[sizeOption.id] === val.value;
                                                        return (
                                                            <button
                                                                key={val.id}
                                                                onClick={() =>
                                                                    handleSelectOption(sizeOption.id, val.value)
                                                                }
                                                                className={`2xl:w-12 2xl:h-12 w-10 h-10 rounded-full border text-sm font-medium transition-all flex items-center justify-center ${isSelected
                                                                    ? "border-blueSite bg-[#E6F0ED] text-blueSite"
                                                                    : "border-gray-300 text-subTitleColor hover:border-gray-400"
                                                                    }`}
                                                                style={{
                                                                    backgroundColor: isSelected ? undefined : '#FAFAFA',
                                                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                                                                }}
                                                            >
                                                                {val.value}
                                                            </button>
                                                        );
                                                    })
                                                )}
                                        </div>
                                    </div>
                                )}
                            {/* Delivery Info - Only shown if data available from API */}
                            <ProductDelivery deliveryInfo={product.delivery_info} />
                            {/* --- Quantity & Buttons --- */}
                            <ProductQuantity
                                quantity={quantity}
                                handleQuantityChange={handleQuantityChange}
                                handleAddToCart={() => handleAddToCart()}
                                handleBuyNow={handleBuyNow}
                                handleAddToCompare={handleAddToCompare}
                                isAddingToCart={isAddingToCart}
                                isInWishlist={isInWishlist}
                                isInCompare={isInCompare}
                                isTogglingWishlist={isTogglingWishlist}
                                handleToggleWishlist={handleToggleWishlist}
                                availabilityText={availabilityText}
                                availableStock={availableStock}
                                loadingWishList={false}
                            />
                            {/* Description and Specifications */}
                            <ProductDescriptionSpecs
                                description={product.description}
                                specifications={product.specifications}
                            />
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
};
export default ProductDetails;
