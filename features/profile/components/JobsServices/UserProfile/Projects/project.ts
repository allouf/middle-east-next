export interface Project {
    id: number;
    user_id: number;
    title: string;
    description: string;
    project_url: string;
    start_date: string;
    end_date: string | null;
    is_current?: boolean; // May not be in response but useful for UI state
    created_at?: string;
    updated_at?: string;
}
