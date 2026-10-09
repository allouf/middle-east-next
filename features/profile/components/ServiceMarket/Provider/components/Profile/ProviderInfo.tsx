"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Pencil, Check, X } from "lucide-react";
import SelectField from "@/components/ui/SelectFiled";
import MultiSelectFieldWithSearch from "@/components/ui/MultiSelectFieldWithSearch";
import { useProviderProfile } from "../../hooks/Profile/useProviderProfile";
import { useTranslation } from "@/lib/i18n/useTranslation";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import { fetchCountries, getCountryNameByCode, getRegionsByCountryCode, getRegionsByCountryName } from "@/shared/utils/locationApi";
import { fetchLanguages } from "@/shared/utils/languageApi";
import SelectFieldWithSearch from "@/components/ui/SelectFieldWithSearch";

type ProviderInfoProps = {
  name?: string;
  location?: string;
  languageIds?: number[];
  about?: string;
  bio?: string;
  country_code?: string;
  region?: string;
  onEdit?: () => void;
  onSave?: (data: {
    name: string;
    about: string;
    bio?: string;
    country_code?: string;
    region?: string;
    language_ids?: number[];
  }) => void;
};

export default function ProviderInfo({
  name = "Provider Name || Company",
  location = "Berlin, Germany",
  languageIds = [1, 2], // Default to English and Arabic IDs
  about = "NAVA is guided by four principles: customer obsession rather than competitor focus, passion for invention, commitment to operational excellence, and long-term thinking. We are driven by excitement of building technologies, inventing products, and providing services that change lives. We embrace new ways of doing things, make decisions quickly, and are not afraid to fail...See more",
  bio,
  country_code,
  region,
  onEdit,
  onSave,
}: ProviderInfoProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = React.useState(false);
  const [countries, setCountries] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [languages, setLanguages] = useState<any[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const countriesData = await fetchCountries();
        setCountries(countriesData || []);
      } catch (error) {
        console.error('Failed to fetch countries:', error);
        setCountries([]);
      } finally {
        setLoadingCountries(false);
      }
    };

    const loadLanguages = async () => {
      try {
        const languagesData = await fetchLanguages();
        setLanguages(languagesData || []);
      } catch (error) {
        console.error('Failed to fetch languages:', error);
        setLanguages([]);
      }
    };

    loadCountries();
    loadLanguages();
  }, []);

  // Initialize profile update hook
  const profileUpdate = useProviderProfile({
    initial: {
      display_name: name,
      bio: bio || about,
      country_code,
      region,
      language_ids: languageIds,
    },
    onSuccess: () => {

    },
  });

  const handleEdit = () => {
    setIsEditing(true);
    profileUpdate.setDisplayName(name);
    profileUpdate.setBio(bio || about);
    if (country_code) profileUpdate.setCountryCode(country_code);
    if (region) profileUpdate.setRegion(region);
    profileUpdate.setLanguageIds(languageIds);
    onEdit?.();
  };

  const handleSave = async () => {
    setIsEditing(false);

    const result = await profileUpdate.submitForm();

    if (result.ok) {
      onSave?.({
        name: profileUpdate.formData.display_name,
        about: about,
        bio: profileUpdate.formData.bio,
        country_code: profileUpdate.formData.country_code,
        region: profileUpdate.formData.region,
        language_ids: profileUpdate.formData.language_ids,
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    profileUpdate.setDisplayName(name);
    profileUpdate.setBio(bio || about);
    if (country_code) profileUpdate.setCountryCode(country_code);
    if (region) profileUpdate.setRegion(region);
    profileUpdate.setLanguageIds(languageIds);
  };

  return (
    <section className="w-full rounded-2xl  px-4 py-5 sm:px-6 sm:py-6">
      <div className="flex flex-col gap-5">
        {/* Top Row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          {/* Left Side */}
          <div className="min-w-0 flex-1">
            {isEditing ? (
              <InputField
                id="display_name"
                label={t('serviceMarket.createProfile.displayName')}
                placeholder={t('serviceMarket.createProfile.displayNamePlaceholder')}
                value={profileUpdate.formData.display_name}
                onChange={(e) => {
                  if (e && typeof e === 'object' && 'target' in e && e.target) {
                    const target = e.target as HTMLInputElement;
                    profileUpdate.setDisplayName(target.value);
                  } else if (typeof e === 'string') {
                    profileUpdate.setDisplayName(e);
                  }
                }}
                withFieldset
                className="text-2xl font-bold text-[#222222] sm:text-[30px] leading-tight w-full border-b-2 border-blueSite focus:outline-none focus:border-blueSiteHover"
              />
            ) : (
              <h1 className="text-2xl font-bold text-[#222222] sm:text-[30px] leading-tight">
                {name}
              </h1>
            )}

            <div className="mt-2 flex items-center gap-2 text-sm text-[#6B7280]">
              <MapPin className="h-4 w-4 shrink-0 text-blueSite" />
              <span>{location}</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {isEditing ? (
                <MultiSelectFieldWithSearch
                  id="language_ids"
                  label={t('serviceMarket.createProfile.serviceLanguages')}
                  values={profileUpdate.formData.language_ids}
                  onChange={(values) => profileUpdate.setLanguageIds(values as number[])}
                  selectorOptions={languages.map((lang) => ({
                    id: lang.id,
                    name: lang.name
                  }))}
                  className="w-full max-w-xs"
                  required={false}
                />
              ) : (
                languageIds?.map((langId) => {
                  const language = languages.find((l) => l.id === langId);
                  return language ? (
                    <span
                      key={langId}
                      className="rounded-full bg-blueLight px-3 py-1 text-xs font-medium text-blueSite"
                    >
                      {language.name}
                    </span>
                  ) : null;
                })
              )}
            </div>
          </div>

          {/* Right Side */}
          <div className="shrink-0">
            {isEditing ? (
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  className="!h-11 !px-5"
                >
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    {t('serviceMarket.providerInfo.save')}
                  </div>
                </Button>
                <Button
                  onClick={handleCancel}
                  className="!h-11 !px-5 !bg-gray-500 hover:!bg-gray-600"
                >
                  <div className="flex items-center gap-2">
                    <X className="h-4 w-4" />
                    {t('serviceMarket.providerInfo.cancel')}
                  </div>
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleEdit}
                className="!h-11 !px-5"
              >
                <div className="flex items-center gap-2">
                  <Pencil className="h-4 w-4" />
                  {t('serviceMarket.providerInfo.editInformation')}
                </div>
              </Button>
            )}
          </div>
        </div>

        {/* About/Bio */}
        <div>
          <h2 className="mb-2 text-xl font-semibold text-[#2A2A2A]">{t('serviceMarket.providerInfo.about')}</h2>
          {isEditing ? (
            <InputField
              id="bio"
              value={profileUpdate.formData.bio}
              onChange={(e) => {
                if (e && typeof e === 'object' && 'target' in e && e.target) {
                  const target = e.target as HTMLTextAreaElement;
                  profileUpdate.setBio(target.value);
                } else if (typeof e === 'string') {
                  profileUpdate.setBio(e);
                }
              }}
              placeholder={t('serviceMarket.providerInfo.aboutProviderPlaceholder')}
              withFieldset
              type="textarea"
              rows={4}
              className="max-w-5xl text-sm leading-7 text-[#5F6368] w-full border-2 border-blueSite rounded-lg p-3 focus:outline-none focus:border-blueSiteHover min-h-[100px]"
            />
          ) : (
            <p className="max-w-5xl text-sm leading-7 text-[#5F6368] text-left whitespace-pre-wrap break-words">
              {bio || about}
            </p>
          )}
        </div>

        {/* Additional fields for editing */}
        {isEditing && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Country */}
            <div>
              <SelectFieldWithSearch
                id="country"
                label={t('serviceMarket.createProfile.country')}
                value={profileUpdate.formData.country_code}
                onChange={async (value) => {
                  profileUpdate.handleChange("country_code")(value);
                  const selectedCountry = countries.find(country =>
                    String(country.alpha_2_code || country.id) === String(value)
                  );
                  const countryName = selectedCountry?.en_short_name || selectedCountry?.name;
                  if (countryName) {
                    try {
                      const regionsData = await getRegionsByCountryName(countryName);
                      setRegions(regionsData);
                    } catch (error) {
                      setRegions([]);
                    }
                  } else {
                    setRegions([]);
                  }
                }}
                selectorOptions={countries.map((country) => ({
                  id: country.alpha_2_code || country.id,
                  name: country.en_short_name || country.name,
                }))}
                className="w-full"
              />
            </div>

            {/* Region */}
            <div>
              <SelectFieldWithSearch
                id="region"
                label={t('serviceMarket.createProfile.region')}
                value={profileUpdate.formData.region}
                onChange={(value) => profileUpdate.handleChange("region")(value)}
                selectorOptions={regions.map((region) => ({
                  id: region.id || region.code,
                  name: region.name
                }))}
                className="w-full"
                disabled={!profileUpdate.formData.country_code || regions.length === 0}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}