import React from 'react'
import { fetchSponsoredProducts, fetchSponsoredCategories } from '../api/sponsored'
import SponsoredProducts_client from './SponsoredProducts_client'
import { SponsoredProduct, SponsoredCategory, MappedSponsoredProduct } from '../type'

const SponsoredProducts_server = async ({ locale, searchParams }: { locale: string; searchParams: { [key: string]: string | string[] | undefined } }) => {
    

    
    // Extract category_id from searchParams and build query string
    const query = searchParams.category_id ? `category_id=${searchParams.category_id}` : ""
    

    
    const sponsoredProducts = await fetchSponsoredProducts(locale, query)
    const sponsoredCategories = await fetchSponsoredCategories(locale)


  
  // Map sponsored products to compatible type
  const mappedProducts: MappedSponsoredProduct[] = sponsoredProducts.map((product: any) => ({
    ...product,
    availability_status: product.availability_status === 'sold_out' ? 'unavailable' : product.availability_status
  }))
  
  return (
    <SponsoredProducts_client 
      sponsoredProducts={mappedProducts} 
      sponsoredCategories={sponsoredCategories as SponsoredCategory[]}
    />
  )
}

export default SponsoredProducts_server