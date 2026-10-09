import React from 'react';

const SkillSkeleton = () => {
    return (
        <div className="bg-[#FCFCFC] rounded-[20px] p-8 border border-gray-100 flex flex-wrap gap-4 animate-pulse">
            {[1, 2, 3, 4, 5].map((index) => (
                <div key={index} className="flex items-center gap-3 bg-gray-100 px-4 py-2.5 rounded-full border border-gray-200">
                    <div className="w-8 h-8 bg-gray-200 rounded-full shrink-0"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="w-4 h-4 bg-gray-200 rounded shrink-0 ml-2"></div>
                </div>
            ))}
        </div>
    );
};

export default SkillSkeleton;
