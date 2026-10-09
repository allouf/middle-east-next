import { useTranslation } from "@/lib/i18n/useTranslation";

import { useAuth } from "@/lib/context/AuthContext";
import LocaleSelect from "@/components/ui/LocaleSelect";
import useFormData from "@/lib/Hooks/useFormData";
import usePostData from "@/lib/api/usePostData";
import { updateUserRole } from "@/shared/constants/urls";
import Button from "@/components/ui/Button";
import useCompleteProfile from "@/lib/store/useCompleteProfile";
import { message } from "antd";

const UpdateRole = () => {
  const { t } = useTranslation();
  const { updateRole } = useAuth();
  const { setIsCompleteProfile } = useCompleteProfile();
  const [messageApi, contextHolder] = message.useMessage();

  // Role state
  const {
    formData: roleData,
    handleChange: handleRoleChange,
    resetForm: resetRoleForm,
  } = useFormData({ role: "" });
  const { postData: postRole, loading: loadingRole } =
    usePostData(updateUserRole);

  /** Save Role */
  const handleSubmitRole = async (e) => {
    e.preventDefault();

    await postRole(roleData, {
      showMessage: false,
      onSuccess: () => {
        updateRole(roleData.role);
        messageApi.success(t("updateRole.role_updated_message"))
        // Swal.fire({
        //   icon: "success",
        //   title: t("updateRole.role_updated_title"),
        //   text: t("updateRole.role_updated_message"),
        //   timer: 1800,
        //   showConfirmButton: false,
        // });
        setIsCompleteProfile(false);
        resetRoleForm();
      },
    });
  };
  return (
    <div className="flex flex-col gap-8 ">
      {contextHolder}
      <form onSubmit={handleSubmitRole}>
        <div className="text-center px-6 py-4">
          <LocaleSelect
            id="role"
            label={t("updateRole.select_role")}
            value={roleData.role}
            onChange={handleRoleChange("role")}
            options={[
              { label: t("updateRole.role_consumer"), value: "consumer" },
              { label: t("updateRole.role_company"), value: "company" },
            ]}
            placeholder={t("updateRole.choose_role_placeholder")}
          />

          <div className="flex justify-between items-center gap-3 pt-6">
            <Button type="submit" disabled={!roleData.role || loadingRole}>
              {loadingRole
                ? t("updateRole.updating")
                : t("updateRole.update_role")}
            </Button>

            <Button
              unstyled
              type="button"
              className="text-subTitleColor hover:text-subTitleColor"
            >
              {t("updateRole.cancel")}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateRole;
