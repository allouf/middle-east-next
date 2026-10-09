// Auth Feature Types

// ==================== LOGIN ====================

export interface LoginFormData {
  contact: string;
  password: string;
}

export interface LoginRequest {
  contact: string;
  password: string;
}

export interface LoginResponse {
  data: {
    user: UserData;
    tokens: TokenData;
  };
}

export interface UserData {
  email: string;
  is_verified: boolean;
  role: string;
}

export interface TokenData {
  access_token: string;
  refresh_token: string;
}

export interface AuthError {
  message: string;
  code?: string;
}

export type ErrorMapKey = 'Invalid credentials' | 'User not found';

export const ERROR_MAP: Record<ErrorMapKey, string> = {
  "Invalid credentials": "errors.invalidCredentials",
  "User not found": "errors.invalidCredentials", // same message for security
};

// ==================== REGISTER ====================

export type AccountType = 'user' | 'company';

export const ACCOUNT_TYPES = {
  USER: 'user' as AccountType,
  COMPANY: 'company' as AccountType,
} as const;

// User Registration
export interface RegisterUserFormData {
  name: string;
  contact: string;
  country_code: string;
  region: string;
  region_name: string;
  password: string;
  confirm_password: string;
  agree_terms: boolean;
  ref_code?: string;
}

export interface RegisterUserRequest {
  name: string;
  contact: string;
  password: string;
  country_code: string;
  region: string;
  ref_code?: string;
}

// Company Registration
export interface RegisterCompanyFormData {
  name: string;
  company_name: string;
  contact: string;
  website?: string;
  country_code: string;
  region: string;
  region_name: string;
  password: string;
  confirm_password: string;
  logo?: File | null;
  trade_license?: File | null;
  registration_no?: string;
  vat_tax_id?: string;
  agree_terms: boolean;
  ref_code?: string;
}

export interface RegisterCompanyRequest {
  name: string;
  contact: string;
  password: string;
  country_code: string;
  region: string;
  company_name: string;
  registration_no?: string;
  vat_tax_id?: string;
  logo?: File | Blob;
  trade_license?: File | Blob;
  website?: string;
  ref_code?: string;
}

export interface RegisterResponse {
  data: {
    email: string;
    phone?: string;
    is_verified: boolean;
    role: string;
  };
}

// ==================== PASSWORD RESET ====================

export interface ForgotPasswordFormData {
  contact: string;
}

export interface ResetPasswordFormData {
  contact: string;
  reset_token?: string | null;
  new_password: string;
  new_password_confirmation: string;
}

// ==================== OTP VERIFICATION ====================

export interface VerifyAccountResponse {
  data: {
    tokens?: TokenData;
    user: UserData;
  };
}

