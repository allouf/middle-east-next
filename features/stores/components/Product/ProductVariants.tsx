"use client";

import React from "react";
import InputField from "../../../../components/ui/InputField";
import Button from "../../../../components/ui/Button";
import VariantRow from "./VariantRow";

interface Variant {
  option_values: string[];
  price: string;
  stock: string;
  low_stock_threshold: string;
  image: File | string | null | undefined;
}

interface ProductVariantsProps {
  formData: any;
  variantsDraft: Variant[];
  setVariantsDraft: (variants: Variant[]) => void;
  bulkValues: {
    price: string;
    stock: string;
    low_stock_threshold: string;
  };
  setBulkValues: React.Dispatch<
    React.SetStateAction<{
      price: string;
      stock: string;
      low_stock_threshold: string;
    }>
  >;
  handleBulkApply: () => void;
  generateCombinations: (options: any[]) => string[][];
  stepErrors: any;
  variantErrors?: Record<
    number,
    { price?: string; stock?: string; low_stock_threshold?: string }
  >;
  t: (key: string) => string;
}

const ProductVariants = ({
  formData,
  variantsDraft,
  setVariantsDraft,
  bulkValues,
  setBulkValues,
  handleBulkApply,
  generateCombinations,
  stepErrors,
  variantErrors,
  t,
}: ProductVariantsProps) => {
  const handleGenerateVariants = () => {
    const combos = generateCombinations(formData.options);
    const variants = combos.map((combo) => ({
      option_values: combo,
      price: "",
      stock: "",
      low_stock_threshold: "",
      image: undefined,
    }));
    setVariantsDraft(variants);
  };

  const handleUpdateVariant = (index: number, updated: Variant) => {
    const newVariants = [...variantsDraft];
    newVariants[index] = updated;
    setVariantsDraft(newVariants);
  };

  const handleDeleteVariant = (index: number) => {
    const newVariants = variantsDraft.filter((_, i) => i !== index);
    setVariantsDraft(newVariants);
  };

  return (
    <div className="bg-white p-4 sm:p-5 rounded-xl border border-blueSite/10 shadow-sm">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-5 flex items-center gap-2">
        <span className="w-1 h-5 sm:h-6 bg-blueSite rounded-full"></span>
        {t("addProduct.step2.productVariants")}
      </h3>

      {stepErrors?.step2?.variants && (
        <p className="text-xs sm:text-sm text-red-500 font-semibold bg-red-50 border border-red-100 p-2 sm:p-3 rounded-md mb-3 sm:mb-4">
          {stepErrors.step2.variants}
        </p>
      )}

      {formData?.options?.length === 0 ? (
        <p className="text-textColor text-xs sm:text-sm">
          {t("addProduct.step2.addOptionsFirst")}
        </p>
      ) : (
        <>
          <Button
            type="button"
            unstyled
            className="w-fit bg-transparent text-blueSite hover:text-blueSiteHover font-semibold mb-4 sm:mb-6 flex items-center gap-2 text-sm sm:text-base"
            onClick={handleGenerateVariants}
          >
            <span className="text-base sm:text-lg">↻</span>
            {variantsDraft.length > 0
              ? t("addProduct.step2.regenerateVariants")
              : t("addProduct.step2.generateVariants")}
          </Button>

          {variantsDraft?.length > 0 && (
            <div className="space-y-4">
              {/* 🔹 Bulk Edit Controls */}
              <div className="bg-slate-50 p-3 sm:p-4 rounded-lg border border-slate-200 mb-4 sm:mb-6">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  {t("addProduct.step2.applyToAllVariants")}
                </label>
                <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-end gap-2 sm:gap-3">
                  <div className="flex-1 sm:flex-initial sm:w-32">
                    <InputField
                      id="bulk_price"
                      type="number"
                      label={t("addProduct.step2.price")}
                      value={bulkValues.price}
                      onChange={(e: any) => {
                        const val = e?.target ? e.target.value : String(e);
                        setBulkValues((prev) => ({
                          ...prev,
                          price: val,
                        }));
                      }}
                      unstyled
                      className="h-8 sm:h-9 px-2 sm:px-3 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="flex-1 sm:flex-initial sm:w-32">
                    <InputField
                      id="bulk_stock"
                      type="number"
                      label={t("addProduct.step2.stock")}
                      value={bulkValues.stock}
                      onChange={(e: any) => {
                        const val = e?.target ? e.target.value : String(e);
                        setBulkValues((prev) => ({
                          ...prev,
                          stock: val,
                        }));
                      }}
                      unstyled
                      className="h-8 sm:h-9 px-2 sm:px-3 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex-1 sm:flex-initial sm:w-32">
                    <InputField
                      id="bulk_threshold"
                      type="number"
                      label={t("addProduct.step2.lowStock")}
                      value={bulkValues.low_stock_threshold}
                      onChange={(e: any) => {
                        const val = e?.target ? e.target.value : String(e);
                        setBulkValues((prev) => ({
                          ...prev,
                          low_stock_threshold: val,
                        }));
                      }}
                      unstyled
                      className="h-8 sm:h-9 px-2 sm:px-3 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      placeholder="0"
                    />
                  </div>
                  <button
                     type="button"
                     onClick={handleBulkApply}
                     className="w-full sm:w-auto h-8 sm:h-[38px] px-4 sm:px-6 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs sm:text-sm font-medium hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-colors mb-0"
                  >
                     {t("addProduct.step2.applyToAll")}
                  </button>
                </div>
              </div>

              {/* Mobile Card Layout */}
              <div className="block sm:hidden space-y-3">
                {variantsDraft.map((v, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                    <VariantRow
                      index={idx}
                      variant={v}
                      onUpdate={handleUpdateVariant}
                      onDelete={handleDeleteVariant}
                      errors={variantErrors?.[idx]}
                      t={t}
                      isMobile={true}
                    />
                  </div>
                ))}
              </div>

              {/* Desktop Table Layout */}
              <div className="hidden sm:block">
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                  <div className="max-h-[500px] overflow-y-auto">
                    <table className="min-w-full border-collapse text-sm">
                      <thead className="bg-gray-100 sticky top-0 z-10">
                        <tr>
                          <th className="p-3 text-start">
                            {t("addProduct.step2.variant")}
                          </th>
                          <th className="p-3 text-start">
                            {t("addProduct.step2.price")}
                          </th>
                          <th className="p-3 text-start">
                            {t("addProduct.step2.stock")}
                          </th>
                          <th className="p-3 text-start">
                            {t("addProduct.step2.lowStock")}
                          </th>
                          <th className="p-3 text-start">
                            {t("addProduct.step2.image")}
                          </th>
                          <th className="p-3 text-end">
                            {t("addProduct.step2.actions")}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {variantsDraft.map((v, idx) => (
                          <VariantRow
                            key={idx}
                            index={idx}
                            variant={v}
                            onUpdate={handleUpdateVariant}
                            onDelete={handleDeleteVariant}
                            errors={variantErrors?.[idx]}
                            t={t}
                            isMobile={false}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductVariants;
