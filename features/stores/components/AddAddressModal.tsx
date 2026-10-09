'use client';

import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import MapSection from "@/components/Map/MapSection";
import useAddressApi from "@/lib/api/useAddressApi";
import useGetData from "@/lib/api/useGetData";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface AddressForm {
  region_id: string;
  address: string;
  is_default: boolean;
  latitude: string;
  longitude: string;
}

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (data: unknown) => void;
  editingAddress?: Partial<AddressForm> & { id?: string | number };
}

const AddAddressModal: React.FC<AddAddressModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editingAddress,
}) => {
  const { t } = useTranslation();
  const { addAddress, updateAddress, loading } = useAddressApi();
  const [showMap, setShowMap] = useState(false);
  const [countries, setCountries] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [formData, setFormData] = useState<AddressForm>({
    region_id: "",
    address: "",
    is_default: false,
    latitude: "",
    longitude: "",
  });

  const { data: countriesData, loading: loadingCountries } = useGetData({
    url: "/shared/countries",
    paginate: true,
    page: currentPage,
  });

  useEffect(() => {
    if (isOpen) {
      setCountries([]);
      setCurrentPage(1);
      setHasMore(true);

      if (editingAddress) {
        setFormData({
          region_id: editingAddress.region_id || "",
          address: editingAddress.address || "",
          is_default: editingAddress.is_default || false,
          latitude: editingAddress.latitude || "",
          longitude: editingAddress.longitude || "",
        });
        if (editingAddress.latitude && editingAddress.longitude) {
          setShowMap(true);
        }
      } else {
        setFormData({
          region_id: "",
          address: "",
          is_default: false,
          latitude: "",
          longitude: "",
        });
        setShowMap(false);
      }
    }
  }, [isOpen, editingAddress]);

  useEffect(() => {
    if (countriesData?.data?.countries) {
      if (currentPage === 1) {
        setCountries(countriesData.data.countries);
      } else {
        setCountries((prev) => [...prev, ...countriesData.data.countries]);
      }
      setHasMore(countriesData.data.meta?.has_more || false);
    }
  }, [countriesData, currentPage]);

  const loadMoreCountries = () => {
    if (hasMore && !loadingCountries) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleChange = (field: keyof AddressForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let value: string | boolean;
    if (e.target.type === "checkbox") {
      value = Boolean(e.target.checked);
    } else {
      value = e.target.value;
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLocationChange = ({ lat, lng }: { lat: string; lng: string }) => {
    setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.region_id || !formData.address || !formData.latitude || !formData.longitude) {
      return;
    }

    const submitData = { ...formData, is_default: Boolean(formData.is_default) };

    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, submitData, {
          onSuccess: (data) => {
            onSuccess?.(data);
            handleClose();
          },
        });
      } else {
        await addAddress(submitData, {
          onSuccess: (data) => {
            onSuccess?.(data);
            handleClose();
          },
        });
      }
    } catch (error) {
      console.error(
        `Failed to ${editingAddress ? t("address.update") : t("address.add")}:`,
        error
      );
    }
  };

  const handleClose = () => {
    setShowMap(false);
    setFormData({
      region_id: "",
      address: "",
      is_default: false,
      latitude: "",
      longitude: "",
    });
    setCountries([]);
    setCurrentPage(1);
    setHasMore(true);
    onClose();
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, region_id: e.target.value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-2xl">
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-blueSite text-center">
          {editingAddress ? t("address.editAddress") : t("address.addNewAddress")}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Country Selection */}
          <div>
            <label className="block text-blueSite text-sm mb-2 font-medium">
              {t("address.country")} *
            </label>
            <div className="relative">
              <select
                value={formData.region_id}
                onChange={handleCountryChange}
                className="w-full rounded-md border border-gray-300 p-3 text-[#323232] focus:outline-none focus:border-blueSite appearance-none bg-white"
                required
                onFocus={loadMoreCountries}
              >
                <option value="">{t("address.selectCountry")}</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
              {loadingCountries && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blueSite rounded-full animate-spin" />
                </div>
              )}
            </div>
            {hasMore && countries.length > 0 && (
              <button
                type="button"
                onClick={loadMoreCountries}
                disabled={loadingCountries}
                className="mt-2 text-sm text-blueSite hover:underline disabled:opacity-50"
              >
                {loadingCountries ? t("loading") : t("address.loadMoreCountries")}
              </button>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-[#0B5C8E] text-sm mb-2 font-medium">
              {t("address.fullAddress")} *
            </label>
            <textarea
              value={formData.address}
              onChange={handleChange("address")}
              className="w-full rounded-md border border-gray-300 p-3 text-[#323232] focus:outline-none focus:border-blueSite"
              placeholder={t("address.fullAddressPlaceholder")}
              rows="3"
              required
            />
          </div>

          {/* Map Location Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-blueSite text-sm font-medium">
                {t("address.locationOnMap")} *
              </label>
              <Button
                type="button"
                unstyled
                onClick={() => setShowMap(!showMap)}
                className="text-sm text-[#32A5EF] hover:underline"
              >
                {showMap ? t("address.hideMap") : t("address.selectLocation")}
              </Button>
            </div>

            {formData.latitude && formData.longitude && (
              <div className="text-xs text-subTitleColor mb-2">
                {t("address.lat")}: {formData.latitude.toFixed(6)}, {t("address.long")}:{" "}
                {formData.longitude.toFixed(6)}
              </div>
            )}

            {showMap && (
              <MapSection
                onLocationChange={handleLocationChange}
                defaultCenter={
                  formData.latitude && formData.longitude
                    ? [formData.latitude, formData.longitude]
                    : [33.5138, 36.2765]
                }
              />
            )}
          </div>

          {/* Is Default Checkbox */}
          <div>
            <label className="inline-flex items-center gap-2 text-[#3C4242] text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_default}
                onChange={handleChange("is_default")}
                className="w-4 h-4 cursor-pointer"
              />
              {t("address.setAsDefault")}
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <Button
              type="button"
              unstyled
              onClick={handleClose}
              className="flex-1 bg-gray-200 text-subTitleColor py-3 rounded-md hover:bg-gray-300 transition"
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              unstyled
              disabled={loading || !formData.latitude || !formData.longitude}
              className="flex-1 bg-blueSite text-textWhiteColor py-3 rounded-md hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? editingAddress
                  ? t("address.updating")
                  : t("address.adding")
                : editingAddress
                  ? t("address.updateAddress")
                  : t("address.addAddress")}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddAddressModal;
