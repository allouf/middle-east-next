'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FaExclamationTriangle, FaRedo } from 'react-icons/fa';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface ErrorReloadProps {
  message?: string;
  title?: string;
  onRetry?: () => void;
}

const ErrorReload: React.FC<ErrorReloadProps> = ({ 
  message = "errors.failedToLoadData", 
  title = "errors.somethingWentWrong",
  onRetry 
}) => {
  const router = useRouter();
  const { t } = useTranslation();

  const handleReload = () => {
    if (onRetry) {
      onRetry();
    } else {
      // Default behavior: reload the page
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] py-12 px-4">
      <div className="text-center max-w-md">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <FaExclamationTriangle className="text-red-500 text-2xl" />
          </div>
        </div>

        {/* Error Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {t(title)}
        </h2>

        {/* Error Message */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          {t(message)}
        </p>

        {/* Reload Button */}
        <button
          onClick={handleReload}
          className="inline-flex items-center gap-2 bg-blueSite hover:bg-blueSiteHover text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blueSite focus:ring-offset-2"
        >
          <FaRedo className="text-sm" />
          {t('errors.tryAgain')}
        </button>

        {/* Additional Help Text */}
        <p className="text-sm text-gray-500 mt-4">
          {t('errors.ifProblemPersists')}
        </p>
      </div>
    </div>
  );
};

export default ErrorReload;
