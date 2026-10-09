'use client';

import React, { useEffect, useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import Modal from "../../../../components/ui/Modal";
import Button from "../../../../components/ui/Button";
import LocaleSelect from "../../../../components/ui/LocaleSelect";
import InputField from "../../../../components/ui/InputField";
import useFormData from "../../../../lib/Hooks/useFormData";
import usePostData from "../../../../lib/api/usePostData";
import { STORE_ENDPOINT } from "@/shared/constants/urls";

import IconsMemberImage from "@/assets/images/iconsMemberImage.png";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { message } from "antd";
import { AddMemberProps, AddMemberFormState } from '@/features/stores/types/storeMembers'

const AddMember: React.FC<AddMemberProps> = ({ store_id, refetch }) => {
  const initialFormState: AddMemberFormState = { store_id: "", email: "", role: "" };
  const [modalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation()
  const { formData, setFormData, handleChange, resetForm } =
    useFormData(initialFormState);
  const { postData, loading } = usePostData(STORE_ENDPOINT.sendInvitations);
  const [messageApi, contextHolder] = message.useMessage();

  // ✅ When store_id becomes available, sync it into formData
  useEffect(() => {
    if (store_id) {
      setFormData((prev) => ({ ...prev, store_id: store_id.toString() }));
    }
  }, [store_id, setFormData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ✅ Prevent submission if no store_id yet
    if (!store_id) {
      messageApi.error(t("members.add.missingStoreText"))
      // Swal.fire({
      //   icon: "warning",
      //   title: t("members.add.missingStoreTitle"),
      //   text: t("members.add.missingStoreText"),
      //   confirmButtonColor: "#0F7ABD",
      // });
      return;
    }
    console.log("invited member", formData)

    await postData(formData, {
      onSuccess: () => {
        // Swal.fire({
        //   icon: "success",
        //   title: t("members.add.successTitle"),
        //   text: t("members.add.successText"),
        //   timer: 1800,
        //   showConfirmButton: false,
        // });

        messageApi.success(t("members.add.successText"));
        setTimeout(() => {
          refetch?.()
        }, 1000);

        resetForm();
        setModalOpen(false);
      },
      onError: (err) => {
        console.log(err)
        messageApi.error(err.response.data?.message || t("members.add.invite_failed"))
      },
      showMessage:false
    });
  };

  return (
    <div>
      {/* Open Modal Button */}
      <Button
        unstyled
        onClick={() => setModalOpen(true)}
        disabled={!store_id}
        className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm ${store_id
          ? "bg-blueSite hover:bg-blueSiteHover text-textWhiteColor"
          : "bg-gray-300 text-textColor cursor-not-allowed"
          }`}
      >
        <FaUserPlus /> {t("members.add.button")}
      </Button>
      {contextHolder}
      {/* Modal */}
      <Modal
        // id="add-member-modal"
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        classNameContent=" max-h-[95vh]"
        style={{ maxWidth: "40%" }}
        padding="py-0 px-6"
      >
        <div className="relative overflow-hidden text-center px-6 py-8">
          {/* Header section */}
          <div className="flex justify-center">
            <Image src={IconsMemberImage} alt={t("members.add.iconAlt")} width={180} height={96} />
          </div>

          <h2 className="text-xl font-semibold text-blueSiteHover mb-1">
            {t("members.add.title")}
          </h2>
          <p className="text-textColor mb-6 text-sm">
            {t("members.add.subtitle")}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <InputField
              id="email"
              type="email"
              label={t("form.email")}
              value={formData.email}
              onChange={handleChange("email")}
              unstyled
              withFieldset
              placeholder={t("form.emailPlaceholder")}

            />

            <LocaleSelect
              label={t("form.role")}
              value={formData.role}
              onChange={handleChange("role")}
              options={[
                { label: t("roles.owner"), value: "STORE_OWNER" },
                { label: t("roles.manager"), value: "STORE_MANAGER" },
                { label: t("roles.support"), value: "SUPPORT_AGENT" },
              ]}
              placeholder={t("form.rolePlaceholder")}
            />

            {/* Email Input */}


            {/* Buttons */}
            <div className="flex justify-end items-center gap-3 pt-2">
              <Button
                type="submit"
                scale={1.03}
                disabled={!store_id || loading}
                className={`px-5 py-2 rounded-lg text-[22px] font-medium w-full flex flex-row justify-center text-center  ${!store_id || loading
                  ? "bg-gray-300 text-textColor cursor-not-allowed"
                  : "bg-blueSite hover:bg-blueSiteHover text-textWhiteColor"
                  }`}
              >
                {loading
                  ? t("common.sending")
                  : t("members.add.invite")}
              </Button>

              {/* <Button
                unstyled
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-subTitleColor hover:text-subTitleColor text-sm font-medium"
              >
                {t("common.cancel")}
              </Button> */}
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default AddMember;
