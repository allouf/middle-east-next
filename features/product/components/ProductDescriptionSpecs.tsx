import React, { useState } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface ProductDescriptionSpecsProps {
  description?: string | null;
  specifications?: string | null;
}

const ProductDescriptionSpecs: React.FC<ProductDescriptionSpecsProps> = ({ description, specifications }) => {
  const {t} = useTranslation();
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Count words in description
  const countWords = (text: string | null | undefined): number => {
    if (!text) return 0;
    return text.trim().split(/\s+/).length;
  };

  // Truncate description to 25 words
  const truncateDescription = (text: string | null | undefined, wordLimit: number = 25): string => {
    if (!text) return "";
    const words = text.trim().split(/\s+/);
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  const descriptionWordCount = countWords(description);
  const shouldShowReadMore = descriptionWordCount > 25;
  const displayDescription = showFullDescription || !shouldShowReadMore
    ? description
    : truncateDescription(description, 25);

  return (
    <div className="space-y-4 text-start">
      {/* Description Section */}
      {description && (
        <div className="space-y-2">
          <h3 className="text-base font-semibold text-blueSite" >
            {t('product.description')}:
          </h3>
          <div className="text-sm text-gray-700 leading-relaxed">
            {displayDescription}
            {shouldShowReadMore && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="ml-2 font-medium hover:underline"
                style={{ color: '#0B5C8E' }}
              >
                {showFullDescription ? t('product.showLess') : t('product.readMore')}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Specifications Section */}
      {specifications && (
        <div className="space-y-2">
          <h3 className="text-base font-semibold text-blueSite" >
            {t('product.specifications')}:
          </h3>
          <div className="text-sm text-gray-700 leading-relaxed">
            {specifications}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDescriptionSpecs;

