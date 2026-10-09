'use client';

import { useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { FLASHSELL_ENDPOINT } from "@/shared/constants/urls";
import useGetData from "@/lib/api/useGetData";
import { FaArrowCircleDown, FaCalendar } from "react-icons/fa";
import CollapsedFlashSellProduct from "./CollapsedFlashSellProduct";
import Button from "@/components/ui/Button";
import { useTranslation } from "@/lib/i18n/useTranslation";
import LoaderPage from "@/components/shared/LoaderPage";
import ErrorWithRetry from "@/components/ui/ErrorWithRetry";
import { FlashSellDetails, FlashSellDetailsApiResponse } from "../../types/flashSell";
import { RiDiscountPercentFill } from "react-icons/ri";

interface ShowFlashSellModalProps {
  open?: boolean;
  handleClose: () => void;
  flashSell_id?: string | number | undefined;
  handleEditFlashSell: (id: string | number) => void;
  handleDeleteFlashSell: (id: string | number) => void;
  refetch?: () => void;
}

const ShowFlashSellModal: React.FC<ShowFlashSellModalProps> = ({
  open = false,
  handleClose,
  flashSell_id,
  handleEditFlashSell,
  handleDeleteFlashSell,
  refetch,
}) => {
  const {
    data: flashSellDetails,
    loading,
    error,
    refetch: refetchFlashDetails,
  } = useGetData<FlashSellDetailsApiResponse>({
    url: FLASHSELL_ENDPOINT.getDetails(flashSell_id),
    enabled:!!flashSell_id
  });
  const { t } = useTranslation();

  const flashSell: FlashSellDetails = flashSellDetails?.data || {} as FlashSellDetails;

  useEffect(() => {
    console.log("view", flashSellDetails);
  }, [flashSellDetails]);

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      className=" text-center h-[95vh]"
      style={{ maxWidth: "90%" }}
      showLine={false}
      padding="py-0 px-4"
    >
      {loading?<LoaderPage  count={2}/>: error?<ErrorWithRetry onRetry={refetchFlashDetails}/>:
        <div>
        <div className="space-y-2 text-start">
          <h1 className="text-[24px] font-bold text-start">{flashSell.name}</h1>
          <p className="text-textColor text-[18px]">{flashSell.description || "No description available"}</p>
        </div>

        <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 text-[20px] py-4">
          <div className="flex flex-row items-center gap-1">
            <span>
              <FaCalendar className="text-blueIcons" />
            </span>
            <span className="text-textColor">
              {t("flashSell.fields.startDate")}
            </span> : 
            <span className="text-subTitleColor">{flashSell.start_date}</span>
          </div>

          <div className="flex flex-row items-center gap-1">
            <span>
              <FaCalendar className="text-blueIcons" />
            </span>
            <span className="text-textColor">
              {t("flashSell.fields.endDate")}
            </span> : 
            <span className="text-subTitleColor">{flashSell.end_date}</span>
          </div>
          <div className="flex flex-row items-center gap-1">
            <span>
              <RiDiscountPercentFill className="text-blueIcons" />
            </span>
            <span className="text-textColor">
              {t("flashSell.fields.discountType")}
            </span> : 
            <span className="text-subTitleColor">{flashSell.discount_type}</span>
          </div>
          <div className="flex flex-row items-center gap-1">
            <span>
              <RiDiscountPercentFill className="text-blueIcons" />
            </span>
            <span className="text-textColor">
              {t("flashSell.fields.discountValue")}
            </span> : 
            <span className="text-subTitleColor first-letter:uppercase">{flashSell.discount_value}</span>
          </div>
          <div className="flex flex-row items-center gap-1">
            <span>
              <RiDiscountPercentFill  className="text-blueIcons" />
            </span>
            <span className="text-textColor">
              {t("flashSell.fields.numberProducts")}
            </span> : 
            <span className="text-subTitleColor">
              {Array.isArray(flashSell.products) && flashSell.products.length}
            </span>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold py-4 text-start">
            {t("flashSell.products.ProductOfferTitle")}
          </h2>

          <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto">
            {Array.isArray(flashSell.products) ? (
              flashSell.products.map((pro) => (
                <CollapsedFlashSellProduct pro={pro} />
              ))
            ) : (
              <span>{t("flashSell.products.noProductfound")}</span>
            )}
          </div>
        </div>

        <div className="flex flex-row gap-4 mt-4">
          <Button
            type="button"
            onClick={() => flashSell.id && handleEditFlashSell(flashSell.id)}
            unstyled
            className="bg-blueBtn text-textWhiteColor px-5 py-2 rounded-lg flex items-center gap-2  transition"
          >
            {t("flashSell.button.eidtFlashSell")}
          </Button>

          <Button
            unstyled
            className="text-red-500 text-lg px-6 py-2"
            onClick={() => flashSell.id && handleDeleteFlashSell(flashSell.id)}
          >
          {t("buttons.delete")}
          </Button>
        </div>
      </div>}
    </Modal>
  );
};

export default ShowFlashSellModal;
