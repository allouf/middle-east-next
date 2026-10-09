// Seller Tickets Types

export interface CreateSupportTicketRequest {
  store_id: string;
  order_id: string;
  issue_type_id: string;
  subject: string;
  message: string;
}

export interface ReplytoTicketRequest {
  message: string;
  attachments: {
    0: File | Blob;
    1: File | Blob;
  };
}

