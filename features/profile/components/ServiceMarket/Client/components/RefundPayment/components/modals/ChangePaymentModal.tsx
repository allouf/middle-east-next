"use client";

import React, { useState } from 'react';
import Modal from "@/components/ui/Modal";
import { CreditCard, ShieldCheck } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { RiVisaLine } from 'react-icons/ri';
import { FaApple } from 'react-icons/fa';
import { useTranslation } from "@/lib/i18n/useTranslation";

interface ChangePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePaymentModal: React.FC<ChangePaymentModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState<'credit_card' | 'apple_pay' | 'google_pay'>('credit_card');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showLine={false}
      padding="p-0"
      secondPadding="p-0"
      className="border-none rounded-[24px]"
      showCloseButton={false} 
      style={{maxWidth: "700px"}}
    >
        <div className="relative z-10 p-6 md:p-8 flex flex-col gap-6 bg-[#FAFAFA] rounded-[24px]">
            <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center justify-center p-2 rounded-lg bg-[#15803D1A] border border-green-100">
                    <CreditCard className="w-5 h-5 text-blueSite" />
                </div>
                <div>
                    <h3 className="text-[18px] xl:text-[20px] font-bold text-subTitleColor">
                        Change Payment Method
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
                    <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedMethod === 'credit_card' ? 'border-blueSite' : 'border-gray-300'}`}>
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
                    <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedMethod === 'apple_pay' ? 'border-blueSite' : 'border-gray-300'}`}>
                         {selectedMethod === 'apple_pay' && <div className="w-[10px] h-[10px] rounded-full bg-blueSite" />}
                    </div>
                    <div className="flex flex-col items-start gap-1">
                         <span className="text-[14px] font-bold text-subTitleColor">Apple Pay</span>
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
                    <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedMethod === 'google_pay' ? 'border-blueSite' : 'border-gray-300'}`}>
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

             <div className="flex justify-center mt-2">
                <button className="bg-[#00664F] hover:bg-[#00523f] text-white px-12 py-3 rounded-[8px] font-bold text-[14px] w-full max-w-[300px] transition-colors">
                    CHANGE
                </button>
             </div>

             <div className="flex items-center justify-center gap-2 mt-2">
                 <ShieldCheck className="w-4 h-4 text-[#00664F]" />
                 <span className="text-[11px] text-textGrayColor">
                    Your data is secured and encrypted with 256-bit SSL technology
                 </span>
             </div>
        </div>
    </Modal>
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

export default ChangePaymentModal;
