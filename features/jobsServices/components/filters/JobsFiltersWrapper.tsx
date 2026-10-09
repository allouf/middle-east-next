"use client";

import React from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useLangSwitch } from "@/lib/Hooks/useLangSwitch";


import { useJobsFiltersUrl } from "../../hooks/useJobsFiltersUrl";

import MobileOverlay from "./components/MobileOverlay";
import SidebarToggle from "./components/SidebarToggle";
import SidebarShell from "./components/SidebarShell";
import SidebarHeader from "./components/SidebarHeader";
import FilterSection from "./components/FilterSection";
import CategoryFilter from "./components/CategoryFilter";
import CountryFilter from "./components/CountryFilter";
import RadioLike from "./components/RadioLike";
import SalaryRangeFilter from "./components/SalaryRangeFilter";
import ActionButtons from "./components/ActionButtons";
import { DEFAULT_CATEGORIES, DEFAULT_EMPLOYMENT_TYPES, DEFAULT_WORK_MODES, DEFAULT_EXPERIENCE_LEVELS, DEFAULT_COUNTRIES, SORT_OPTIONS, DEFAULT_MIN, DEFAULT_MAX } from "../../constants";
import { Categorie, Option } from "../../types/jobs.types";
import { useFooterControl } from "@/lib/Hooks/useFooterControl";

type Props = {
    searchBar: React.ReactNode;
    content: React.ReactNode;
    jobsCount?: number;
    categories: Categorie[];
    employmentTypes?: Option[];
    workModes?: Option[];
    experienceLevels?: Option[];
    countries?: Option[];
    sortOptions?: Option[];
};

export default function JobsFiltersWrapper({
    searchBar,
    content,
    jobsCount,
    categories,
    employmentTypes = DEFAULT_EMPLOYMENT_TYPES,
    workModes = DEFAULT_WORK_MODES,
    experienceLevels = DEFAULT_EXPERIENCE_LEVELS,
    countries = DEFAULT_COUNTRIES,
    sortOptions = SORT_OPTIONS,
}: Props) {
    const { t } = useTranslation();
    const { currentLang } = useLangSwitch();
    const isRtl = currentLang === "ar";
    const { hideFooter, showFooter } = useFooterControl();

    const { ui, state, loading, filteredCategories, actions } = useJobsFiltersUrl({
        categories,
        countries,
    });

    // Hide footer when menu is open on mobile
    React.useEffect(() => {
        if (ui.showMenu && ui.isMobile) {
            hideFooter();
        } else {
            showFooter();
        }
    }, [ui.showMenu, ui.isMobile, hideFooter, showFooter]);

    return (
        <>
            <MobileOverlay show={ui.showMenu} isMobile={ui.isMobile} onClose={actions.closeMenu} />

            <div className="mx-auto w-full py-8 sm:py-6 overflow-x-hidden">
                <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[320px_1fr] relative">
                    <SidebarToggle isMobile={ui.isMobile} isRtl={isRtl} onClick={actions.toggleMenu} />

                    <SidebarShell isMobile={ui.isMobile} show={ui.showMenu} isRtl={isRtl}>
                        <SidebarHeader
                            title={t("filters.title_sidebar") || "The Filters :"}
                            isMobile={ui.isMobile}
                            onClose={actions.closeMenu}
                        />

                        {/* <div className="px-3 sm:px-5 py-3 border-b border-gray-100">
                            <button
                                onClick={actions.resetAll}
                                disabled={Object.values(loading).some(Boolean)}
                                className={`
                                    w-full flex items-center justify-center gap-2 py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium
                                    transition-all duration-300
                                    ${Object.values(loading).some(Boolean)
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-red-50 text-red-600 hover:bg-red-100 hover:scale-[1.02] active:scale-[0.98]'
                                    }
                                `}
                            >
                                {Object.values(loading).some(Boolean) ? (
                                    <>
                                        <span className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-gray-300 border-t-red-400 rounded-full animate-spin"></span>
                                        <span className="text-xs sm:text-sm">Resetting...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-sm sm:text-base">↺</span>
                                        <span className="text-xs sm:text-sm">{t("jobs.filter.reset_all") || "RESET ALL"}</span>
                                    </>
                                )}
                            </button>
                        </div> */}

                        <div className="px-3 sm:px-5 space-y-3 sm:space-y-4 py-3 sm:py-4 overflow-y-auto flex-1 max-h-[calc(100vh-250px)]   md:overflow-y-auto lg:max-h-none lg:overflow-y-visible">
                            <FilterSection title={t("jobs.filter.category") || "FILTER BY CATEGORIES"} defaultOpen>
                                <CategoryFilter
                                    placeholder={t("jobs.searchPlaceholder") || "Search for anything..."}
                                    search={ui.categorySearch}
                                    setSearch={actions.setCategorySearch}
                                    items={filteredCategories}
                                    activeValue={state.category_id?.toString() || null}
                                    loading={loading.category_id}
                                    onPick={actions.setCategoryId}
                                    t={t}
                                />
                            </FilterSection>

                            <FilterSection title={t("jobs.filter.jobType") || "EMPLOYMENT TYPE"} defaultOpen>
                                <RadioLike
                                    value={state.employment_type}
                                    options={employmentTypes}
                                    onPick={actions.setEmploymentType}
                                    loading={loading.employment_type}
                                    t={t}
                                />
                            </FilterSection>

                            <FilterSection title={t("jobs.filter.workplace") || "WORK MODE"} defaultOpen>
                                <RadioLike
                                    value={state.work_mode}
                                    options={workModes}
                                    onPick={actions.setWorkMode}
                                    loading={loading.work_mode}
                                    t={t}
                                />
                            </FilterSection>

                            <FilterSection title={t("jobs.filter.level") || "EXPERIENCE LEVEL"} defaultOpen>
                                <RadioLike
                                    value={state.experience_level}
                                    options={experienceLevels}
                                    onPick={actions.setExperienceLevel}
                                    loading={loading.experience_level}
                                    t={t}
                                />
                            </FilterSection>

                            <FilterSection title={t("jobs.filter.location") || "COUNTRY"} defaultOpen>
                                <CountryFilter
                                    placeholder={t("jobs.filter.searchCountry") || "Search for country..."}
                                    search={ui.countrySearch || ""}
                                    setSearch={actions.setCountrySearch}
                                    items={countries}
                                    activeValue={state.country_code || null}
                                    loading={loading.country_code}
                                    onPick={actions.setCountryCode}
                                    t={t}
                                />
                            </FilterSection>

                            <FilterSection title={t("jobs.filter.priceRange") || "SALARY RANGE"} defaultOpen>
                                <SalaryRangeFilter
                                    minPlaceholder={t("jobs.filter.price.min") || "Min"}
                                    maxPlaceholder={t("jobs.filter.price.max") || "Max"}
                                    value={[state.min_salary ?? DEFAULT_MIN, state.max_salary ?? DEFAULT_MAX]}
                                    localValue={[state.min_salary ?? DEFAULT_MIN, state.max_salary ?? DEFAULT_MAX]}
                                    setLocalValue={(values) => actions.setSalaryRange(values[0], values[1])}
                                    onCommit={(min, max) => actions.setSalaryRange(min, max)}
                                    loading={loading.min_salary || loading.max_salary}
                                />
                            </FilterSection>

                            {/* ActionButtons - Inside scrollable container, positioned after filters */}
                            <div className="pb-3">
                                <ActionButtons
                                    filterLabel={t("jobs.filter.apply") || "Filter"}
                                    resetLabel={t("jobs.filter.reset_all") || "RESET ALL"}
                                    loading={Object.values(loading).some(Boolean)}
                                    onFilter={() => {
                                        // already applied by URL, close only
                                        if (ui.isMobile) actions.closeMenu();
                                    }}
                                    onReset={actions.resetAll}
                                />
                            </div>
                        </div>
                    </SidebarShell>

                    <main className="flex flex-col gap-3 sm:gap-4">
                        <div className="px-2 sm:px-0">{searchBar}</div>
                        <div className="px-2 sm:px-0">{content}</div>
                    </main>
                </div>
            </div>
        </>
    );
}
