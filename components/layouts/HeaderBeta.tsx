'use client';

import React, { useMemo, useState } from 'react';
import { Button, Modal } from 'antd';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useLangSwitch } from '@/lib/Hooks/useLangSwitch';

const HeaderBeta: React.FC = () => {
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();
    const { currentLang } = useLangSwitch();
    const isRTL = currentLang === 'ar';

    const modalWidth = useMemo(() => {
        if (typeof window === 'undefined') return 600;
        const w = window.innerWidth;
        if (w < 480) return 360;
        if (w < 768) return 520;
        return 640;
    }, []);

    return (
        <>
            {/* Top Beta Bar */}
            <div className="w-full bg-white border-b border-gray-200">
                <div className=" px-3 sm:px-4 py-2">
                    <div className="mx-auto flex  flex-row flex-1  max-w-[1200px]  items-start  justify-start md:items-center md:justify-center  gap-2 text-start md:text-center sm:gap-3">
                        <p className="text-[12px] md:text-[13px] font-semibold text-blueSite leading-5">
                            {t('beta.banner_text')}
                        </p>

                        <Button
                            type="primary"
                            className="!bg-blueSite hover:!bg-blueSiteHover text-[12px] md:text-[13px]  !border-blueSite hover:!border-blueSiteHover !rounded-lg !h-7 md:!h-9 w-1/2 sm:w-auto"
                            onClick={() => setOpen(true)}
                        >
                            {t('beta.button')}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <Modal
                title={t('beta.modal_title')}
                open={open}
                onCancel={() => setOpen(false)}
                width={modalWidth}
                centered
                styles={{
                    body: {
                        maxHeight: '70vh',
                        overflowY: 'auto',
                    },
                }}
                footer={[
                    <Button
                        key="close"
                        type="primary"
                        className="!bg-blueSite hover:!bg-blueSiteHover !border-blueSite hover:!border-blueSiteHover !rounded-lg"
                        onClick={() => setOpen(false)}
                    >
                        {t('beta.got_it')}
                    </Button>,
                ]}
            >
                <div className="text-[13px] sm:text-[14px] text-gray-700 leading-6 space-y-3">
                    <p>{t('beta.modal_intro')}</p>

                    <p>{t('beta.modal_description')}</p>

                    <p className="font-semibold">{t('beta.modal_warning')}</p>

                    <p>{t('beta.modal_goal_title')}</p>

                    <ul
                        className={`list-disc space-y-1 ${isRTL ? 'pr-5 pl-0' : 'pl-5 pr-0'}`}
                    >
                        <li>{t('beta.goal_1')}</li>
                        <li>{t('beta.goal_2')}</li>
                        <li>{t('beta.goal_3')}</li>
                        <li>{t('beta.goal_4')}</li>
                    </ul>

                    <p>{t('beta.modal_footer')}</p>
                </div>
            </Modal>
        </>
    );
};

export default HeaderBeta;
