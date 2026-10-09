import GlowLight from '@/components/shered/GlowLight'
import React, { Suspense } from 'react'
import { CategorySearchParams ,Category } from '@/features/category/types/type'
import { fetchCategoriesWithChildren } from '../api/getCategoriesWithChildren';
import FiltersHeader from './FilterHeader';
import AllCategoriesContent from './AllCategoriesContent';
import LoaderPage from '@/components/shared/LoaderPage';

const AllCategoriesPage = async ({searchParams,locale}:{searchParams:CategorySearchParams,locale:string}) => {

  return (
    <div>
        <div className='relative w-full sm:h-56 h-[100px] bg-gray-100 flex items-center justify-center'>
            <div className={`relative z-10 w-full h-full bg-[#323232] flex items-center justify-center overflow-hidden`}>
                {/* <h1 className="text-textWhiteColor text-2xl md:text-3xl font-bold relative z-10">
                {storeName}
                </h1> */}

                <GlowLight
                color="#00664F"
                size="w-[200px] h-[200px]"
                opacity="opacity-100"
                blur="blur-[120px]"
                position="-top-24 -right-16"
                // offset="translate-x-1/3 -translate-y-1/3"
                />
                <GlowLight
                color="#00664F"
                size="w-[200px] h-[200px]"
                opacity="opacity-100"
                blur="blur-[120px]"
                position="bottom-0 start-0"
                // offset="-translate-x-1/3 translate-y-1/3"
                />
            </div>
        </div>
        <main className='px-6 py-4'>
            
            {/* <Suspense fallback={<LoaderPage />}> */}
                <AllCategoriesContent searchParams={searchParams} locale={locale}/>
            {/* </Suspense> */}
        </main>
      
    </div>
  )
}

export default AllCategoriesPage