"use client";

import { useEffect, useState } from "react";
import SelectField from "@/components/ui/SelectFiled";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Clock } from "lucide-react";
import { boostCampaignService } from "../../../../services/boostCampaign.service";
import { ServiceOffer } from "../../types/boostCampaign.types";

interface MainFormFieldsProps {
  form: {
    service?: string;
    date?: string;
  };
  onChange: (key: keyof MainFormFieldsProps["form"], value: any) => void;
  onServiceSelect?: (service: ServiceOffer | null) => void;
  selectedPlan?: {
    duration_days: number;
  };
}

export default function MainFormFields({ form, onChange, onServiceSelect, selectedPlan }: MainFormFieldsProps) {
  const { t } = useTranslation();
  const [services, setServices] = useState<ServiceOffer[]>([]);
  const [loading, setLoading] = useState(false);

  const calculateDeadline = () => {
    if (selectedPlan?.duration_days) {
      const today = new Date();
      const endDate = new Date();
      endDate.setDate(today.getDate() + selectedPlan.duration_days);
      
      const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
      };
      
      return ` ${formatDate(endDate)}`;
    }
    return form.date;
  };

  const deadlineValue = calculateDeadline();

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const response = await boostCampaignService.getServiceOffers(
          { status: "active" },
          { showMessage: false }
        );
        if (response?.data?.offers) {
          setServices(response.data.offers);
        }
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleServiceChange = (v: any) => {
    const serviceId = v?.target?.value ?? null;
    onChange("service", serviceId);
    
    const selectedService = services.find(s => String(s.id) === String(serviceId)) || null;
    onServiceSelect?.(selectedService);
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="flex-1 space-y-2">
        <p className="text-sm font-semibold text-subTitleColor">
          {t("serviceMarket.boostCampaign.create.selectService", { defaultValue: "Select Service" })}
        </p>
        <div className="rounded-md border border-grayBorder bg-white px-4 py-3 shadow-sm shadow-transparent transition duration-200 hover:border-lightGreen/80 hover:shadow-[0_10px_25px_rgba(0,0,0,0.05)]">
          <SelectField
            id="boost-service"
            label={t("serviceMarket.boostCampaign.create.service", { defaultValue: "Service" })}
            value={form.service ?? null}
            onChange={handleServiceChange}
            selectorOptions={services.map(s => ({ id: s.id, name: s.title }))}
            unstyled
            hideLable
            placeholder={loading ? t("common.loading", { defaultValue: "Loading..." }) : t("serviceMarket.boostCampaign.create.servicePlaceholder", { defaultValue: "Select a service" })}
            disabled={loading}
          />
        </div>
      </div>

      <div className="flex items-center justify-start md:justify-end w-full md:w-auto mt-5 py-4 ">
        <div className="flex items-center gap-3 rounded-md border border-lightGreen bg-[#004B4033] px-5 py-4  text-sm text-[#0F172A]">
          <Clock size={18} className="text-lightGreen" />
          <p className="font-medium text-[#0F172A]">
            {t("serviceMarket.boostCampaign.create.deadlineInfo", {
              defaultValue: `The deadline will be ${deadlineValue}`,
              deadline: deadlineValue,
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
