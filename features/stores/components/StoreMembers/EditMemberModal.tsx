'use client';

import React from 'react';
import usePostData from "../../../../lib/api/usePostData";
import InputField from "../../../../components/ui/InputField";
import Button from "../../../../components/ui/Button";
import Modal from "../../../../components/ui/Modal";
import { STORE_ENDPOINT } from "@/shared/constants/urls";
import LocaleSelect from "../../../../components/ui/LocaleSelect";
import useFormData from "../../../../lib/Hooks/useFormData";
import { useTranslation } from "@/lib/i18n/useTranslation";

import Image from "next/image";
import { EditMemberModalProps } from '@/features/stores/types/storeMembers'
import IconsMemberImage from "@/assets/images/iconsMemberImage.png";


const EditMemberModal: React.FC<EditMemberModalProps> = ({
  member,
  onClose,
  refetch,
  disabled = false,
  messageApi,
  handleDeleteMember,
  open
}) => {
  const initialFormState = { role: member.role };
  const { formData, handleChange, resetForm } = useFormData(initialFormState);
  const { postData, loading } = usePostData(
    STORE_ENDPOINT.updateRole(member.id)
  );
  const {postData:revokeInvitation,loading:revoking, error:revokeError} = usePostData(STORE_ENDPOINT.revokeInvitations(member.id))
  //const {data: memberData,loading:memberLoading,refetch:memberRefetch} = useGetData({url: STORE_ENDPOINT.showMember(member.id)})
  const {t} = useTranslation()


  console.log("member",member)
  // useEffect(()=>{
  //   console.log("memberData",memberData)
  // },[memberData])


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await postData(formData, {
      onSuccess: () => {
        refetch();
        messageApi.success(t("members.edit.successText"));
        onClose();
      },
      onError:(err)=>{
        console.log(err)
        messageApi.error(err.response?.data?.message||t("members.edit.failedText"))
      },
      showMessage:false
    });
  };

  const handleRevoke = async ()=>{


        await revokeInvitation({}, {
      onSuccess: () => {
        refetch();
        messageApi.success(t("members.invite.revoke_success"));
        onClose();
      },
      onError:(err)=>{
        console.log(err)
        messageApi.error(err.response?.data?.message||t("members.ivite.revoke_failed"))
      },
      showMessage:false
    });
  }

  return (
    <Modal isOpen={open} onClose={onClose} 
    padding="py-0 px-6"
    className="">
      <div className="relative overflow-hidden text-center px-6 py-8">
          <div className="flex justify-center">
            <Image src={IconsMemberImage} alt={t("members.add.iconAlt")} 
            width={180} height={96} />
          </div>
          <h2 className="text-xl font-semibold text-blueSite mb-1">
            {t("members.edit.title")}
          </h2>
          <p className="text-textColor mb-6 text-sm">
            {t("members.edit.subtitle")}
          </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center space-y-4"
        >
          {/* Email Field */}
          {/* <div className="w-full relative">
            <InputField
              id="email"
              type="email"
              label={t("form.email")}
              value={member.email}
              unstyled
              withFieldset
              placeholder={t("form.emailPlaceholder")}
              disabled
            />
          </div> */}

          {/* Role Field */}
          <div className="w-full relative">
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
              disabled={disabled}
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            scale={1.03}

            unstyled
            className="w-full mt-4 bg-blueBtn hover:bg-blueSiteHover text-textWhiteColor font-medium py-2 rounded-lg transition"
          >
            {t("common.editInformation")}
          </Button>

          {member.status=="invited" && 
          <Button
            
          scale={1.03}
            
            disabled={revoking}
            onClick={handleRevoke}
            unstyled
            className="w-full mt-4 bg-red-500 hover:bg-red-700 text-textWhiteColor font-medium py-2 rounded-lg transition"
          >
            {revoking? t("members.invite.canceling"):t("members.cancel_invitation")}
          </Button>}

          <Button
            type="button"
            scale={1.03}
            unstyled 
            onClick={()=>handleDeleteMember?.(member.id)}
            className="w-full mt-4 text-[24px] text-red-500 underline underline-offset-2 font-medium py-2 rounded-lg transition"
          >
            {t("common.delete")}
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default EditMemberModal;
