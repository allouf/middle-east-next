'use client';

import { useTranslation } from 'react-i18next';
import { Search, Building, ArrowRight } from 'lucide-react';

interface NoCompaniesFoundProps {
  resetFilter: () => void;
}

export default function NoCompaniesFound({resetFilter}: NoCompaniesFoundProps) {
  const { t } = useTranslation();

  return (
    <div className="mt-12 flex flex-col items-center justify-center py-16">
      <div className="relative mb-6">
        <div className=" inset-0 bg-blueLight rounded-full w-24 h-24 flex items-center justify-center">
          <Building className="w-12 h-12 text-blueSite" />
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        {t('jobs.noCompaniesFound.title', 'لم يتم العثور على شركات')}
      </h3>
      
      <p className="text-textColor text-center max-w-md mb-8">
        {t('jobs.noCompaniesFound.description', 'لم نتمكن من العثور على شركات تطابق معايير البحث الخاصة بك. حاول تعديل الفلاتر أو البحث بكلمات مختلفة.')}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <button 
        onClick={resetFilter}
        className="flex items-center gap-2 bg-blueBtn text-white px-6 py-3 rounded-lg hover:bg-blueSiteHover transition-colors duration-200 font-medium">
          {t('jobs.noCompaniesFound.browseAllCompanies', 'تصفح جميع الشركات')}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <div className="text-center p-6 bg-grayLight rounded-lg">
          <div className="w-12 h-12 bg-blueLight rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 text-blueSite" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">
            {t('jobs.noCompaniesFound.tips.search.title', 'عدل البحث')}
          </h4>
          <p className="text-sm text-textColor">
            {t('jobs.noCompaniesFound.tips.search.description', 'جرب كلمات مفتاحية مختلفة أو فلاتر أوسع')}
          </p>
        </div>
        
        <div className="text-center p-6 bg-grayLight rounded-lg">
          <div className="w-12 h-12 bg-blueLight rounded-full flex items-center justify-center mx-auto mb-4">
            <Building className="w-6 h-6 text-blueSite" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">
            {t('jobs.noCompaniesFound.tips.categories.title', 'تصفح الفئات')}
          </h4>
          <p className="text-sm text-textColor">
            {t('jobs.noCompaniesFound.tips.categories.description', 'استكشف الشركات حسب الفئة أو المجال')}
          </p>
        </div>
        
        <div className="text-center p-6 bg-grayLight rounded-lg">
          <div className="w-12 h-12 bg-blueLight rounded-full flex items-center justify-center mx-auto mb-4">
            <ArrowRight className="w-6 h-6 text-blueSite" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">
            {t('jobs.noCompaniesFound.tips.alerts.title', 'تفعيل التنبيهات')}
          </h4>
          <p className="text-sm text-textColor">
            {t('jobs.noCompaniesFound.tips.alerts.description', 'احصل على إشعارات عند توفر شركات جديدة')}
          </p>
        </div>
      </div>
    </div>
  );
}
