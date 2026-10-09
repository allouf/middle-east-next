import React, { useState, useEffect } from "react";
import useGetData from "@/lib/api/useGetData";
import usePostData from "../../../../lib/api/usePostData";
import useFormData from "../../../../lib/Hooks/useFormData";
import { STORE_ENDPOINT } from "@/shared/constants/urls";
import LoaderPage from "../../../../components/shared/LoaderPage";
import ErrorWithRetry from "../../../../components/ui/ErrorWithRetry";
import { useAlert } from "@/lib/context/AlertProvider";
import InputField from "../../../../components/ui/InputField";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useParams } from "next/navigation";

interface StorePoliciesProps {
  type?: "shipping" | "return";
}

const StorePolicies = ({ type = "shipping" }: StorePoliciesProps) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { message } = useAlert();

  /** Fetch policy data */
  const {
    data: resData,
    loading,
    error,
    refetch,
  } = useGetData({
    url: STORE_ENDPOINT.storePolicies(id as string, type),
  });

  /** Initialize form data with store_id + type */
  const initialFormState = {
    store_id: id,
    type,
    content: "",
  };
  const { formData, handleChange, setFormData, resetForm } =
    useFormData(initialFormState);
  const { postData, loading: updating } = usePostData(
    STORE_ENDPOINT.updateStorePolicy
  );
  const [isEditing, setIsEditing] = useState(false);

  /** When data fetched, update form content */
  useEffect(() => {
    if (resData?.data) {
      const policy = resData.data;
      setFormData({
        store_id: id,
        type,
        content: policy.content || "",
      });
    }
  }, [resData, id, type, setFormData]);

  if (loading) return <LoaderPage />;
  if (error) return <ErrorWithRetry onRetry={refetch} />;

  const policy = resData?.data;

  // If no policy exists yet, we still might want to allow editing/creating it?
  // But original code showed "No policy" message. 
  // Let's keep original behavior for now but maybe allow creating if the backend supports it via update?
  // Assuming "updateStorePolicy" creates if not exists or similar logic, but for now sticking to safe refactor.

  if (!policy && !isEditing) {
    // If no policy, maybe we want to allow adding one? 
    // The original code returned:
    // return (
    //   <div className="text-center py-10 text-textColor">
    //     {t("policies.noPolicy")}
    //   </div>
    // );
    // But if we want to add one, we should probably show the form or an "Add" button.
    // user's design image shows tabs. If empty, maybe show empty state with "Edit/Add"?
    // For now, let's keep it close to original but maybe allow editing if empty?
    // Actually, let's stick to EXACT behavior of original for now to avoid breaking changes, 
    // unless the "Edit" button was outside the !policy check?
    // In original code:
    // const policy = resData?.data;
    // if (!policy) { return ... }
    // So if no policy, you couldn't edit. I will preserve this.
    return (
      <div className="text-center py-10 text-textColor">
        {t("policies.noPolicy")}
        {/* Potentially add button to create here in future */}
      </div>
    );
  }

  /** Handle Edit Mode */
  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setIsEditing(false);
    resetForm();
  };

  /** Submit form */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content.trim()) {
      message.error(t("policies.emptyContent"));
      return;
    }
    const res = await postData(formData);
    if (res?.status) {
      message.success(t("policies.updateSuccess"));
      setIsEditing(false);
      refetch();
    } else {
      message.error(res?.message || t("policies.updateFail"));
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-xl p-6 max-w-3xl mx-auto mt-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold text-subTitleColor capitalize">
          {/* Use dynamic title based on type if policy is null/undefined? 
               But we returned early if !policy. So policy is defined here. */}
          {t("policies.title", { type: type })}
        </h2>
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="px-4 py-1.5 bg-blueBtn text-textWhiteColor rounded-lg hover:bg-blueSiteHover text-sm"
          >
            {t("common.edit")}
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <InputField
            id="content"
            type="textarea"
            unstyled
            value={formData.content}
            onChange={handleChange("content")}
            rows={6}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blueSite focus:outline-none text-subTitleColor"
          />
          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={updating}
              className="px-4 py-2 bg-green-600 text-textWhiteColor rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {updating ? t("common.saving") : t("common.save")}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-subTitleColor rounded-lg hover:bg-gray-400"
            >
              {t("common.cancel")}
            </button>
          </div>
        </form>
      ) : (
        <>
          <p className="text-subTitleColor whitespace-pre-line leading-relaxed">
            {policy?.content}
          </p>
          <div className="mt-4 text-sm text-textColor">
            <p>
              {t("policies.createdAt")}:{" "}
              {new Date(policy?.created_at).toLocaleString()}
            </p>
            <p>
              {t("policies.updatedAt")}:{" "}
              {new Date(policy?.updated_at).toLocaleString()}
            </p>
          </div>
        </>
      )}
    </div>
  );
};
export default StorePolicies;
