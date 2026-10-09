// Seller Members Types

export interface UpdateMemberRoleRequest {
  role: string;
}

export interface SendInvitationRequest {
  store_id: string;
  email: string;
  role: string;
}

