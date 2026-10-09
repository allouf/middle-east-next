"use client";

import React, { useState } from 'react';
import { useTranslation } from "@/lib/i18n/useTranslation";
import GlowLight from '@/components/shered/GlowLight';
import { CreditCard, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import { RiVisaLine } from 'react-icons/ri';
import { FaApple } from 'react-icons/fa';

const PaymentMethodCard = () => {
    const { t } = useTranslation();
    const [selectedMethod, setSelectedMethod] = useState<'credit_card' | 'apple_pay' | 'google_pay'>('credit_card');

    return (
        <div className="relative rounded-[20px] bg-[#FAFAFA] border border-[#E2E8F0] overflow-hidden shadow-sm w-full transition-all duration-300">
            <GlowLight
                color="#06B187"
                size="w-[55px] h-[40px]"
                opacity="opacity-80"
                blur="blur-[35px] sm:blur-[35px]"
                position="top-0 right-0"
            />
            <GlowLight
                color="#06B187"
                size="w-[50px] h-[40px]"
                opacity="opacity-80"
                blur="blur-[35px] sm:blur-[35px]"
                position="bottom-0 left-0"
            />

            <div className="relative z-10 p-6 md:p-8 flex flex-col gap-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center justify-center p-2 rounded-lg bg-[#15803D1A] border border-green-100">
                        <CreditCard className="w-5 h-5 text-blueSite" />
                    </div>
                    <div>
                        <h3 className="text-[18px] xl:text-[20px] font-bold text-subTitleColor">
                            Payment Method
                        </h3>
                        <p className="text-[14px] xl:text-[16px] text-textGrayColor mt-0.5">
                            Please Select your payment method and add the required data.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button 
                        onClick={() => setSelectedMethod('credit_card')}
                        className={`flex items-center gap-3 px-4 py-5 rounded-[12px] border transition-colors ${selectedMethod === 'credit_card' ? 'border-blueSite bg-[#F0FDF4]/50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                    >
                        <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center ${selectedMethod === 'credit_card' ? 'border-blueSite' : 'border-gray-300'}`}>
                             {selectedMethod === 'credit_card' && <div className="w-[10px] h-[10px] rounded-full bg-blueSite" />}
                        </div>
                        <div className="flex flex-col items-start gap-1">
                             <span className="text-[14px] font-bold text-subTitleColor">Credit Card / Mada</span>
                             <div className="flex items-center gap-1.5 h-4 mt-0.5">
                                <span className="text-[#1A1F71] font-extrabold italic text-[11px] tracking-tighter"><RiVisaLine className='w-11 h-8' /></span>
                                <div className="relative overflow-hidden h-[12px] w-[20px] flex items-center justify-center translate-y-[1px]">
                                   <div className="flex items-center justify-center absolute scale-[0.6]">
                                      <div className="w-[18px] h-[18px] bg-[#EB001B] rounded-full z-10 translate-x-[6px]"></div>
                                      <div className="w-[18px] h-[18px] bg-[#F79E1B] rounded-full -translate-x-[6px]"></div>
                                   </div>
                                </div>
                             </div>
                        </div>
                    </button>
                    
                    <button 
                        onClick={() => setSelectedMethod('apple_pay')}
                        className={`flex items-center gap-3 px-4 py-5 rounded-[12px] border transition-colors ${selectedMethod === 'apple_pay' ? 'border-blueSite bg-[#F0FDF4]/50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                    >
                        <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center ${selectedMethod === 'apple_pay' ? 'border-blueSite' : 'border-gray-300'}`}>
                             {selectedMethod === 'apple_pay' && <div className="w-[10px] h-[10px] rounded-full bg-blueSite" />}
                        </div>
                        <div className="flex flex-col items-start gap-1">
                             <span className="text-[14px] font-bold text-subTitleColor">Apple Pay</span>
                             {/* Apple Pay Logo approximate */}
                             <span className="font-bold text-black flex items-center text-[13px] tracking-tighter mt-0.5">
                                <FaApple className="w-3.5 h-3.5 mr-1 mb-0.5" />
                                Pay
                             </span>
                        </div>
                    </button>

                    <button 
                        onClick={() => setSelectedMethod('google_pay')}
                        className={`flex items-center gap-3 px-4 py-5 rounded-[12px] border transition-colors ${selectedMethod === 'google_pay' ? 'border-blueSite bg-[#F0FDF4]/50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                    >
                        <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center ${selectedMethod === 'google_pay' ? 'border-blueSite' : 'border-gray-300'}`}>
                             {selectedMethod === 'google_pay' && <div className="w-[10px] h-[10px] rounded-full bg-blueSite" />}
                        </div>
                        <div className="flex flex-col items-start gap-1">
                             <span className="text-[14px] font-bold text-subTitleColor">Google Pay</span>
                             <span className="text-gray-600 font-bold flex items-center gap-0.5 text-[13px] mt-0.5"><FcGoogle className='w-3.5 h-3.5 mr-1 mb-0.5' />Pay</span>
                        </div>
                    </button>
                </div>

                {selectedMethod === 'credit_card' && (
                    <div className="flex flex-col gap-6 mt-4 transition-all animate-in fade-in zoom-in duration-300">
                        <fieldset className="border border-gray-300 rounded-[8px] px-4 pb-3 pt-1 bg-white relative focus-within:border-blueSite transition-colors">
                            <legend className="text-[14px] font-bold text-blueSite px-2 ml-1">Cardholder Name</legend>
                            <div className="flex items-center gap-3 mt-1 cursor-text" onClick={(e) => (e.currentTarget.querySelector('input') as HTMLInputElement)?.focus()}>
                                <UserIcon className="w-5 h-5 text-gray-400 opacity-80" />
                                <input type="text" placeholder="e.g. John Doe" className="w-full text-[15px] placeholder-gray-400 font-medium text-subTitleColor focus:outline-none bg-transparent" />
                            </div>
                        </fieldset>

                        <fieldset className="border border-gray-300 rounded-[8px] px-4 pb-3 pt-1 bg-white relative focus-within:border-blueSite transition-colors">
                            <legend className="text-[14px] font-bold text-blueSite px-2 ml-1">Card Number</legend>
                            <div className="flex items-center gap-3 mt-1 cursor-text" onClick={(e) => (e.currentTarget.querySelector('input') as HTMLInputElement)?.focus()}>
                                <CardIcon className="w-5 h-5 text-gray-400 opacity-80" />
                                <input type="text" placeholder="0000 0000 0000 0000" className="w-full text-[15px] placeholder-gray-400 font-medium text-subTitleColor focus:outline-none bg-transparent" />
                                <div className="relative overflow-hidden h-[14px] w-[24px] flex items-center justify-center translate-y-[1px] ml-auto">
                                   <div className="flex items-center justify-center absolute scale-[0.75]">
                                      <div className="w-[18px] h-[18px] bg-[#EB001B] rounded-full z-10 translate-x-[6px]"></div>
                                      <div className="w-[18px] h-[18px] bg-[#F79E1B] rounded-full -translate-x-[6px]"></div>
                                   </div>
                                </div>
                            </div>
                        </fieldset>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <fieldset className="border border-gray-300 rounded-[8px] px-4 pb-3 pt-1 bg-white relative focus-within:border-blueSite transition-colors">
                                <legend className="text-[14px] font-bold text-blueSite px-2 ml-1">Expire Date</legend>
                                <div className="flex items-center gap-3 mt-1 cursor-text" onClick={(e) => (e.currentTarget.querySelector('input') as HTMLInputElement)?.focus()}>
                                    <CalendarIcon className="w-5 h-5 text-gray-400 opacity-80" />
                                    <input type="text" placeholder="MM/YY" className="w-full text-[15px] placeholder-gray-400 font-medium text-subTitleColor focus:outline-none bg-transparent" />
                                </div>
                            </fieldset>

                            <fieldset className="border border-gray-300 rounded-[8px] px-4 pb-3 pt-1 bg-white relative focus-within:border-blueSite transition-colors">
                                <legend className="text-[14px] font-bold text-blueSite px-2 ml-1">CVV</legend>
                                <div className="flex items-center gap-3 mt-1 cursor-text" onClick={(e) => (e.currentTarget.querySelector('input') as HTMLInputElement)?.focus()}>
                                    <LockOutlineIcon className="w-5 h-5 text-gray-400 opacity-80" />
                                    <input type="password" placeholder="1234" maxLength={4} className="w-full text-[15px] placeholder-gray-400 font-medium text-subTitleColor focus:outline-none bg-transparent" />
                                </div>
                            </fieldset>
                        </div>
                    </div>
                 )}

                 <div className="flex items-center justify-center gap-2 mt-4 mb-2">
                     <ShieldCheck className="w-4 h-4 text-blueSite" />
                     <span className="text-[13px] text-textGrayColor">
                        Your data is secured and encrypted with 256-bit SSL technology
                     </span>
                 </div>
            </div>
        </div>
    );
};

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);

const CardIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);

const LockOutlineIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);

const AppleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 170 170" fill="currentColor"><path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.92.21-9.84-1.96-14.74-6.53-3.13-2.73-7.1-7.43-11.87-14.09-5.04-7.05-9.68-15.58-13.91-25.55-4.22-9.97-6.34-19.12-6.34-27.43 0-11.4 3.23-20.35 9.68-26.85 4.31-4.24 9.1-7.23 14.36-8.99 5.27-1.75 10.59-2.58 15.96-2.47 4.54 0 9.12 1.07 13.73 3.2 4.62 2.13 8.1 3.2 10.45 3.2 1.95 0 5.48-1.07 10.58-3.2 5.1-2.13 10.4-3.05 15.89-2.76 10.02.56 18.06 3.66 24.11 9.3 2.11 1.95 3.96 4.11 5.56 6.47-8.14 4.54-12.26 10.37-12.35 17.48-.1 8.87 3.4 15.53 10.52 19.98 2.05 1.28 4.41 2.36 7.1 3.23-1.63 4.96-3.83 10.08-6.61 15.35zM113.11 31.06c0-7.28-2.65-13.57-7.96-18.87-5.55-5.59-12.18-8.58-19.89-8.97-1.12 7.74 1.54 14.44 7.96 20.08 5.75 5.09 12.36 7.96 19.89 7.76z"/></svg>
);

export default PaymentMethodCard;
