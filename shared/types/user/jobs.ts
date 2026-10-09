// User Jobs Types

export interface CreateOpportunityRequest {
  region_id: string;
  category_id: string;
  name: string;
  description: string;
  type: string;
  min_salary: string;
  max_salary: string;
  starts_at: string;
  expires_at: string;
  social_links: {
    phone: string;
    facebook: string;
  };
}

export interface UpdateOpportunityRequest {
  user_id: string;
  region_id: string;
  category_id: string;
  name: string;
  description: string;
  type: string;
  min_salary: string;
  max_salary: string;
  starts_at: string;
  expires_at: string;
  social_links: {
    phone: string;
    youtube: string;
  };
}

