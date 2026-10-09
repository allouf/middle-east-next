export interface CertificationRecord {
    id: string | number;
    name: string;
    issuer: string;
    issue_date: string;
    expiration_date: string | null;
    credential_url: string | null;
}
