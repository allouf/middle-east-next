import React from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import Image from 'next/image';

interface NoPackagesCreatedProps {
    onCreateFirst: () => void;
}

const NoPackagesCreated = ({ onCreateFirst }: NoPackagesCreatedProps) => {
    const { t } = useTranslation();

    return (
        <div className="mx-auto flex w-full max-w-xl flex-col items-center justify-center px-6 py-16 text-center">
            <div className="relative mb-2 h-72 w-72">
                <Image
                    src="/Margin.png"
                    alt="No packages"
                    fill
                    className="object-contain"
                />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-[#353635]">
                {t("serviceMarket.myServices.plans.noPackagesCreated")}
            </h3>
            <p className="mb-6 max-w-md text-sm leading-6 text-gray-600">
                {t("serviceMarket.myServices.plans.noPackagesDescription")}
            </p>
            <button
                onClick={onCreateFirst}
                className="rounded-lg bg-[#00664F] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#005543]"
            >
                {t("serviceMarket.myServices.plans.createFirstPackage")}
            </button>
        </div>
    );
};

export default NoPackagesCreated;
