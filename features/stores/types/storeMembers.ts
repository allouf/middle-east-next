export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  photo?: string;
}

export interface Member {
  id: number;
  user: User | null;
  role: string;
  role_display: string;
  permissions: string[];
  status: 'active' | 'invited' | 'revoked';
  invited_at: string;
  accepted_at: string | null;
  revoked_at: string | null;
  invited_by: {
    id: number;
    name: string;
  } | null;
  revoked_by: {
    id: number;
    name: string;
  } | null;
  store: {
    id: number;
    name: string;
  };
}

export interface MembersResponse {
  status: boolean;
  message: string;
  data: Member[];
}

export interface MemberResponse {
  status: boolean;
  message: string;
  data: Member;
}

export interface ShowMemberProps {
  memberId: string | number;
  open: boolean;
  handleClose: () => void;
  handleEditMember?: (member: Member) => void;
  handleDeleteMember?: (memberId: number) => void;
  refetch:()=>void;
  messageApi:any;
  store_id:number
}

export interface EditMemberModalProps {
  member: Member;
  onClose: () => void;
  refetch: () => void;
  disabled?: boolean;
  messageApi: any;
  handleDeleteMember?: (memberId: number) => void;
  open: boolean;
}

export interface AddMemberProps {
  store_id: string | number;
  refetch:()=>void;
}

export interface AddMemberFormState {
  store_id: string;
  email: string;
  role: string;
}