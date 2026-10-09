'use client';

import { useEffect, useMemo } from 'react';
import Image from 'next/image';
import { FaCalendar } from 'react-icons/fa';
import { RiDiscountPercentFill } from 'react-icons/ri';
import Modal from '@/components/ui/Modal';
import LoaderPage from '@/components/shered/LoaderPage';
import ErrorWithRetry from '@/components/ui/ErrorWithRetry';
import Button from '@/components/ui/Button';
import useGetData from '@/lib/api/useGetData';
import { PACKAGES_ENDPOINT } from '@/shared/constants/urls';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { PackageDetails, PackageDetailsResponse } from '../../types/PackageTypes';

type ShowPackageModalProps = {
  open?: boolean;
  handleClose: () => void;
  package_id: number | string | null;

  handleEditPackage: (packageId: number | string) => void;
  handleDeletePackage?: (packageId: number | string) => void; // kept for compatibility (not used here)
  refetch?: () => void; // kept for compatibility (not used here)
};

const ShowPackageModal = ({
  open = false,
  handleClose,
  package_id,
  handleEditPackage,
}: ShowPackageModalProps) => {
  const {
    data: packageDetails,
    loading,
    error,
    refetch: refetchPackageDetails,
  } = useGetData<PackageDetailsResponse>({
    url: PACKAGES_ENDPOINT.getDetails(package_id ?? ''),
    enabled: Boolean(package_id),
  });


  const { t } = useTranslation();

  const packa: PackageDetails = useMemo(
    () => packageDetails?.data?.package ?? ({} as PackageDetails),
    [packageDetails]
  );



  const createdAtText =
    packa.created_at ? new Date(packa.created_at).toLocaleDateString() : '-';

  const discountTypeText = packa.fixed_discount
    ? t('packages.fixed_value')
    : packa.discount_percent
      ? t('packages.percentage')
      : '-';

  const discountValueText = packa.fixed_discount
    ? `$${packa.fixed_discount}`
    : packa.discount_percent !== null && packa.discount_percent !== undefined
      ? `${packa.discount_percent}%`
      : '-';

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      className="max-h-[90vh] w-full max-w-2xl mx-4 overflow-x-hidden"
      padding="p-4 sm:p-5"
      showLine={false}
    >
      {loading ? (
        <LoaderPage count={1} />
      ) : error ? (
        <ErrorWithRetry onRetry={refetchPackageDetails} />
      ) : (
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
            <h2 className="font-bold text-lg sm:text-xl lg:text-[24px] text-subTitleColor leading-tight">
              {packa.title || t('packages.default_title')}
            </h2>

            <p className="text-sm sm:text-[15px] lg:text-[16px] text-right">
              <span className="text-textColor">
                {t('packages.total_price')}:
              </span>{" "}
              <span className="text-blueSite font-semibold">
                ${packa.total_price ?? '-'}
              </span>
            </p>
          </div>


          <p className="text-textColor text-sm sm:text-[14px] leading-relaxed">
            {packa.description ?? ''}
          </p>


          {/* Discount Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 text-sm sm:text-[16px] lg:text-[18px] text-subTitleColor">
            <div className="flex items-center gap-2">
              <RiDiscountPercentFill className="text-blueIcons text-base sm:text-[18px] flex-shrink-0" />
              <div className="min-w-0  flex flex-row md:flex-col gap-2 ">
                <span className="text-textGrayColor block text-xs sm:text-sm">
                  {t('packages.discount_type')}:
                </span>
                <span className="font-medium truncate">{discountTypeText}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <RiDiscountPercentFill className="text-blueIcons text-base sm:text-[18px] flex-shrink-0" />
              <div className="min-w-0 flex flex-row md:flex-col gap-2 ">
                <span className="text-textGrayColor block text-xs sm:text-sm">
                  {t('packages.discount_value')}:
                </span>
                <span className="font-medium truncate">{discountValueText}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-1">
              <FaCalendar className="text-blueIcons text-base sm:text-[18px] flex-shrink-0" />
              <div className="min-w-0  flex flex-row md:flex-col gap-2">
                <span className="text-textGrayColor block text-xs sm:text-sm">
                  {t('packages.date_added')}:
                </span>
                <span className="font-medium truncate">{createdAtText}</span>
              </div>
            </div>
          </div>


          {/* Main Product */}
          <div className="space-y-3 sm:space-y-4 mt-4">
            <h3 className="font-semibold text-lg sm:text-xl lg:text-[21px] text-subTitleColor">
              {t('packages.main_product')}
            </h3>

            <div className="flex items-center gap-3 sm:gap-4 w-full">
              <div className="relative w-12 h-12 sm:w-[65px] sm:h-[65px] flex-shrink-0">
                <Image
                  src={packa.product?.image || 'https://placehold.co/60x60'}
                  alt={packa.product?.name || 'main product'}
                  fill
                  className="object-cover rounded"
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-base sm:text-[18px] font-medium text-subTitleColor truncate">
                  {packa.product?.name ?? '-'}
                </p>
                <p className="text-blueSite font-semibold text-base sm:text-[18px]">
                  ${packa.product?.price ?? '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Related Items */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-semibold text-lg sm:text-xl lg:text-[21px] text-subTitleColor">
              {t('packages.related_items')}
            </h3>

            <div className="max-h-[350px] sm:max-h-[300px] lg:max-h-[250px] overflow-y-auto dropDown">
              {(packa.items ?? []).map((item) => (
                <div key={item.id} className="flex gap-3 sm:gap-4 p-3 sm:p-4 border-b hover:bg-gray-50">
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 lg:w-[80px] lg:h-[80px] rounded border flex-shrink-0">
                    <Image
                      src={item?.variant?.image || 'https://placehold.co/80x80'}
                      alt={item.product?.title || 'product'}
                      fill
                      className="object-cover rounded"
                    />
                  </div>

                  <div className="flex-1 flex flex-col gap-2">
                    <div className='min-w-0'>
                      <p className="text-xs sm:text-sm font-medium text-blueSite truncate mb-1">
                        {item?.product?.category?.name ?? '-'}
                      </p>
                      <p className="text-sm sm:text-base lg:text-lg text-textColor truncate font-medium">
                        {item.product?.title ?? '-'}
                      </p>
                    </div>

                    <div className="flex justify-between items-end gap-2">
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 text-xs sm:text-sm text-textColor">
                        <span className="font-medium">${item.variant?.price ?? '-'}</span>
                        <span className="text-gray-500">x{item.quantity ?? 1}</span>
                      </div>
                      <div className="font-semibold text-subTitleColor text-sm sm:text-base">
                        ${(item.variant?.price * item.quantity) ?? '-'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-start pt-4 sm:pt-6">
            <Button
              unstyled
              onClick={handleClose}
              className="text-sm sm:text-[16px] text-textColor px-4 sm:px-5 py-2 hover:underline"
            >
              {t('buttons.cancel')}
            </Button>
          </div>

        </div>
      )}
    </Modal>
  );
};

export default ShowPackageModal;
