'use client';

import Link from "next/link";
import React from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface BreadcrumbProps {
  product: any;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ product }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2 sm:text-sm text-[12px] text-subTitleColor mb-6">
      <Link href={"/"} className="hover:text-blueSiteHover cursor-pointer">{t('nav.home')}</Link>


      {product.category?.id && <>
        <span>/</span>
        <Link href={`/categories?category=${product.category?.id}`} className="hover:text-blueSiteHover cursor-pointer">
          {product.category?.name || t('breadcrumb.category')}
        </Link>
      </>}

      <span>/</span>
      <span className="font-medium text-subTitleColor truncate max-w-xs">
        {product.name}
      </span>
    </div>
  );
};

export default Breadcrumb;
