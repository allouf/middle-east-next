// LocaleSelect.jsx
import React from "react";
import { FaChevronDown } from "react-icons/fa6";

interface Option {
  label: string;
  value: string;
}

interface LocaleSelectProps {
  options?: Option[];
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value?: string;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
}

const LocaleSelect: React.FC<LocaleSelectProps> = ({
  options = [],
  onChange,
  value,
  label,
  disabled = false,
  placeholder,
}) => {
  const id = label?.toLowerCase().replace(/\s+/g, "-") || "locale-select";

  return (
    <div className="w-full">
      <fieldset className="relative border border-gray-300 rounded-lg  pb-2 transition-colors duration-200 focus-within:border-blueSite">
        {/* Label */}
        {label && (
          <legend className="px-2 text-blueSite font-semibold text-sm leading-none">
            {label}
          </legend>
        )}

        <div className="relative">
          <select
            id={id}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required
            className={`w-full appearance-none bg-white  text-subTitleColor text-sm px-3 py-[12px] pr-8 rounded-md focus:outline-none focus:border-transparent transition disabled:bg-gray-100 disabled:text-textColor disabled:cursor-not-allowed`}
            style={{
              WebkitAppearance: "none",
              MozAppearance: "none",
              borderRadius: "0.5rem",
            }}
          >
            <option value="">
              {placeholder || `Choose ${label?.toLowerCase()}...`}
            </option>
            {options.map((item: Option, index) => (
              <option
                key={index}
                value={item.value}
                className="rounded-md hover:bg-[#E6F0ED]"
              >
                {item.label}
              </option>
            ))}
          </select>

          {/* React Icon */}
          <FaChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-textColor text-[12px] pointer-events-none" />
        </div>
      </fieldset>
    </div>
  );
};

export default LocaleSelect;
