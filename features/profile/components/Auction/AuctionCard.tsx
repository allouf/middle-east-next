import { FaPhoneAlt, FaTelegramPlane } from "react-icons/fa";
import { BsCalendar2Event } from "react-icons/bs";
import { storageURL } from "@/shared/constants/data";
import { useState } from "react";
import DeleteModal from "@/components/shered/DeleteModel";
import Button from "@/components/ui/Button";
import { t } from "i18next";
import { deleteAuctions } from "@/shared/constants/urls";

const AuctionCard = ({
  id,
  name,
  description,
  created_at,
  start_date,
  end_date,
  status,
  social_links,
  user,
  category,
  country,
  region,
  images,
}) => {
  // const formattedCreatedAt = new Intl.DateTimeFormat("en-GB", {
  //   year: "numeric",
  //   month: "long",
  //   day: "numeric",
  // }).format(new Date(created_at));

  const formattedStartDate = new Date(start_date).toLocaleDateString();
  const formattedEndDate = new Date(end_date).toLocaleDateString();
  const [isModalOpen, setModalOpen] = useState(false);
  return (
    <div
      key={id}
      className="bg-white shadow-md p-6 rounded-lg border space-y-4 hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-blueIcons">{name}</h2>
        {/* <span
          className={`px-3 py-1 rounded-full text-sm ${
            status === "active"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {status.toUpperCase()}
        </span> */}
      </div>

      <p className="text-subTitleColor">{description}</p>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-sm text-textColor">
          <BsCalendar2Event className="inline-block mr-2 text-blueIcons" />
          {/* <strong>{t("posted")}:</strong> {formattedCreatedAt} */}
        </div>
        <div className="text-sm text-textColor">
          <BsCalendar2Event className="inline-block mr-2 text-blueIcons" />
          <strong>{t("startsAt")}:</strong> {formattedStartDate}
        </div>
        <div className="text-sm text-textColor">
          <BsCalendar2Event className="inline-block mr-2 text-blueIcons" />
          <strong>{t("expiresAt")}:</strong> {formattedEndDate}
        </div>
      </div>

      <div className="text-sm text-textColor mt-4">
        <strong>{t("publisher")}:</strong> {user.name}
      </div>

      {/* <div className="text-sm text-textColor">
        <strong>{t("category")}:</strong> {category.name} / {category.en_name}
      </div>

      <div className="text-sm text-textColor">
        <strong>{t("location")}:</strong> {country.name} - {region.name}
      </div> */}

      {images?.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          {images.map((image, index) => (
            <img
              key={index}
              src={`${image.image_path}`}
              alt={`Auction Image ${index + 1}`}
              className="w-full h-24 object-cover rounded"
            />
          ))}
        </div>
      )}

      <div className="mt-4 space-y-2">
        {social_links?.phone && (
          <div className="text-sm text-subTitleColor flex items-center">
            <FaPhoneAlt className="mr-2 text-green-500" />
            <span>{social_links.phone}</span>
          </div>
        )}
        {social_links?.email && (
          <div className="text-sm text-subTitleColor flex items-center">
            <FaTelegramPlane className="mr-2 text-blueIcons" />
            <span>{social_links.email}</span>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <Button
          onClick={() => setModalOpen(true)}
          className="bg-red-500 text-textWhiteColor p-2 rounded hover:bg-red-600"
        >
          {t("buttons.delete")}
        </Button>

        <Button
          to={`/view-auction/${id}`}
          className="bg-green-500 text-textWhiteColor p-2 rounded hover:bg-green-600 "
        >
          {t("buttons.view")}
        </Button>
      </div>
      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={t("text.deleteConfirmation")}
        description={t("text.confirmDeleteItem")}
        url={deleteAuctions}
        id={id}
      />
    </div>
  );
};

export default AuctionCard;
