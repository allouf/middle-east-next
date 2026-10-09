// components/ProductSearchSlot.tsx
import React, { useMemo } from "react";
import { Select, Spin } from "antd";
import { SearchOutlined, InboxOutlined } from "@ant-design/icons";
import { debounce } from "@/lib/utils/debounce";
import { Product } from "@/features/product/types/type";

import { useTranslation } from "@/lib/i18n/useTranslation";

interface ProductSearchSlotProps {
  onSearch: (value: string) => void;
  onSelect: (product: Product) => void;
  data: Product[];
  loading: boolean;
}

const ProductSearchSlot: React.FC<ProductSearchSlotProps> = ({
  onSearch,
  onSelect,
  data,
  loading,
}) => {
  const { t } = useTranslation();
  // Debounce the state update function from the parent
  const debouncedSearch = useMemo(() => {
    return debounce((value: string) => {
      onSearch(value);
    }, 500);
  }, [onSearch]);

  const options = useMemo(() => {
    const items = data || [];
    return items.map((item: Product) => ({
      label: item.name,
      value: item.id,
      productData: item,
    }));
  }, [data]);

  return (
    <div className="flex flex-col items-center p-2 md:p-4 h-full text-center">
      <Select
        showSearch
        className="w-full textLeft [&>div]:!bg-[#E6F0ED] text-sm"
        placeholder={t("compareProducts.searchPlaceholder")}
        prefix={
          <SearchOutlined className="text-[#004838] size-5 [&_svg]:size-full" />
        }
        variant="filled"
        suffixIcon={null}
        filterOption={false}
        onSearch={debouncedSearch}
        loading={loading}
        onSelect={(_, option) => onSelect(option.productData)}
        notFoundContent={
          loading ? <Spin size="small" /> : t("compareProducts.searchForProduct")
        }
        options={options}
      />

      <div className="my-auto text-gray-200">
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.2"
            d="M8.27501 18.6504C8.09385 18.9615 7.99892 19.3154 8.00001 19.6754V44.3254C8.00192 44.6815 8.09768 45.0307 8.27764 45.338C8.4576 45.6452 8.71539 45.8996 9.02501 46.0754L31.025 58.4504C31.3216 58.6199 31.6584 58.7062 32 58.7004L32.225 32.0004L8.27501 18.6504Z"
            fill="#8AB9AE"
          />
          <path
            d="M56 44.3253V19.6753C55.9981 19.3193 55.9023 18.97 55.7224 18.6627C55.5424 18.3555 55.2846 18.1011 54.975 17.9253L32.975 5.55031C32.6786 5.37916 32.3423 5.28906 32 5.28906C31.6577 5.28906 31.3214 5.37916 31.025 5.55031L9.025 17.9253C8.71538 18.1011 8.45759 18.3555 8.27763 18.6627C8.09768 18.97 8.00191 19.3193 8 19.6753V44.3253C8.00191 44.6814 8.09768 45.0306 8.27763 45.3379C8.45759 45.6451 8.71538 45.8995 9.025 46.0753L31.025 58.4503C31.3214 58.6215 31.6577 58.7116 32 58.7116C32.3423 58.7116 32.6786 58.6215 32.975 58.4503L54.975 46.0753C55.2846 45.8995 55.5424 45.6451 55.7224 45.3379C55.9023 45.0306 55.9981 44.6814 56 44.3253V44.3253Z"
            stroke="#8AB9AE"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M44.25 38.125V25.125L20 11.75"
            stroke="#8AB9AE"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M55.7312 18.6504L32.2312 32.0004L8.28125 18.6504"
            stroke="#8AB9AE"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M32.225 32L32 58.7"
            stroke="#8AB9AE"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default ProductSearchSlot;
