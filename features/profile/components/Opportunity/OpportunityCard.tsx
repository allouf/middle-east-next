import { FaPhoneAlt, FaTelegramPlane } from "react-icons/fa";
import { BsCalendar2Event, BsCurrencyDollar } from "react-icons/bs";
import { useState } from "react";
import DeleteModal from "@/components/shered/DeleteModel";
import Button from "@/components/ui/Button";
import { t } from "i18next";
import { deleteJobs } from "@/shared/constants/urls";

const OpportunityCard = ({
  id,
  name,
  description,
  created_at,
  type,
  min_salary,
  max_salary,
  social_links,
  starts_at,
  expires_at,
  state,
  views,
  shares,
  applicants,
}) => {
  // const formattedDate = new Intl.DateTimeFormat("en-GB", {
  //   year: "numeric",
  //   month: "long",
  //   day: "numeric",
  // }).format(new Date(created_at));

  const [isModalOpen, setModalOpen] = useState(false);
  return (
    <div
      key={id}
      className="bg-white shadow-md p-6 rounded-lg border space-y-4 hover:shadow-lg transition-shadow"
    >
      {/* Header Section */}
      {/* <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-sky-600">{name}</h2>
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            state === "active"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {state.toUpperCase()}
        </span>
      </div> */}

      {/* Description */}
      <p className="text-subTitleColor">{description}</p>

      {/* Details */}
      <div className="grid grid-cols-2 gap-4">
        {/* <div className="text-sm text-textColor">
          <BsCalendar2Event className="inline-block mr-2 text-sky-500" />
          <strong>{t("posted")}:</strong> {formattedDate}
        </div> */}
        <div className="text-sm text-textColor">
          <BsCalendar2Event className="inline-block mr-2 text-blueIcons" />
          <strong>{t("startsAt")}:</strong>{" "}
          {new Date(starts_at).toLocaleDateString()}
        </div>
        <div className="text-sm text-textColor">
          <BsCalendar2Event className="inline-block mr-2 text-blueIcons" />
          <strong>{t("expiresAt")}:</strong>{" "}
          {new Date(expires_at).toLocaleDateString()}
        </div>
        <div className="text-sm text-textColor">
          <BsCurrencyDollar className="inline-block mr-2 text-green-600" />
          <strong>{t("salary")}:</strong> {min_salary} - {max_salary}
        </div>
      </div>

      {/* Social Links */}
      <div className="mt-4 space-y-2">
        {social_links?.phone && (
          <div className="text-sm text-subTitleColor flex items-center">
            <FaPhoneAlt className="mr-2 text-green-500" />
            <span>{social_links.phone}</span>
          </div>
        )}
        {social_links?.telegram && (
          <div className="text-sm text-subTitleColor flex items-center">
            <FaTelegramPlane className="mr-2 text-blueIcons" />
            <span>{social_links.telegram}</span>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="flex justify-between mt-4 text-sm text-textColor">
        <p>
          👁️ {views} {t("views")}
        </p>
        <p>
          🔗 {shares} {t("shares")}{" "}
        </p>
        <p>
          👥 {applicants} {t("applicants")}
        </p>
      </div>
      <div className="flex items-center justify-between">
        <Button
          onClick={() => setModalOpen(true)}
          className="bg-red-500 text-textWhiteColor p-2 rounded hover:bg-red-600"
        >
          {t("buttons.delete")}
        </Button>
        <Button
          to={`/opportunities/${id}`}
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
        url={deleteJobs}
        id={id}
      />
    </div>
  );
};

export default OpportunityCard;
