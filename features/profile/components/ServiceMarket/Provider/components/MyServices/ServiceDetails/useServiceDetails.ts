"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useLocaleDirection } from '@/lib/i18n/useLocaleDirection';
import { useProviderServicesApi } from '../../../hooks/Service/useProviderServicesApi';
import { useProviderService } from '../../../hooks/Service/useProviderService';
import { ServiceOffer, ApiResponse } from '../../../types/provider.types';
import { useServiceDataStore } from '../../../../stores';

interface UseServiceDetailsProps {
    offerId: number;
}

export function useServiceDetails({ offerId }: UseServiceDetailsProps) {
    const { t } = useTranslation();
    const { isRTL } = useLocaleDirection();
    const [activeTab, setActiveTab] = useState('overview');
    const [offer, setOffer] = useState<ServiceOffer | null>(null);
    const [triggerEdit, setTriggerEdit] = useState(false);
    const [triggerAddPackage, setTriggerAddPackage] = useState(false);

    const { fetchServiceById, loading, error } = useProviderServicesApi();
    const { 
        overviewRefetchTrigger,
        plansRefetchTrigger, 
        faqRefetchTrigger, 
        availabilityRefetchTrigger,
        setCurrentService,
        triggerOverviewRefetch,
        triggerPlansRefetch,
        triggerFaqRefetch,
        triggerAvailabilityRefetch
    } = useServiceDataStore();

    // Memoize initial data to prevent infinite re-renders
    const initialFormData = useMemo(() => {
        if (!offer) return undefined;
        return {
            title: offer.title,
            service_category_id: offer.service_category_id?.toString(),
            type: offer.type,
            delivery_model: offer.delivery_model,
            description: offer.description,
            is_active: offer.is_active?.toString(),
            sort_order: offer.sort_order?.toString(),
            plans: offer.plans?.map(plan => ({
                title: plan.title,
                price: plan.price?.toString(),
                currency: plan.currency,
                delivery_time_value: plan.delivery_time_value?.toString(),
                delivery_time_unit: plan.delivery_time_unit,
                revision_window: plan.revision_window,
                revision_scope_rules: plan.revision_scope_rules,
                number_of_revisions: plan.number_of_revisions?.toString(),
            })) || [],
            faqs: offer.faqs || [],
            available_slots: offer.available_slots || [],
            cover: null,
            media: [],
        };
    }, [offer]);

    // Memoize onSuccess callback to prevent infinite re-renders
    const handleProviderServiceSuccess = useCallback(() => {
        fetchServiceById(offerId, { showMessage: false });
    }, [offerId, fetchServiceById]);

    // Use centralized provider service hook for all form operations
    const providerService = useProviderService({
        initial: initialFormData,
        onSuccess: handleProviderServiceSuccess
    });

    // Simple submit handler that delegates to useProviderService
    const handleSubmit = useCallback(async (tabType: 'overview' | 'packages' | 'faq' | 'availability', formData: any) => {
        let result;
        
        // Use the specific submit function for each tab type
        switch (tabType) {
            case 'overview':
                result = await providerService.submitOverview(offerId, formData);
                break;
            case 'packages':
                result = await providerService.submitPackage(offerId, formData);
                break;
            case 'faq':
                result = await providerService.submitFAQ(offerId, formData);
                break;
            case 'availability':
                result = await providerService.submitAvailability(offerId, formData);
                break;
            default:
                return { ok: false as const, error: "Unknown tab type" };
        }
        
        // Trigger refetch for the specific tab after successful update
        if (result?.ok) {
            switch (tabType) {
                case 'overview':
                    triggerOverviewRefetch();
                    break;
                case 'packages':
                    triggerPlansRefetch();
                    break;
                case 'faq':
                    triggerFaqRefetch();
                    break;
                case 'availability':
                    triggerAvailabilityRefetch();
                    break;
            }
        }
        
        return result;
    }, [offerId, providerService, triggerOverviewRefetch, triggerPlansRefetch, triggerFaqRefetch, triggerAvailabilityRefetch]);

    // Fetch service on mount
    useEffect(() => {
        if (offerId) {
            fetchServiceById(offerId, {
                onSuccess: (response: ApiResponse<ServiceOffer>) => {
                    if (response.data) {
                        setOffer(response.data);
                        setCurrentService(response.data);
                    }
                },
                showMessage: false,
            });
        }
    }, [offerId, fetchServiceById, setCurrentService]);

    // Listen for refetch triggers
    useEffect(() => {
        if (offerId && offer) {
            fetchServiceById(offerId, {
                onSuccess: (response: ApiResponse<ServiceOffer>) => {
                    if (response.data) {
                        setOffer(response.data);
                        setCurrentService(response.data);
                    }
                },
                showMessage: false,
            });
        }
    }, [overviewRefetchTrigger, plansRefetchTrigger, faqRefetchTrigger, availabilityRefetchTrigger]);

    const handleEdit = useCallback(() => {
        setTriggerEdit(true);
        // Reset trigger after a brief moment to allow re-triggering
        setTimeout(() => setTriggerEdit(false), 100);
    }, []);

    const handleAddPackage = useCallback(() => {
        setTriggerAddPackage(true);
        // Reset trigger after a brief moment to allow re-triggering
        setTimeout(() => setTriggerAddPackage(false), 100);
    }, []);

    // Get translated label for each tab
    const getTabLabel = useCallback((tabKey: string) => {
        switch (tabKey) {
            case 'overview':
                return t("serviceMarket.myServices.steps.serviceOverview");
            case 'packages':
                return t("serviceMarket.myServices.steps.servicePackages");
            case 'faq':
                return t("serviceMarket.myServices.steps.faqs");
            case 'availability':
                return t("serviceMarket.myServices.steps.availability");
            case 'reviews':
                return t("serviceMarket.myServices.steps.customerReviews");
            case 'orders':
                return t("serviceMarket.myServices.steps.orders");
            default:
                return tabKey.toUpperCase();
        }
    }, [t]);

    // Get tab config for each tab type
    const getTabConfig = useCallback((key: string) => {
        switch (key) {
            case 'overview':
                return {
                    title: t("serviceMarket.myServices.details.serviceOverview"),
                    subtitle: t("serviceMarket.myServices.details.serviceOverviewDescription"),
                    actionText: t("serviceMarket.myServices.details.editInformation"),
                    onAction: handleEdit,
                };
            case 'faq':
                return {
                    title: t("serviceMarket.myServices.details.frequentlyAskedQuestions"),
                    subtitle: t("serviceMarket.myServices.details.faqDescription"),
                    actionText: t("serviceMarket.myServices.details.addFaq"),
                    onAction: handleEdit,
                };
            case 'packages':
                return {
                    title: t("serviceMarket.myServices.details.servicePackages"),
                    subtitle: t("serviceMarket.myServices.details.packagesDescription"),
                    actionText: t("serviceMarket.myServices.plans.addPackage"),
                    onAction: handleAddPackage,
                };
            case 'availability':
                return {
                    title: t("serviceMarket.myServices.details.availabilitySchedule"),
                    subtitle: t("serviceMarket.myServices.details.availabilityDescription"),
                    actionText: t("serviceMarket.myServices.details.tabs.availability.addSlot"),
                    onAction: handleEdit,
                };
            case 'reviews':
                return {
                    title: t("serviceMarket.myServices.details.customerReviews"),
                    subtitle: t("serviceMarket.myServices.details.reviewsDescription"),
                    sortByText: t("serviceMarket.myServices.details.sortBy"),
                    highestRateText: t("serviceMarket.myServices.details.highestRate"),
                };
            case 'orders':
                return {
                    comingSoonText: t("serviceMarket.myServices.details.ordersComingSoon"),
                };
            default:
                return {};
        }
    }, [t, handleEdit, handleAddPackage]);

    return {
        // State
        activeTab,
        setActiveTab,
        offer,
        triggerEdit,
        triggerAddPackage,
        loading,
        error,
        isRTL,
        
        // Handlers
        handleSubmit,
        handleEdit,
        handleAddPackage,
        
        // Tab helpers
        getTabLabel,
        getTabConfig,
        
        // Translations
        t,
    };
}
