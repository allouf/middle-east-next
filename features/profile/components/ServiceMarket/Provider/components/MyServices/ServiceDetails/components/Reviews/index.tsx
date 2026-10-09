import React from 'react';
import { ServiceOffer } from '../../../../../types/provider.types';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface ReviewsTabProps {
    offer: ServiceOffer | null;
}

const ReviewsTab = ({ offer }: ReviewsTabProps) => {
    const { t } = useTranslation();
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border border-[#E9E9E9] rounded-xl bg-white p-5 cursor-default hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#E6F0EE] text-[#00664F] font-bold text-sm flex items-center justify-center shrink-0">JD</div>
                            <div className="flex flex-col">
                                <span className="font-semibold text-[15px] text-[#353635]">Jason D.</span>
                                <span className="text-xs text-gray-400">12 : 12 pm • 2 {t("serviceMarket.myServices.details.tabs.reviews.daysAgo")}</span>
                            </div>
                        </div>
                        <div className="bg-[#E6F0EE] text-[#00664F] text-xs font-semibold px-2 py-1 rounded">#ORD-8921</div>
                    </div>
                    {/* Stars mock */}
                    <div className="flex gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map(s => <svg key={s} className="w-4 h-4 text-[#FACC15]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                    </div>
                    <p className="text-[#353635]/90 text-sm leading-relaxed">
                        Alex absolutely nailed the brand vision. The guidelines are so thorough that our team was able to start using them immediately. Great communication.
                    </p>
                </div>
            ))}
        </div>
    );
};

export default ReviewsTab;
