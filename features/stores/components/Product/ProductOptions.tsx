"use client";

import React from "react";
import { HiMiniPencil } from "react-icons/hi2";
import { AiFillDelete } from "react-icons/ai";
import { FaSave } from "react-icons/fa";
import { X } from "lucide-react";
import useApp from "antd/es/app/useApp";
import InputField from "../../../../components/ui/InputField";
import SelectField from "../../../../components/ui/SelectFiled";
import Button from "../../../../components/ui/Button";

interface Option {
  name: string;
  type: string;
  values: string[];
}

interface OptionDraft extends Option {
  editIndex?: number | null;
}

interface ProductOptionsProps {
  formData: any;
  optionDraft: OptionDraft;
  setOptionDraft: React.Dispatch<React.SetStateAction<OptionDraft>>;
  newValueInput: string;
  setNewValueInput: React.Dispatch<React.SetStateAction<string>>;
  handleArrayChange: (key: any, value: any[]) => void;
  setStepErrors: React.Dispatch<React.SetStateAction<any>>;
  stepErrors: any;
  COMMON_COLORS: { name: string; hex: string }[];
  t: (key: string) => string;
}

const ProductOptions = ({
  formData,
  optionDraft,
  setOptionDraft,
  newValueInput,
  setNewValueInput,
  handleArrayChange,
  setStepErrors,
  stepErrors,
  COMMON_COLORS,
  t,
}: ProductOptionsProps) => {
  const { message } = useApp();
  const isOptionIncomplete =
    !optionDraft.name?.trim() ||
    !optionDraft.type ||
    !optionDraft.values ||
    optionDraft.values.length === 0;

  const handleAddOptionValue = () => {
    if (newValueInput.trim()) {
      setOptionDraft({
        ...optionDraft,
        values: [...(optionDraft.values || []), newValueInput.trim()],
      });
      setNewValueInput("");
    }
  };

  const handleRemoveOptionValue = (index: number) => {
    const updated = optionDraft.values.filter((_, i) => i !== index);
    setOptionDraft({
      ...optionDraft,
      values: updated,
    });
  };

  const handleSaveOption = () => {
    if (
      !optionDraft.name ||
      !optionDraft.type ||
      !optionDraft.values ||
      optionDraft.values.length === 0
    ) {
      message.error(t("addProduct.validation.fillAllOptionFields"));
      return;
    }

    const newOption = {
      name: optionDraft.name,
      type: optionDraft.type,
      values: optionDraft.values,
    };

    const updatedOptions = [...(formData.options || [])];

    if (typeof optionDraft.editIndex === "number") {
      updatedOptions[optionDraft.editIndex] = newOption;
      message.success(t("addProduct.messages.optionUpdatedSuccessfully"));
    } else {
      updatedOptions.push(newOption);
      message.success(t("addProduct.messages.optionAddedSuccessfully"));
    }

    handleArrayChange("options", updatedOptions);
    setOptionDraft({
      name: "",
      type: "",
      values: [],
      editIndex: null,
    });
    setNewValueInput("");

    // Clear step 2 errors when options are added
    setStepErrors((prev: any) => {
      if (prev.step2?.options) {
        const newStep2 = { ...prev.step2 };
        delete newStep2.options;
        return {
          ...prev,
          step2: Object.keys(newStep2).length > 0 ? newStep2 : undefined,
        };
      }
      return prev;
    });
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-blueSite/10 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span className="w-1 h-6 bg-blueSite rounded-full"></span>
        {t("addProduct.step2.productOptions")}
      </h3>

      {/* Existing Options List */}
      {formData?.options?.length > 0 && (
        <div className="grid grid-cols-1 gap-4 mb-6">
          {formData.options.map((opt: Option, idx: number) => (
            <div
              key={idx}
              className="group relative bg-white border border-gray-200 rounded-xl p-4 transition-all hover:border-blueSite hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-gray-800 text-base">
                    {opt.name}
                  </h4>
                  <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full font-medium capitalize border border-gray-200">
                    {opt.type}
                  </span>
                </div>
                <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => {
                      setOptionDraft({
                        name: opt.name,
                        type: opt.type,
                        values: opt.values,
                        editIndex: idx,
                      });
                      setNewValueInput("");
                    }}
                    className="p-1.5 text-blueSite hover:bg-blueSite/10 rounded-md transition-colors"
                    title={t("labels.edit")}
                  >
                    <HiMiniPencil size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const updated = formData.options.filter(
                        (_: any, i: number) => i !== idx
                      );
                      handleArrayChange("options", updated);
                    }}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    title={t("labels.delete")}
                  >
                    <AiFillDelete size={18} />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {opt.values.map((val, vIdx) => (
                  <span
                    key={vIdx}
                    className="px-2.5 py-1 bg-gray-50 border border-gray-100 text-gray-700 text-sm rounded-md font-medium"
                  >
                    {val}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Option Form */}
      <div className="bg-gray-50 p-2 rounded-xl border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
          <InputField
            id="option_name"
            type="text"
            label={t("addProduct.step2.optionName")}
            placeholder={t("addProduct.step2.optionNamePlaceholder")}
            value={optionDraft.name}
            onChange={(e: any) => {
              const val = e?.target ? e.target.value : String(e);
              setOptionDraft({ ...optionDraft, name: val });
            }}
            unstyled
            className="bg-white"
            withFieldset
          />

          <SelectField
            id="option_type"
            label={t("addProduct.step2.optionType")}
            placeholder={t("addProduct.step2.selectOptionType")}
            selectorOptions={[
              { id: "string", name: t("labels.text") },
              { id: "color", name: t("labels.color") },
              { id: "number", name: t("labels.number") },
            ]}
            value={optionDraft.type || ""}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setOptionDraft({ ...optionDraft, type: e.target.value })
            }
            unstyled
            className="bg-white"
            withFieldset
          />
        </div>

        {/* Option Value Section */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t("addProduct.step2.optionValue")}
          </label>

          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

            {/* Quick Select for Colors */}
            {optionDraft.type === "color" && (
              <div className="mb-4 pb-4 border-b border-gray-100">
                <span className="text-xs text-gray-500 font-medium block mb-2">{t("labels.quickSelect")}:</span>
                <div className="flex flex-wrap gap-2">
                  {COMMON_COLORS.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => {
                        const exists = (optionDraft.values || []).some(
                          (v) => v.toLowerCase() === color.name.toLowerCase()
                        );
                        if (!exists) {
                          setOptionDraft({
                            ...optionDraft,
                            values: [
                              ...(optionDraft.values || []),
                              color.name,
                            ],
                          });
                        }
                      }}
                      className="group flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full border border-gray-200 hover:border-blueSite/30 hover:bg-[#E6F0ED] transition-all"
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-gray-200 shadow-sm"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-xs text-gray-600 font-medium group-hover:text-blueSite">{t(`colors.${color.name}`)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input & Add Row */}
            <div className="flex gap-2 items-center mb-3">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={newValueInput}
                  onChange={(e) => setNewValueInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddOptionValue();
                    }
                  }}
                  placeholder={t("addProduct.step2.writeOptionValueHere")}
                  className="w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
                />
                <button
                  type="button"
                  onClick={handleAddOptionValue}
                  disabled={!newValueInput.trim()}
                  className="absolute end-1 top-1 bottom-1 px-3 bg-gray-100 hover:bg-blueSite hover:text-white text-gray-600 text-xs font-bold uppercase rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("labels.add")}
                </button>
              </div>
            </div>

            {/* Values Chips */}
            {optionDraft.values && optionDraft.values.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {optionDraft.values.map((value, index) => (
                  <div
                    key={index}
                    className="group flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:bg-emerald-100 hover:border-emerald-200"
                  >
                    
                    <span>{t(`colors.${value}`)}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveOptionValue(index)}
                      className="text-emerald-600 hover:text-red-500 transition-colors"
                      aria-label="Remove value"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm italic">{t("addProduct.step2.noValuesAdded")}</p>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200 mt-2">
          {optionDraft.editIndex !== null && optionDraft.editIndex !== undefined ? (
            <button
              type="button"
              onClick={() => {
                setOptionDraft({
                  name: "",
                  type: "",
                  values: [],
                  editIndex: null,
                });
                setNewValueInput("");
              }}
              className="text-gray-500 text-sm hover:text-gray-700 font-medium px-2"
            >
              {t("labels.cancel")}
            </button>
          ) : <div />}

          <Button
            type="button"
            className="w-fit px-6 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={isOptionIncomplete}
            addDisableStyle
            onClick={handleSaveOption}
          >
            {typeof optionDraft.editIndex === "number" ? (
              <div className="flex gap-2 justify-center items-center">
                <FaSave size={16} /> <span>{t("addProduct.step2.saveOption")}</span>
              </div>
            ) : (
              <div className="flex gap-2 justify-center items-center">
                <span className="text-lg leading-none">+</span> <span>{t("addProduct.step2.addOtherOptionsProduct")}</span>
              </div>
            )}
          </Button>
        </div>
        {stepErrors.step2?.options && (
          <p className="mt-3 text-sm text-red-500 font-semibold bg-red-50 p-2 rounded-md border border-red-100 text-center">
            {stepErrors.step2.options}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductOptions;
