export type ProviderProfile = {
  id: number;
  user_id: number;
  type: string;
  display_name: string;
  country_code?: string;
  region?: string;
  bio: string | null;
  identity_document: string | null;
  verification_notes: string | null;
  verification_status?: "none" | "pending" | "rejected" | "verified";
  languages?: ProviderLanguage[];
  logo: string | null;
  cover: string | null;
  // Optional fields that may not be present in API response
  gallery?: string[];
  team_members?: ProviderTeamMember[];

  created_at: string;
  updated_at: string;
};

export type ProviderLanguage = {
  id: number;
  code: string;
  name: string;
};

export type ProviderTeamMember = {
  id: number;
  name: string;
  provider_id?: number;
  position?: string | null;
  sort_order?: number | null;
  image?: string | null;
};

export type ProviderProfileFormState = {
  display_name: string;
  country_code?: string;
  region?: string;
  bio?: string;
  verification_notes?: string;
  language_ids?: number[];
  identity_document?: File | null;
  // Legacy fields for backward compatibility
  provider_name?: string;
  description?: string;
  website?: string;
  location?: string;
  languages?: string[];
};

export type ProviderProfileFormErrors = Partial<{
  display_name: string;
  country_code: string;
  region: string;
  bio: string;
  verification_notes: string;
  language_ids: string;
  identity_document: string;
  // Legacy fields for backward compatibility
  provider_name: string;
  description: string;
  website: string;
  location: string;
  languages: string;
  logo: string;
  cover: string;
}>;

// Project types
export type ProjectFormState = {
  title: string;
  description: string;
  url: string;
  sort_order: string;
  service_offer_ids: number[];
  images: File[];
};

export type ProjectFormErrors = Partial<{
  title: string;
  description: string;
  url: string;
  sort_order: string;
  service_offer_ids: string;
  images: string;
}>;