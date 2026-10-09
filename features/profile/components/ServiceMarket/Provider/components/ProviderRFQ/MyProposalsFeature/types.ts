export type ProposalStatus = "In Review" | "Awarded" | "Rejected" | "Under Review" | "Pending" | "Accepted" | "Canceled";

export interface ProposalItem {
  id: number;
  reference_number: string;
  custom_request_id?: number;
  submitted_date: string;
  title: string;
  category: string;
  category_id?: number;
  status: ProposalStatus;
  customer: {
    name: string;
    description: string;
    avatar: string | null;
  };
  delivery_model?: string;
  deadline_date: string;
  budget: number;
  budget_min?: number;
  budget_max?: number;
  estimated_delivery_date?: string;
  location?: string;
}

export interface ProposalsListProps {
  statusFilter: string;
  onStatusChange: (value: string) => void;
  createUrl: ({ proposalId }: { proposalId: string }) => string;
}

