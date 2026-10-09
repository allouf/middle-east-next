import React from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import InputField from "@/components/ui/InputField";
import SelectFiled from "@/components/ui/SelectFiled";
import MultiImageUpload from "@/components/ui/MultiImageUpload";


type Option = {
  label: string;
  value: string;
};

type BasicInfoStepProps = {
  form: {
    title: string;
    service_category_id: string;
    type: string;
    delivery_model: string;
    description: string;
    cover: File | { id: number; url: string } | null;
    media: { file: File | { id: number; url: string } | null; sort_order: string }[];
  };
  serviceForm: any;
  serviceTypeOptions: Option[];
  deliveryModelOptions: Option[];
  isSubmitted: boolean;
};

export default function BasicInfoStep({ 
  form, 
  serviceForm, 
  serviceTypeOptions, 
  deliveryModelOptions,
  isSubmitted
}: BasicInfoStepProps) {
  const { t } = useTranslation();
  return (
    <div>
      {/* <div className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          <span className="inline-block h-12 w-1 rounded-full bg-blueSite" />
          <h2 className="text-[34px] font-bold leading-none text-blueSite">
            {t('serviceMarket.myServices.basicInfo.sectionTitle')}
          </h2>
        </div>
        <p className="ps-4 text-[22px] text-textGrayColor">
          {t('serviceMarket.myServices.basicInfo.sectionDescription')}
        </p>
      </div> */}

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1.1fr]">
          <div className="space-y-5">
            <InputField
              id="title"
              label={t('serviceMarket.myServices.basicInfo.title')}
              placeholder={t('serviceMarket.myServices.basicInfo.titlePlaceholder')}
              value={form.title}
              onChange={serviceForm.handleChange("title")}
              withFieldset
              validate
              required
              isSubmited={isSubmitted}
            />

            <SelectFiled
              id="category"
              label={t('serviceMarket.myServices.basicInfo.category')}
              onChange={serviceForm.handleChange("service_category_id")}
              value={form.service_category_id || null}
              url="/service-categories"
              placeholder={t('serviceMarket.myServices.basicInfo.categoryPlaceholder')}
              withFieldset
              validate
              required
              isSubmited={isSubmitted}
            />

            <SelectFiled
              id="serviceType"
              label={t('serviceMarket.myServices.basicInfo.serviceType')}
              onChange={serviceForm.handleChange("type")}
              value={form.type || null}
              selectorOptions={serviceTypeOptions.map(opt => ({ id: opt.value, name: opt.label }))}
              placeholder={t('serviceMarket.myServices.basicInfo.serviceTypePlaceholder')}
              withFieldset
              validate
              required
              isSubmited={isSubmitted}
            />

            <SelectFiled
              id="deliveryModel"
              label={t('serviceMarket.myServices.basicInfo.deliveryModel')}
              onChange={serviceForm.handleChange("delivery_model")}
              value={form.delivery_model || null}
              selectorOptions={deliveryModelOptions.map(opt => ({ id: opt.value, name: opt.label }))}
              placeholder={t('serviceMarket.myServices.basicInfo.deliveryModelPlaceholder')}
              withFieldset
              validate
              required
              isSubmited={isSubmitted}
            />

            <div className="space-y-4">
              <div className="rounded-2xl bg-white">
                <MultiImageUpload
                  id="coverService"
                  label= {t('serviceMarket.myServices.basicInfo.coverService')}
                  value={form.cover && form.cover instanceof File ? [form.cover] : []}
                  onImagesChange={(images: File[]) => 
                    serviceForm.setCover(images[0] || null)
                  }
                  oldImages={form.cover && !(form.cover instanceof File) ? [{
                    id: form.cover.id,
                    url: form.cover.url
                  }] : []}
                  handleDeleteOldImg={() => serviceForm.setCover(null)}
                  withFieldset
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-white">
                <MultiImageUpload
                  id="mediaService"
                  label= {t('serviceMarket.myServices.basicInfo.serviceMedia')}
                  value={form.media?.filter(m => m.file !== null && m.file instanceof File).map(m => m.file as File) || []}
                  onImagesChange={(images: File[]) => {
                    const existingOldMedia = form.media?.filter(
                      (m) => m.file !== null && !(m.file instanceof File)
                    ) || [];
                    const nextMedia = [
                      ...existingOldMedia,
                      ...images.map((file, index) => ({
                        file,
                        sort_order: (existingOldMedia.length + index).toString(),
                      })),
                    ];
                    serviceForm.setMedia(nextMedia);
                  }}
                  oldImages={form.media?.filter(m => m.file !== null && !(m.file instanceof File)).map(m => ({
                    id: (m.file as any)?.id,
                    url: (m.file as any)?.url
                  })) || []}
                  handleDeleteOldImg={(id) => {
                    serviceForm.setMedia(
                      form.media?.filter((m) => {
                        if (m.file === null || m.file instanceof File) return true;
                        return (m.file as any)?.id !== id;
                      }) || []
                    );
                  }}
                  withFieldset
                />
              </div>
            </div>
          </div>

          <div>
            <InputField
              id="description"
              label={t('serviceMarket.myServices.basicInfo.serviceDescription')}
              placeholder={t('serviceMarket.myServices.basicInfo.descriptionPlaceholder')}
              value={form.description}
              onChange={serviceForm.handleChange("description")}
              type="textarea"
              rows={18}
              withFieldset
              validate
              required
              isSubmited={isSubmitted}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
