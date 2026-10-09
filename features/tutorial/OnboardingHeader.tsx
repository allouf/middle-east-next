'use client';

import React from 'react';
import { Button } from 'antd';
import { motion } from 'framer-motion';

type Props = {
    title: string;
    subtitle?: string;
    stepText: string;
    onSkip: () => void;
    skipText: string;
};

const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: 'easeOut', staggerChildren: 0.08 },
    },
};

const textVariants = {
    hidden: { opacity: 0, y: 6 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.35, ease: 'easeOut' },
    },
};

const pulseVariants = {
    initial: { opacity: 0.7 },
    animate: {
        opacity: [0.7, 1, 0.7],
        transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
    },
};

const OnboardingHeader: React.FC<Props> = ({
    title,
    subtitle,
    stepText,
    onSkip,
    skipText,
}) => {
    return (
        <div className="absolute top-0 left-0 w-full z-50 pointer-events-none">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="
          pointer-events-auto
          mx-2 sm:mx-4 mt-2 sm:mt-3
          rounded-xl
          bg-blueSite/55 backdrop-blur-[2px]
          border border-white/10
          max-w-[calc(100%-16px)] sm:max-w-[calc(100%-32px)]
        "
            >
                <div
                    className="
            px-3 sm:px-6 py-3 sm:py-4
            flex flex-col sm:flex-row
            sm:items-start sm:justify-between
            gap-2 sm:gap-3
          "
                >
                    {/* Text */}
                    <div className="min-w-0">
                        <motion.p
                            variants={textVariants}
                            className="
                text-[14px] sm:text-[16px]
                font-semibold text-white
                leading-5 sm:leading-6
                line-clamp-2
              "
                            title={title}
                        >
                            {title}
                        </motion.p>

                        {subtitle && (
                            <motion.p
                                variants={textVariants}
                                className="
                  mt-1
                  text-[12px] sm:text-[13px]
                  text-white/80
                  leading-5
                  line-clamp-2 sm:line-clamp-3
                "
                                title={subtitle}
                            >
                                {subtitle}
                            </motion.p>
                        )}

                        <motion.p
                            variants={pulseVariants}
                            initial="initial"
                            animate="animate"
                            className="mt-2 text-[11px] sm:text-[12px] text-emerald-300/90"
                        >
                            {stepText}
                        </motion.p>
                    </div>

                    {/* Skip (responsive placement) */}
                    <motion.div
                        variants={textVariants}
                        className="
              self-end sm:self-auto
              -mt-1 sm:mt-0
              flex-shrink-0
            "
                    >
                        <Button
                            type="link"
                            className="
                !text-emerald-300 hover:!text-emerald-200
                !px-0
                !h-auto
                text-[12px] sm:text-[13px]
                whitespace-nowrap
              "
                            onClick={onSkip}
                        >
                            {skipText}
                        </Button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default OnboardingHeader;
