import React from 'react';
import { Divider } from 'antd';

const LanguagesSkeleton = () => {
    return (
        <div className="p-4 rounded-[10px] bg-gray-50 border border-gray-100 animate-pulse">
            {/* header */}
            <div className='flex flex-row gap-2 items-center justify-between'>
                <div className='flex flex-row gap-3 items-center w-full'>
                    <div className="w-12 h-12 bg-gray-200 rounded-full shrink-0"></div>
                    <div className="flex-1 flex flex-col gap-2">
                        <div className="h-5 bg-gray-200 rounded w-48"></div>
                        <div className="flex flex-row items-center gap-1">
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                            <div className="w-3 h-3 bg-gray-200 rounded-full shrink-0"></div>
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </div>
                    </div>
                </div>

                <div className='flex flex-row gap-3 shrink-0'>
                    <div className="w-5 h-5 bg-gray-200 rounded"></div>
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                </div>
            </div>

            <Divider className='!my-3' />

            {/* body */}
            <div className="space-y-3 pt-1">
                <div className='flex items-center gap-2'>
                    <div className="w-4 h-4 bg-gray-200 rounded shrink-0"></div>
                    <div className="h-4 bg-gray-200 rounded w-28"></div>
                    <div className="h-4 bg-gray-200 rounded w-40"></div>
                </div>
            </div>

            {/* footer */}
            <div className='flex flex-row justify-between pt-5'>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
        </div>
    );
};

export default LanguagesSkeleton;
