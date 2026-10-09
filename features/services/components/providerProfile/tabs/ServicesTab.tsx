import React, { useEffect, useState } from 'react'
import ServiceCard from '../../ServiceCard';
import { Input, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import useGetData from '@/lib/api/useGetData';
import { PUBLIC_PROVIDER_PROFILE } from '@/shared/constants/api-endpoints';
import Pagination from '@/components/ui/Pagination';
import { useTranslation } from '@/lib/i18n/useTranslation';


const ServicesTab = ({profileId}:{profileId:number}) => { 
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchQuery, setActiveSearchQuery] = useState("");


  const {data ,loading,error} = useGetData({
    url:PUBLIC_PROVIDER_PROFILE.services(profileId),
    paginate: true,
    extraParams: { 
      page: currentPage,
      per_page: rowsPerPage,
      search: activeSearchQuery }
  })
  
  const rawServices = data?.data?.services || [];
  const meta = data?.data?.meta || { current_page: 1, last_page: 1, per_page: 15, total: 0 };


   

  const services = rawServices.map((item: any) => ({
    id: item.id,
    title: item.title,
    slug: "",
    description: item.description,
    price: (item.price_from || 0).toString(),
    is_price_negotiable: false, 
    status: 'active',
    contact_method: 'both',
    show_phone: false,
    images: item.cover ? [item.cover] : [],
    views_count: 0,
    published_at: item.created_at,
    is_owner: false,
    is_favorited: false,
    user: {
      id: item.service_provider?.id,
      name: item.service_provider?.display_name || t("services.providerProfile.providerFallback", { defaultValue: "Provider" }),
      photo: null,
    },
    country_code: item.service_provider?.country_code,
    category: {
      id: item.service_category?.id,
      name: item.service_category?.name,
      slug: item.service_category?.slug,
    },
    region: item.service_provider?.region,
    created_at: item.created_at,
    updated_at: item.created_at,
    service_type: item.type,
    provider_type: null,
  })) as any[]; 

  useEffect(()=>{
    console.log("profile Services",services)
    

  },[data])


  // Loading and error states are handled inside the render now

  return (
    <div className='animate-in fade-in duration-500'>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <Input 
            placeholder={t("services.providerProfile.searchServicesPlaceholder", { defaultValue: "Search for anything..." })} 
            prefix={
              <button onClick={() => setActiveSearchQuery(searchQuery)} className="hover:text-blueSite transition-colors focus:outline-none flex items-center justify-center">
                <SearchOutlined className="text-gray-400 cursor-pointer" />
              </button>
            }
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (!e.target.value) setActiveSearchQuery("");
            }}
            onPressEnter={() => setActiveSearchQuery(searchQuery)}
            className="w-full sm:max-w-[300px] h-10 rounded-lg"
            allowClear
          />
          <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-2">
            <span className="text-gray-500 whitespace-nowrap">
              {t("services.providerProfile.sortByLabel", { defaultValue: "Sort by:" })}
            </span>
            <Select 
              defaultValue="highest_rate" 
              className="w-[140px] h-10"
            >
              <Select.Option value="highest_rate">
                {t("services.providerProfile.sortHighestRate", { defaultValue: "Highest Rate" })}
              </Select.Option>
              <Select.Option value="lowest_rate">
                {t("services.providerProfile.sortLowestRate", { defaultValue: "Lowest Rate" })}
              </Select.Option>
              <Select.Option value="newest">
                {t("services.providerProfile.sortNewest", { defaultValue: "Newest" })}
              </Select.Option>
            </Select>
          </div>
        </div>
        {error ? (
          <div className="text-red-500 text-center py-10 w-full">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-4 md:gap-6 mb-6">
            {loading ? (
              // Skeleton Loader
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col rounded-2xl border border-gray-200 bg-white overflow-hidden">
                  <div className="relative w-full h-48 bg-gray-200 animate-pulse"></div>
                  <div className="flex flex-col p-4 gap-3">
                    <div className="flex justify-between items-start">
                      <div className="h-5 bg-gray-200 animate-pulse rounded w-2/3"></div>
                      <div className="h-5 bg-gray-200 animate-pulse rounded w-10"></div>
                    </div>
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
                    <div className="flex items-center gap-2 mt-4">
                      <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 animate-pulse rounded w-24"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : services.length > 0 ? (
              services.map((service: any) => (
                <ServiceCard key={service.id} service={service} />
              ))
            ) : (
              <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 text-center py-10 text-gray-500">
                {t("services.providerProfile.noServicesFoundProvider", { defaultValue: "No services found for this provider." })}
              </div>
            )}
          </div>
        )}

        {!loading && !error && services.length > 0 && meta.last_page > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t">
            <span className="text-sm text-gray-500 mb-4 sm:mb-0">
              {t("common.showing") || "Showing"} 1 - {services.length}{" "}
              {t("common.of") || "of"} {meta.total}
            </span>
            <div>
              <Pagination 
                totalPages={meta.last_page} 
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                onPageChange={(page) => setCurrentPage(page)}
                onRowsPerPageChange={(rows) => {
                  setRowsPerPage(rows);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        )}
    </div>
  )
}

export default ServicesTab