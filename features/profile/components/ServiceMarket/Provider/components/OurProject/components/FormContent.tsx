"use client";

import type { UploadFile } from "antd/es/upload/interface";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { ProjectItem } from "../PortfolioProjectModal";
import { ProjectFormErrors } from "../../../types";
import InputField from "@/components/ui/InputField";
import MultiSelectFieldWithSearch from "@/components/ui/MultiSelectFieldWithSearch";
import MultiImageUpload from "@/components/ui/MultiImageUpload";
import Button from "@/components/ui/Button";
import { useServiceOffersApi } from "../../../hooks/ServiceOffers/useServiceOffersApi";

type Props = {
  title: string;
  isEdit: boolean;
  isSubmited: boolean,
  loading: boolean,
  errors: ProjectFormErrors,
  form: ProjectItem;
  fileList: UploadFile[];
  onChangeField: (key: keyof ProjectItem, value: any) => void;
  onCancel: () => void;
  onSubmit: () => void;
};

export default function FormContent({
  title,
  isEdit,
  form,
  fileList,
  onChangeField,
  onCancel,
  onSubmit,
  isSubmited,
  loading,
  errors,
}: Props) {
  const { t } = useTranslation();
  return (
    <div>
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          <span className="inline-block h-12 w-1 rounded-full bg-blueSite" />
          <h2 className="text-[34px] font-bold leading-none text-blueSite">
            {title}
          </h2>
        </div>
        <p className="ps-4 text-[22px] text-textGrayColor">
          {isEdit
            ? t('serviceMarket.projects.updatePortfolioEntry')
            : t('serviceMarket.projects.createPortfolioEntry')}
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <InputField
            id="title"
            label={t('serviceMarket.projects.title')}
            value={form.title}
            onChange={(e) => {
              if (e && typeof e === 'object' && 'target' in e && e.target) {
                const target = e.target as HTMLInputElement;
                onChangeField("title", target.value);
              } else if (typeof e === 'string') {
                onChangeField("title", e);
              }
            }}
            placeholder={t('serviceMarket.projects.titlePlaceholder')}
            withFieldset
            required
            isSubmited={isSubmited}
            error={errors.title}
          />

          <InputField
            id="url"
            label={t('serviceMarket.projects.urlOptional')}
            value={form.url}
            onChange={(e) => {
              if (e && typeof e === 'object' && 'target' in e && e.target) {
                const target = e.target as HTMLInputElement;
                onChangeField("url", target.value);
              } else if (typeof e === 'string') {
                onChangeField("url", e);
              }
            }}
            placeholder={t('serviceMarket.projects.urlPlaceholder')}
            withFieldset
            type="url"
            isSubmited={isSubmited}
            error={errors.url}
          />

          <InputField
            id="sort_order"
            label={t('serviceMarket.projects.sortOrder')}
            value={form.sort_order ? Number(form.sort_order) : 1}
            onChange={(e) => {
              if (e && typeof e === 'object' && 'target' in e && e.target) {
                const target = e.target as HTMLInputElement;
                onChangeField("sort_order", target.value);
              } else if (typeof e === 'string') {
                onChangeField("sort_order", e);
              } else if (typeof e === 'number') {
                onChangeField("sort_order", e.toString());
              }
            }}
            placeholder={t('serviceMarket.projects.sortOrderPlaceholder')}
            withFieldset
            type="number"
            min={0}
            max={9999}
            isSubmited={isSubmited}
            error={errors.sort_order}
          />
        </div>

        <InputField
          id="description"
          label={t('serviceMarket.projects.description')}
          value={form.description}
          onChange={(e) => {
            if (e && typeof e === 'object' && 'target' in e && e.target) {
              const target = e.target as HTMLTextAreaElement;
              onChangeField("description", target.value);
            } else if (typeof e === 'string') {
              onChangeField("description", e);
            }
          }}
          placeholder={t('serviceMarket.projects.descriptionPlaceholder')}
          withFieldset
          type="textarea"
          rows={4}
          required
          isSubmited={isSubmited}
          error={errors.description}
        />

        <div className="space-y-4">
          <label className="block text-sm font-medium text-textGrayColor">
            {t('serviceMarket.projects.images')}
          </label>
          <div className="rounded-2xl bg-white">
            <MultiImageUpload
              id="images"
              label=""
              defaultImages={fileList.filter(file => !file.originFileObj).map(file => ({
                url: file.url,
                file_path: file.url
              }))}
              value={fileList
                .filter(file => file.originFileObj instanceof File)
                .map(file => file.originFileObj)}
              onImagesChange={(files) => {
                const uploadFiles = files.map((file, index) => ({
                  uid: `-${Date.now()}-${index}`,
                  name: file instanceof File ? file.name : file,
                  status: 'done' as const,
                  originFileObj: file instanceof File ? file : undefined,
                }));

                onChangeField("images", files);
              }}
              // acceptedTypes={['.png', '.jpg', '.jpeg']}
              withFieldset
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl  bg-white">
            <MultiSelectFieldWithSearch
              label={t('serviceMarket.projects.relatedServices')}
              id="relatedServices"
              values={form.service_offer_ids}
              onChange={(value) => onChangeField("service_offer_ids", value)}
              url="/service-offers"
              enabled={true}
              required={false}
              validate={false}
              isSubmited={isSubmited}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Button
            onClick={onSubmit}
            disabled={loading}
            className="!h-12 !px-10 !text-base !font-semibold"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {isEdit ? t('serviceMarket.projects.saving') : t('serviceMarket.projects.adding')}
              </div>
            ) : (
              <>
                {isEdit ? t('serviceMarket.projects.saveChanges') : t('serviceMarket.projects.addProject')}
              </>
            )}
          </Button>

          <button
            type="button"
            onClick={onCancel}
            className="text-lg font-medium text-textColor underline underline-offset-4"
          >
            {t('serviceMarket.projects.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
}
