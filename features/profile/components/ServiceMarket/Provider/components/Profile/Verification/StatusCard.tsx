import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

interface StatusCardProps {
  status?: 'ACTIVE' | 'PENDING' | 'REJECTED';
  title?: string;
  subtitle?: string;
  description?: string;
  benefits?: string[];
}

const StatusCard = ({ 
  status = 'ACTIVE',
  title = status,
  subtitle = 'Verified Credential Profile',
  description = "Your profile has undergone rigorous peer and administrative review. Maintain your verified status by ensuring all documents remain current.",
  benefits = [
    'Unlock "Verified" badge on your profile',
    'Access higher value projects',
    'Priority support from our team',
  ]
}: StatusCardProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'ACTIVE':
        return {
          border: 'border-[#B9D8CC]',
          bg: 'bg-[#F3FBF7]',
          badge: 'bg-[#E7F7F1]',
          badgeText: 'text-[#00875A]',
          iconBg: 'bg-[#E6F6F0]',
          iconText: 'text-[#00664F]',
          glow: 'bg-[#0A7B61]/10'
        };
      case 'PENDING':
        return {
          border: 'border-[#FFD6A5]',
          bg: 'bg-[#FFF9F0]',
          badge: 'bg-[#FFF4E6]',
          badgeText: 'text-[#D48806]',
          iconBg: 'bg-[#FFE8CC]',
          iconText: 'text-[#D48806]',
          glow: 'bg-[#D48806]/10'
        };
      case 'REJECTED':
        return {
          border: 'border-[#FECACA]',
          bg: 'bg-[#FEF2F2]',
          badge: 'bg-[#FEE2E2]',
          badgeText: 'text-[#DC2626]',
          iconBg: 'bg-[#FECACA]',
          iconText: 'text-[#DC2626]',
          glow: 'bg-[#DC2626]/10'
        };
      default:
        return {
          border: 'border-[#B9D8CC]',
          bg: 'bg-[#F3FBF7]',
          badge: 'bg-[#E7F7F1]',
          badgeText: 'text-[#00875A]',
          iconBg: 'bg-[#E6F6F0]',
          iconText: 'text-[#00664F]',
          glow: 'bg-[#0A7B61]/10'
        };
    }
  };

  const colors = getStatusColor();

  return (
    <div className={`rounded-2xl border ${colors.border} ${colors.bg} p-6 relative overflow-hidden`}>
      <div className={`absolute top-0 right-0 h-28 w-28 rounded-full ${colors.glow} blur-3xl`} />

      <div className="relative z-10">
        <div className="flex items-start gap-4">
          <div className={`h-14 w-14 rounded-full ${colors.iconBg} flex items-center justify-center`}>
            <ShieldCheck className={`h-7 w-7 ${colors.iconText}`} />
          </div>

          <div>
            <h2 className="text-3xl font-bold text-[#1B1F1E]">
              {title}
            </h2>

            <span className={`inline-block mt-2 rounded-full ${colors.badge} px-3 py-1 text-xs font-medium ${colors.badgeText}`}>
              {subtitle}
            </span>
          </div>
        </div>

        <p className="mt-5 text-sm leading-6 text-gray-600">
          {description}
        </p>

        <div className="mt-6 space-y-4">
          {benefits.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle2 className={`h-5 w-5 ${colors.badgeText} mt-0.5`} />

              <p className="text-sm text-[#1B1F1E]">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
