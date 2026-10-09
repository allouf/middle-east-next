"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import InputField from "@/components/ui/InputField";
import MultiSelectFieldWithSearch from "@/components/ui/MultiSelectFieldWithSearch";
import { fetchCountries, getRegionsByCountryName } from "@/shared/utils/locationApi";
import { fetchLanguages } from "@/shared/utils/languageApi";
import SelectField from "@/components/ui/SelectFiled";

type Props = {
  profileUpdate: any;
  errors?: any;
  isSubmitted:boolean;
};

export default function CreateProviderProfileForm({ profileUpdate, errors ,isSubmitted }: Props) {
  const { t } = useTranslation();
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

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.15fr]">
        {/* left */}
        <div className="space-y-4">
          <InputField
            id="displayName"
            label={t('serviceMarket.createProfile.displayName')}
            placeholder={t('serviceMarket.createProfile.displayNamePlaceholder')}
            value={profileUpdate.formData.display_name}
            onChange={profileUpdate.handleChange("display_name")}
            withFieldset
            validate
            required
            isSubmited={isSubmitted}
            // error={}
          />

          <MultiSelectFieldWithSearch
            id="serviceLanguages"
            values={profileUpdate.formData.language_ids}
            onChange={(values) => profileUpdate.setLanguageIds(values as number[])}
            label={t('serviceMarket.createProfile.serviceLanguages')}
            selectorOptions={languages.map((lang) => ({
              id: lang.id,
              name: lang.name
            }))}
            className="w-full"
            validate
            required={false}
            isSubmited={isSubmitted}
          />

          <SelectField
            id="country"
            label={t('serviceMarket.createProfile.country')}
            value={profileUpdate.formData.country_code}
            onChange={async (event) => {
              const value = event.target.value;
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
            withFieldset
            validate
            className="w-full"
            required={false}
            isSubmited={isSubmitted}
          />

          <SelectField
            id="region"
            label={t('serviceMarket.createProfile.region')}
            value={profileUpdate.formData.region}
            onChange={(value) => profileUpdate.handleChange("region")(value)}
            selectorOptions={regions.map((region) => ({
              id: region.id || region.code,
              name: region.name
            }))}
            withFieldset
            className="w-full"
            validate
            disabled={!profileUpdate.formData.country_code || regions.length === 0}
            required={false}
            isSubmited={isSubmitted}
          />
        </div>

        {/* right */}
        <div>
          <InputField
            id="professionalBio"
            label={t('serviceMarket.createProfile.professionalBio')}
            type="textarea"
            placeholder={t('serviceMarket.createProfile.professionalBioPlaceholder')}
            value={profileUpdate.formData.bio}
            onChange={profileUpdate.handleChange("bio")}
            withFieldset
            validate
            rows={6}
            required
            isSubmited={isSubmitted}
          />
        </div>
      </div>
    </div>
  );
}