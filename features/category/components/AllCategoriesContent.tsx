import React from 'react'
import { CategorySearchParams ,Category, CategoryResponse} from '../types/type';
import { fetchCategoriesWithChildren } from '../api/getCategoriesWithChildren';
import CategoryCard from './CategoryCard';
import FiltersHeader from './FilterHeader';
import { fetchParentCategoreis } from '../api/getParentCategories';
import { getT } from '@/lib/i18n/server';
import Pagination from '@/components/ui/Pagination';

const AllCategoriesContent = async ({ searchParams, locale }: { searchParams: CategorySearchParams, locale: string }) => {
  const t = await getT(locale);
  const search = searchParams?.search ?? "";
  const page = searchParams?.page ?? "1";
  const sort = searchParams?.sort

  const query = new URLSearchParams({
    ...(search && { "search": search }),
    ...(page && { "page": page }),
    ...(sort && { "sort": sort }),

  }).toString()
  const categoriesRes: CategoryResponse = await fetchParentCategoreis(query, locale);

  // console.log("categories ",categories)

  // Flatten all categories with children into a single array


  const allCategories = categoriesRes?.categories || [];
  const meta = categoriesRes?.meta;

  console.log("allcategories ", categoriesRes)

  return (
    <>
      <FiltersHeader results={allCategories.length} sortOptions={[
        { value: "most_popular", label: t("filters.sort.most_popular") },
        { value: "newest", label: t("filters.sort.newest") },
        { value: "oldest", label: t("filters.sort.oldest") },
      ]} />
      <div className="py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {allCategories.map((category) => (
            <CategoryCard 
              key={category.id} 
              category={category} 
              locale={locale} 
              isChild={false}
            />
          ))}
        </div>
        {meta && meta.last_page > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination 
              currentPage={Number(page)} 
              totalPages={meta.last_page} 
            />
                     
          </div>
        )}
      </div>
    </>
  )
}

export default AllCategoriesContent