"use client";

import { useCallback } from 'react';
import { ServiceOffer } from '../../../../../types/provider.types';
import { usePlanApi } from '../../../../../hooks/Service/usePlanApi';
import { usePackageForm, PackageFormState } from '../../../../../hooks/Service/usePackageForm';
import { useServiceDataStore } from '@/features/profile/components/ServiceMarket/stores';

interface Package {
    id: string;
    title: string;
    price: string;
    currency: string;
    delivery_time_value: string;
    delivery_time_unit: string;
    revision_window: string;
    revision_scope_rules: string;
    number_of_revisions: string;
}


interface UsePackageOperationsProps {
    offer: ServiceOffer | null;
    onSuccess?: () => void;
}

// Helper function to build FormData for a single package
const buildPackageFormData = (pkg: Package): FormData => {
    const fd = new FormData();
    fd.append('title', pkg.title || '');
    fd.append('price', pkg.price || '');
    fd.append('currency', pkg.currency || '');
    fd.append('delivery_time_value', pkg.delivery_time_value || '');
    fd.append('delivery_time_unit', pkg.delivery_time_unit || '');
    fd.append('revision_window', pkg.revision_window || '');
    fd.append('revision_scope_rules', pkg.revision_scope_rules || '');
    fd.append('number_of_revisions', pkg.number_of_revisions || '');
    return fd;
};

// Helper function to convert Package to PackageFormState
const packageToFormState = (pkg: Package): PackageFormState => ({
    title: pkg.title,
    price: pkg.price,
    currency: pkg.currency,
    delivery_time_value: pkg.delivery_time_value,
    delivery_time_unit: pkg.delivery_time_unit,
    revision_window: pkg.revision_window,
    revision_scope_rules: pkg.revision_scope_rules,
    number_of_revisions: pkg.number_of_revisions,
});

export const usePackageOperations = ({ offer, onSuccess }: UsePackageOperationsProps) => {
    const { triggerPlansRefetch } = useServiceDataStore();
    const { addPlan, updatePlan, deletePlan, loading } = usePlanApi();
    const { 
        setTitle, 
        setPrice, 
        setCurrency, 
        setDeliveryTimeValue, 
        setDeliveryTimeUnit, 
        setRevisionWindow, 
        setRevisionScopeRules, 
        setNumberOfRevisions,
        validate ,  setIsSubmitted,  isSubmitted
    } = usePackageForm();

    const addPackage = useCallback(async (newPackage: Package, existingPackages: Package[]) => {
        if (!offer) return false;

        // Update form data with the package to validate
        const formState = packageToFormState(newPackage);
        setTitle(formState.title);
        setPrice(formState.price);
        setCurrency(formState.currency);
        setDeliveryTimeValue(formState.delivery_time_value);
        setDeliveryTimeUnit(formState.delivery_time_unit);
        setRevisionWindow(formState.revision_window);
        setRevisionScopeRules(formState.revision_scope_rules);
        setNumberOfRevisions(formState.number_of_revisions);
        
        // Validate using usePackageForm's validation
        if (!validate()) {
            setIsSubmitted(true);
            return false;
            
        }

        try {
            const formData = buildPackageFormData(newPackage);
            const result = await addPlan(Number(offer.id), formData, {
                showMessage: true,
                onSuccess: () => {
                    onSuccess?.();
                    triggerPlansRefetch();
                },
            });

            return !!result;
        } catch (error) {
            console.error('Error saving package:', error);
            return false;
        }
    }, [offer, addPlan, setTitle, setPrice, setCurrency, setDeliveryTimeValue, setDeliveryTimeUnit, setRevisionWindow, setRevisionScopeRules, setNumberOfRevisions, validate, onSuccess, triggerPlansRefetch]);

    const updatePackage = useCallback(async (index: number, packageData: Package, existingPackages: Package[]) => {
        if (!offer) return false;

        // Update form data with the package to validate
        const formState = packageToFormState(packageData);
        setTitle(formState.title);
        setPrice(formState.price);
        setCurrency(formState.currency);
        setDeliveryTimeValue(formState.delivery_time_value);
        setDeliveryTimeUnit(formState.delivery_time_unit);
        setRevisionWindow(formState.revision_window);
        setRevisionScopeRules(formState.revision_scope_rules);
        setNumberOfRevisions(formState.number_of_revisions);
        
        // Validate using usePackageForm's validation
        if (!validate()) {
             setIsSubmitted(true);
            return false;
        }

        try {
            const packageId = existingPackages[index].id;
            if (!packageId) return false;

            const formData = buildPackageFormData(packageData);
            const result = await updatePlan(Number(packageId), formData, {
                showMessage: true,
                onSuccess: () => {
                    onSuccess?.();
                    triggerPlansRefetch();
                },
            });

            return !!result;
        } catch (error) {
            console.error('Error updating package:', error);
            return false;
        }
    }, [offer, updatePlan, setTitle, setPrice, setCurrency, setDeliveryTimeValue, setDeliveryTimeUnit, setRevisionWindow, setRevisionScopeRules, setNumberOfRevisions, validate, onSuccess, triggerPlansRefetch]);

    const deletePackage = useCallback(async (index: number, existingPackages: Package[]) => {
        if (!offer) return false;

        try {
            const packageId = existingPackages[index].id;
            if (!packageId) return false;

            const result = await deletePlan(Number(packageId), {
                showMessage: true,
                onSuccess: () => {
                    onSuccess?.();
                    triggerPlansRefetch();
                },
            });

            return !!result;
        } catch (error) {
            console.error('Error deleting package:', error);
            return false;
        }
    }, [offer, deletePlan, onSuccess, triggerPlansRefetch]);

    return {
        addPackage,
        updatePackage,
        deletePackage,
        loading,
        isSubmitted,
    };
};
