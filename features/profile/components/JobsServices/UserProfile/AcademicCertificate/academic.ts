export interface AcademicRecord {
    id: number;
    user_id: number;
    degree_type: string;
    university_name: string;
    major: string;
    start_date: string;
    end_date: string | null;
    expected_graduation_date: string;
    is_current: boolean;
    description: string;
    created_at?: string;
    updated_at?: string;
}
