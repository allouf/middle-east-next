import api from "@/lib/api";
import { PROVIDER_MILESTONE_ENDPOINTS } from "@/shared/constants/api-endpoints";

/** Mirrors Modules\Services\Http\Resources\Provider\MilestoneListResource. */
export type ProviderMilestoneListItem = {
  id: number;
  title: string;
  duration_days: number;
  delivery_model: string | null;
  request_modification_days: number | null;
  total_budget: number;
  activation_status: boolean;
  services_count?: number;
  created_at: string;
  updated_at: string;
};

/** Mirrors Modules\Services\Http\Resources\Provider\MilestoneServiceLineResource. */
export type ProviderMilestoneServiceLine = {
  id: number;
  milestone_id: number;
  service_name: string;
  service_category_id: number;
  category: {
    id: number;
    name: string;
    slug: string;
  } | null;
  duration_days: number;
  budget: number;
  revision_window_days: number | null;
  sort_order: number;
  status: string | null;
  created_at: string;
  updated_at: string;
};

/** Mirrors Modules\Services\Http\Resources\Provider\MilestoneResource. */
export type ProviderMilestoneDetail = {
  id: number;
  service_provider_id: number;
  title: string;
  description: string;
  delivery_model: string | null;
  request_modification_days: number | null;
  duration_days: number;
  total_budget: number;
  status: string | null;
  activation_status: boolean;
  sort_order: number;
  summary: {
    delivery_model: string | null;
    timeline_days: number;
    total_budget: number;
    request_modification_days: number | null;
  };
  services: ProviderMilestoneServiceLine[];
  created_at: string;
  updated_at: string;
};

export type CreateMilestonePayload = {
  title: string;
  description: string;
  delivery_model: "hybrid" | "onsite" | "remote";
  request_modification_days: number;
  /** Optional — derived from sum of service lines on the backend, but accepted. */
  duration_days?: number;
};

export type CreateServiceLinePayload = {
  service_name: string;
  service_category_id: number;
  duration_days: number;
  budget: number;
  revision_window_days: number;
};

export type ProviderMilestoneListPage = {
  milestones: ProviderMilestoneListItem[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

type ListQuery = {
  page?: number;
  perPage?: number;
  search?: string;
  activationStatus?: 0 | 1;
  deliveryModel?: string;
};

export const providerMilestonesService = {
  /**
   * GET /milestones — paginated list of THIS provider's milestone templates.
   * Backend enforces ownership via service.profile.provider middleware +
   * MilestoneService::listForProvider filter; we don't pass provider_id.
   */
  async list(query: ListQuery = {}): Promise<ProviderMilestoneListPage> {
    const params = new URLSearchParams();
    if (query.page) params.append("page", String(query.page));
    if (query.perPage) params.append("per_page", String(query.perPage));
    if (query.search) params.append("search", query.search);
    if (query.activationStatus !== undefined) {
      params.append("activation_status", String(query.activationStatus));
    }
    if (query.deliveryModel) params.append("delivery_model", query.deliveryModel);

    const url = params.toString()
      ? `${PROVIDER_MILESTONE_ENDPOINTS.list}?${params.toString()}`
      : PROVIDER_MILESTONE_ENDPOINTS.list;

    const response = await api.get(url);
    return response.data?.data as ProviderMilestoneListPage;
  },

  /**
   * POST /milestones/toggle-activation/{id} — flips activation_status.
   * Returns the updated milestone.
   */
  async toggleActivation(id: number): Promise<ProviderMilestoneListItem> {
    const response = await api.post(PROVIDER_MILESTONE_ENDPOINTS.toggleActivation(id));
    return response.data?.data as ProviderMilestoneListItem;
  },

  /**
   * DELETE /milestones/delete/{id} — soft-deletes the template.
   * Backend rejects if the milestone has live orders attached.
   */
  async remove(id: number): Promise<void> {
    await api.delete(PROVIDER_MILESTONE_ENDPOINTS.delete(id));
  },

  /**
   * GET /milestones/show/{id} — full detail for the provider-owned
   * milestone (404 if it's not theirs, enforced by the BE).
   */
  async show(id: number): Promise<ProviderMilestoneDetail> {
    const response = await api.get(PROVIDER_MILESTONE_ENDPOINTS.show(id));
    return response.data?.data as ProviderMilestoneDetail;
  },

  /**
   * POST /milestones — creates the milestone shell. Service lines are
   * added separately via addServiceLine() because the BE accepts them
   * as nested CRUD rather than as a single batch payload.
   */
  async create(payload: CreateMilestonePayload): Promise<ProviderMilestoneDetail> {
    const response = await api.post(PROVIDER_MILESTONE_ENDPOINTS.create, payload);
    return response.data?.data as ProviderMilestoneDetail;
  },

  /**
   * POST /milestones/{milestoneId}/services — append a service line.
   * Caller uses this in a loop after create() to add each phase.
   */
  async addServiceLine(
    milestoneId: number,
    payload: CreateServiceLinePayload,
  ): Promise<ProviderMilestoneServiceLine> {
    const response = await api.post(
      PROVIDER_MILESTONE_ENDPOINTS.addServiceLine(milestoneId),
      payload,
    );
    return response.data?.data as ProviderMilestoneServiceLine;
  },

  /**
   * DELETE /milestones/services/delete/{lineId} — drop a single line.
   */
  async deleteServiceLine(lineId: number): Promise<void> {
    await api.delete(PROVIDER_MILESTONE_ENDPOINTS.deleteServiceLine(lineId));
  },
};
