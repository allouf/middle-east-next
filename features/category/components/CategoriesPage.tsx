import React, { Suspense } from 'react'
import CategoriesSideBar from './CategoriesSideBar'
import CategoriesContent from './CategoriesContent'
import { Category, CategorySearchParams } from '../types/type'
import LoaderPage from '@/components/shared/LoaderPage'
import FiltersHeader from './FilterHeader'
import { fetchCategoriesWithChildren } from '../api/getCategoriesWithChildren'


interface CategoriesPageProps {
  searchParams: CategorySearchParams
  locale: string
}
const CategoriesPage = async ({ searchParams, locale }: CategoriesPageProps) => {
  const search = searchParams?.category_search ?? "";

  const query = new URLSearchParams({
    ...(search && { "search": search }),

  }).toString()
  const categories: Category[] = await fetchCategoriesWithChildren(query, locale);

  // console.log("categories ",categories)
  return (
    <div >
      <div className="relative w-full sm:h-56 h-[100px] bg-gray-100 flex items-center justify-center mb-10">
        {/* {storeCover ? (
            <img
                src={storeCover}
                alt="cover"
                className="w-full h-full object-cover"
                onError={(e) => {
                e.target.style.display = "none";
                }}
            />
            ) : ( */}
        <div className="w-full h-full bg-gradient-to-tr from-blueSite  via-[#323232] to-blueSite flex items-center justify-center">
          {/* <h1 className="text-textWhiteColor text-2xl md:text-3xl font-bold">
                Category Name
                </h1> */}
        </div>

      </div>
      <div className='flex flex-col md:flex-row gap-6 px-6 pb-16'>
        <CategoriesSideBar categories={categories} searchParams={JSON.parse(JSON.stringify(searchParams))} />
        <main className='flex-1 mt-12 lg:mt-2 '>

          <Suspense fallback={<main className="flex-1">
            {/* Products grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="border rounded-lg p-3 space-y-3">
                  {/* Image */}
                  <div className="h-[180px] bg-gray-200 rounded" />

                  {/* Title */}
                  <div className="h-4 w-3/4 bg-gray-200 rounded" />

                  {/* Rating */}
                  <div className="h-3 w-24 bg-gray-200 rounded" />

                  {/* Price */}
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </main>}>
            <CategoriesContent searchParams={searchParams} locale={locale} />
          </Suspense>
        </main>
      </div>
    </div>
  )
}

export default CategoriesPage
