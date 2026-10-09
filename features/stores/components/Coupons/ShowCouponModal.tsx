import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import useGetData from '@/lib/api/useGetData';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { formatDate } from '@/lib/utils/format';
import { COUPONS_ENDPOINT } from '@/shared/constants/urls';
import { FaCalendar, FaUser } from 'react-icons/fa';
import {
  Coupon,
  CouponResponse,
  ShowCouponModalProps
} from '@/features/stores/types/coupons';
import { RiDiscountPercentFill } from 'react-icons/ri';
import { BsFillBoxSeamFill } from 'react-icons/bs';

const SkeletonLoader = () => (
  <div className="animate-pulse">
    <div className="space-y-4">
      <div>
        <div className="h-10 bg-gray-200 rounded w-48 mb-4"></div>
      </div>
      <div className="space-y-2">
        <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
        <div className="space-y-3">
          <div className="flex gap-4 items-center">
            <div className="h-5 w-5 bg-gray-200 rounded"></div>
            <div className="h-5 bg-gray-200 rounded w-24"></div>
            <div className="h-5 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="h-5 w-5 bg-gray-200 rounded"></div>
            <div className="h-5 bg-gray-200 rounded w-24"></div>
            <div className="h-5 bg-gray-200 rounded w-12"></div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="h-5 w-5 bg-gray-200 rounded"></div>
            <div className="h-5 bg-gray-200 rounded w-24"></div>
            <div className="h-5 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="h-5 w-5 bg-gray-200 rounded"></div>
            <div className="h-5 bg-gray-200 rounded w-24"></div>
            <div className="h-5 bg-gray-200 rounded w-8"></div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="h-5 w-5 bg-gray-200 rounded"></div>
            <div className="h-5 bg-gray-200 rounded w-24"></div>
            <div className="h-5 bg-gray-200 rounded w-10"></div>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
        <div className="h-5 bg-gray-200 rounded w-40"></div>
      </div>
      <div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  </div>
);

const ShowCouponModal = ({
  open,
  handleClose,
  couponId,
  handleDeleteCoupon
}: ShowCouponModalProps) => {
  const { t } = useTranslation();

  const {
    data: resData,
    loading,
    error,
    refetch,
  } = useGetData<CouponResponse>({
    url: COUPONS_ENDPOINT.getDetails(couponId || ''),
    enabled: !!couponId
  });

  const coupon: Coupon = resData?.data || {
    id: 0,
    code: '',
    discount_type: 'percentage',
    discount_value: 0,
    min_cart_amount: 0,
    expires_at: '',
    max_usage_count: 0,
    max_usage_per_user: 0,
    scope: 'all',
    is_expired: false,
    remaining_usage: 0,
    store: { id: 0, name: '' },
    products: []
  };


  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      style={{ maxWidth: "700px" }}
      padding='py-2 px-6'
      classNameContent="!max-h-[65vh]"
    >
      {loading ? (
        <SkeletonLoader />
      ) : (
        <div className='space-y-4' >
          <div >
            <h1 className='text-[35px] lg:text-[40px] text-subTitleColor'>{coupon.code}</h1>
          </div>
          <div className='space-y-2'>
            <h2 className='border-s-2 border-blueSite text-[20px] text-blueSite px-3 font-semibold'>{t("coupons.show.information")} :</h2>
            <div className="flex flex-col gap-5 text-[20px] py-4 space-y-3">
              <div className='flex flex-col gap-5'>
                <div className="flex flex-row items-center gap-1">
                  <span>
                    <RiDiscountPercentFill className="text-blueIcons" />
                  </span>
                  <span className="text-textColor">
                    {t("coupons.create.fields.discountType")}
                  </span> :
                  <span className='text-subTitleColor '>{coupon.discount_type}</span>
                </div>

                <div className="flex flex-row items-center gap-1">
                  <span>
                    <RiDiscountPercentFill className="text-blueIcons" />
                  </span>
                  <span className="text-textColor">
                    {t("coupons.create.fields.discountValue")}
                  </span> :
                  <span className='text-subTitleColor '>{coupon.discount_value}</span>
                </div>
              </div>

              <div className='flex flex-col gap-5'>
                <div className="flex flex-row items-center gap-1">
                  <span>
                    <FaCalendar className="text-blueIcons" />
                  </span>
                  <span className="text-textColor">
                    {t("coupons.create.fields.expiresAt")}
                  </span> :
                  <span className='text-subTitleColor '>{formatDate(coupon.expires_at)}</span>
                </div>

                <div className="flex flex-row items-center gap-1">
                  <span>
                    <FaUser className="text-blueIcons" />
                  </span>
                  <span className="text-textColor">
                    {t("coupons.create.fields.maxUsageCount")}
                  </span> :
                  <span className='text-subTitleColor '>{coupon.max_usage_per_user}</span>
                </div>
                <div className="flex flex-row items-center gap-1">
                  <span>
                    <BsFillBoxSeamFill className="text-blueIcons" />
                  </span>
                  <span className="text-textColor">
                    {t("coupons.create.fields.minCartAmount")}
                  </span> :
                  <span className='text-subTitleColor '>
                    {coupon.min_cart_amount}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {
            Array.isArray(coupon.products) && coupon.products.length >= 0 && coupon.scope === 'products'
            && <div className='space-y-2'>
              <h2 className='border-s-2 border-blueSite text-[20px] text-blueSite px-3 font-semibold'>{t("coupons.show.products")} :</h2>
              <div className='px-3 text-textColor text-[17px]'>
                {
                  coupon.products?.length !== 0 ? coupon?.products?.map((prod, index) =>
                    <span key={index} className='px-1'>{prod.name} ,</span>) :
                    <p>{t("coupons.show.noProducts")}</p>
                }
              </div>
            </div>}
          {
            (Array.isArray(coupon.categories) && coupon.categories.length >= 0 && coupon.scope === 'categories') &&
            <div className='space-y-2'>
              <h2 className='border-s-2 border-blueSite text-[20px] text-blueSite px-3 font-semibold'>{t("coupons.show.categories")} :</h2>
              <div className='px-3 text-textColor text-[17px]'>
                {
                  coupon.categories?.length !== 0 ? coupon?.categories?.map((prod, index) =>
                    <span key={index} className='px-1'>{prod.name} ,</span>) :
                    <p>{t("coupons.show.noCategories")}</p>
                }
              </div>
            </div>
          }
          <div>
            <Button
              unstyled
              scale={1.03}
              onClick={() => handleDeleteCoupon(coupon.id.toString())}
              className='bg-red-500 text-white text-[20px] rounded-lg py-2 px-5 w-full'>
              {t("coupons.btn.delete")}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default ShowCouponModal