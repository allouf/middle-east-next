// Seller SLA Rules Types

export interface CreateSLARuleRequest {
  store_id: string;
  issue_type_id: string;
  sla_response_hours: string;
}

