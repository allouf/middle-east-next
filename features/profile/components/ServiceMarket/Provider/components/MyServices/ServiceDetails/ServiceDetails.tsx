"use client";

import React, { useMemo } from 'react';
import { Spin, Tabs } from 'antd';
import { ChevronLeft, ChevronRight, Edit3 } from 'lucide-react';
import { useServiceDetails } from './useServiceDetails';
import HeaderButton from './components/Shared/HeaderButton';
import OverviewTab from './components/Overview';
import PackagesTab from './components/Packages';
import FAQTab from './components/FAQ';
import AvailabilityTab from './components/Availability';
import ReviewsTab from './components/Reviews';
import ExpandableText from './components/ExpandableText';
import './ServiceDetails.css';

type Props = {
    offerId: number;
    onBack: () => void;
};

export default function ServiceDetails({ offerId, onBack }: Props) {
    const {
        activeTab,
        setActiveTab,
        offer,
        triggerEdit,
        triggerAddPackage,
        loading,
        error,
        isRTL,
        handleSubmit,
        handleEdit,
        handleAddPackage,
        getTabLabel,
        getTabConfig,
        t,
    } = useServiceDetails({ offerId });

    const items = useMemo(() => {
        const getTabContent = (key: string) => {
            const config = getTabConfig(key);
            const hasPackages = Array.isArray(offer?.plans) && offer.plans.length > 0;
            const shouldHideHeader = key === 'packages' && !hasPackages;
            let actionBtn = null;
            let content = null;

            if (key === 'overview') {
                actionBtn = <HeaderButton icon={<Edit3 size={15} />} text={config.actionText ?? ''} variant="primary" onClick={config.onAction} />;
                content = <OverviewTab offer={offer || null} onSubmit={(formData) => handleSubmit('overview', formData)} triggerEdit={triggerEdit} />;
            } else if (key === 'faq') {
                actionBtn = <HeaderButton icon={<Edit3 size={15} />} text={config.actionText ?? ''} variant="primary" onClick={config.onAction} />;
                content = <FAQTab offer={offer || null} onSubmit={(formData) => handleSubmit('faq', formData)} triggerEdit={triggerEdit} />;
            } else if (key === 'packages') {
                actionBtn = hasPackages
                    ? <HeaderButton icon={<Edit3 size={15} />} text={config.actionText ?? ''} variant="primary" onClick={config.onAction} />
                    : null;
                content = <PackagesTab offer={offer || null} onSubmit={(formData) => handleSubmit('packages', formData)} triggerEdit={triggerEdit} triggerAddPackage={triggerAddPackage} />;
            } else if (key === 'availability') {
                actionBtn = <HeaderButton icon={<Edit3 size={15} />} text={config.actionText ?? ''} variant="primary" onClick={config.onAction} />;
                content = <AvailabilityTab offer={offer || null} onSubmit={(formData) => handleSubmit('availability', formData)} triggerEdit={triggerEdit} />;
            } else if (key === 'reviews') {
                actionBtn = (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-textColor">{config.sortByText}</span>
                        <select className="border border-[#E9E9E9] rounded-md px-3 py-1.5 text-sm outline-none text-[#353635]">
                            <option>{config.highestRateText}</option>
                        </select>
                    </div>
                );
                content = <ReviewsTab offer={offer || null} />;
            } else if (key === 'orders') {
                content = <div className="p-8 text-center text-gray-500">{config.comingSoonText}</div>;
            }

            return {
                key,
                label: getTabLabel(key),
                children: (
                    <div className="animate-in fade-in duration-300">
                        {key !== 'orders' && !shouldHideHeader && (
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex flex-col gap-1">
                                    <h2 className="text-lg font-medium text-[#353635]">{config.title}</h2>
                                    <p className="text-sm text-gray-400">{config.subtitle}</p>
                                </div>
                                {actionBtn}
                            </div>
                        )}
                        {content}
                    </div>
                )
            };
        };

        return [
            getTabContent('overview'),
            getTabContent('packages'),
            getTabContent('faq'),
            getTabContent('availability'),
            getTabContent('reviews'),
            getTabContent('orders')
        ];
    }, [offer, handleSubmit, handleEdit, handleAddPackage, triggerEdit, triggerAddPackage, getTabLabel, getTabConfig]);

    if (loading) return (
        <div className="flex flex-col flex-1 h-full items-center justify-center min-h-[50vh]">
            <Spin size="large" />
        </div>
    );

    if (error || !offer) return (
        <div className="p-4 text-red-500">{t("common.errorLoading", { defaultValue: "Error loading details." })}</div>
    );

    return (
        <div className="bg-white rounded-xl p-8 -mt-2">
            <div className="mb-6 pb-6   space-y-4">
                <button
                    onClick={onBack}
                    className="flex items-center text-[#00664F] hover:underline font-medium text-[13px] mb-8"
                >
                    {isRTL ? (
                        <ChevronRight className="w-4 h-4 mr-0.5" />
                    ) : (
                        <ChevronLeft className="w-4 h-4 mr-0.5" />
                    )}
                    {t("serviceMarket.myServices.details.goBack")}
                </button>
                <h1 className="text-2xl md:text-3xl font-bold text-[#14264A] mb-8 max-w-2xl leading-tight">
                    <ExpandableText
                        text={offer.title || t("serviceMarket.myServices.details.serviceTitle")}
                        maxLength={100}
                        as="span"
                    />
                </h1>

                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={items}
                    className="service-details-tabs space-y-4"
                />
            </div>
        </div>
    );
}
