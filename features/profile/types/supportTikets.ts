



export type TicketFormState = {
    store_id: string; // keep as string for FormData
    order_id: string; // empty string when not used
    issue_type_id: string;
    subject: string;
    message: string;
    attachments: File[];
};





export type ProductDetails = {
    id: string | number;
    name?: string;
    description?: string | null;
    price?: number | string | null;
};


export type IssueType = {
    id: number;
    name: string;
    description?: string;
    priority?: string;
    created_at?: string;
    updated_at?: string;
};

export type Ticket = {
    id: number;
    store_id?: number;
    user_id?: number;

    issue_type?: IssueType | null;

    priority?: 'low' | 'medium' | 'high' | string;
    subject?: string;
    status?: string;

    sla_response_hours?: number | null;
    sla_due_at?: string | null;
    is_sla_breached?: boolean;
    sla_delay?: string | null;

    created_at?: string | null;
};

export type ProductRow = Ticket;// ✅ علشان ما نكسر استعمالك الحالي بسرعة
