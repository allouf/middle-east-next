import React from 'react';

export const ListIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="15"
        viewBox="0 0 16 15"
        fill="none"
        className={className}>
        <rect width="16" height="15" rx="5.16234" fill="url(#paint0_linear_367_499)" />
        <g filter="url(#filter0_ddiif_367_499)">
            <rect x="2.90918" y="2.72656" width="10.1818" height="9.54545" rx="3.50649" fill="url(#paint1_linear_367_499)" />
            <rect x="3.00658" y="2.82397" width="9.98701" height="9.35065" rx="3.40909" stroke="white" strokeWidth="0.194805" />
        </g>
        <defs>
            <filter id="filter0_ddiif_367_499" x="0.181907" y="-0.000710309" width="15.6362" height="14.9995" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dx="0.779221" dy="0.779221" />
                <feGaussianBlur stdDeviation="0.974026" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.0862745 0 0 0 0 0.0980392 0 0 0 0 0.141176 0 0 0 0.1 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_367_499" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dx="-0.779221" dy="-0.779221" />
                <feGaussianBlur stdDeviation="0.974026" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
                <feBlend mode="normal" in2="effect1_dropShadow_367_499" result="effect2_dropShadow_367_499" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_367_499" result="shape" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dx="1.94805" dy="1.94805" />
                <feGaussianBlur stdDeviation="1.46104" />
                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.55599 0 0 0 0 0.609734 0 0 0 0 0.729167 0 0 0 0.4 0" />
                <feBlend mode="normal" in2="shape" result="effect3_innerShadow_367_499" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dx="-0.779221" dy="-3.7013" />
                <feGaussianBlur stdDeviation="0.974026" />
                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.7 0" />
                <feBlend mode="normal" in2="effect3_innerShadow_367_499" result="effect4_innerShadow_367_499" />
                <feGaussianBlur stdDeviation="0.0974026" result="effect5_foregroundBlur_367_499" />
            </filter>
            <linearGradient id="paint0_linear_367_499" x1="8" y1="3.40909" x2="8" y2="15.8766" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00664F" stopOpacity="0.2" />
                <stop offset="1" stopColor="#00664F" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="paint1_linear_367_499" x1="8.00009" y1="4.89598" x2="8.00009" y2="12.8299" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00664F" />
                <stop offset="1" stopColor="#00664F" />
            </linearGradient>
        </defs>
    </svg>
);