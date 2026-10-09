import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface ExpandableTextProps {
    text: string;
    maxLength?: number;
    className?: string;
    as?: 'div' | 'span' | 'p';
}

const ExpandableText = ({ text, maxLength = 100, className = '', as = 'div' }: ExpandableTextProps) => {
    const { t } = useTranslation();
    const [isExpanded, setIsExpanded] = useState(false);

    if (!text) return null;

    const shouldTruncate = text.length > maxLength;
    const displayText = shouldTruncate && !isExpanded
        ? text.substring(0, maxLength).trim() + '...'
        : text;

    // Only show the button if text needs truncation
    if (!shouldTruncate) {
        const Wrapper = as;
        return <Wrapper className={className}>{displayText}</Wrapper>;
    }

    const Wrapper = as;
    return (
        <Wrapper className={className}>
            <span>{displayText}</span>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-[#00664F] hover:underline font-medium text-[13px] ml-2 cursor-pointer"
            >
                {isExpanded
                    ? t("common.seeLess", { defaultValue: "See Less" })
                    : t("common.seeMore", { defaultValue: "See More" })
                }
            </button>
        </Wrapper>
    );
};

export default ExpandableText;
