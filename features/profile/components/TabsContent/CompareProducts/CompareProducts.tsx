"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import useCartApi from "@/features/cart/hook/useCartApi";
import { Product, ProductsResponse } from "@/features/product/types/type";
import useGetData from "@/lib/api/useGetData";
import useWishlistApi from "@/lib/api/useWishlistApi";
import useWishlistStore from "@/lib/store/useWishlistStore";
import useCompareStore from "@/lib/store/useCompareStore";
import useCartStore from "@/lib/store/useCartStore";
import { PRODUCTS_ENDPOINT } from "@/shared/constants/urls";
import { CompareProduct } from "@/lib/store/useCompareStore";
import ProductSearchSlot from "./ProductSearchSlot";
import SlotHeader from "./SlotHeader";
import CompareRow, { CompareRowConfig, renderValue } from "./CompareRow";
import { useTranslation } from "@/lib/i18n/useTranslation";
import useApp from "antd/es/app/useApp";
import CartProductDetails from "@/components/cards/product/CartProductDetails";


const DEFAULT_SLOTS_COUNT = 4;

const compareRows = (t: any): CompareRowConfig[] => [
  { label: t("compareProducts.rows.name"), path: "name" },
  { label: t("compareProducts.rows.category"), path: "category.name" },
  { label: t("compareProducts.rows.store"), path: "store.name" },

  { label: t("compareProducts.rows.price"), path: "price", type: "money" },
  { label: t("compareProducts.rows.priceBeforeDiscount"), path: "price_before_discount", type: "money" },
  { label: t("compareProducts.rows.discountValue"), path: "discount_value", type: "number" },
  { label: t("compareProducts.rows.discountType"), path: "discount_type" },

  { label: t("compareProducts.rows.availability"), path: "availability_status", type: "badge" },
  { label: t("compareProducts.rows.totalLeftInStock"), path: "total_left_in_stock", type: "number" },
  { label: t("compareProducts.rows.status"), path: "status", type: "badge" },

  { label: t("compareProducts.rows.customerFeedback"), path: "avg_rating", type: "rating" },
  { label: t("compareProducts.rows.numberOfBuys"), path: "number_of_buys", type: "number" },
];



const getCategoryId = (p: Product | null) => (p?.category as any)?.id ?? null;

/** ------- Main component ------- */
export default function CompareProducts() {
  const { message } = useApp();
  const { t, i18n } = useTranslation();
  const compareStoreItems = useCompareStore((s) => s.getItems());
  const clearCompareStore = useCompareStore((s) => s.clear);
  const addToCompareStore = useCompareStore((s) => s.addItem);
  const removeFromCompareStore = useCompareStore((s) => s.removeItem);
  const [openCartModal, setOpenCartModal] = useState(false)

  // id of product to show in cart modal
  const [cartProductId, setCartProductId] = useState<number | null>(null);

  // Initialize slots (empty initially, will be populated from store after hydration)
  const [slots, setSlots] = useState<(CompareProduct | null)[]>(
    Array.from({ length: DEFAULT_SLOTS_COUNT }, () => null)
  );
  const [isHydrated, setIsHydrated] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  // ✅ NEW: lock category after first selection
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  // ✅ NEW: ID of the product being processed.
  const [processingProductId, setProcessingProductId] = useState<number | null>(null);

  const { loading: cartLoading } = useCartApi();
  const { addToWishlist, removeFromWishlist, loading: wishlistLoading } = useWishlistApi();
  const { isInWishlist } = useWishlistStore();
  const openCartWithProduct = (productId: number | null) => {
    setCartProductId(productId);
    setOpenCartModal(true);
  };
  // Sync slots with compare store after hydration
  useEffect(() => {
    // Wait for store to hydrate from localStorage
    if (!isHydrated && compareStoreItems.length > 0) {
      const initialSlots: (CompareProduct | null)[] = Array.from({ length: DEFAULT_SLOTS_COUNT }, () => null);
      compareStoreItems.forEach((item, index) => {
        if (index < DEFAULT_SLOTS_COUNT) {
          initialSlots[index] = item;
        }
      });
      setSlots(initialSlots);

      const firstCategoryId = (compareStoreItems[0] as any)?.category?.id;
      if (firstCategoryId) {
        setSelectedCategoryId(firstCategoryId);
      }
      setIsHydrated(true);
    }
  }, [compareStoreItems, isHydrated]);

  // ✅ search is filtered by category_id once locked
  const searchApi = useGetData<ProductsResponse>({
    url: PRODUCTS_ENDPOINT.getAll,
    extraParams: {
      search: searchQuery,
      limit: 10,
      ...(selectedCategoryId ? { category_id: selectedCategoryId } : {}),
    },
  });

  const updateSlot = useCallback(
    (index: number, product: Product | null) => {
      // ✅ if selecting product enforce same category
      if (product) {
        const productCatId = getCategoryId(product);

        // if first pick → lock category
        if (!selectedCategoryId) {
          if (!productCatId) {
            message.error(t("compareProducts.noCategory"));
            return;
          }
          setSelectedCategoryId(productCatId);
        } else {
          // if already locked → must match
          if (!productCatId || productCatId !== selectedCategoryId) {
            message.error(t("compareProducts.sameCategoryRequired"));
            return;
          }
        }
        // Create CompareProduct item
        const compareProduct: CompareProduct = {
          id: (product as any).variants?.[0]?.id || (product as any).id,
          product_id: (product as any).product_id || product.id,
          variant_id: (product as any).variants?.[0]?.id || ((product as any).product_id ? product.id : null),
          name: product.name,
          price: product.price,
          image: (product as any).image || (product as any).gallery?.[0]?.file_path || "/dummy/prod21.png",
          category: product.category as any,
          store: product.store as any,
          // Add other fields needed for comparison rows
          price_before_discount: product.price_before_discount,
          discount_value: product.discount_value,
          discount_type: product.discount_type || undefined,
          availability_status: (product as any).availability_status,
          total_left_in_stock: (product as any).total_left_in_stock,
          status: product.status,
          avg_rating: product.avg_rating,
          number_of_buys: (product as any).number_of_buys,
          reviews: (product as any).reviews || 0,
        };

        addToCompareStore(compareProduct);

        setSlots((prev) => {
          const next = [...prev];
          next[index] = compareProduct;
          return next;
        });
      } else {
        // Removing product from slot - also remove from store
        const currentProduct = slots[index];
        if (currentProduct) {
          removeFromCompareStore(currentProduct.id);
        }
        setSlots((prev) => {
          const next = [...prev];
          next[index] = null;
          return next;
        });
      }

      setSlots((next) => {
        // ✅ if removing and all slots empty → unlock category
        const allEmpty = next.every((x) => x === null);
        if (allEmpty) setSelectedCategoryId(null);
        return next;
      });

      if (product) setSearchQuery("");
    },
    [selectedCategoryId, slots, addToCompareStore, removeFromCompareStore, message, t]
  );



  const toggleWishlist = useCallback(
    async (item: CompareProduct) => {
      const inWishlist = isInWishlist(item.product_id);
      setProcessingProductId(item.product_id); // Set the loading ID
      try {
        if (inWishlist) {
          await removeFromWishlist(item.product_id, {
            showMessage: false,
            onSuccess: () => useWishlistStore.getState().removeItem(item.product_id),
          });
          message.success(t("compareProducts.removedFromWishlist"));
          return;
        }

        await addToWishlist(item.product_id, {
          showMessage: false,
          onSuccess: () =>
            useWishlistStore.getState().addItem({
              id: item.product_id,
              name: item.name,
              price: item.price,
              image: item.image,
              stock: item.total_left_in_stock,
            } as any),
        });
        message.success(t("compareProducts.addedToWishlist"));
      } catch {
        message.error(t("compareProducts.wishlistActionFailed"));
      } finally {
        setProcessingProductId(null); // Reset the loading ID
      }
    },
    [addToWishlist, removeFromWishlist, isInWishlist, message, t]
  );

  const rows = useMemo(() => compareRows(t), [t]);

  // ✅ optional: show selected category name in UI
  const selectedCategoryName = useMemo(() => {
    const first = slots.find((x) => x !== null);
    return (first?.category as any)?.name ?? "";
  }, [slots]);

  return (

    <>  <div className="p-6 md:p-7 md:pt-[4vh]">
      <div className="text-2xl mb-2 max-w-[670px]">
        {t("compareProducts.title")}
      </div>

      {/* ✅ hint */}
      {selectedCategoryId ? (
        <div className="text-sm text-gray-500 mb-4">
          {t("compareProducts.comparingWithinCategory")}{" "}
          <span className="font-semibold text-gray-700">{selectedCategoryName || `#${selectedCategoryId}`}</span>
        </div>
      ) : (
        <div className="text-sm text-gray-500 mb-4">
          {t("compareProducts.selectFirstProduct")}
        </div>
      )}

      <div className="w-full mx-auto bg-white rounded-md overflow-x-auto">
        {/* HEADER SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 border-b border-gray-200">
          <div className="p-4 flex flex-col justify-center border-r border-gray-200 bg-white md:block " />

          {slots.map((product, index) => (
            <div
              key={index}
              className="p-3 md:p-5 border-r border-gray-200 last:border-r-0 relative min-h-[300px] md:min-h-[400px]"
            >
              {product ? (
                <SlotHeader
                  product={product}
                  onRemove={() => updateSlot(index, null)}
                  onAddToCart={() => openCartWithProduct(product.product_id)}
                  onToggleWishlist={() => toggleWishlist(product)}
                  cartLoading={cartLoading && processingProductId === product.product_id}
                  wishlistLoading={wishlistLoading && processingProductId === product.product_id}
                  inWishlist={isInWishlist(product.product_id)}
                />
              ) : (
                <ProductSearchSlot
                  loading={searchApi.loading}
                  data={searchApi.data?.data?.products ?? []}
                  onSearch={setSearchQuery}
                  onSelect={(p) => updateSlot(index, p)}
                />
              )}
            </div>
          ))}
        </div>

        {/* COMPARISON ROWS */}
        <div className="block lg:hidden">
          {/* Mobile layout - stack each product vertically */}
          {slots.map((product, productIndex) => (
            product && (
              <div key={productIndex} className="border-b border-gray-200 last:border-b-0">
                <div className="bg-gray-50 p-3 border-b border-gray-200">
                  <h3 className="font-medium text-sm text-gray-900 truncate">{product.name}</h3>
                </div>
                {rows.map((row, rowIndex) => (
                  <div
                    key={row.path}
                    className={`flex justify-between p-3 ${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                  >
                    <span className="text-sm text-gray-500 font-medium">{row.label}</span>
                    <div className="text-sm text-right">
                      {renderValue(row, product, t, i18n.language)}
                    </div>
                  </div>
                ))}
              </div>
            )
          ))}
          {slots.every(s => s === null) && (
            <div className="text-center py-8 text-gray-500">
              {t("compareProducts.noProductsToCompare")}
            </div>
          )}
        </div>

        {/* Desktop layout - original grid */}
        <div className="hidden lg:block">
          {rows.map((row, index) => (
            <CompareRow
              key={row.path}
              row={row}
              products={slots as any}
              isStriped={index % 2 === 0}
            />
          ))}
        </div>

      </div>
    </div>

      <CartProductDetails open={openCartModal} setOpen={setOpenCartModal} id={cartProductId} />
    </>
  );
}
