import React, { useEffect, useState } from "react";
import useGetData from "@/lib/api/useGetData";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import LoaderPage from "@/components/shared/LoaderPage";
import usePostData from "@/lib/api/usePostData";
import useFormData from "@/lib/Hooks/useFormData";
import {
  myPostUrl,
  profileUrl,
  updateCompanyProfile,
  updateUserProfile,
} from "@/shared/constants/urls";
import { t } from "i18next";

import PostCard from "@/_pages/Community/Components/PostCard";

const AccountSettings = () => {
  const [updateUrl, setUpdateUrl] = useState();
  const [isEditing, setIsEditing] = useState(false);

  const initialFormState = {
    name: "",
    email: "",
    gender: "",
    birthday: "",
  };
  const {
    data: resData,
    loading,
    refetch,
  } = useGetData({
    url: profileUrl,
  });

  const {
    data: myPostData,
    loading: loadingMyPost,
    refetch: refetchMyPost,
  } = useGetData({
    url: myPostUrl,
  });
  console.log("myPostData", myPostData);

  useEffect(() => {
    if (resData?.data?.type === "user") {
      setUpdateUrl(updateUserProfile);
    } else if (resData?.data?.type === "company") {
      setUpdateUrl(updateCompanyProfile);
    }
  }, [resData]);

  const {
    postData: updateUserData,
    loading: loadingPost,
    error,
  } = usePostData(updateUrl);

  const { formData, handleChange, setFormData, resetForm } =
    useFormData(initialFormState);

  const ProfileData = resData?.data?.user || resData?.data?.company;
  console.log("ProfileData", ProfileData);

  useEffect(() => {
    if (ProfileData && !isEditing) {
      setFormData(ProfileData);
    }
  }, [ProfileData, setFormData, isEditing]);

  const handleSave = async (e) => {
    e.preventDefault();
    await updateUserData(formData, {
      onSuccess: () => {
        setIsEditing(false);
        refetch();
      },
    });
  };

  if (loading) return <LoaderPage />;

  const fields = [
    { key: "name", label: t("form.name"), type: "text" },
    { key: "email", label: t("form.email"), type: "email" },
    // {
    //   key: "gender",
    //   label: t("form.gender"),
    //   type: "select",
    //   options: [
    //     { value: "male", label: t("form.gender_options.male") },
    //     { value: "female", label: t("form.gender_options.female") },
    //   ],
    // },
    // { key: "birthday", label: t("form.birthday"), type: "date" },
  ];

  return (
    <section className="mb-10 overflow-y-scroll">
      <h2 className="text-2xl font-bold mb-6">{t("accountDetails")}</h2>

      {!isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <div key={field.key}>
              <p>
                <strong>{field.label}:</strong>{" "}
                {ProfileData?.[field.key] || "N/A"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <div key={field.key}>
              {field.type === "select" ? (
                <>
                  <label className="block mb-1 text-sm font-medium text-subTitleColor">
                    {field.label}
                  </label>
                  <select
                    id={field.key}
                    value={formData[field.key]}
                    onChange={handleChange(field.key)}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blueSite"
                  >
                    <option value="">
                      {t("labels.select")} {field.label}
                    </option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </>
              ) : (
                <InputField
                  id={field.key}
                  label={field.label}
                  type={field.type}
                  value={formData[field.key]}
                  onChange={handleChange(field.key)}
                  required
                />
              )}
            </div>
          ))}
        </form>
      )}

      <div className="mt-6">
        {!isEditing ? (
          <Button
            unstyled
            className="bg-blueBtn text-textWhiteColor py-2 px-4 rounded hover:bg-blueSiteHover"
            onClick={() => {
              setFormData(ProfileData);
              setIsEditing(true);
            }}
          >
            {t("buttons.edit")}
          </Button>
        ) : (
          <div className="w-full flex items-center justify-between">
            <Button
              unstyled
              className="bg-gray-500 text-textWhiteColor py-2 px-4 rounded hover:bg-gray-600"
              onClick={() => setIsEditing(false)}
            >
              {t("buttons.cancel")}
            </Button>
            <Button
              unstyled
              className="bg-blueBtn text-textWhiteColor py-2 px-4 rounded hover:bg-blueSiteHover"
              onClick={handleSave}
            >
              {loadingPost ? t("buttons.saveing") : t("buttons.save")}
            </Button>
          </div>
        )}
      </div>

      {myPostData?.data?.data.map((post) => (
        <PostCard key={post?.id || post?.title} post={post} />
      ))}
    </section>
  );
};

export default AccountSettings;
