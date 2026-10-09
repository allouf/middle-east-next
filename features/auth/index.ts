// Auth Feature - Client-Safe Exports
// For server-only utilities, import from '@/features/auth/server'

// Components (Client) - Login
export { default as LoginPage } from './components/LoginPage';
export { default as LoginForm } from './components/LoginForm';
export { default as AuthWrapper } from './components/AuthWrapper';
export { default as GoogleLoginButton } from './components/GoogleLoginButton';
export { default as ForgotPasswordPage } from './components/ForgotPasswordPage';
export { default as ResetPasswordPage } from './components/ResetPasswordPage';
export { default as VerificationCodePage } from './components/VerificationCodePage';
export { default as VerifyAccountPage } from './components/VerifyAccountPage';
export { default as LoginCallbackPage } from './components/LoginCallbackPage';

// Components (Client) - Register
export { default as RegisterPage } from './components/RegisterPage';
export { default as RegisterUserForm } from './components/RegisterUserForm';
export { default as RegisterCompanyForm } from './components/RegisterCompanyForm';
export { default as AccountTypeCard } from './components/AccountTypeCard';
export { default as ReferralPrompt } from './components/ReferralPrompt';

// Hooks (Client)
export { useLoginForm } from './hooks/useLoginForm';
export { useRegisterUserForm, useRegisterCompanyForm } from './hooks/useRegisterForm';
export { useForgotPassword } from './hooks/useForgotPassword';
export { useResetPassword } from './hooks/useResetPassword';
export { useOtpVerification } from './hooks/useOtpVerification';

// Client-safe API utilities
export { getGoogleAuthUrl } from './api/client.api';

// Types (can be used anywhere)
export type {
  // Login types
  LoginFormData,
  LoginRequest,
  LoginResponse,
  UserData,
  TokenData,
  AuthError,
  ErrorMapKey,
  // Register types
  AccountType,
  RegisterUserFormData,
  RegisterUserRequest,
  RegisterCompanyFormData,
  RegisterCompanyRequest,
  RegisterResponse,
  ForgotPasswordFormData,
  ResetPasswordFormData,
  VerifyAccountResponse,
} from './types';

// Constants
export { ACCOUNT_TYPES, ERROR_MAP } from './types';

