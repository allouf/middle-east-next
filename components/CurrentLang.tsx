'use client';

import React, { useState, useRef, useEffect } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";
import { useTranslation } from "@/lib/i18n/useTranslation";
import useGetData from "@/lib/api/useGetData";
import { getCountry, getRegionsByCountry } from "@/shared/constants/urls";
import { AnimatePresence, motion } from "framer-motion";

interface Country {
  id: number | string;
  name: string;
}

interface Region {
  id: number | string;
  name: string;
}

const CurrentLang = () => {
  const { t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeCountry, setActiveCountry] = useState<Country | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [tempSelection, setTempSelection] = useState<{
    country: Country | null;
    region: Region | null;
  }>({
    country: null,
    region: null,
  });
  const [mobileStep, setMobileStep] = useState<"country" | "region">("country");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch countries
  const { data: countryData, loading: loadingCountries } = useGetData({
    url: getCountry,
  });
  const countries = Array.isArray(countryData?.data?.["countries"])
    ? countryData.data["countries"]
    : [];

  // Fetch regions dynamically
  const { data: regionData, loading: loadingRegions } = useGetData({
    url: activeCountry ? `${getRegionsByCountry}/${activeCountry.id}` : "",
  });
  const regions = Array.isArray(regionData?.data) ? regionData.data : [];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
        setActiveCountry(null);
        setMobileStep("country");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handlers
  const handleOpen = () => setIsDropdownOpen(true);

  const handleCountrySelect = (country: Country) => {
    setActiveCountry(country);
    setTempSelection({ country, region: null });
    setMobileStep("region");
  };

  const handleRegionSelect = (region: Region) => {
    setTempSelection((prev) => ({ ...prev, region }));
  };

  const handleConfirm = () => {
    if (tempSelection.country) {
      setSelectedCountry(tempSelection.country);
      setSelectedRegion(tempSelection.region || null);
      setIsDropdownOpen(false);
      setActiveCountry(null);
      setMobileStep("country");
    }
  };

  const isConfirmDisabled = !tempSelection.country;

  return (
    <div className="relative w-[230px] max-sm:hidden" ref={dropdownRef}>
      {/* Header */}
      <div
        onClick={handleOpen}
        className="flex flex-col items-center justify-between md:px-3 px-2 py-2 rounded-lg cursor-pointer transition hover:bg-blueSiteHover/20"
      >
        <div className="flex flex-row items-center gap-1">
          <span className="text-textWhiteColor text-xs md:text-sm font-medium">
            {t("header.current_location")}
          </span>
          <IoMdArrowDropdown size={20} className="text-textWhiteColor" />
        </div>
        <div className="flex items-center md:gap-2 gap-1 truncate w-full justify-center">
          <FaLocationDot className="text-textWhiteColor text-lg flex-shrink-0" />
          <span
            className={`text-sm max-sm:hidden font-medium truncate text-textWhiteColor`}
          >
            {selectedCountry
              ? selectedRegion
                ? `${selectedCountry.name}, ${selectedRegion.name}`
                : `${selectedCountry.name}`
              : t("header.select_country_&_region")}
          </span>
        </div>
      </div>

      {/* ðŸŒ Desktop Dropdown */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.25 }}
            className="hidden md:flex absolute left-0 top-[48px] bg-white shadow-2xl border border-gray-200 rounded-lg z-50 flex w-[420px]"
          >
            {/* Left: Country list */}
            <div className="w-1/2 max-h-72 overflow-y-auto border-r border-gray-100">
              {loadingCountries ? (
                <p className="p-3 text-sm text-textColor">
                  {t("header.location.loading")}
                  
                </p>
              ) : (
                countries.map((country: Country) => (
                  <div
                    key={country.id}
                    onMouseEnter={() => setActiveCountry(country)}
                    onClick={() => setTempSelection({ country, region: null })}
                    className={`px-4 py-2 text-sm cursor-pointer transition ${
                      tempSelection.country?.id === country.id
                        ? "bg-blue-100 text-blueSite font-semibold"
                        : "hover:bg-gray-50 text-subTitleColor"
                    }`}
                  >
                    {country.name}
                  </div>
                ))
              )}
            </div>

            {/* Right: Regions */}
            <div className="w-1/2 max-h-72 overflow-y-auto">
              {loadingRegions ? (
                <p className="p-3 text-sm text-textColor">{t("header.location.loading_regions")}</p>
              ) : activeCountry && regions.length > 0 ? (
                regions.map((region: Region) => (
                  <div
                    key={region.id}
                    onClick={() => handleRegionSelect(region)}
                    className={`px-4 py-2 text-sm cursor-pointer transition ${
                      tempSelection.region?.id === region.id
                        ? "bg-blue-100 text-blueSite font-semibold"
                        : "hover:bg-gray-50 text-subTitleColor"
                    }`}
                  >
                    {region.name}
                  </div>
                ))
              ) : (
                <p className="p-3 text-sm text-textColor">
                  {activeCountry
                    ? t("No regions available")
                    : t("Hover or select a country")}
                </p>
              )}
            </div>

            {/* Confirm Button */}
            <div className="absolute bottom-0 left-0 w-full bg-white p-2 border-t border-gray-200 flex justify-end rounded-b-lg">
              <button
                onClick={handleConfirm}
                disabled={isConfirmDisabled}
                className={`px-4 py-1 text-sm font-medium rounded-md transition ${
                  isConfirmDisabled
                    ? "bg-gray-200 text-textColor cursor-not-allowed"
                    : "bg-blueSite text-textWhiteColor hover:bg-blueSiteHover"
                }`}
              >
                {t("Confirm")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ðŸ“± Mobile Modal (responsive bottom sheet) */}
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
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                {mobileStep === "region" ? (
                  <button
                    onClick={() => setMobileStep("country")}
                    className="flex items-center text-subTitleColor font-medium"
                  >
                    <IoIosArrowBack size={20} className="mr-1" /> {t("Back")}
                  </button>
                ) : (
                  <div />
                )}
                <h3 className="text-subTitleColor font-semibold">
                  {mobileStep === "country"
                    ? t("Select Country")
                    : t("Select Region")}
                </h3>
                <div />
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {mobileStep === "country" && (
                  <div className="max-h-[60vh] overflow-y-auto">
                    {loadingCountries ? (
                      <p className="p-3 text-sm text-textColor text-center">
                        Loading countries...
                      </p>
                    ) : (
                      countries.map((country: Country) => (
                        <div
                          key={country.id}
                          onClick={() => handleCountrySelect(country)}
                          className={`px-4 py-3 text-sm cursor-pointer ${
                            tempSelection.country?.id === country.id
                              ? "bg-blue-100 text-blueSite font-semibold"
                              : "hover:bg-gray-50 text-subTitleColor"
                          }`}
                        >
                          {country.name}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {mobileStep === "region" && (
                  <div className="max-h-[60vh] overflow-y-auto">
                    {loadingRegions ? (
                      <p className="p-3 text-sm text-textColor text-center">
                        Loading regions...
                      </p>
                    ) : regions.length > 0 ? (
                      regions.map((region: Region) => (
                        <div
                          key={region.id}
                          onClick={() => handleRegionSelect(region)}
                          className={`px-4 py-3 text-sm cursor-pointer ${
                            tempSelection.region?.id === region.id
                              ? "bg-blue-100 text-blueSite font-semibold"
                              : "hover:bg-gray-50 text-subTitleColor"
                          }`}
                        >
                          {region.name}
                        </div>
                      ))
                    ) : (
                      <p className="p-3 text-sm text-textColor text-center">
                        {t("No regions available")}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Confirm */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <button
                  onClick={handleConfirm}
                  disabled={isConfirmDisabled}
                  className={`w-full py-2 text-sm font-medium rounded-md transition ${
                    isConfirmDisabled
                      ? "bg-gray-200 text-textColor cursor-not-allowed"
                      : "bg-blueSite text-textWhiteColor hover:bg-blueSiteHover"
                  }`}
                >
                  {t("Confirm")}
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
