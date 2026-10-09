"use client";

import { Button } from "antd";
import {
  Pencil,
  ChevronLeft,
  ChevronRight,
  Link as LinkIcon,
} from "lucide-react";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { ProjectItem, ProjectImage } from "../PortfolioProjectModal";

const tagColors: Record<string, string> = {
  Branding: "bg-[#FFF3D6] text-[#C69214] border-[#F5D88A]",
  Research: "bg-[#FFE6F2] text-[#C94C86] border-[#F3B7D0]",
  QA: "bg-[#E8F0FF] text-[#5A78D1] border-[#C6D5FF]",
  Development: "bg-[#E8F8E8] text-[#4E9E59] border-[#BFE5C5]",
  "Ui / Ux": "bg-[#DFF3EE] text-[#00664F] border-[#B9DDD4]",
  "Front-End": "bg-[#DFF3EE] text-[#00664F] border-[#B9DDD4]",
  "Back-End": "bg-[#DFF3EE] text-[#00664F] border-[#B9DDD4]",
};

type Props = {
  form: ProjectItem;
  visibleThumbs: ProjectImage[];
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onEditFromView?: () => void;
  onDelete: () => void;
};

export default function ViewContent({
  form,
  visibleThumbs,
  canPrev,
  canNext,
  onPrev,
  onNext,
  onEditFromView,
  onDelete,
}: Props) {
  const { t } = useTranslation();
  return (
    <div>
      <div className="mb-5">
        <h2 className="text-[30px] font-semibold text-textColor">{form.title}</h2>

        <div className="mt-4 flex flex-wrap gap-2">
          {form.relatedServices?.map((service) => (
            <span
              key={service}
              className={`rounded-full border px-3 py-1 text-xs font-medium ${
                tagColors[service] || "border-gray-200 bg-gray-50 text-gray-600"
              }`}
            >
              {service}
            </span>
          )) || null}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="mb-2 text-[22px] font-semibold text-textColor">
          {t('serviceMarket.projects.description')} :
        </h3>
        <p className="max-w-6xl text-[15px] leading-7 text-textGrayColor">
          {form.description}
        </p>

        {form.url ? (
          <div className="mt-4 flex items-center gap-2 text-blueSite">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#DFF3EE]">
              <LinkIcon className="h-3.5 w-3.5" />
            </span>
            <a
              href={form.url}
              target="_blank"
              rel="noreferrer"
              className="text-[15px] hover:underline"
            >
              {form.url}
            </a>
          </div>
        ) : null}
      </div>

      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="text-[16px] font-semibold text-textColor">
          {t('serviceMarket.projects.gallery', { count: form.images.length })} :
        </h3>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!canPrev}
            onClick={onPrev}
            className="flex h-7 w-7 items-center justify-center rounded bg-[#DFF3EE] text-blueSite disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            disabled={!canNext}
            onClick={onNext}
            className="flex h-7 w-7 items-center justify-center rounded bg-[#DFF3EE] text-blueSite disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-12 gap-3">
        <div className="col-span-12 md:col-span-5">
          <div className="relative h-[250px] overflow-hidden rounded-md bg-gray-100">
            {form.images[0]?.url ? (
              <Image
                src={form.images[0].url}
                alt={form.images[0].name || form.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-gray-400">
                {t('serviceMarket.projects.noImage')}
              </div>
            )}
          </div>
        </div>

        <div className="col-span-12 grid grid-cols-2 gap-3 md:col-span-7 md:grid-cols-4">
          {visibleThumbs.map((img) => (
            <div
              key={img.uid}
              className="relative h-[118px] overflow-hidden rounded-md bg-gray-100"
            >
              <Image
                src={img.url}
                alt={img.name}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-5">
        <Button
          type="primary"
          icon={<Pencil className="h-4 w-4" />}
          onClick={onEditFromView}
          className="!h-12 !rounded-xl !border-0 !bg-blueSite !px-8 !text-base !font-medium hover:!bg-blueSite/90"
        >
          {t('serviceMarket.projects.editProject')}
        </Button>

        <button
          type="button"
          onClick={onDelete}
          className="text-base font-medium text-red-600 underline underline-offset-4"
        >
          {t('serviceMarket.projects.deleteProject')}
        </button>
      </div>
    </div>
  );
}
