import api from "@/lib/api";
import { STRIPE_ONBOARDING_ENDPOINTS } from "@/shared/constants/api-endpoints";

export type SellerStripeAccountSummary = {
  stripe_account_id: string;
  details_submitted: boolean;
  charges_enabled: boolean;
  payouts_enabled: boolean;
  ready_for_charges: boolean;
  country: string | null;
  default_currency: string | null;
  last_synced_at: string | null;
};

export type StartOnboardingResponse = {
  account: SellerStripeAccountSummary;
  onboarding_url: string;
};

export type OnboardingStatus =
  | { kind: "not_started" }
  | { kind: "ready"; account: SellerStripeAccountSummary }
  | { kind: "incomplete"; account: SellerStripeAccountSummary };

export const sellerStripeOnboardingService = {
  /**
   * GET /seller/stripe-onboarding/status (optionally ?refresh=1 to force
   * a fresh sync from Stripe rather than reading our cached snapshot).
   * Returns kind='not_started' when the seller has no row yet — caller
   * should offer the "Set up payments" CTA.
   */
  async getStatus(refresh = false): Promise<OnboardingStatus> {
    try {
      const url = refresh
        ? STRIPE_ONBOARDING_ENDPOINTS.statusRefresh
        : STRIPE_ONBOARDING_ENDPOINTS.status;
      const response = await api.get(url);
      const account: SellerStripeAccountSummary | undefined = response.data?.data?.account;

      if (!account) {
        return { kind: "not_started" };
      }

      return account.ready_for_charges
        ? { kind: "ready", account }
        : { kind: "incomplete", account };
    } catch (error: any) {
      // Backend returns 404 with key 'stripe_onboarding_not_started' when
      // the seller has no SellerStripeAccount row yet. That's the normal
      // first-time path, not an error.
      if (error?.response?.status === 404) {
        return { kind: "not_started" };
      }
      throw error;
    }
  },

  /**
   * POST /seller/stripe-onboarding — idempotent on the backend (returns
   * a fresh Account Link URL even if the seller already has an account).
   */
  async start(): Promise<StartOnboardingResponse> {
    const response = await api.post(STRIPE_ONBOARDING_ENDPOINTS.start);
    return response.data?.data as StartOnboardingResponse;
  },
};
