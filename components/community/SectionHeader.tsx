import { t } from "i18next";
import Button from "./../ui/Button";

const SectionHeader = ({ title, link, translationKey }) => {
  
  return (
    <div className="flex justify-between mb-2">
      <h3 className="text-blue-900 font-bold">{title}</h3>
      <Button unstyled className="text-sm text-textColor hover:underline" to={link}>
        {t("community.sideBarRight.groupList.seeAll")}
      </Button>
    </div>
  );
};

export default SectionHeader;