import type { ImageLoaderProps } from "next/image";
import { ensureHttps, storageURL } from "@/shared/constants/data";

const normalizeSrc = (src: string): string => {
  // Allow data URLs to pass through unchanged
  if (src.startsWith("data:")) return src;

  // Keep public assets (root-relative) as-is to avoid rewriting to storage
  if (src.startsWith("/")) {
    return src;
  }

  // Already absolute (http/https) -> enforce https to avoid mixed content
  if (/^https?:\/\//i.test(src)) {
    return ensureHttps(src);
  }

  // Treat anything else as a storage-relative path
  const cleaned = src.replace(/^\/+/, "");
  return `${storageURL}/${cleaned}`;
};

const imageLoader = ({ src, width, quality }: ImageLoaderProps): string => {
  const normalized = normalizeSrc(src);

  // Skip query param rewriting for data URLs
  if (normalized.startsWith("data:")) {
    return normalized;
  }

  // For local public assets, attach width/quality as query params but keep path intact
  if (normalized.startsWith("/")) {
    const params = new URLSearchParams();
    params.set("w", width.toString());
    params.set("q", (quality || 70).toString());
    return `${normalized}?${params.toString()}`;
  }

  // For external URLs, check if they're from our API domain
  try {
    const url = new URL(normalized);
    
    // Don't add query parameters to external API URLs that might not support them
    // but still construct a proper URL with width for Next.js compatibility
    if (url.hostname.includes('mideastcom.net') || url.hostname.includes('middleeastcommerce.net')) {
      // Add width parameter to satisfy Next.js requirements
      url.searchParams.set("w", width.toString());
      if (quality) {
        url.searchParams.set("q", quality.toString());
      }
      return url.toString();
    }
    
    // For other external URLs, add query parameters
    url.searchParams.set("w", width.toString());
    url.searchParams.set("q", (quality || 70).toString());
    return url.toString();
  } catch {
    // Fallback to normalized string if URL parsing fails
    return normalized;
  }
};

export default imageLoader;
