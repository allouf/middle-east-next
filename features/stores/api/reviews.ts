import api from "@/lib/api";
import { REVIEWS_ENDPOINT } from "@/shared/constants/urls";
import { ReviewResponse, Review, ReviewStatistics } from "../types";

/**
 * Fetch reviews for a specific store
 */
export async function fetchStoreReviews(
  storeId: string,
  params: { page?: number; per_page?: number; search?: string } = {}
): Promise<ReviewResponse> {
  const response = await api.get(REVIEWS_ENDPOINT.getByStore(storeId), { params });
  const payload = response.data?.data ?? response.data ?? {};
  const reviews = Array.isArray(payload?.reviews?.data)
    ? payload.reviews.data
    : Array.isArray(payload?.reviews)
    ? payload.reviews
    : Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload)
    ? payload
    : [];
  const meta =
    payload?.meta ||
    payload?.reviews?.meta ||
    payload?.data?.meta;

  return { reviews, meta };
}

/**
 * Fetch review details
 */
export async function fetchReviewDetails(
  reviewId: string
): Promise<Review> {
  const response = await api.get(REVIEWS_ENDPOINT.show(reviewId));
  return response.data?.data ?? {};
}

/**
 * Fetch review statistics for a specific store
 */
export async function fetchStoreReviewStatistics(
  storeId: string
): Promise<ReviewStatistics> {
  const response = await api.get(REVIEWS_ENDPOINT.statisticsByStore(storeId));
  const payload = response.data?.data ?? response.data ?? {};
  const statistics = payload?.statistics ?? payload;

  if (statistics && typeof statistics === "object" && !Array.isArray(statistics)) {
    return statistics as ReviewStatistics;
  }

  return {};
}
