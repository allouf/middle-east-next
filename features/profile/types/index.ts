import { ReactNode } from "react";

export type ProfileRole = "consumer" | "company";

export type ProfileTabKey =
  | "basic"
  | "referrals"
  | "devices_managment"
  | "balance"
  | "wishlist"
  | "orders"
  | "addresses"
  | "settings"
  | "company_stores"
  | "used_market"
  | "compare"
  | "trashed"
  | "mytickets"
  | "jobs_services"
  | "service_market";

export interface ProfileTabDropdown {
  id: number;
  name: string;
  key: string;
  component: ReactNode;
  icon: ReactNode;
  roles: ProfileRole[];
}

export interface ProfileTab {
  id: number;
  name: string;
  key: ProfileTabKey;
  icon: ReactNode;
  roles: ProfileRole[];
  dropdown?: ProfileTabDropdown[];
}

export interface ProfileLocation {
  id?: number | string | null;
  name?: string | null;
}

export interface ProfileUser {
  id?: number | string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | string[] | null;
  photo?: string | null;
  country_code?: string | null;
  country?: {
    id?: number;
    num_code?: number;
    alpha_2_code?: string;
    alpha_3_code?: string;
    en_short_name?: string;
    nationality?: string;
  } | null;
  region?: string | {
    id?: number;
    country_id?: number;
    name?: string;
  } | null;
  is_active?: boolean | null;
  is_profile_complete?: boolean | null;
  is_verified?: boolean | null;
  ref_code?: string | null;
  role?: "consumer" | "company" | null;
  company_name?: string | null;
  registration_no?: string | null;
  vat_tax_id?: string | null;
  logo?: string | null;
  trade_license?: string | null;
  website?: string | null;
  created_at?: string | null;
}

export interface ProfileApiResponse {
  status?: boolean;
  message?: string;
  data?: {
    user: ProfileUser;
  };
}

export interface ProfileContentProps {


  userData?: ProfileApiResponse | null;

}
