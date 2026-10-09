"use client";
import Button from "@/components/ui/Button";
import useWishlistApi from "@/lib/api/useWishlistApi";
import { useTranslation } from "@/lib/i18n/useTranslation";
import useWishlistStore from "@/lib/store/useWishlistStore";
import { DatePicker, Input, message, Select } from "antd";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BiCalendar } from "react-icons/bi";
import { CiGrid41, CiSearch } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { GoTrash } from "react-icons/go";
import { LiaCoinsSolid } from "react-icons/lia";
import { RiSortAsc } from "react-icons/ri";
import { TbDiscount } from "react-icons/tb";

const formatMoney = (n: number) =>
  (n || 0).toLocaleString(undefined, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

// Helper function to get item stock
const getItemStock = (item: any): number => {
  if (item.stock != null) return item.stock;
  if (item.quantity != null && item.quantity > 0) return item.quantity;
  return 0;
};

// Helper function to get item image
const getItemImage = (item: any): string | undefined => {
  return item.image || (item.gallery && item.gallery[0]?.file_path);
};

// Helper function to calculate discount percentage
const calculateDiscount = (item: any): number | null => {
  if (item.discount_value && item.discount_value > 0) {
    return item.discount_value;
  }

  if (
    item.price_before_discount &&
    item.price &&
    item.price_before_discount > item.price
  ) {
    const calculated = Math.round(
      ((item.price_before_discount - item.price) / item.price_before_discount) *
      100
    );
    return calculated > 0 ? calculated : null;
  }

  return null;
};

const WishlistSkeleton = () => {
  const pulse = "animate-pulse bg-gray-200 rounded";

  return (
    <section className="w-full space-y-6 p-6 md:p-7 md:pt-[4vh]">
      <div className="space-y-3">
        <div className={`${pulse} h-7 w-48`} />
        <div className={`${pulse} h-4 w-64`} />
      </div>

      <div className="flex flex-col lg:flex-row gap-3">
        <div className={`${pulse} h-[50px] w-full rounded-lg`} />
        <div className={`${pulse} h-[50px] w-48 rounded-lg`} />
      </div>

      <div className="flex flex-row flex-wrap items-start justify-between gap-4">
        <div className={`${pulse} h-[50px] w-52 rounded-lg`} />
        <div className={`${pulse} h-[50px] w-52 rounded-lg`} />
        <div className={`${pulse} h-[50px] w-52 rounded-lg`} />
        <div className={`${pulse} h-[50px] w-52 rounded-lg`} />
      </div>

      <div className="space-y-4">
        {[...Array(3)].map((_, idx) => (
          <div
            key={idx}
            className="bg-grayLight rounded-[12px] p-4 grid grid-cols-1 lg:grid-cols-[140px_1fr] gap-4 shadow-sm"
          >
            <div className={`${pulse} h-[130px] w-full rounded-lg`} />
            <div className="space-y-3">
              <div className="flex justify-between items-start gap-4">
                <div className={`${pulse} h-6 w-48`} />
                <div className={`${pulse} h-6 w-24`} />
              </div>
              <div className={`${pulse} h-4 w-72`} />
              <div className="flex items-center gap-3">
                <div className={`${pulse} h-4 w-20`} />
                <div className={`${pulse} h-4 w-16`} />
              </div>
              <div className="flex justify-end">
                <div className={`${pulse} h-10 w-24 rounded-lg`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Wishlist = () => {
  const items = useWishlistStore((s) => s.items);
  const removeItem = useWishlistStore((s) => s.removeItem);
  const setWishlist = useWishlistStore((s) => s.setWishlist);
  const { fetchWishlist, removeFromWishlist } = useWishlistApi();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPrice, setFilterPrice] = useState("all");
  const [filterSoldOut, setFilterSoldOut] = useState<boolean>(false);
  const [filterDate, setFilterDate] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("latest");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const formatDate = (dateString: string) => {
    if (!dateString) return t("labels.n_a");
    const date = new Date(dateString);
    return `${date.getDate()} / ${date.getMonth() + 1} / ${date.getFullYear()}`;
  };

  // Stable callback for loading wishlist
  const loadWishlist = useCallback(async () => {
    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetchWishlist();
      if (response.status && response.data) {
        setWishlist(response.data);
      }
    } catch (err) {
      // Only log if not aborted
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("Failed to fetch wishlist:", err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [fetchWishlist, setWishlist]);

  useEffect(() => {
    loadWishlist();

    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadWishlist]);

  const categories = useMemo(() => {
    const catsMap = new Map();
    items.forEach((item) => {
      if (item.category && item.category.name) {
        catsMap.set(item.category.id, item.category.name);
      } else if (item.categoryPath && Array.isArray(item.categoryPath)) {
        item.categoryPath.forEach((cat) => catsMap.set(cat, cat));
      }
    });
    return Array.from(catsMap.entries()).map(([id, name]) => ({
      value: id,
      label: name,
    }));
  }, [items]);

  // Memoize parsed price range
  const priceRange = useMemo(() => {
    if (filterPrice === "all") return null;
    const [min, max] = filterPrice.split("-").map(Number);
    return { min, max: max || Infinity };
  }, [filterPrice]);

  // Memoize selected date as dayjs instance
  const selectedDateDayjs = useMemo(() => {
    return filterDate ? dayjs(filterDate) : null;
  }, [filterDate]);

  const filteredItems = useMemo(() => {
    let filtered = [...items];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title?.toLowerCase().includes(query) ||
          item.name?.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filterCategory !== "all") {
      filtered = filtered.filter((item) => {
        if (item.category && item.category.id) {
          return item.category.id.toString() === filterCategory.toString();
        }
        return item.categoryPath?.includes(filterCategory);
      });
    }

    // Price filter
    if (priceRange) {
      filtered = filtered.filter((item) => {
        const price = item.price || 0;
        return price >= priceRange.min && price <= priceRange.max;
      });
    }

    // Sold out filter
    if (filterSoldOut) {
      filtered = filtered.filter((item) => getItemStock(item) === 0);
    }

    // Date filter
    if (selectedDateDayjs) {
      filtered = filtered.filter((item) => {
        const itemDate = dayjs(item.favorited_at || item.addedDate);
        return itemDate.isSame(selectedDateDayjs, "day");
      });
    }

    // Sorting (non-mutating)
    const sorted = [...filtered];
    if (sortBy === "latest") {
      sorted.sort((a, b) =>
        dayjs(b?.favorited_at || b?.addedDate!).diff(
          dayjs(a?.favorited_at || a?.addedDate!)
        )
      );
    } else if (sortBy === "oldest") {
      sorted.sort((a, b) =>
        dayjs(a?.favorited_at || a?.addedDate!).diff(
          dayjs(b?.favorited_at || b?.addedDate!)
        )
      );
    } else if (sortBy === "price-low") {
      sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "price-high") {
      sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    return sorted;
  }, [
    items,
    searchQuery,
    filterCategory,
    priceRange,
    filterSoldOut,
    selectedDateDayjs,
    sortBy,
  ]);

  const handleDelete = async (item: (typeof items)[number]) => {
    const { id, wishlistItemId, title } = item;

    if (deletingId === id) return;

    setDeletingId(id);

    try {
      if (wishlistItemId) {
        await removeFromWishlist(wishlistItemId, {
          showMessage: false,
          onSuccess: () => {
            removeItem(id);
            message.success(t("messages.removedFromWishlist", { title }));
          },
        });
      } else {
        removeItem(id);
        message.success(t("messages.removedFromWishlist", { title }));
      }
    } catch (err) {
      console.error("Failed to delete from wishlist:", err);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return <WishlistSkeleton />;
  }

  return (
    <section className="w-full p-6 md:p-7 md:pt-[4vh]">
      <div className="mb-6 flex flex-col lg:flex-row gap-3">
        <Input
          placeholder={t("placeholders.searchProducts")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          prefix={<CiSearch className="text-darkbg mr-2" size={25} />}
          className="flex-1 h-[50px] rounded-lg bg-blueLight border-none hover:bg-blueLight focus:bg-blueLight"
          style={{ backgroundColor: "var(--blueLight)" }} // Ensuring background color matches
          variant="filled"
        />

        <div className="flex flex-wrap items-center gap-3">
          {/* SORT SELECT */}
          <Select
            value={sortBy}
            onChange={(value) => setSortBy(value)}
            className="flex-1 [&>.ant-select-selector]:!bg-blueLight [&>.ant-select-selector]:!border-none [&>.ant-select-selector]:!shadow-none min-w-[180px] h-[50px] [&_.ant-select-selection-wrap]:!w-fit [&>.ant-select-selector]:!justify-center"
            prefix={<RiSortAsc className="text-[#00664f]" size={25} />}
            suffixIcon={null}
            options={[
              { value: "latest", label: t("sort.latest") },
              { value: "oldest", label: t("sort.oldest") },
              { value: "price-low", label: t("sort.priceLow") },
              { value: "price-high", label: t("sort.priceHigh") },
            ]}
          />
        </div>
      </div>

      <div className="mb-6 flex flex-row flex-wrap items-start justify-between gap-5">
        {/* DATE PICKER */}
        <DatePicker
          placeholder={t("filters.filterByDate")}
          className="flex-1 h-[50px] !bg-bgGray rounded-lg !shadow-none border-none"
          prefix={<BiCalendar className="text-blueIcons" size={24} />}
          suffixIcon={null}
          value={filterDate ? dayjs(filterDate) : null}
          onChange={(_, dateString) => {
            setFilterDate(dateString as string);
          }}
        />
        <button
          onClick={() => setFilterSoldOut(!filterSoldOut)}
          className={`flex-1 flex flex-row justify-center items-center gap-2 px-4 rounded-lg shadow-sm transition ${filterSoldOut
              ? "bg-[#D02F44] text-textWhiteColor"
              : "bg-bgGray text-subTitleColor"
            }`}
          style={{ width: "214px", height: "50px", flexShrink: 0 }}
        >
          <div className="flex items-center justify-center flex-shrink-0">
            <TbDiscount
              size={25}
              className={`${filterSoldOut ? "text-textWhiteColor" : "text-[#D02F44]"
                }`}
            />
          </div>
          <span className="text-sm whitespace-nowrap">
            {t("filters.productsSoldOut")}
          </span>
        </button>

        {/* CATEGORY SELECT */}
        <Select
          placeholder={t("filters.byCategory")}
          value={filterCategory}
          onChange={(value) => setFilterCategory(value)}
          className="flex-1 [&>.ant-select-selector]:!bg-blueLight [&>.ant-select-selector]:!border-none [&>.ant-select-selector]:!shadow-none min-w-[214px] h-[50px] [&_.ant-select-selection-wrap]:!w-fit [&>.ant-select-selector]:!justify-center"
          suffixIcon={null}
          prefix={<CiGrid41 className="text-blueIcons" size={24} />}
          options={[
            { value: "all", label: t("categories.all") },
            ...categories,
          ]}
        />

        {/* PRICE SELECT */}
        <Select
          placeholder={t("filters.byPrice")}
          value={filterPrice}
          onChange={(value) => setFilterPrice(value)}
          className="flex-1 [&>.ant-select-selector]:!bg-blueLight [&>.ant-select-selector]:!border-none [&>.ant-select-selector]:!shadow-none min-w-[214px] h-[50px] [&_.ant-select-selection-wrap]:!w-fit [&>.ant-select-selector]:!justify-center"
          suffixIcon={null}
          prefix={<LiaCoinsSolid className="text-blueIcons" size={24} />}
          options={[
            { value: "all", label: t("filters.byPrice") },
            { value: "0-100", label: "$0 - $100" },
            { value: "100-500", label: "$100 - $500" },
            { value: "500-1000", label: "$500 - $1,000" },
            { value: "1000", label: "$1,000+" },
          ]}
        />
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-20">
          <FaHeart className="mx-auto text-6xl text-gray-300 mb-4" />
          <p className="text-xl text-textColor">{t("text.wishListEmpty")}</p>
          <Link
            href="/"
            className="mt-4 inline-block text-blueIcons hover:underline"
          >
            {t("buttons.continueShopping")}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {filteredItems.map((item) => {
              const discountPercentage = calculateDiscount(item);
              const itemStock = getItemStock(item);
              const itemImage = getItemImage(item);
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-grayLight relative rounded-[12px] p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-[140px_1fr_auto] gap-4 items-start">
                    {/* Product Image */}
                    <div className="w-full lg:w-[140px] h-[140px] flex-shrink-0 relative">
                      <Link href={`/products/${item.id}`}>
                        <div className="w-full h-full bg-blueLight rounded-lg overflow-hidden flex items-center justify-center p-2">
                          <Image
                            src={itemImage}
                            alt={item.title || item.name}
                            fill
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </Link>
                      {discountPercentage != null && discountPercentage > 0 && itemStock != null && itemStock > 0 && (
                        <div className={`absolute top-0 ${isRTL ? "right-0 rounded-tr-lg" : "left-0 rounded-tl-lg"} bg-[#efd33d] text-xs px-2 py-1`}>
                          {t("topOffers.off", { value: discountPercentage })}
                        </div>
                      )}
                      {itemStock === 0 && (
                        <div className="absolute top-0 left-0 z-10">
                          <div
                            className="bg-[#D02F44] text-textWhiteColor pt-[2px] text-xs h-[60px] w-[80px] tracking-wide shadow-lg"
                            style={{
                              clipPath: "polygon(45% 0, 100% 0, 0 98%, 0 44%)",
                            }}
                          >
                            <motion.div
                              initial={{ rotate: 0 }}
                              animate={{ rotate: -36 }}
                              className="text-[10px] uppercase"
                              style={{ translate: "0 4px" }}
                            >
                              {t("wishlist.soldout")}
                            </motion.div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col gap-3 min-w-0">
                      {/* Title */}
                      <Link href={`/products/${item.id}`}>
                        <h3 className="text-lg sm:text-xl font-semibold text-subTitleColor line-clamp-2 leading-tight">
                          {item.title || item.name}
                        </h3>
                      </Link>

                      {/* Description */}
                      <p className="text-sm text-textColor line-clamp-2 leading-relaxed">
                        {item.description || t("text.defaultDescription")}
                      </p>

                      {/* Quantity */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-textColor">
                          {t("labels.quantity")}:
                        </span>
                        <span className="text-sm font-semibold text-blueIcons">
                          {itemStock} {t("labels.piece")}
                        </span>
                      </div>

                      {/* Date */}
                      <div className="text-xs text-textColor">
                        {formatDate(item.favorited_at || item.addedDate)}
                      </div>
                    </div>

                    {/* Price & Actions */}
                    <div className="flex flex-row  md:flex-col items-end justify-between gap-3 min-w-0">
                      {/* Price */}
                      <div className="text-right">
                        <span className="text-xl sm:text-2xl font-bold text-blueSite block">
                          {formatMoney(item.price)} $
                        </span>
                        {item.price_before_discount && item.price_before_discount > item.price && (
                          <span className="text-sm text-textGrayColor line-through">
                            {formatMoney(item.price_before_discount)} $
                          </span>
                        )}
                      </div>

                      {/* Delete Button */}
                      <Button
                        unstyled
                        onClick={() => handleDelete(item)}
                        disabled={deletingId === item.id}
                        className="flex items-center gap-2 text-[#D02F44] hover:text-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 rounded-lg hover:bg-red-50"
                      >
                        {deletingId === item.id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-[#D02F44] border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm">{t("buttons.deleting")}</span>
                          </>
                        ) : (
                          <>
                            <GoTrash size={16} />
                            <span className="text-sm">{t("buttons.delete")}</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
};

export default Wishlist;
