"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { AnimatePresence, motion } from "framer-motion";
import { setLocationCookie, getLocationCookie, clearLocationCookie } from "@/lib/utils/auth-storage";

interface Country {
  id: string;
  name: string;
  shortName?: string;
}

interface Region {
  id: string;
  name: string;
  shortName?: string;
}

const normalize = (value?: string | null) => (value || "").toLowerCase().trim();
const matchCountry = (list: Country[], target?: Country | null) =>
  target
    ? list.find(
      (c) =>
        c.id === target.id ||
        normalize(c.shortName) === normalize(target.shortName) ||
        normalize(c.name) === normalize(target.name),
    ) || target
    : null;
const matchRegion = (list: Region[], target?: Region | null) =>
  target
    ? list.find(
      (r) =>
        r.id === target.id ||
        normalize(r.name) === normalize(target.name) ||
        normalize(r.name).includes(normalize(target.name)),
    ) || target
    : null;

const setCookie = (name: string, value: string, days = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

const clearCookie = (name: string) => {
  document.cookie = `${name}=; expires=${new Date(0).toUTCString()}; path=/; SameSite=Lax`;
};

const CurrentLang = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeCountry, setActiveCountry] = useState<Country | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [countrySearch, setCountrySearch] = useState("");
  const [regionSearch, setRegionSearch] = useState("");
  const [mobileStep, setMobileStep] = useState<"country" | "region">("country");
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [pendingRegion, setPendingRegion] = useState<Region | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const STORAGE_KEY = "current_location_selection";
  const countriesRef = useRef<Country[]>([]);
  const regionsRef = useRef<Region[]>([]);
  const selectedCountryRef = useRef<Country | null>(null);
  const selectedRegionRef = useRef<Region | null>(null);
  const detectingRef = useRef(false);
  const allLabel =
    t("header.location.select_country_region");
  const allOption = useMemo(
    () => ({ id: "all", name: t("header.search.all") }),
    [t],
  );

  const clearPersistedSelection = useCallback(() => {
    try {
      clearLocationCookie();
      clearCookie("country_code");
      clearCookie("region_name");
    } catch {
      /* ignore */
    }
  }, []);

  const resetSelection = useCallback(() => {
    clearPersistedSelection();
    setSelectedCountry(null);
    setSelectedRegion(null);
    selectedCountryRef.current = null;
    selectedRegionRef.current = null;
    setActiveCountry(null);
    setPendingRegion(null);
    setCountrySearch("");
    setRegionSearch("");
    setRegions([]);
    regionsRef.current = [];
    setLocationError(null);
    setIsDropdownOpen(false);
    setMobileStep("country");
    router.refresh();
  }, [clearPersistedSelection, router]);

  const persistSelection = useCallback(
    (country: Country | null, region: Region | null) => {
      try {
        setLocationCookie({
          country,
          region,
        });

        // Also set cookies for server-side access
        if (country?.shortName || country?.id) {
          setCookie("country_code", country?.shortName || country?.id || "", 30);
        } else {
          clearCookie("country_code");
        }
        if (region?.name) {
          setCookie("region_name", region.name, 30);
        } else {
          clearCookie("region_name");
        }
      } catch {
        /* ignore */
      }
    },
    [],
  );

  const hydrateSelection = useCallback(() => {
    try {
      const stored = getLocationCookie();
      if (!stored) {
        clearPersistedSelection();
        return;
      }

      if (stored?.country?.name) {
        setSelectedCountry(stored.country);
        selectedCountryRef.current = stored.country;
        // Sync cookie on hydration
        if (stored.country.shortName || stored.country.id) {
          setCookie(
            "country_code",
            stored.country.shortName || stored.country.id,
          );
        }
      } else {
        clearCookie("country_code");
      }
      if (stored?.region?.name) {
        setSelectedRegion(stored.region);
        selectedRegionRef.current = stored.region;
        // Sync cookie on hydration
        setCookie("region_name", stored.region.name);
      } else {
        clearCookie("region_name");
      }
    } catch {
      /* ignore */
    }
  }, [clearPersistedSelection]);

  const applyDetectedLocation = useCallback(
    (
      countryName?: string | null,
      countryCode?: string | null,
      regionName?: string | null,
      regionCode?: string | null,
    ) => {
      if (!countryName) return null;
      const country: Country = {
        id: countryCode || countryName,
        name: countryName,
        shortName: countryCode || undefined,
      };
      const region: Region | null = regionName
        ? {
          id: regionCode || regionName,
          name: regionName,
          shortName: regionCode || undefined,
        }
        : null;
      return { country, region };
    },
    [],
  );

  const fetchCountries = useCallback(async () => {
    setLoadingCountries(true);
    setLocationError(null);
    try {
      // Use the cached version from locationApi to avoid multiple API calls
      const list = await import("@/shared/utils/locationApi").then(({ fetchCountries }) => fetchCountries() as unknown as Country[]);
      setCountries(list);
      countriesRef.current = list;

      // Align selected country to fetched list
      if (selectedCountryRef.current) {
        const matched = matchCountry(list, selectedCountryRef.current);
        setSelectedCountry(matched);
        selectedCountryRef.current = matched;
      }
    } catch (err: any) {
      setCountries([]);
      countriesRef.current = [];
      setLocationError(
        err?.message ||
        t("header.location.error_load_countries"),
      );
    } finally {
      setLoadingCountries(false);
    }
  }, []);

  const fetchRegions = useCallback(
    async (country?: Country | null) => {
      if (!country || country.id === allOption.id) {
        setRegions([]);
        regionsRef.current = [];
        return;
      }
      setLoadingRegions(true);
      setLocationError(null);
      try {
        const params = new URLSearchParams({ country: country.name });
        const res = await fetch(`/api/location/regions?${params.toString()}`);
        const payload = await res.json();
        if (!res.ok || payload?.status !== "OK")
          throw new Error(
            payload?.error_message ||
            t("header.location.error_load_regions"),
          );
        const list = Array.isArray(payload.data) ? payload.data : [];
        setRegions(list);
        regionsRef.current = list;

        // Align selected region to fetched list
        if (selectedRegionRef.current) {
          const matched = matchRegion(list, selectedRegionRef.current);
          setSelectedRegion(matched);
          setPendingRegion(matched);
          selectedRegionRef.current = matched;
        }
      } catch (err: any) {
        setRegions([]);
        regionsRef.current = [];
        setLocationError(
          err?.message ||
          t("header.location.error_load_regions"),
        );
      } finally {
        setLoadingRegions(false);
      }
    },
    [allOption],
  );

  useEffect(() => {
    hydrateSelection();
    fetchCountries();
  }, [fetchCountries, hydrateSelection]);

  useEffect(() => {
    fetchRegions(selectedCountryRef.current);
  }, [fetchRegions, selectedCountryRef.current]);

  const detectLocation = useCallback((force = false) => {
    if (typeof window === "undefined") return;
    if (detectingRef.current && !force) return;
    detectingRef.current = true;
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const params = new URLSearchParams({
            lat: String(coords.latitude),
            lng: String(coords.longitude),
            language: "en",
          });
          const res = await fetch(
            `/api/location/reverse-geocode?${params.toString()}`,
          );
          const data = await res.json();
          if (!res.ok || data?.status !== "OK")
            throw new Error(
              data?.error_message ||
              t("header.location.error_detect_location"),
            );
          const detectedCountry: Country = {
            id: data.country?.shortName || data.country?.name,
            name: data.country?.name,
            shortName: data.country?.shortName,
          };
          const detectedRegion: Region | null = data.region?.name
            ? {
              id: data.region?.shortName || data.region?.name,
              name: data.region?.name,
              shortName: data.region?.shortName,
            }
            : null;

          const matchedCountry = matchCountry(
            countriesRef.current,
            detectedCountry,
          );
          const matchedRegion =
            matchedCountry && regionsRef.current.length > 0
              ? matchRegion(regionsRef.current, detectedRegion)
              : detectedRegion;

          // Apply immediately and close
          const nextCountry = matchedCountry || detectedCountry;
          const nextRegion = matchedRegion || detectedRegion || null;

          setActiveCountry(nextCountry);
          setPendingRegion(nextRegion);
          setSelectedCountry(nextCountry);
          setSelectedRegion(nextRegion);
          selectedCountryRef.current = nextCountry;
          selectedRegionRef.current = nextRegion;
          persistSelection(nextCountry, nextRegion);
          setIsDropdownOpen(false);
          setMobileStep("country");
          // Refresh to update all server components with detected location
          router.refresh();
        } catch (err: any) {
          setLocationError(
            err?.message ||
            t("header.location.error_detect_location"),
          );
        } finally {
          detectingRef.current = false;
        }
      },
      async () => {
        detectingRef.current = false;
      },
      { enableHighAccuracy: false, maximumAge: 600000, timeout: 12000 },
    );
  }, []);

  const handleOpen = () => {
    setIsDropdownOpen(true);
    if (selectedCountry) {
      setActiveCountry(selectedCountry);
      setPendingRegion(selectedRegion);
    } else {
      setActiveCountry(allOption);
      setPendingRegion(null);
    }
  };

  const handleCountrySelect = (country: Country) => {
    if (country.id === allOption.id) {
      setActiveCountry(allOption);
      setPendingRegion(null);
      setSelectedRegion(null);
      setRegionSearch("");
      setRegions([]);
      regionsRef.current = [];
      return;
    }
    setActiveCountry(country);
    setPendingRegion(null);
    setSelectedRegion(null);
    fetchRegions(country);
  };

  const handleRegionSelect = (region: Region) => {
    setPendingRegion(region);
  };

  const handleConfirm = () => {
    if (activeCountry?.id === allOption.id) {
      resetSelection();
      return;
    }

    if (!activeCountry) return;

    setSelectedCountry(activeCountry);
    setSelectedRegion(pendingRegion);
    selectedCountryRef.current = activeCountry;
    selectedRegionRef.current = pendingRegion;
    persistSelection(activeCountry, pendingRegion);
    setIsDropdownOpen(false);
    setActiveCountry(null);
    setPendingRegion(null);
    setMobileStep("country");
    // Refresh to update all server components with new location
    router.refresh();
  };

  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(countrySearch.trim().toLowerCase()),
  );
  const filteredRegions = regions.filter((r) =>
    r.name.toLowerCase().includes(regionSearch.trim().toLowerCase()),
  );
  const isConfirmDisabled = !activeCountry;
  const displayLocation = selectedCountry
    ? selectedRegion
      ? `${selectedCountry.name}, ${selectedRegion.name}`
      : `${selectedCountry.name}`
    : allLabel;

  return (
    <div className="relative w-[230px] max-sm:hidden" ref={dropdownRef}>
      <div
        onClick={handleOpen}
        className="flex flex-col items-center justify-between md:px-3 px-2 py-2 rounded-lg cursor-pointer transition hover:bg-blueSiteHover/20"
      >
        <div className="flex flex-row items-center gap-1">
          <span className="text-textWhiteColor text-xs md:text-sm font-light">
            {t("header.current_location")}
          </span>
          <IoMdArrowDropdown size={20} className="text-textWhiteColor" />
        </div>
        <div className="flex items-center md:gap-2 gap-1 truncate w-full justify-center">
          <FaLocationDot className="text-textWhiteColor text-lg flex-shrink-0" />
          <span
            className="text-sm max-sm:hidden font-medium truncate text-textWhiteColor"
            title={selectedCountry ? displayLocation : undefined}
          >
            {displayLocation}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.25 }}
            onMouseLeave={() => setIsDropdownOpen(false)}
            className="hidden overflow-hidden md:flex absolute left-0 top-[48px] bg-white shadow-2xl border border-gray-200 rounded-lg z-50 flex w-[440px]"
          >
            <div className="w-1/2 h-[60vh] pb-14 overflow-y-auto border-r border-gray-100">
              <div className="p-3 border-b border-gray-100 bg-white sticky top-0">
                <input
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  placeholder={
                    t("header.location.search_country")
                  }
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blueSite focus:ring-1 focus:ring-blueSite text-[#111827] font-medium"
                  type="text"
                />
              </div>
              {loadingCountries ? (
                <p className="p-3 text-sm text-textColor">
                  {t("header.location.loading")}
                </p>
              ) : (
                <>
                  <div
                    key={allOption.id}
                    onClick={() => handleCountrySelect(allOption)}
                    className={`px-4 py-2 text-sm cursor-pointer transition ${activeCountry?.id === allOption.id
                        ? "bg-[#8AB9AE]/50 text-blueSite font-semibold"
                        : "hover:bg-gray-50 text-subTitleColor"
                      }`}
                  >
                    {allOption.name}
                  </div>
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((country: Country) => (
                      <div
                        key={country.id}
                        onClick={() => handleCountrySelect(country)}
                        className={`px-4 py-2 text-sm cursor-pointer transition ${activeCountry?.id === country.id
                            ? "bg-[#8AB9AE]/50 text-blueSite font-semibold"
                            : "hover:bg-gray-50 text-subTitleColor"
                          }`}
                      >
                        {country.name}
                      </div>
                    ))
                  ) : (
                    <p className="p-3 text-sm text-textColor">
                      {t("header.location.no_countries")}
                    </p>
                  )}
                </>
              )}
            </div>

            <div className="w-1/2 h-[60vh] pb-14 overflow-y-auto">
              <div className="p-3 border-b border-gray-100 bg-white sticky top-0">
                <input
                  value={regionSearch}
                  onChange={(e) => setRegionSearch(e.target.value)}
                  placeholder={
                    t("header.location.search_region")
                  }
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blueSite focus:ring-1 focus:ring-blueSite text-[#111827] font-medium"
                  type="text"
                  disabled={!activeCountry || activeCountry.id === allOption.id}
                />
              </div>
              {loadingRegions ? (
                <p className="p-3 text-sm text-textColor">
                  {t("header.location.loading_regions")}
                </p>
              ) : activeCountry?.id === allOption.id ? (
                <p className="p-3 text-sm text-textColor">
                  {t("header.location.all_regions")}
                </p>
              ) : activeCountry && filteredRegions.length > 0 ? (
                filteredRegions.map((region: Region) => (
                  <div
                    key={region.id}
                    onClick={() => handleRegionSelect(region)}
                    className={`px-4 py-2 text-sm cursor-pointer transition ${pendingRegion?.id === region.id
                        ? "bg-[#8AB9AE]/50 text-blueSite font-semibold"
                        : "hover:bg-gray-50 text-subTitleColor"
                      }`}
                  >
                    {region.name}
                  </div>
                ))
              ) : (
                <p className="p-3 text-sm text-textColor">
                  {activeCountry
                    ? t("header.location.no_regions")
                    : t("header.location.select_country_prompt")}
                </p>
              )}
            </div>

            <div className="absolute bottom-0 left-0 w-full bg-white p-2 border-t border-gray-200 flex flex-col gap-2 rounded-b-lg">
              {locationError && (
                <span className="text-xs text-red-500 truncate ml-2">
                  {locationError}
                </span>
              )}
              <div className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={resetSelection}
                    className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 transition"
                  >
                    {t("header.location.reset")}
                  </button>
                  <button
                    type="button"
                    onClick={() => detectLocation(true)}
                    className="px-3 py-2 text-sm font-medium text-blueSite hover:text-blueSiteHover transition"
                  >
                    {t("header.location.use_current_location")}
                  </button>
                </div>
                <button
                  onClick={handleConfirm}
                  disabled={isConfirmDisabled}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition ${isConfirmDisabled
                      ? "bg-gray-200 text-textColor cursor-not-allowed"
                      : "bg-blueSite text-textWhiteColor hover:bg-blueSiteHover"
                    }`}
                >
                  {t("buttons.confirm")}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 bg-black bg-opacity-40 flex justify-center items-end z-50"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.3 }}
              className="bg-white w-full rounded-t-2xl shadow-xl max-h-[85vh] overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                {mobileStep === "region" ? (
                  <button
                    onClick={() => setMobileStep("country")}
                    className="flex items-center text-subTitleColor font-medium"
                  >
                    <IoIosArrowBack size={20} className="mr-1" />{" "}
                    {t("header.location.back")}
                  </button>
                ) : (
                  <div />
                )}
                <h3 className="text-subTitleColor font-semibold">
                  {mobileStep === "country"
                    ? t("header.location.select_country_title")
                    : t("header.location.select_region_title")}
                </h3>
                <div />
              </div>

              <div className="flex-1 overflow-y-auto">
                {mobileStep === "country" && (
                  <div className="h-[60vh] overflow-y-auto">
                    <div className="p-4 border-b border-gray-100 bg-white sticky top-0">
                      <input
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        placeholder={
                          t("header.location.search_country")
                        }
                        className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blueSite focus:ring-1 focus:ring-blueSite"
                        type="text"
                      />
                    </div>
                    {loadingCountries ? (
                      <p className="p-3 text-sm text-textColor text-center">
                        {t("header.location.loading")}
                      </p>
                    ) : (
                      <>
                        <div
                          key={allOption.id}
                          onClick={() => handleCountrySelect(allOption)}
                          className={`px-4 py-3 text-sm cursor-pointer ${activeCountry?.id === allOption.id
                              ? "bg-blue-100 text-blueSite font-semibold"
                              : "hover:bg-gray-50 text-subTitleColor"
                            }`}
                        >
                          {allOption.name}
                        </div>
                        {filteredCountries.length > 0 ? (
                          filteredCountries.map((country: Country) => (
                            <div
                              key={country.id}
                              onClick={() => handleCountrySelect(country)}
                              className={`px-4 py-3 text-sm cursor-pointer ${activeCountry?.id === country.id
                                  ? "bg-blue-100 text-blueSite font-semibold"
                                  : "hover:bg-gray-50 text-subTitleColor"
                                }`}
                            >
                              {country.name}
                            </div>
                          ))
                        ) : (
                          <p className="p-3 text-sm text-textColor text-center">
                            {t("header.location.no_countries")}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                )}

                {mobileStep === "region" && (
                  <div className="h-[60vh] overflow-y-auto">
                    <div className="p-4 border-b border-gray-100 bg-white sticky top-0">
                      <input
                        value={regionSearch}
                        onChange={(e) => setRegionSearch(e.target.value)}
                        placeholder={
                          t("header.location.search_region")
                        }
                        className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blueSite focus:ring-1 focus:ring-blueSite"
                        type="text"
                        disabled={
                          !activeCountry || activeCountry.id === allOption.id
                        }
                      />
                    </div>
                    {loadingRegions ? (
                      <p className="!h-[60vh] p-3 text-sm text-textColor text-center">
                        {t("header.location.loading_regions")}
                      </p>
                    ) : activeCountry?.id === allOption.id ? (
                      <p className="p-3 text-sm text-textColor text-center">
                        {t("header.location.all_regions")}
                      </p>
                    ) : activeCountry && filteredRegions.length > 0 ? (
                      filteredRegions.map((region: Region) => (
                        <div
                          key={region.id}
                          onClick={() => handleRegionSelect(region)}
                          className={`px-4 py-3 text-sm cursor-pointer ${pendingRegion?.id === region.id
                              ? "bg-blue-100 text-blueSite font-semibold"
                              : "hover:bg-gray-50 text-subTitleColor"
                            }`}
                        >
                          {region.name}
                        </div>
                      ))
                    ) : (
                      <p className="p-3 text-sm text-textColor text-center">
                        {activeCountry
                          ? t("header.location.no_regions")
                          : t("header.location.select_country_prompt")}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-200 bg-white space-y-2">
                {locationError && (
                  <p className="text-xs text-red-500 text-center">
                    {locationError}
                  </p>
                )}
                <button
                  type="button"
                  onClick={resetSelection}
                  className="w-full py-2 text-sm font-medium rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition"
                >
                  {t("header.location.reset")}
                </button>
                <button
                  type="button"
                  onClick={() => detectLocation(true)}
                  className="w-full py-2 text-sm font-medium text-blueSite hover:text-blueSiteHover transition"
                >
                  {t("header.location.use_current_location")}
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isConfirmDisabled}
                  className={`w-full py-2 text-sm font-medium rounded-md transition ${isConfirmDisabled
                      ? "bg-gray-200 text-textColor cursor-not-allowed"
                      : "bg-blueSite text-textWhiteColor hover:bg-blueSiteHover"
                    }`}
                >
                  {t("buttons.confirm")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CurrentLang;
