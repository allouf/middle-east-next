import { useTranslation } from '@/lib/i18n/useTranslation'
import { FileText } from 'lucide-react'
import React from 'react'
import { LuCalendarClock, LuClock, LuCheck, LuX } from 'react-icons/lu'

import { TimeRemaining, OrderExtension } from '../types'

const NumberRemain = ({number,title}:{number:number,title:string})=>{
    return (
        <div className='flex flex-col justify-center items-center gap-1 min-w-[60px]'>
            <div className='text-[30px] font-bold text-[#EF4444]'>
                {number}
            </div>
            <div className='text-[10px] text-subTitleColor'>
                {title}
            </div>
        </div>
    )
}

interface Props {
  timeRemaining?: TimeRemaining;
  extensions?: OrderExtension[];
  onAcceptExtension?: (extensionId: number) => void;
  onRejectExtension?: (extensionId: number) => void;
}

const TimeRemainingCard: React.FC<Props> = ({ timeRemaining, extensions, onAcceptExtension, onRejectExtension }) => {
  const {t} = useTranslation();

  if (!timeRemaining) return null;
  
  const totalMinutes = timeRemaining.totalMinutes || 0;
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = Math.floor(totalMinutes % 60);

  // Display the approved extension if there is one, otherwise display the latest one
  const displayExtension = extensions && extensions.length > 0 
    ? (extensions.find((ext: any) => ext.status === 'APPROVED') || extensions[extensions.length - 1])
    : null;

  return (
    <div className="relative rounded-[20px] bg-[#FAFAFA] border border-[#E2E8F0] overflow-hidden shadow-sm flex flex-col mb-6">
      <div className="p-6 flex flex-col md:flex-row justify-between gap-4">
        <div className='flex flex-row items-center gap-4'>
            <div className={`flex items-center justify-center p-2 rounded-lg ${timeRemaining.isOverdue ? 'bg-red-50 border-red-100' : 'bg-[#15803D1A] border-green-100'}`}>
                <LuCalendarClock className={`w-5 h-5 ${timeRemaining.isOverdue ? 'text-red-500' : 'text-blueSite'}`} />
            </div>
            <div>
            <h3 className="text-[18px] font-bold text-subTitleColor">
                {t('orderDetails.timeRemaining', { defaultValue: 'Time Remaining' })}
            </h3>  
            <p className="text-[14px] text-textGrayColor leading-relaxed pr-0 md:pr-10 mt-1">
                {timeRemaining.started ? (
                  <>
                    <span className={`font-bold ${timeRemaining.isOverdue ? 'text-red-500' : 'text-subTitleColor'}`}>
                      {timeRemaining.formatted}
                    </span> {timeRemaining.isOverdue ? 'overdue' : 'remaining to complete the service.'}
                  </>
                ) : (
                  <span className='font-bold text-subTitleColor'>{timeRemaining.formatted}</span>
                )}
            </p>  
            </div>
        </div>
        
        {timeRemaining.started && totalMinutes > 0 && !timeRemaining.isOverdue && (
          <div className='flex flex-row items-center gap-2 justify-center'>
              <NumberRemain number={days} title={t('common.days', { defaultValue: 'DAYS' })}/>
              <span className='text-2xl font-bold text-gray-300 mb-4'>:</span>
              <NumberRemain number={hours} title={t('common.hours', { defaultValue: 'HOURS' })}/>
              <span className='text-2xl font-bold text-gray-300 mb-4'>:</span>
              <NumberRemain number={minutes} title={t('common.minutes', { defaultValue: 'MINUTES' })}/>
          </div>
        )}
      </div>

      {displayExtension && (
        <div className="bg-[#F4F4F4] border-t border-[#E2E8F0] p-4 px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 flex-1">
            <div className="flex items-center gap-2 text-textGrayColor">
              <LuClock className="w-5 h-5 text-blueSite" />
              <span className="text-[14px]">
                {t('orderDetails.extension', { defaultValue: 'Extension' })} : <span className="font-bold text-subTitleColor text-[12px]">{displayExtension.requested_days} {t('common.days', { defaultValue: 'Days' })}</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-textGrayColor">
              <FileText className="w-5 h-5 text-blueSite" />
              <span className="text-[14px]">
                {t('orderDetails.reason', { defaultValue: 'Reason' })}: <span className="text-subTitleColor text-[12px]">{displayExtension.reason.name}</span>
              </span>
            </div>
          </div>
          
          {/* Action Buttons - Only show for PENDING status */}
          {displayExtension.status === 'PENDING' && (
            <div className="flex flex-row items-center gap-3 mt-2 md:mt-0 ml-auto w-full md:w-auto justify-end">
              <button 
                  onClick={() => onAcceptExtension?.(displayExtension.id)}
                  className="w-10 h-10 flex items-center justify-center bg-[#E8F5E9] border border-[#A5D6A7] rounded-[10px] text-[#2E7D32] hover:bg-[#D4E8D9] transition-colors"
                  aria-label="Accept Extension"
              >
                  <LuCheck className="w-6 h-6" />
              </button>
              <button 
                  onClick={() => onRejectExtension?.(displayExtension.id)}
                  className="w-10 h-10 flex items-center justify-center bg-[#FFEBEE] border border-[#EF9A9A] rounded-[10px] text-[#D32F2F] hover:bg-[#FFCDD2] transition-colors"
                  aria-label="Reject Extension"
              >
                  <LuX className="w-6 h-6" />
              </button>
            </div>
          )}

          {/* Status badge for non-pending cases */}
          {displayExtension.status !== 'PENDING' && (
            <div className="ml-auto">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                displayExtension.status === 'APPROVED' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                {displayExtension.status}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default TimeRemainingCard
