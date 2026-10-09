import React, { useState, useEffect } from 'react';
import { ServiceOffer } from '../../../../../types/provider.types';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useOverviewForm } from '../../../../../hooks/Service/useOverviewForm';
import OverviewEditForm from './OverviewEditForm';
import OverviewView from './OverviewView';
import { useServiceDataStore } from '@/features/profile/components/ServiceMarket/stores';

interface OverviewTabProps {
    offer: ServiceOffer | null;
    onSubmit?: (formData: any) => Promise<{ ok: boolean; error?: string }>;
    triggerEdit?: boolean;
}

const OverviewTab = ({ offer, onSubmit, triggerEdit }: OverviewTabProps) => {
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmited, setIsSubmited] = useState(false);
    const { triggerOverviewRefetch } = useServiceDataStore();

    // Use the proper overview form hook
    const overviewForm = useOverviewForm({
        initial: offer ? {
            title: offer.title,
            service_category_id: offer.service_category_id?.toString(),
            type: offer.type,
            delivery_model: offer.delivery_model,
            description: offer.description,
            is_active: offer.is_active?.toString(),
            sort_order: offer.sort_order?.toString(),
        } : undefined,
        serviceId: offer?.id,
        onSuccess: () => {
            setIsEditing(false);
            triggerOverviewRefetch();
        }
    });

    // Service type and delivery model options (same as BasicInfoStep)
    const serviceTypeOptions = [
        { value: 'fixed_price', label: t('serviceMarket.myServices.serviceTypes.fixed_price') },
        { value: 'hourly', label: t('serviceMarket.myServices.serviceTypes.hourly') },
        { value: 'project_based', label: t('serviceMarket.myServices.serviceTypes.project_based') },
        { value: 'retainer', label: t('serviceMarket.myServices.serviceTypes.retainer') },
        { value: 'package', label: t('serviceMarket.myServices.serviceTypes.package') },
        { value: 'subscription', label: t('serviceMarket.myServices.serviceTypes.subscription') }
    ];

    const deliveryModelOptions = [
        { value: 'remote', label: t('serviceMarket.myServices.deliveryTypes.remote') },
        { value: 'on_site', label: t('serviceMarket.myServices.deliveryTypes.onsite') },
        { value: 'hybrid', label: t('serviceMarket.myServices.deliveryTypes.hybrid') },
        { value: 'in_person', label: t('serviceMarket.myServices.deliveryTypes.inperson') }
    ];
    
    if (!offer) return null;

    // Trigger edit mode when parent component requests it
    useEffect(() => {
        if (triggerEdit) {
            setIsEditing(true);
        }
    }, [triggerEdit]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        overviewForm.resetForm();
        setIsEditing(false);
    };

    const validateFormData = () => {
        const formData = overviewForm.formData;
        
        // Check if any required field is empty
        if (!formData.title?.trim()) return false;
        if (!formData.service_category_id?.trim()) return false;
        if (!formData.type?.trim()) return false;
        if (!formData.delivery_model?.trim()) return false;
        if (!formData.description?.trim()) return false;
        
        return true;
    };

    const handleSave = async () => {
        if (!offer) return;
        
        // Set isSubmited to true to trigger validation display
        setIsSubmited(true);
        
        // Small delay to ensure form re-renders with validation state
        setTimeout(() => {
            // Check if any data is empty
            if (!validateFormData()) {
              
                setTimeout(() => setIsSubmited(false), 3000);
                return; // Don't submit if validation fails
            }
            
            // If validation passes, submit the form
            overviewForm.submitForm().then(result => {
                if (result.ok) {
                    setIsEditing(false);
                    setIsSubmited(false); // Reset submitted state on success
                    triggerOverviewRefetch();
                } else {
                    console.error('Save failed:', result.error);
                    // Reset isSubmited on error as well
                    setIsSubmited(false);
                }
            });
        }, 100);
    };

    if (isEditing) {
        return (
            <OverviewEditForm
                formData={overviewForm.formData}
                serviceTypeOptions={serviceTypeOptions}
                deliveryModelOptions={deliveryModelOptions}
                handleChange={overviewForm.handleChange}
                onSave={handleSave}
                onCancel={handleCancel}
                isSubmited={isSubmited}
                loading={overviewForm.loading}
            />
        );
    }
    
    return (
        <OverviewView
            offer={offer}
            onEdit={handleEdit}
        />
    );
};

export default OverviewTab;
