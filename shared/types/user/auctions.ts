// User Auctions Types

export interface CreateAuctionRequest {
  category_id: string;
  region_id: string;
  name: string;
  description: string;
  latitude: string;
  longitude: string;
  start_date: string;
  end_date: string;
  social_links: {
    phone: string;
  };
  start_price: string;
  current_price: string;
  is_extended: string;
}

export interface SubmitBidRequest {
  amount: string;
}

export interface UpdateAuctionsRequest {
  category_id: string;
  region_id: string;
  name: string;
  description: string;
  latitude: string;
  longitude: string;
  start_date: string;
  end_date: string;
  social_links: {
    phone: string;
  };
}

