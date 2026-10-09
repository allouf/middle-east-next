import { Applicant } from './applicantsTypes';

const TAGS = [
    { label: 'Design', color: '#E8B84B' },
    { label: 'Research', color: '#E74C3C' },
    { label: 'Q&A', color: '#00664F' },
    { label: 'Development', color: '#5DADE2' },
];

const createApplicant = (id: string, status: Applicant['status']): Applicant => ({
    id,
    name: 'Ahmad Mohamad',
    rating: 4.5,
    hasCvUpload: true,
    tags: TAGS,
    status,
    expectedSalary: '300 - 400 Dollar',
    longAnswer:
        "simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
    attachments: [
        { name: 'Name Form', editedOn: 'Feb 7, 2026', iconColor: '#4CAF50' },
        { name: 'Name Form', editedOn: 'Feb 7, 2026', iconColor: '#2196F3' },
        { name: 'Name Form', editedOn: 'Feb 7, 2026', iconColor: '#FF5722' },
    ],
    ratingText:
        "simply dummy text of the printing and typesetting industry.",
    notes:
        "simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the ind.",
});

export const MOCK_APPLICANTS: Applicant[] = [
    // Newest (3)
    createApplicant('101', 'new'),
    createApplicant('102', 'new'),
    createApplicant('103', 'new'),

    // Under Review (4)
    createApplicant('201', 'under_review'),
    createApplicant('202', 'under_review'),
    createApplicant('203', 'under_review'),
    createApplicant('204', 'under_review'),

    // Shortlisted (3)
    createApplicant('301', 'shortlisted'),
    createApplicant('302', 'shortlisted'),
    createApplicant('303', 'shortlisted'),

    // Interviews (3)
    createApplicant('401', 'interviews'),
    createApplicant('402', 'interviews'),
    createApplicant('403', 'interviews'),

    // Job Offer (2)
    createApplicant('501', 'job_offer'),
    createApplicant('502', 'job_offer'),
];
