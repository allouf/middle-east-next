import React from 'react'
import HeaderForm from './HeaderForm'
import CertificateCard from './CertificateCard'
import MultiImageUpload from '@/components/ui/MultiImageUpload'
import InputField from '@/components/ui/InputField'
import ActionButtons from './ActionButtons'
import StatusCard from './StatusCard'
import { useProviderProfile } from '../../../hooks/Profile/useProviderProfile'
import { useTranslation } from '@/lib/i18n/useTranslation'

interface VerificationProps {
  onBack: () => void;
  profileData: any;
}

const Verification = ({ onBack, profileData }: VerificationProps) => {
  const { t } = useTranslation();
  const verificationForm = useProviderProfile({
    initial: {
      verification_notes: profileData?.verification_notes || '',
      identity_document: profileData?.identity_document || null,
    },
    required: {
      verification_notes: true,
      identity_document: true,
    },
    onSuccess: () => {
      onBack();
    },
  });

  const handleSave = async () => {
    const result = await verificationForm.submitForm();
    if (!result.ok) {
      console.error('Failed to save verification data');
    }
  };

  const handleCancel = () => {
    onBack();
  };

  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      verificationForm.setIdentityDocument(files[0]);
    }
  };

  const handleNotesChange = (e: any) => {
    verificationForm.setVerificationNotes(e.target.value);
  };

  return (
    <div className="w-full p-2">
      <HeaderForm
        title={t('serviceMarket.verification.form.title')}
        description={t('serviceMarket.verification.form.description')}
        onBack={onBack}
      />

      <div className="w-full my-6 relative overflow-hidden rounded-2xl border border-[#DDE5E2] bg-[#F8FAF9] p-4 sm:p-6">
        {/* Glow Effects */}
        <div className="pointer-events-none absolute -top-10 -left-10 h-32 w-32 rounded-full bg-[#0A7B61]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-[#0A7B61]/20 blur-3xl" />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 relative z-10">
          
          {/* LEFT SECTION */}
          <div className="xl:col-span-2 space-y-5">
            
            {/* Certificate Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <CertificateCard 
                title={t('serviceMarket.verification.form.boardCertification')}
                isVerified={true}
              />
              <CertificateCard 
                title={t('serviceMarket.verification.form.medicalLicense')}
                isVerified={true}
              />
              <CertificateCard 
                title={t('serviceMarket.verification.form.professionalDegree')}
                isVerified={true}
              />
            </div>

            {/* Upload Section */}
            <MultiImageUpload
              id="identity-document"
              label={t('serviceMarket.verification.identityDocument')}
              withFieldset
              onImagesChange={handleFileUpload}
              acceptedTypes={['image/png', 'image/jpeg', 'image/jpg', 'application/pdf']}
              value={verificationForm.identityDocumentFile ? [verificationForm.identityDocumentFile] : []}
            />

            {/* Notes Section */}
            <InputField
              id="verification-notes"
              label={t('serviceMarket.verification.verificationNotes')}
              type="textarea"
              withFieldset
              placeholder={t('serviceMarket.verification.form.notesPlaceholder')}
              value={verificationForm.formData.verification_notes}
              onChange={handleNotesChange}
              rows={5}
              error={verificationForm.errors.verification_notes}
            />

            {/* Action Buttons */}
            <ActionButtons 
              onSave={handleSave}
              onCancel={handleCancel}
              saveText={t('serviceMarket.verification.form.saveChanges')}
              cancelText={t('serviceMarket.verification.form.cancel')}
              disabled={verificationForm.loading}
            />
          </div>

          {/* RIGHT SECTION - Status Card */}
          <StatusCard 
            status="ACTIVE"
            title={t('serviceMarket.verification.form.statusCard.active')}
            subtitle={t('serviceMarket.verification.form.statusCard.subtitle')}
            description={t('serviceMarket.verification.form.statusCard.description')}
            benefits={[
              t('serviceMarket.verification.benefit1'),
              t('serviceMarket.verification.benefit2'),
              t('serviceMarket.verification.benefit3'),
            ]}
          />

        </div>
      </div>
    </div>
  )
}

export default Verification