import React from "react";
import { Search } from "lucide-react";
import Button from "@/components/ui/Button";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface StoreHeaderProps {
  count: number;
  onAddStore: () => void;
  search: string;
  setSearch: (value: string) => void;
  sort: string;
  setSort: (value: string) => void;
  hideAddButton?: boolean;
}

const StoreHeader: React.FC<StoreHeaderProps> = ({
  count,
  onAddStore,
  search,
  setSearch,
  sort,
  setSort,
  hideAddButton = false,
}) => {

  const {t} = useTranslation()
  return (
    <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between lg:flex-col lg:items-start w-full lg:w-1/3 gap-3 sm:gap-4">
        <div className="flex-1">
          <h2 className="text-base sm:text-lg lg:text-[20px] font-semibold text-subTitleColor">
            {t("store.management")}
            {count > 0 && (
              <span className="text-textGrayColor text-xs sm:text-sm block sm:inline">
                ({count} {t("store.stores")}, {count} {t("store.draft")})
              </span>
            )}
          </h2>
        </div>

        {/* Mobile actions - Show only if count > 0 or not hiding add button */}
        {(count > 0 || !hideAddButton) && (
          <div className="flex sm:hidden items-center gap-2 shrink-0">
            {count > 0 && (
              <div className="flex items-center gap-1">
                <select
                  className="border rounded-[4px] px-3 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blueSite"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="latest">{t("common.latest")}</option>
                  <option value="oldest">{t("common.oldest")}</option>
                </select>
              </div>
            )}

            {!hideAddButton && (
              <Button
                onClick={onAddStore}
                unstyled
                className="bg-blueSite text-textWhiteColor px-3 sm:px-4 py-1.5 rounded-lg
                transition hover:opacity-90 whitespace-nowrap text-xs sm:text-sm"
              >
                {t("store.addStore")}
              </Button>
            )}
          </div>
        )}

        {/* Tablet actions - Show only if count > 0 or not hiding add button */}
        {(count > 0 || !hideAddButton) && (
          <div className="hidden sm:flex md:hidden items-center gap-2 shrink-0">
            {count > 0 && (
              <div className="flex items-center gap-1">
                <select
                  className="border rounded-[4px] px-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blueSite"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="latest">{t("common.latest")}</option>
                  <option value="oldest">{t("common.oldest")}</option>
                </select>
              </div>
            )}

            {!hideAddButton && (
              <Button
                onClick={onAddStore}
                unstyled
                className="bg-blueSite text-textWhiteColor px-4 py-1.5 rounded-lg
                transition hover:opacity-90 whitespace-nowrap text-sm"
              >
                {t("store.addStore")}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Search */}
      {count > 0 && (
        <div className="relative w-full sm:w-1/2 lg:w-1/3 px-2">
          <input
            type="text"
            placeholder={t("common.searchPlaceholder")}
            className="w-full border rounded-md py-2 pl-8 pr-3 text-xs sm:text-sm
            focus:ring-2 focus:ring-blueSite outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search
            className="absolute left-2 top-1/2 -translate-y-1/2 text-textColor"
            size={16}
          />
        </div>
      )}

      {/* Desktop actions - Show only if count > 0 or not hiding add button */}
      {(count > 0 || !hideAddButton) && (
        <div className="hidden md:flex items-center gap-3 w-full lg:w-1/4 justify-end">
          {count > 0 && (
            <div className="flex items-center gap-2">
              <select
                className="border rounded-md px-4 py-1.5 text-sm text-textColor focus:outline-none focus:ring-2 focus:ring-blueSite"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="latest">{t("common.latest")}</option>
                <option value="oldest">{t("common.oldest")}</option>
              </select>
            </div>
          )}

          {!hideAddButton && (
            <Button
              onClick={onAddStore}
              unstyled
              className="bg-blueSite text-textWhiteColor px-4 py-1.5 rounded-md
              transition hover:opacity-90 text-sm whitespace-nowrap"
            >
              {t("store.addStore")}
            </Button>
          )}
        </div>
      )}
      

     
    </div>
  );
};

export default StoreHeader;
