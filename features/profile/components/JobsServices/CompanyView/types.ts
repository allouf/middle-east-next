export type CompanyProfileFormState = {
  description: string;
};

export type CompanyProfileFormErrors = Partial<{
  description: string;
  logo: string;
  cover: string;
}>;



export type TeamMember = {
  id: number;
  name: string;
  company_id?: number;
  position?: string | null;
  sort_order?: number | null;
  image?: string | null;
};

export type CompanyProfile = {
  id: number;
  user_id: number;

  company_name: string;
  registration_no: string | null;
  vat_tax_id: string | null;

  logo: string | null;
  cover: string | null;
  trade_license: string | null;

  website: string | null;
  description: string | null;

  gallery: string[]; 
  team_members: TeamMember[];

  created_at: string;
  updated_at: string;
};