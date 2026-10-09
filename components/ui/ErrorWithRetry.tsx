// components/ui/ErrorWithRetry.jsx

import { useTranslation } from "@/lib/i18n/useTranslation";

interface ErrorWithRetryProps {
  onRetry?: () => void;
}

export default function ErrorWithRetry({ onRetry }: ErrorWithRetryProps) {
    const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <p className="text-red-600 font-semibold mb-4">
        {t("text.errorLoading") ?? "An error occurred while loading data."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-500 hover:bg-red-600 text-textWhiteColor font-medium py-2 px-6 rounded transition"
        >
          {t("buttons.retry") ?? "Retry"}
        </button>
      )}
    </div>
  );
}
