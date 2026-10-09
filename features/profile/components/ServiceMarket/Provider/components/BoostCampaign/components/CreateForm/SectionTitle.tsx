import { useTranslation } from "@/lib/i18n/useTranslation";
import { useLocaleDirection } from "@/lib/i18n/useLocaleDirection";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";

interface SectionTitleProps {
  title?: string;
  description?: string;
  onBack?: () => void;
}

export default function SectionTitle({ title, description, onBack }: SectionTitleProps) {
  const { t } = useTranslation();
  const { dir } = useLocaleDirection();

  return (
    <div className="relative mb-5 sm:mb-6">
      {onBack && (
        <button
          onClick={onBack}
          className={`absolute top-0 flex items-center text-blueSite  hover:text-[#0D5F52] transition-colors cursor-pointer ${dir === "rtl" ? "right-0" : "left-0"}`}
        >
          {dir === "rtl" ? <ArrowRight className="w-5 h-5 ml-2" /> : <ArrowLeft className="w-5 h-5 mr-2" />}
          {t("common.goBack", { defaultValue: "GO BACK" })}
        </button>
      )}
      <div className="flex flex-col items-center justify-center text-center pt-8">
        {/* <div className="bg-[#D7E7E4] rounded-lg p-3 mb-4"> */}
          <Image src="/Megaphone.png" alt="Megaphone" width={64} height={64} />
        {/* </div> */}
        <h2 className="text-4xl font-bold text-blueSite mb-2">
          {title || t("serviceMarket.boostCampaign.create.title", { defaultValue: "Create New Boost" })}
        </h2>
        <p className="text-blueSite text-lg max-w-3xl">
          {description || t("serviceMarket.boostCampaign.create.subtitle", { defaultValue: "Select a tailored visibility plan to connect with patients seeking your specific expertise." })}
        </p>
      </div>
    </div>
  );
}
