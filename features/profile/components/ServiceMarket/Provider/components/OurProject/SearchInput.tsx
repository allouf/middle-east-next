import React from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Search } from "lucide-react";
import InputField from "@/components/ui/InputField";

/**
 * Search Input Component
 * 
 * Search input field with icon and clear functionality.
 * Used for filtering projects by various criteria.
 */
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function SearchInput({ 
  value, 
  onChange, 
  placeholder 
}: SearchInputProps) {
  const { t } = useTranslation();
  const defaultPlaceholder = placeholder || t('serviceMarket.projects.searchPlaceholder');
  const handleChange = (e: any): void => {
    if (e && typeof e === 'object' && 'target' in e && e.target) {
      const target = e.target as HTMLInputElement;
      onChange(target.value);
    } else if (typeof e === 'string') {
      onChange(e);
    }
  };

  return (
    <div className="relative border-l border-r border-b border-gray-100 rounded-lg p-2 shadow-md focus-within:shadow-md transition-shadow duration-200">
      <Search className="absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <InputField
        id="search"
        value={value}
        onChange={handleChange}
        placeholder={defaultPlaceholder}
        withFieldset={false}
        className="!h-11 pl-10 mr-3"
        unstyled
      />
    </div>
  );
}

export default SearchInput;
