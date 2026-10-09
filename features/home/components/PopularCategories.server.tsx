import { fetchPopularCategories } from "../api/popularCategories";
import { Category } from "../type";
import PopularCategoriesClient from "./PopularCategories.client";

function mapPopularCategories(categories: Category[]): Category[] {
  return categories
     .filter(cat => cat.is_active)
   // .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
}

export default async function PopularCategories({ locale }: { locale: string }) {
  const data = await fetchPopularCategories(locale);

  if (!data) return null;

  return (<PopularCategoriesClient categories={mapPopularCategories(data)} />);
}
