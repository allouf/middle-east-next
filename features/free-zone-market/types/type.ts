export interface FreeZoneSearchParams {
  /* Pagination */
  page?: string;

  /* Global product search */
  search?: string;

  /* Category filter */
  category?: string;

  /* Price filter */
  min?: string;
  max?: string;

  /* Rating filter */
  rating?: string;

  /* Seller filter */
  seller?: "company" | "person";

  /* Promotions (comma-separated in URL) */
  promo?: string;

  /* Attributes (comma-separated in URL) */
  attr?: string;

  /* Sorting */
  sort?: "popular" | "price_asc" | "price_desc" | "newest";

  /* Country filter (iso2 code, e.g. "AE") */
  country_code?: string;
}
