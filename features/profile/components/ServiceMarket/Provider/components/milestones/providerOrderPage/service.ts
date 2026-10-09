import api from "@/lib/api";
import {
  PROVIDER_SERVICES_ORDERS,
  CLIENT_SERVICES_ORDERS,
} from "@/shared/constants/api-endpoints";

/**
 * Helpers for the provider's view of a single milestone order they
 * received. Uses the existing /provider-orders/show + phase endpoints;
 * the response shape mirrors ServiceOfferOrderDetailsResource (same
 * one the buyer view consumes).
 */

export type ProviderMilestoneOrder = {
  id: number;
  order_number: string;
  orderable_type: string;
  orderable_id: number;
  status: string;
  payment_status: string;
  price: number;
  currency: string;
  purchased_on: string;
  deadline: string | null;
  customer?: {
    id: number;
    name: string;
    avatar: string | null;
    country?: string;
    region?: string;
  };
  milestone_package?: {
    id: number;
    title: string;
    description: string;
    delivery_model: string | null;
    total_budget: number;
    duration_days: number;
  } | null;
  phases: Array<{
    id: number;
    service_name: string;
    category: { id: number; name: string; slug: string } | null;
    duration_days: number;
    budget: number;
    revision_window_days: number | null;
    sort_order: number;
    status: string;
    payment_status: string;
    is_cursor: boolean;
    started_at: string | null;
    deadline: string | null;
    delivered_at: string | null;
    completed_at: string | null;
    deliveries?: Array<{
      id: number;
      version: number;
      message: string;
      attachments: string[];
      submitted_at: string;
    }>;
  }>;
  cursor: {
    phase_id: number;
    phase_name: string;
    sort_order: number;
    status: string;
    payment_status: string;
    action: string;
  } | null;
  summary: {
    service_price: number;
    vat: number;
    fees: number;
    total: number;
    currency: string;
  };
  requirements: {
    notes: string | null;
    attachments: string[];
  };
};

export const providerMilestoneOrderService = {
  /**
   * GET /provider-orders/show/{id}
   * Same endpoint the existing OrderDetails uses — we just consume the
   * milestone-specific fields (phases, cursor, milestone_package) which
   * the BE already returns when orderable_type=milestone_template.
   */
  async getOrder(orderId: number): Promise<ProviderMilestoneOrder> {
    const response = await api.get(PROVIDER_SERVICES_ORDERS.getDetails(orderId));
    return response.data?.data as ProviderMilestoneOrder;
  },

  /**
   * POST /provider-orders/{orderId}/phases/{phaseId}/start
   * Only valid when the phase is funded (escrow=PAID) and status=PendingPayment.
   * Backend flips status to InProgress and starts the deadline countdown.
   */
  async startPhase(orderId: number, phaseId: number): Promise<ProviderMilestoneOrder> {
    const response = await api.post(PROVIDER_SERVICES_ORDERS.phaseStart(orderId, phaseId));
    return response.data?.data as ProviderMilestoneOrder;
  },

  /**
   * POST /provider-orders/{orderId}/define-milestone
   * Provider defines the milestone template inline on a status=Negotiation
   * order. Body matches StoreMilestoneRequest: title + description +
   * delivery_model + request_modification_days + services[].
   *
   * Backend creates the Milestone in the provider's library, copies its
   * services into service_offer_order_phases for this order, sets
   * current_phase_id + orderable_type/_id, and flips status to
   * PendingPayment so the buyer can pay phase 1.
   */
  async defineMilestone(
    orderId: number,
    payload: {
      title: string;
      description: string | null;
      delivery_model: string;
      request_modification_days: number;
      services: Array<{
        service_name: string;
        service_category_id: number;
        duration_days: number;
        budget: number;
        revision_window_days: number;
      }>;
    },
  ): Promise<ProviderMilestoneOrder> {
    const response = await api.post(PROVIDER_SERVICES_ORDERS.defineMilestone(orderId), payload);
    return response.data?.data as ProviderMilestoneOrder;
  },

  /**
   * POST /provider-orders/{orderId}/phases/{phaseId}/deliver
   * Multipart: message + attachments[]. Only valid when status=InProgress.
   */
  async deliverPhase(
    orderId: number,
    phaseId: number,
    message: string,
    attachments: File[],
  ): Promise<ProviderMilestoneOrder> {
    const formData = new FormData();
    formData.append("message", message);
    attachments.forEach((file) => formData.append("attachments[]", file));

    const response = await api.post(
      PROVIDER_SERVICES_ORDERS.phaseDeliver(orderId, phaseId),
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data?.data as ProviderMilestoneOrder;
  },
};

// Re-export so callers don't have to import from two places.
export { CLIENT_SERVICES_ORDERS };
