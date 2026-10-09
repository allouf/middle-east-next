import { backUrl } from "@/shared/constants/data";

export const formatDate = (
  dateString,
  format = "display",
  locale = "en-US",
  options = { year: "numeric", month: "long", day: "numeric" }
) => {
  if (!dateString) return "-";
  const date = new Date(dateString);

  if (format === "input") {
    // Format to YYYY-MM-DD for input type="date"
    return date.toISOString().split("T")[0];
  }

  return date.toLocaleDateString(locale, options);
};

// ✅ convert "storage/..." to full URL
export  const toPublicUrl = (p?: string | null) => {
    if (!p) return null;

    if (p.startsWith('http://') || p.startsWith('https://')) return p;

    const clean = p.startsWith('/') ? p : `/${p}`;

    return `${backUrl}${clean}`;
};
export const getLastSegment = (url) => {
  if (!url) return null;
  const parts = url.split("/").filter(Boolean); // removes empty parts
  const lastPart = parts[parts.length - 1] || null;
  // Remove query parameters if present
  return lastPart?.split('?')[0] || null;
};

export const isHexColor = (value) => {
  return /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(value);
};

// types/googlePlaces.ts (optional)
export type AddressComponent = {
  long_name?: string;
  short_name?: string;
  types: string[];
};

type ExtractedAddress = {
  country: string;
  country_code: string;
  region: string;
  city: string;
  postal_code: string;
};

export const extractAddressData = (
  addressComponents: AddressComponent[] = []
): ExtractedAddress => {
  const getLong = (type: string): string =>
    addressComponents.find((c) => c.types.includes(type))?.long_name ?? "";

  const getShort = (type: string): string =>
    addressComponents.find((c) => c.types.includes(type))?.short_name ?? "";

  return {
    country: getLong("country"),
    country_code: getShort("country"),
    region: getLong("administrative_area_level_1"), // state / region
    city:
      getLong("locality") ||
      getLong("administrative_area_level_2") ||
      getLong("sublocality"),
    postal_code: getLong("postal_code"),
  };
};

// lib/utils/base64ToFile.ts
export function base64ToFile(base64: string, filename: string): File {
  const [meta, data] = base64.split(",");

  if (!meta || !data) {
    throw new Error("Invalid base64 string (expected 'data:mime/type;base64,...').");
  }

  const match = meta.match(/:(.*?);/);
  const mime = match?.[1] ?? "application/octet-stream";

  const bstr = atob(data);
  const u8arr = new Uint8Array(bstr.length);

  for (let i = 0; i < bstr.length; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }

  return new File([u8arr], filename, { type: mime });
}





export const getPaginationRange = (meta: {
  current_page: number;
  per_page: number;
  total: number;
}) => {
  if (meta.total === 0) {
    return { from: 0, to: 0 };
  }

  const from = (meta.current_page - 1) * meta.per_page + 1;
  const to = Math.min(meta.current_page * meta.per_page, meta.total);

  return { from, to };
};

export const getCssVar = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

// slug.ts
export function generateSlug(input: string): string {
  if (!input) return "";

  return (
    input
      .trim()
      .toLowerCase()

      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "") 

      .replace(/[^\p{L}\p{N}]+/gu, "-")

      .replace(/^-+|-+$/g, "")

      .replace(/-+/g, "-")
  );
}

export function generateSlugId(title: string, id: number | string) {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // حذف الرموز
    .replace(/\s+/g, "-"); // تحويل المسافات إلى -

  return `${slug}-${id}`;
}
