export interface ReviewUser {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  description: string;
  images: string[];
  is_approved: boolean;
  user: ReviewUser;
  created_at: string;
  updated_at: string;
}

export interface ReviewStatistics {
  total?: number;
  total_reviews?: number;
  new?: number;
  new_reviews?: number;
  highest_rating?: number;
  lowest_rating?: number;
  average_rating?: number;
  [key: string]: unknown;
}

export interface ReviewPaginationMeta {
  current_page?: number;
  per_page?: number;
  total?: number;
}

export interface ReviewResponse {
  reviews: Review[];
  meta?: ReviewPaginationMeta;
}
