import api from "@/lib/api";
import {
  WALLET_ENDPOINTS,
  type WalletTxType,
} from "@/shared/constants/api-endpoints";

/** Mirrors Modules\Wallet\Http\Resources\User\WalletResource. */
export type Wallet = {
  id: number;
  available_balance: string;
  pending_balance: string;
  locked_balance: string;
  currency: string;
  created_at: string;
  updated_at: string;
};

/** Mirrors Modules\Wallet\Http\Resources\User\WalletTransactionResource. */
export type WalletTransaction = {
  id: number;
  type: WalletTxType;
  amount: string;
  balance_before: string;
  balance_after: string;
  reference: { type: string; id: number } | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

export type TransactionsPage = {
  data: WalletTransaction[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
};

/** Mirrors Modules\Wallet\Http\Resources\User\InvoiceResource. */
export type TopupResponse = {
  intent: {
    id: number;
    amount: string;
    currency: string;
    status: string;
    stripe_session_id: string | null;
    stripe_payment_intent_id: string | null;
    failure_reason: string | null;
    completed_at: string | null;
    created_at: string;
  };
  checkout_url: string;
};

type TxQuery = {
  page?: number;
  perPage?: number;
  type?: WalletTxType | null;
};

export const walletService = {
  /** GET /wallet — returns the user's wallet, creating it on first call. */
  async getWallet(): Promise<Wallet> {
    const response = await api.get(WALLET_ENDPOINTS.show);
    return response.data?.data as Wallet;
  },

  /**
   * GET /wallet/transactions — paginated, newest first.
   * Type filter is optional; backend ignores unrecognized values.
   */
  async getTransactions(query: TxQuery = {}): Promise<TransactionsPage> {
    const params = new URLSearchParams();
    if (query.page) params.append("page", String(query.page));
    if (query.perPage) params.append("per_page", String(query.perPage));
    if (query.type) params.append("type", query.type);

    const url = params.toString()
      ? `${WALLET_ENDPOINTS.transactions}?${params.toString()}`
      : WALLET_ENDPOINTS.transactions;

    const response = await api.get(url);
    return response.data?.data as TransactionsPage;
  },

  /**
   * POST /wallet/topup — initiates a Stripe topup. Returns the pending
   * Invoice + a Stripe Checkout URL. Caller redirects the user to that
   * URL; the webhook handler credits the wallet when payment lands.
   *
   * Amount is bounded by the BE (services.stripe.topup_min / topup_max,
   * defaults 1..1000). Two decimal places max.
   */
  async initiateTopup(amount: string | number): Promise<TopupResponse> {
    const response = await api.post(WALLET_ENDPOINTS.topup, {
      amount: typeof amount === "number" ? amount.toFixed(2) : amount,
    });
    return response.data?.data as TopupResponse;
  },
};
