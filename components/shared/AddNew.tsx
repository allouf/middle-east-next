'use client';

import { useState } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useRouter } from "next/navigation";
import { t } from "i18next";

const AddNew = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  const handleNavigate = (url: string) => {
    router.push(url);
    setModalOpen(false);
  };

  const buttonConfig = [
    { label: `${t("add")} ${t("ads")}`, url: "/AddAds" },
    { label: `${t("add")} ${t("opportunityjob")}`, url: "/addOpportunity" },
    { label: `${t("add")} ${t("auction")}`, url: "/add_auction" },
  ];

  const ActionButton = ({ label, url }) => (
    <div className="m-4">
      <Button
        onClick={() => handleNavigate(url)}
        unstyled={true}
        className="text-textWhiteColor px-[8rem] bg-sky-400 p-2 border rounded-2xl"
      >
        {label}
      </Button>
    </div>
  );

  return (
    <>
      <Button
        unstyled
        onClick={() => setModalOpen(true)}
        className="whitespace-nowrap text-textWhiteColor text-sm md:text-base mx-2 bg-sky-400 p-2 border rounded-2xl"
      >
        {t("addNew")}
      </Button>

      <Modal
        id="addnew"
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        className="flex flex-col justify-between items-center space-y-4 p-4"
      >
        {buttonConfig.map((btn, index) => (
          <ActionButton key={index} {...btn} />
        ))}
      </Modal>
    </>
  );
};

export default AddNew;

