// User Profiles Types

export interface UpdateCompanyProfileRequest {
  name: string;
  email: string;
  phone: string;
  region_id: string;
  photo: File | Blob;
  company_name: string;
  registration_no: string;
  vat_tax_id: string;
  logo: File | Blob;
  trade_license: File | Blob;
  website: string;
}

export interface UpdateConsumerProfileRequest {
  name: string;
  email: string;
  region_id: string;
  photo: string;
}

export interface UpdateRoleRequest {
  role: string;
}

