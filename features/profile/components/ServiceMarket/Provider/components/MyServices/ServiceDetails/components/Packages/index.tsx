"use client";

import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import { ServiceOffer } from '../../../../../types/provider.types';
import { useTranslation } from '@/lib/i18n/useTranslation';
import PackageCard from './PackageCard';
import PackageForm from './PackageForm';
import NoPackagesCreated from './NoPackagesCreated';
import { usePackageOperations } from './usePackageOperations';
import './styles.css';

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

interface PackagesTabProps {
    offer: ServiceOffer | null;
    onSubmit?: (formData: any) => Promise<{ ok: boolean; error?: string }>;
    triggerEdit?: boolean;
    triggerAddPackage?: boolean;
}

const DEFAULT_PACKAGE: Package = {
    id: '',
    title: '',
    price: '',
    currency: 'USD',
    delivery_time_value: '',
    delivery_time_unit: '',
    revision_window: '',
    revision_scope_rules: '',
    number_of_revisions: '',
};

const PackagesTab = ({ offer, onSubmit, triggerEdit, triggerAddPackage }: PackagesTabProps) => {
    const { t } = useTranslation();

    // State for managing which forms are open
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingIndexes, setEditingIndexes] = useState<Set<number>>(new Set());
    const [activeTabKey, setActiveTabKey] = useState<string>('0');

    // Convert ServicePlan[] to Package[] format
    const [packages, setPackages] = useState<Package[]>(
        offer?.plans?.map(plan => ({
            id: plan.id?.toString() || '',
            title: plan.title || '',
            price: plan.price?.toString() || '',
            currency: plan.currency || 'USD',
            delivery_time_value: plan.delivery_time_value?.toString() || '',
            delivery_time_unit: plan.delivery_time_unit || '',
            revision_window: plan.revision_window || '',
            revision_scope_rules: plan.revision_scope_rules || '',
            number_of_revisions: plan.number_of_revisions?.toString() || '',
        })) || []
    );

    // State for new package form
    const [newPackage, setNewPackage] = useState<Package>(DEFAULT_PACKAGE);

    // Use package operations hook for API calls
    const { addPackage, updatePackage, deletePackage, isSubmitted, loading } = usePackageOperations({
        offer,
        onSuccess: () => {
            // Reset forms after successful operations
            setShowAddForm(false);
            setEditingIndexes(new Set());
            setNewPackage(DEFAULT_PACKAGE);
        }
    });

    // Update packages when offer changes
    useEffect(() => {
        if (offer?.plans) {
            setPackages(offer.plans.map(plan => ({
                id: plan.id?.toString() || '',
                title: plan.title || '',
                price: plan.price?.toString() || '',
                currency: plan.currency || 'USD',
                delivery_time_value: plan.delivery_time_value?.toString() || '',
                delivery_time_unit: plan.delivery_time_unit || '',
                revision_window: plan.revision_window || '',
                revision_scope_rules: plan.revision_scope_rules || '',
                number_of_revisions: plan.number_of_revisions?.toString() || '',
            })));
        }
    }, [offer]);

    // Trigger edit mode when parent component requests it
    useEffect(() => {
        if (triggerEdit) {
            setShowAddForm(true);
        }
    }, [triggerEdit]);

    // Trigger add package mode when parent component requests it
    useEffect(() => {
        if (triggerAddPackage) {
            setActiveTabKey('add');
            setShowAddForm(true);
        }
    }, [triggerAddPackage]);

    // Switch to first tab when add form is hidden and currently on add tab
    useEffect(() => {
        if (!showAddForm && activeTabKey === 'add') {
            setActiveTabKey(packages.length > 0 ? '0' : '');
        }
    }, [showAddForm, activeTabKey, packages.length]);

    const handleEditPackage = (index: number) => {
        // Add this index to the set of editing indexes
        setEditingIndexes(prev => new Set(prev).add(index));
    };

    const handleCreateFirstPackage = () => {
        setActiveTabKey('add');
        setShowAddForm(true);
    };

    const handleCancelAdd = () => {
        setShowAddForm(false);
        setNewPackage(DEFAULT_PACKAGE);
    };

    const handleCancelEdit = (index: number) => {
        // Remove this index from the set of editing indexes
        setEditingIndexes(prev => {
            const newSet = new Set(prev);
            newSet.delete(index);
            return newSet;
        });
    };

    const handleSaveNew = async () => {
        const success = await addPackage(newPackage, packages);
        if (success) {
            setShowAddForm(false);
            setNewPackage(DEFAULT_PACKAGE);
        }
    };

    const handleSaveEdit = async (index: number, packageData: Package) => {
        const success = await updatePackage(index, packageData, packages);
        if (success) {
            handleCancelEdit(index);
        }
    };

    const handleDeletePackage = async (index: number) => {
        const success = await deletePackage(index, packages);
        if (success) {
            const updatedPackages = packages.filter((_, i) => i !== index);
            setPackages(updatedPackages);
        }
    };

    // Create tab items for Ant Design Tabs
    const tabItems = packages.map((pkg, index) => ({
        key: index.toString(),
        label: pkg.title || `Package ${index + 1}`,
        children: (
            <div className="space-y-6">
                {editingIndexes.has(index) ? (
                    <PackageForm
                        packageData={pkg}
                        editingIndex={index}
                        title={`${t("serviceMarket.myServices.plans.editPackage")}: ${pkg.title}`}
                        onPackageChange={(updatedPkg) => {
                            // Update package in array
                            setPackages(prev => prev.map((p, i) =>
                                i === index ? { ...updatedPkg, id: p.id } : p
                            ));
                        }}
                        onSave={() => handleSaveEdit(index, packages[index])}
                        onUpdate={() => handleSaveEdit(index, packages[index])}
                        onCancel={() => handleCancelEdit(index)}
                        isSubmitted={isSubmitted}
                        loading={loading}
                    />
                ) : (
                    <PackageCard
                        package={pkg}
                        index={index}
                        onEdit={handleEditPackage}
                        onDelete={handleDeletePackage}
                    />
                )}
            </div>
        )
    }));

    // Add tab for creating new package
    const addTabItem = {
        key: 'add',
        label: t("serviceMarket.myServices.plans.addPackage"),
        children: (
            <PackageForm
                packageData={newPackage}
                editingIndex={null}
                title={t("serviceMarket.myServices.plans.addNewPackage")}
                onPackageChange={(pkg) => setNewPackage({ ...pkg, id: '' })}
                onSave={handleSaveNew}
                onCancel={handleCancelAdd}
                isSubmitted={isSubmitted}
                loading={loading}
            />
        )
    };

    // Combine all tabs
    const allTabItems = [...tabItems];

    // Only include add tab when showAddForm is true
    if (showAddForm) {
        allTabItems.push(addTabItem);
    }

    // Handle tab change
    const handleTabChange = (key: string) => {
        setActiveTabKey(key);
        if (key !== 'add') {
            // Hide add form when switching away from add tab
            setShowAddForm(false);
            setNewPackage(DEFAULT_PACKAGE);
        }
    };

    return (
        <>
            {packages.length === 0 && !showAddForm ? (
                <NoPackagesCreated onCreateFirst={handleCreateFirstPackage} />
            ) : (
                <div className="border border-[#E9E9E9] rounded-xl space-y-6">
                    <Tabs
                        activeKey={activeTabKey}
                        onChange={handleTabChange}
                        items={allTabItems}
                        className="w-full packages-tabs space-y-4"
                    />
                </div>
            )}
        </>
    );
};

export default PackagesTab;
