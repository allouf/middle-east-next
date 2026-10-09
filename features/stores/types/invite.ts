export interface Store {
  id: number;
  name: string;
  description: string;
  logo: string;
}

export interface InvitedBy {
  name: string;
  email: string;
}

export interface PermissionsByCategory {
  [key: string]: string[] | { [key: string]: string };
}

export interface InvitationData {
  token: string;
  member_id: number;
  store: Store;
  role: string;
  role_display: string;
  role_description: string;
  permissions: string[];
  permissions_by_category: PermissionsByCategory;
  invited_by: InvitedBy;
  invited_at: string;
  expires_at: string;
  email: string | null;
  is_expired: boolean;
  can_accept: boolean;
}

export interface InvitationResponse {
  status: boolean;
  message: string;
  data: InvitationData;
}