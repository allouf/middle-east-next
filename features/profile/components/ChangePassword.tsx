import { t } from "i18next";

const ChangePassword = () => {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">{t("password")}</h2>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-2">
          <label className="block mb-1 text-sm font-medium text-subTitleColor">
            {t("oldPassword")}
          </label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blueSite"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-subTitleColor">
            {t("newPassword")}
          </label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blueSite"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-subTitleColor">
            {t("rNewPassword")}
          </label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blueSite"
          />
        </div>
      </form>
      <div className="mt-6">
        <button className="bg-blueBtn text-textWhiteColor py-2 px-4 rounded hover:bg-blueSiteHover">
          Save changes
        </button>
      </div>
    </section>
  );
};

export default ChangePassword;
