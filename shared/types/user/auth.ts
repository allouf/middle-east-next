// User Authentication Types

export interface LoginRequest {
  contact: string;
  password: string;
}

export interface LoginResponse {
  data: {
    user: {
      email: string;
      is_verified: boolean;
      role: string;
    };
    tokens: {
      access_token: string;
      refresh_token: string;
    };
  };
}

export interface CheckForgotPasswordOtpRequest {
  contact: string;
  code: string;
}

export interface ForgotPasswordRequest {
  contact: string;
}

export interface LogoutRequest {
  contact: string;
  password: string;
}

export interface RegisterasCompanyRequest {
  name: string;
  contact: string;
  password: string;
  region_id: string;
  company_name: string;
  registration_no: string;
  vat_tax_id: string;
  logo: File | Blob;
  trade_license: File | Blob;
  website: string;
}

export interface RegisterasConsumerRequest {
  name: string;
  contact: string;
  password: string;
  region_id: string;
}

export interface RegisterasFreelancerRequest {
  name: string;
  contact: string;
  password: string;
  region_id: string;
  profession_id: string;
  national_id: string;
  portfolio_url: string;
}

export interface ResetPasswordRequest {
  contact: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface VerifyAccountRequest {
  contact: string;
  code: string;
}

export interface ConfirmUpgradeRequest {
  token: string;
  profession_id: string;
  national_id: string;
  portfolio_url: string;
}

