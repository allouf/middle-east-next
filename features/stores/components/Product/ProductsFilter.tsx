import React, { useState } from "react";
import PriceFilter from "@/components/ui/PriceFilter";
import SelectField from "@/components/ui/SelectFiled";
import { categories } from "@/shared/constants/urls";
import { Button } from "antd";
import { RotateCcw } from "lucide-react";

interface Category {
    id: string | number;
    name: string;
}

interface ProductsFilterProps {
    selectedCategoryId: string;
    selectedSubCategoryId: string;
    t: (key: string) => string;

    setSelectedCategoryId: (value: string) => void;
    setSelectedSubCategoryId: (value: string) => void;

    selectedStatus: string;
    setSelectedStatus: (value: string) => void;

    hasDiscount: string;
    setHasDiscount: (value: string) => void;

    minPrice: string;
    maxPrice: string;
    setMinPrice: (value: string) => void;
    setMaxPrice: (value: string) => void;
}

const ProductsFilter: React.FC<ProductsFilterProps> = ({
    selectedCategoryId,
    selectedSubCategoryId,
    t,
    setSelectedCategoryId,
    setSelectedSubCategoryId,
    selectedStatus,
    setSelectedStatus,
    hasDiscount,
    setHasDiscount,
    minPrice,
    maxPrice,
    setMinPrice,
    setMaxPrice,
}) => {
const [selectedLocalCategoryId, setSelectedLocalCategoryId] = useState("");
const [selectedLocalSubCategoryId, setSelectedLocalSubCategoryId] = useState("");
    const handleResetFilters = () => {
        setSelectedLocalCategoryId("");
        setSelectedLocalSubCategoryId("");
        setSelectedLocalSubCategoryId("");
        setSelectedSubCategoryId("");
        setSelectedStatus("");
        setHasDiscount("");
        setMinPrice("");
        setMaxPrice("");
    };
    return (
        <div className="grid relative grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-5 gap-4 mb-6">

            <SelectField
                id="filter_category"
                label={t("filters.categories")}
                placeholder={t("filters.categories")}
                url={categories}
                value={selectedLocalCategoryId}
                onChange={(e) => {
                    setSelectedLocalCategoryId(e.target.value);
                    // setSelectedSubCategoryId("");
                }}
                className=" text-[12px]text-[12px] h-[38px] "
                hideLable
            />
            <SelectField
                id="filter_subcategory"
                label={t("filters.subcategory")}
                placeholder={t("filters.subcategory")}
                url={selectedLocalCategoryId
                    ? `/categories/childrens/${selectedLocalCategoryId}`
                    : undefined}
                value={selectedLocalSubCategoryId}
                onChange={(e) => {
                    setSelectedSubCategoryId(e.target.value);
                    setSelectedLocalSubCategoryId(e.target.value);
                }}
                className=" text-[12px]text-[12px] h-[38px] "
                hideLable
            />
            <SelectField
                id="filter_status"
                label={t("table.status")}
                placeholder={t("table.status")}
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className=" text-[12px]text-[12px] h-[38px]  "
                hideLable
                selectorOptions={[
                    { id: "", name: t("filters.all") },
                    { id: "active", name: t("products.active") },
                    { id: "draft", name: t("products.inactive") },
                ]}
            />

            <PriceFilter
                minPrice={minPrice}
                maxPrice={maxPrice}
                onMinPriceChange={setMinPrice}
                onMaxPriceChange={setMaxPrice}
                className=" text-[12px]   "
                showLabel
            />

            <SelectField
                id="filter_has_discount"
                label={t("filters.has_discount")}
                value={hasDiscount}
                onChange={(e) => setHasDiscount(e.target.value)}
                className=" text-[12px] h-[38px]  "
                hideLable
                selectorOptions={[
                    { id: "", name: t("filters.discount.title2") },
                    { id: "1", name: t("filters.with_discount") },
                    { id: "0", name: t("filters.without_discount") },
                ]}
            />
            <div className="flex items-end">

                <Button
                    type="text"
                    onClick={handleResetFilters}
                    aria-label={t("filters.reset_all")}
                    className="w-[36px] h-[36px] rounded-xl bg-[#F6F6F6] border border-black/10 hover:!bg-[#EFEFEF] hover:!border-black/10 flex items-center justify-center p-0"
                    icon={<RotateCcw size={18} color="var(--SiteColor)" />}
                />
            </div>
        </div>
    );
};

export default ProductsFilter;
