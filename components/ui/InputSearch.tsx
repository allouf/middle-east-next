"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";
import { DownOutlined, LeftOutlined } from "@ant-design/icons";
import {
  Button,
  Collapse,
  Drawer,
  Dropdown,
  Empty,
  Input,
  List,
  Skeleton,
  Space,
  Typography,
} from "antd";
import { useEffect, useState, useRef } from "react";
import { CiSearch } from "react-icons/ci";
import { FaCaretDown, FaCaretLeft, FaCaretRight } from "react-icons/fa";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import api from "@/lib/api";
import { USER_ENDPOINTS } from "@/shared/constants/api-endpoints";
import { debounce } from "@/lib/utils/debounce";
import { useRouter } from "next/navigation";
import { useLocaleDirection } from "@/lib/i18n/useLocaleDirection";
import Link from "next/link";
import Image from "next/image";
import ProductRate from "@/components/cards/product/ProductRate";

const { Panel } = Collapse;
const { Text } = Typography;

// --- Types ---
type Category = {
  id: number;
  name: string;
  image?: string;
  has_children?: boolean;
};

type Product = {
  id: number;
  name: string;
  gallery?: { file_path: string }[];
  price: string;
  oldPrice?: string;
  image: string;
  category?: { id: number; name: string };
  sub_category?: { id: number; name: string };
};

const InputSearch = () => {
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Data States
  const [mainCategories, setMainCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<{
    [key: number]: Category[];
  }>({});
  const [products, setProducts] = useState<Product[]>([]);

  // Selection States
  const [activeMain, setActiveMain] = useState<Category | null>(null);
  const [activeSub, setActiveSub] = useState<Category | null>(null);

  // Search State
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Loading States
  const [loadingMain, setLoadingMain] = useState(true);
  const [loadingSub, setLoadingSub] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Cache for search results to avoid re-fetching when extracting categories
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [allMainCategories, setAllMainCategories] = useState<Category[]>([]);
  const [allSubCategories, setAllSubCategories] = useState<{ [key: number]: Category[] }>({});
  const [hoveredProduct, setHoveredProduct] = useState<Product | null>(null);
  const latestSearchTermRef = useRef<string>("");
  const { isRTL } = useLocaleDirection()


  // Refs for debouncing
  const searchDebounceRef = useRef<any>(null);

  // Mount effect to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Debug hovered product
  useEffect(() => {
    if (hoveredProduct) {
      console.log("Hovered product:", hoveredProduct);
    }
  }, [hoveredProduct]);

  // --- 1. Fetch Main Categories on Mount ---
  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        setLoadingMain(true);
        const { data } = await api.get(USER_ENDPOINTS.Get_Parent_Categories); // Endpoint: /categories
        // Assuming response structure data: { data: [] } or just data:[] based on common patterns
        const categories = Array.isArray(data?.data?.categories)
          ? data.data.categories
          : data || [];
        setMainCategories(categories);
        setAllMainCategories(categories);
        // select first one by default if available
        // if (categories.length > 0) {
        //   setActiveMain(categories[0]);
        // }
      } catch (error) {
        console.error("Failed to fetch main categories", error);
        setMainCategories([]);
      } finally {
        setLoadingMain(false);
      }
    };

    fetchMainCategories();
  }, []);

  // --- 2. Fetch Sub Categories when activeMain changes (Normal Mode) ---
  useEffect(() => {
    if (!activeMain || isSearching) return;

    const fetchSubCategories = async () => {
      // If already cached/loaded, define it or check if we want to refetch.
      // For now, simple caching in state:
      if (subCategories[activeMain.id]) {
        const subs = subCategories[activeMain.id];
        if (subs.length > 0) setActiveSub(subs[0]);
        else {
          setActiveSub(null);
          setProducts([]);
        }
        return;
      }

      try {
        setLoadingSub(true);
        // Endpoint: /categories/childrens/:catId
        const { data } = await api.get(
          USER_ENDPOINTS.Get_Childerns(activeMain.id)
        );
        const subs = Array.isArray(data?.data) ? data.data : data || [];

        setSubCategories((prev) => ({ ...prev, [activeMain.id]: subs }));

        if (subs.length > 0) {
          setActiveSub(subs[0]);
        } else {
          setActiveSub(null);
        }
      } catch (error) {
        console.error("Failed to fetch subcategories", error);
      } finally {
        setLoadingSub(false);
      }
    };

    fetchSubCategories();
  }, [activeMain, isSearching]);

  // --- 3. Fetch Products when activeSub changes (Normal Mode) ---
  useEffect(() => {
    if (!activeSub || isSearching) return;

    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        // Endpoint: /products?category_ids[]=:subCatId
        const { data } = await api.get(USER_ENDPOINTS.Get_Products, {
          params: { category_ids: [activeSub.id] },
        });
        const prods = Array.isArray(data?.data?.products)
          ? data.data.products
          : data || [];
        setProducts(prods);
      } catch (error) {
        console.error("Failed to fetch products", error);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [activeSub, isSearching]);

  useEffect(()=>{
    if(!activeMain||!activeSub){
      setHoveredProduct(null)
    }
  },[activeMain,activeSub])

  // --- 4. Search Logic ---
  const handleSearch = (term: string) => {
    const cleanTerm = term.trim();
    setSearchValue(term);
    latestSearchTermRef.current = term;

    //  if cleared -> return to normal categories
    if (!cleanTerm) {
      setIsSearching(false);

      // restore original categories + cached subcategories
      setMainCategories(allMainCategories);
      setSubCategories(allSubCategories);

      setProducts([]);
      setSearchResults([]);

      if (allMainCategories.length > 0) {
        setActiveMain(allMainCategories[0]);
        setActiveSub(null); // let effect fetch subs/products
      } else {
        setActiveMain(null);
        setActiveSub(null);
      }

      setLoadingProducts(false);
      return;
    }

    //  searching mode
    setIsSearching(true);
    setLoadingProducts(true);

    //  create debounced function once, then reuse it
    if (!searchDebounceRef.current) {
      searchDebounceRef.current = debounce(async (value: string) => {
        try {
          // ignore old calls
          if (latestSearchTermRef.current !== value) return;

          const { data } = await api.get(USER_ENDPOINTS.Get_Products, {
            params: { search: value.trim() },
          });

          // ignore old calls again after await
          if (latestSearchTermRef.current !== value) return;

          const results = Array.isArray(data?.data?.products)
            ? data.data.products
            : data || [];

          setSearchResults(results);
          setProducts(results);

          //  extract categories from results
          extractCategoriesFromSearch(results);
        } catch (error) {
          console.error("Search failed", error);

          setSearchResults([]);
          setProducts([]);
        } finally {
          if (latestSearchTermRef.current === value) {
            setLoadingProducts(false);
          }
        }
      }, 500);
    }

    // run debounced search
    searchDebounceRef.current(term);
  };

  // Function to fetch products by multiple category IDs
  const fetchProductsByCategories = async (categoryIds: number[]) => {
    try {
      setLoadingProducts(true);
      const { data } = await api.get(USER_ENDPOINTS.Get_Products, {
        params: { category_ids: categoryIds },
      });
      const prods = Array.isArray(data?.data?.products)
        ? data.data.products
        : data || [];
      return prods;
    } catch (error) {
      console.error("Failed to fetch products by categories", error);
      return [];
    } finally {
      setLoadingProducts(false);
    }
  };

  const extractCategoriesFromSearch = (results: Product[]) => {
    // Logic: Iterate results, find unique categories and subcategories
    const extractedMain: Record<number, Category> = {};
    const extractedSubs: Record<number, Category[]> = {};

    results.forEach((p) => {
      if (p.category) {
        if (!extractedMain[p.category.id]) {
          extractedMain[p.category.id] = p.category;
          extractedSubs[p.category.id] = [];
        }

        // Check for subcategory
        if (p.sub_category) {
          const existingSubs = extractedSubs[p.category.id];
          if (!existingSubs.find((s) => s.id === p.sub_category?.id)) {
            existingSubs.push(p.sub_category);
          }
        }
      }
    });

    const newMainCats = Object.values(extractedMain);
    setMainCategories(newMainCats);
    setSubCategories(extractedSubs);

    if (newMainCats.length > 0) {
      setActiveMain(newMainCats[0]);
      const subs = extractedSubs[newMainCats[0].id];
      if (subs && subs.length > 0) {
        setActiveSub(subs[0]);
      } else {
        setActiveSub(null);
      }
    } else {
      // No categories found in search results
      setActiveMain(null);
      setActiveSub(null);
    }
  };

  // --- Handlers ---
  const onMainCategoryHover = (cat: Category) => {
    setActiveMain(cat);
    // If we are in search mode, update active sub from the extracted map
    if (isSearching) {
      const subs = subCategories[cat.id] || [];
      if (subs.length > 0) setActiveSub(subs[0]);
      else setActiveSub(null);

      // Filter products for this category locally since we have search results
      const filtered = searchResults.filter((p) => p.category?.id === cat.id);
      setProducts(filtered);
    }
  };

  const onSubCategoryHover = (sub: Category) => {
    setActiveSub(sub);
    if (isSearching) {
      // Filter products for this subcategory locally
      const filtered = searchResults.filter(
        (p) => p.sub_category?.id === sub.id
      );
      setProducts(filtered);
    }
  };

  const promo = {
    image: "/defaulLogo.png",
    title: t("header.search.promo.title"),
    text: t("header.search.promo.text"),
    price: t("header.search.promo.price"),
  };

  // --- Desktop Mega Menu Content ---
  const megaMenuContent = (
    <div
      className="flex overflow-hidden lg:w-[850px]"
      onMouseLeave={() => setActiveMain(null)}
    >
      {/* 1. Sidebar: Main Categories */}
      <div className="w-[200px] h-full overflow-y-auto bg-gray-50 py-2 me-3 border rounded-md border-gray-200">
        {loadingMain ? (
          <div className="p-2 space-y-2">
            {[...Array(6)].map((_, i) => (
              <Skeleton.Button
                key={i}
                active
                size="small"
                block
                style={{ height: 32 }}
              />
            ))}
          </div>
        ) : (
          mainCategories?.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories?category=${cat.id}`}
              onMouseEnter={() => onMainCategoryHover(cat)}
              className={`ps-3 pe-1 py-2 flex justify-between items-center text-sm cursor-pointer transition-colors ${activeMain?.id === cat.id
                ? "bg-[#8AB9AE] text-[#004838] font-semibold"
                : "hover:bg-gray-100 text-gray-500"
                }`}
            >
              {cat.name}
              {activeMain?.id === cat.id ? isRTL ? <FaCaretLeft size={20} /> : <FaCaretRight size={20} /> : ""}
            </Link>
          ))
        )}
        {!loadingMain && mainCategories.length === 0 && (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={t("header.search.no_categories")}
          />
        )}
      </div>

      {/* 2. Right Panel: Subcategories & Products */}
      {activeMain ? (
        <div className="flex-1 grid grid-cols-[40%_60%] lg:grid-cols-[25%_40%_35%] h-fit p-2 bg-gray-50 py-2 me-3 border rounded-md border-gray-200">
          {/* Sub List */}
          <div className="h-full overflow-y-auto p-2 pe-0 border-e border-gray-100">
            <div className="px-3 py-1 my-1 text-sm cursor-pointer rounded text-gray-600 hover:bg-gray-50 font-bold">
              {activeMain.name}
            </div>
            {loadingSub ? (
              <div className="space-y-2 mt-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton.Button
                    key={i}
                    active
                    size="small"
                    block
                    style={{ height: 24 }}
                  />
                ))}
              </div>
            ) : (
              <ul className="space-y-1">
                {subCategories[activeMain.id]?.map((sub) => (
                  <li
                    key={sub.id}
                    onMouseEnter={() => onSubCategoryHover(sub)}
                  >
                    <Link href={`/categories?category=${sub.id}`}
                      className={`px-3 py-1 pe-1 flex justify-between items-center text-sm cursor-pointer rounded ${activeSub?.id === sub.id
                        ? "bg-[#8AB9AE] text-[#004838] font-semibold"
                        : "text-gray-500 hover:bg-gray-100"
                        }`}>
                      {sub.name}
                      {activeSub?.id === sub.id ? isRTL ? <FaCaretLeft size={20} /> : <FaCaretRight size={20} /> : ""}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {!loadingSub &&
              (!subCategories[activeMain.id] ||
                subCategories[activeMain.id].length === 0) && (
                <div className="text-xs text-center text-gray-400 mt-4">
                  {t("header.search.no_subcategories")}
                </div>
              )}
          </div>

          {/* Product Grid */}
          <div className="h-full p-4 custom-scrollbar">
            <h4 className="uppercase text-lg text-[#303333] mb-3 pb-2">
              {isSearching
                ? t("header.search.results")
                : `${t("header.search.featured")} ${activeSub?.name || ""}`}
            </h4>

            {loadingProducts ? (
              <div className="grid grid-cols-1 gap-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton.Image active style={{ width: 40, height: 40 }} />
                    <Skeleton active paragraph={{ rows: 2 }} title={false} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 overflow-y-auto max-h-[400px]">
                {products.length > 0 ? (
                  products.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        router.push(`/products/${p.id}`);
                        setOpen(false);
                      }}
                      onMouseEnter={() => setHoveredProduct(p)}
                      // onMouseLeave={() => setHoveredProduct(null)}
                      className="flex items-center hover:bg-gray-100 gap-3 p-2 rounded-md border border-[#D4D5D5] cursor-pointer hover:shadow-sm transition-shadow"
                    >
                      <div className="relative w-10 h-10">
                        <Image
                          src={p.gallery?.[0]?.file_path || "/defaulLogo.png"}
                          alt={p.name}
                          fill
                          className="object-contain"
                          sizes="40px"
                        />
                      </div>
                      <div className="overflow-hidden flex-1">
                        <p className="text-md text-[#303333] line-clamp-2 text-sm leading-tight mb-1">
                          {p.name}
                        </p>
                        <span className="text-[#00664F] font-bold text-sm">
                          ${p.price}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-[200px] flex justify-center items-center">
                    <Empty
                      description={
                        t("header.search.no_products")
                      }
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Product Preview Section - Show hovered product or default promo */}
          <div className="bg-[#E6F0ED] p-4 rounded-md h-fit flex flex-col items-center  justify-center col-span-2 lg:col-span-1">
            {hoveredProduct ? (
              <div className="w-full">
                {/* Product Image with Badge */}
                <div className="relative w-full h-40 mb-4">
                  <Image
                    src={hoveredProduct.gallery?.[0]?.file_path || "/defaulLogo.png"}
                    alt={hoveredProduct.name}
                    fill
                    className="object-contain rounded-md"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* Discount Badge */}
                  {hoveredProduct.discount_value && (
                    <div className="absolute top-2 left-2 bg-[#4CAF50] text-white text-xs font-semibold px-4 py-1 rounded-sm uppercase z-10">
                      {hoveredProduct.discount_type === 'percentage' ? `${hoveredProduct.discount_value}%off` : 'SALE'}
                    </div>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center justify-start text-yellow-400 mb-2">
                  <ProductRate rating={hoveredProduct.avg_rating || 0} size={16} isDark={false} />
                </div>

                 {/* Product Title */}
                <h3 className="sm:text-[16px] text-[14px] font-semibold mt-2 line-clamp-2 leading-snug min-h-[40px] text-subTitleColor">
                  {hoveredProduct.name}
                </h3>

                {/* Category */}
                <p className="font-sans font-normal text-[12px] mt-2 leading-snug line-clamp-1 min-h-[20px] text-[#475156]">
                  {t("header.search.category")}:{" "}
                  <span className="font-semibold text-subTitleColor">
                    {hoveredProduct.category?.name || "N/A"}
                  </span>
                </p>

               

                {/* Store Name */}
                {/* <p className="text-sm text-[#475156] mb-2">
                  {hoveredProduct.store?.name}
                </p> */}

                {/* Price */}
                <div className="flex justify-start items-center gap-2 mt-2">
                  {hoveredProduct.price_before_discount && parseFloat(hoveredProduct.price_before_discount) > parseFloat(hoveredProduct.price) && (
                    <span className="text-textColor line-through sm:text-[14px] text-[12px]">
                      {typeof hoveredProduct.price_before_discount === "string"
                        ? hoveredProduct.price_before_discount
                        : `$${parseFloat(hoveredProduct.price_before_discount).toLocaleString()}`}
                    </span>
                  )}
                  <span className="text-blueSite font-semibold sm:text-[16px] text-[14px]">
                    ${parseFloat(hoveredProduct.price).toLocaleString()}
                  </span>
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-1 text-sm text-[#475156] mb-4 mt-2">
                  <span>📦</span>
                  <span>{hoveredProduct.total_left_in_stock} {t("header.search.left_in_stock")}</span>
                </div>

                {/* Action Button */}
                <Button
                  type="primary"
                  className="flex items-center gap-2 !bg-[#00664F] border-none h-9 w-full shadow-md"
                  onClick={() => {
                    router.push(`/products/${hoveredProduct.id}`);
                    setOpen(false);
                  }}
                >
                    {t("header.search.shop_now")} {isRTL ? <GoArrowLeft size={18} /> : <GoArrowRight size={18} />}
                </Button>
              </div>
            ) : (
              /* Default Promo Section */
              <>
                <div className="relative w-20 h-20 mb-4">
                  <Image
                    src={promo.image}
                    alt="promo"
                    fill
                    className="object-contain"
                    sizes="80px"
                  />
                </div>
                <h3 className="text-xl text-[#303333] mb-2">{promo.title}</h3>
                <p className="text-[#475156] mb-2 text-sm">{promo.text}</p>
                <div className="flex items-center gap-2 text-[#475156] mb-4 text-sm">
                  {(t("header.search.starting_price")) + ":"}{" "}
                  <div className="font-bold text-[#303333] bg-white py-1 px-3 rounded shadow-sm">
                    {promo.price}
                  </div>
                </div>
                <Button
                  type="primary"
                  className="flex items-center gap-2 !bg-[#00664F] border-none h-9 w-full shadow-md"
                >
                  {t("header.search.shop_now")} {isRTL ? <GoArrowLeft size={18} /> : <GoArrowRight size={18} />}
                </Button>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );

  // Show placeholder before mount to prevent layout shift
  if (!isMounted) {
    return (
      <div className="input-search-placeholder" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="input-search-desktop">
          <div className="input-search-container" style={{ margin: '0 0.5rem' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              width: '100%',
              direction: isRTL ? 'rtl' : 'ltr'
            }}>
              <span style={{ 
                fontSize: '0.875rem', 
                fontWeight: 500, 
                color: '#00664f',
                padding: ' 0.5rem'
              }}>
                {t("header.search.all")}
              </span>
              <div className="input-search-inner" style={{
                borderRadius: isRTL ? '0.75rem 0 0 0.75rem' : '0 0.75rem 0.75rem 0',
                marginInlineStart: '0.25rem'
              }}>
                <CiSearch size={20} style={{ color: '#003125' }} />
              </div>
            </div>
          </div>
        </div>
        <div className="input-search-mobile">
          <CiSearch size={24} style={{ color: 'white' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[500px] lg:w-full">
      {/* Desktop View */}
      <div className="hidden lg:block">
        <Dropdown
          popupRender={() => megaMenuContent}
          trigger={["click"]}
          open={open}
          onOpenChange={setOpen}
          placement={isRTL ? "bottomRight" : "bottomLeft"}
          overlayClassName="pt-2"
        >
          <Space.Addon
            className="rounded-xl bg-[#8AB9AE] border-none cursor-pointer pe-0 w-full"
            onClick={(e) => e.preventDefault()}
          >
            <div className="flex items-center px-1 cursor-pointer text-blueSite">
              <span className="text-sm font-medium">
                {t("header.search.all")}
              </span>
              <FaCaretDown size={20} />
            </div>
            <Input
              size="large"
              placeholder={t("header.search_placeholder")}
              prefix={<CiSearch size={20} className="text-[#003125]" />}
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              className="rounded-s-none rounded-e-xl !border-none !shadow-none !bg-[#E6F0ED] placeholder:text-[#00382B]/70"
            />
          </Space.Addon>
        </Dropdown>
      </div>

      {/* Mobile Trigger */}
      <div className="lg:hidden">
        <div
          onClick={() => setIsOpen(true)}
          className="flex items-center cursor-pointer"
        >
          <CiSearch size={24} className="text-white" />
        </div>
      </div>

      {/* Mobile Fullscreen Drawer */}
      <Drawer
        title={
          <div className="flex items-center gap-2">
            <span className="font-bold">{t("search.search")}</span>
          </div>
        }
        placement="right"
        onClose={() => setIsOpen(false)}
        open={isOpen}
        width="100%"
        closeIcon={<LeftOutlined />}
        extra={<CiSearch />}
      >
        <Input
          size="large"
          placeholder={t("header.search_placeholder")}
          prefix={<CiSearch size={20} className="text-[#005D48]" />}
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          className="rounded-xl !border-none !shadow-none !bg-[#E6F0ED] placeholder:text-[#00382B]/70 mb-4"
        />

        {/* Show search results when searching, otherwise show categories */}
        {isSearching ? (
          <div>
            <h4 className="font-bold text-gray-400 text-xs uppercase mb-4 px-4">
              {t("header.search.results")}
            </h4>
            {loadingProducts ? (
              <div className="px-4 space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton.Image active style={{ width: 40, height: 40 }} />
                    <Skeleton active paragraph={{ rows: 2 }} title={false} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4">
                {products.length > 0 ? (
                  <div className="space-y-2">
                    {products.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          router.push(`/products/${p.id}`);
                          setIsOpen(false);
                        }}
                        className="flex items-center hover:bg-gray-100 gap-3 p-3 rounded-md border border-[#D4D5D5] cursor-pointer"
                      >
                        <div className="relative w-10 h-10 flex-shrink-0">
                          <Image
                            src={p.gallery?.[0]?.file_path || "/defaulLogo.png"}
                            alt={p.name}
                            fill
                            className="object-contain"
                            sizes="40px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[#303333] line-clamp-2 mb-1">
                            {p.name}
                          </p>
                          <span className="text-[#00664F] font-bold text-sm">
                            ${p.price}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-[200px] flex justify-center items-center">
                    <Empty description={t("header.search.no_products")} />
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="mobile-accordion-wrapper">
            <h4 className="font-bold text-gray-400 text-xs uppercase mb-4 px-4">
              {t("search.categories")}
            </h4>

            {loadingMain ? (
              <Skeleton active paragraph={{ rows: 6 }} />
            ) : (
              <Collapse
                ghost
                accordion
                expandIconPosition="end"
                expandIcon={({ isActive }) => (
                  <DownOutlined
                    rotate={isActive ? 180 : 0}
                    style={{ fontSize: "10px" }}
                  />
                )}
                style={{ backgroundColor: "transparent" }}
                // activeKey={activeMain?.id ? [String(activeMain.id)] : undefined}
                onChange={(key) => {
                  const id = Number(key[0]);
                  const cat = mainCategories.find((c) => c.id === id);
                  if (cat) setActiveMain(cat);
                  else setActiveMain(null);
                }}
              >
                {mainCategories.map((cat) => (
                  <Panel
                    header={
                      <Text
                        className={
                          activeMain?.id === cat.id
                            ? "text-[#00664F] !font-bold"
                            : ""
                        }
                      >
                        {cat.name}
                      </Text>
                    }
                    key={cat.id}
                    style={{ borderBottom: "1px solid #f0f0f0" }}
                  >
                    {/* Nested Subcategories List */}
                    {loadingSub && activeMain?.id === cat.id ? (
                      <Skeleton active paragraph={{ rows: 2 }} />
                    ) : (
                      <List
                        dataSource={subCategories[cat.id] || []}
                        renderItem={(sub) => (
                          <div key={sub.id} className="py-2 pl-4">
                            <Text className="block mb-2 font-medium text-[#00664F]">
                              {sub.name}
                            </Text>
                            <div className="flex flex-col gap-1 ml-2">
                              {products?.map((product: any) => (
                                <Text
                                  key={product.id}
                                  onClick={() => {
                                    router.push(`/products/${product.id}`);
                                    setIsOpen(false);
                                  }}
                                  onMouseEnter={() => setHoveredProduct(product)}
                                  onMouseLeave={() => setHoveredProduct(null)}
                                  className="text-sm border-s-2 border-gray-400 ps-2 text-gray-600 cursor-pointer hover:text-[#00664F] hover:border-[#00664F]"
                                >
                                  {product.name}
                                </Text>
                              ))}
                            </div>
                          </div>
                        )}
                      />
                    )}
                  </Panel>
                ))}
              </Collapse>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default InputSearch;
