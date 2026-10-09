"use client";

import { useCallback, useState } from "react";
import { App } from "antd";
import type { AxiosError } from "axios";
import api from "@/lib/api/index";
import { Job, JobFilterParams, CreateJobTemplatePayload, UpdateJobTemplatePayload, JobApplicationResponse } from "./types";

/** Common API response shape */
export type ApiResponse<T = unknown> = {
    status?: boolean;
    message?: string;
    data?: T;
};

/** Error response shape */
type ApiErrorResponse = {
    message?: string;
    errors?: Record<string, string[]>;
};

type RequestOptions<TSuccess = unknown> = {
    showMessage?: boolean;
    onSuccess?: (data: ApiResponse<TSuccess>) => void;
    onError?: (error: AxiosError<ApiErrorResponse> | Error) => void;
};

export type JobStatusUpdatePayload = {
    status: string;
};

/**
 * Custom hook for jobs API operations
 */
const useJobsApi = () => {
    const { message: messageApi } = App.useApp();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [statusCode, setStatusCode] = useState<number | null>(null);

    const getErrorMessage = (err: unknown, fallback: string) => {
        const axiosErr = err as AxiosError<ApiErrorResponse>;
        const status = axiosErr?.response?.status;
        
        // Set the status code in state
        if (status) {
            setStatusCode(status);
        }
        
        return (
            axiosErr?.response?.data?.message ||
            (axiosErr?.message as string) ||
            fallback
        );
    };

    /**
     * GET /api/v1/job-applications/get-by-candidate
     */
    const getMyAppliedJobs = useCallback(async (filters?: {
        status?: string;
        search?: string;
        sort?: string;
    }) => {
        setLoading(true);
        setError(null);

        try {
            // Build clean params — only include non-empty values
            const params: Record<string, string | number> = {};
            if (filters?.status) params.status = filters.status;
            if (filters?.search) params.search = filters.search;
            if (filters?.sort) params.sort = filters.sort;

            const [response] = await Promise.all([
                api.get<ApiResponse<JobApplicationResponse>>("/job-applications/get-by-candidate", { params }),
                new Promise((resolve) => setTimeout(resolve, 800)),
            ]);
            return response.data;
        } catch (err) {
            const msg = getErrorMessage(err, "Failed to fetch applied jobs");
            setError(msg);
            console.error("Fetch applied jobs error:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * GET /api/v1/job-applications/get-by-candidate/show/{id}
     */
    const getAppliedJobDetails = useCallback(async (id: string | number) => {
        setLoading(true);
        setError(null);

        try {
            const [response] = await Promise.all([
                api.get<ApiResponse<any>>(`/job-applications/get-by-candidate/show/${id}`),
                new Promise((resolve) => setTimeout(resolve, 800)),
            ]);
            return response.data;
        } catch (err) {
            const msg = getErrorMessage(err, "Failed to fetch applied job details");
            setError(msg);
            console.error("Fetch applied job details error:", err);
            return null;
        } finally {
            setLoading(false);
        }
    }, [getErrorMessage]);

    /**
     * GET /api/v1/job-postings/my-jobs
     */
    const getMyJobs = useCallback(async (filters?: JobFilterParams & { page?: number; per_page?: number }) => {
        setLoading(true);
        setError(null);

        try {
            // Build clean params — only include non-empty values
            const params: Record<string, string | number> = {};
            if (filters) {
                if (filters.category_id) params.category_id = filters.category_id;
                if (filters.work_mode) params.work_mode = filters.work_mode;
                if (filters.application_deadline_to) params.application_deadline_to = filters.application_deadline_to;
                if (filters.min_salary) params.min_salary = filters.min_salary;
                if (filters.max_salary) params.max_salary = filters.max_salary;
                if (filters.status) params.status = filters.status;
                if (filters.search) params.search = filters.search;
                if (filters.page) params.page = filters.page;
                if (filters.per_page) params.per_page = filters.per_page;
            }

            const response = await api.get<ApiResponse<Job[]>>("/job-postings/my-jobs", { params });
            return response.data;
        } catch (err) {
            const msg = getErrorMessage(err, "Failed to fetch my jobs");
            setError(msg);
            console.error("Fetch my jobs error:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * DELETE /api/v1/job-postings/delete/{id}
     */
    const deleteJob = useCallback(
        async <TResult = unknown>(
            id: string | number,
            options: RequestOptions<TResult> = {}
        ) => {
            setLoading(true);
            setError(null);

            const { onSuccess, onError, showMessage = true } = options;

            try {
                const response = await api.delete<ApiResponse<TResult>>(
                    `/job-postings/delete/${id}`
                );

                if (showMessage) {
                    messageApi.success(response.data?.message || "Job deleted successfully");
                }

                onSuccess?.(response.data);
                return response.data;
            } catch (err) {
                const msg = getErrorMessage(err, "Failed to delete job");
                setError(msg);

                if (showMessage) messageApi.error(msg);

                onError?.(err as AxiosError<ApiErrorResponse>);
                console.error("Delete job error:", err);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    /**
     * POST /api/v1/job-postings/{id}/update-status
     */
    const updateJobStatus = useCallback(
        async <TResult = unknown>(
            id: string | number,
            data: JobStatusUpdatePayload,
            options: RequestOptions<TResult> = {}
        ) => {
            setLoading(true);
            setError(null);

            const { onSuccess, onError, showMessage = true } = options;

            try {
                const response = await api.post<ApiResponse<TResult>>(
                    `/job-postings/update-status/${id}`,
                    data
                );

                if (showMessage) {
                    messageApi.success(response.data?.message || "Job status updated");
                }

                onSuccess?.(response.data);
                return response.data;
            } catch (err) {
                const msg = getErrorMessage(err, "Failed to update job status");
                setError(msg);

                if (showMessage) messageApi.error(msg);

                onError?.(err as AxiosError<ApiErrorResponse>);
                console.error("Update job status error:", err);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    /**
     * POST /api/v1/job-postings
     */
    const createJob = useCallback(
        async <TResult = unknown>(
            data: any,
            options: RequestOptions<TResult> = {}
        ) => {
            setLoading(true);
            setError(null);

            const { onSuccess, onError, showMessage = true } = options;

            try {
                const response = await api.post<ApiResponse<TResult>>("/job-postings", data);

                if (showMessage) {
                    messageApi.success(response.data?.message || "Job created successfully");
                }

                onSuccess?.(response.data);
                return response.data;
            } catch (err) {
                const msg = getErrorMessage(err, "Failed to create job");
                setError(msg);

                if (showMessage) messageApi.error(msg);

                onError?.(err as AxiosError<ApiErrorResponse>);
                console.error("Create job error:", err);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    /**
     * POST /api/v1/job-postings/update/{id}
     */
    const updateJob = useCallback(
        async <TResult = unknown>(
            id: string | number,
            data: any,
            options: RequestOptions<TResult> = {}
        ) => {
            setLoading(true);
            setError(null);

            const { onSuccess, onError, showMessage = true } = options;

            try {
                const response = await api.post<ApiResponse<TResult>>(`/job-postings/update/${id}`, data);

                if (showMessage) {
                    messageApi.success(response.data?.message || "Job updated successfully");
                }

                onSuccess?.(response.data);
                return response.data;
            } catch (err) {
                const msg = getErrorMessage(err, "Failed to update job");
                setError(msg);

                if (showMessage) messageApi.error(msg);

                onError?.(err as AxiosError<ApiErrorResponse>);
                console.error("Update job error:", err);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    /**
     * GET /api/v1/job-categories
     */
    const getJobCategories = useCallback(async (params?: Record<string, string | number|boolean>) => {
        try {
            const response = await api.get<ApiResponse<any[]>>("/job-categories",{params});
            return response.data;
        } catch (err) {
            console.error("Fetch job categories error:", err);
            return { data: [] };
        }
    }, []);

    /**
     * GET /api/v1/job-templates/my-templates
     */
    const getMyTemplates = useCallback(async (params?: Record<string, string | number|boolean>) => {
        try {
            const response = await api.get<ApiResponse<any[]>>("/job-templates/my-templates", { params });
            return response.data;
        } catch (err) {
            console.error("Fetch my templates error:", err);
            return { data: [] };
        }
    }, []);

    /**
     * GET /api/v1/job-postings/candidate-statistics/{userId}
     */
    const getJobStatistics = useCallback(async (userId: string | number) => {
        try {
            const response = await api.get<ApiResponse<any>>(`/job-postings/candidate-statistics/${userId}`);
            return response.data;
        } catch (err) {
            console.error("Fetch job statistics error:", err);
            return null;
        }
    }, []);

    const getAllJobStatistics = useCallback(async () => {
        try {
            const response = await api.get<ApiResponse<any>>(`/job-postings/statistics`);
            return response.data;
        } catch (err) {
            console.error("Fetch job statistics error:", err);
            return null;
        }
    }, []);

    /**
     * GET /api/v1/job-postings/{id}
     */
    const getJobDetails = useCallback(async (id: string | number) => {
        try {
            const response = await api.get<ApiResponse<any>>(`/job-postings/${id}`);
            return response.data;
        } catch (err) {
            console.error("Fetch job details error:", err);
            return null;
        }
    }, []);

    /**
     * GET /api/v1/job-postings/candidates/kanban/{id}
     */
    const getKanbanCandidates = useCallback(async (
        jobId: string | number,
        params?: Record<string, number | string>
    ) => {
        try {
            const response = await api.get<ApiResponse<any>>(
                `/job-postings/candidates/kanban/${jobId}`,
                { params }
            );
            return response.data;
        } catch (err) {
            console.error("Fetch kanban candidates error:", err);
            return null;
        }
    }, []);

    // ─── Job Template CRUD Methods ─────────────────────────────

    /**
     * GET /api/v1/job-templates/system-templates?category_id={id}
     */
    const getSystemTemplates = useCallback(async (categoryId?: number) => {
        try {
            const params: Record<string, number> = {};
            if (categoryId) params.category_id = categoryId;
            const response = await api.get<ApiResponse<any[]>>("/job-templates/system-templates", { params });
            return response.data;
        } catch (err) {
            console.error("Fetch system templates error:", err);
            return { data: [] };
        }
    }, []);

    /**
     * GET /api/v1/job-templates/show/{id}
     */
    const getTemplate = useCallback(async (id: number | string) => {
        try {
            const response = await api.get<ApiResponse<any>>(`/job-templates/show/${id}`);
            return response.data;
        } catch (err) {
            console.error("Fetch template error:", err);
            return null;
        }
    }, []);

    /**
     * POST /api/v1/job-templates
     */
    const createTemplate = useCallback(
        async <TResult = unknown>(
            data: CreateJobTemplatePayload,
            options: RequestOptions<TResult> = {}
        ) => {
            setLoading(true);
            setError(null);
            const { onSuccess, onError, showMessage = true } = options;

            try {
                const response = await api.post<ApiResponse<TResult>>("/job-templates", data);
                if (showMessage) {
                    messageApi.success(response.data?.message || "Template created successfully");
                }
                onSuccess?.(response.data);
                return response.data;
            } catch (err) {
                const msg = getErrorMessage(err, "Failed to create template");
                setError(msg);
                if (showMessage) messageApi.error(msg);
                onError?.(err as AxiosError<ApiErrorResponse>);
                console.error("Create template error:", err);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    /**
     * POST /api/v1/job-templates/{id}
     */
    const updateTemplate = useCallback(
        async <TResult = unknown>(
            id: number | string,
            data: UpdateJobTemplatePayload,
            options: RequestOptions<TResult> = {}
        ) => {
            setLoading(true);
            setError(null);
            const { onSuccess, onError, showMessage = true } = options;

            try {
                const response = await api.post<ApiResponse<TResult>>(`/job-templates/update/${id}`, data);
                if (showMessage) {
                    messageApi.success(response.data?.message || "Template updated successfully");
                }
                onSuccess?.(response.data);
                return response.data;
            } catch (err) {
                const msg = getErrorMessage(err, "Failed to update template");
                setError(msg);
                if (showMessage) messageApi.error(msg);
                onError?.(err as AxiosError<ApiErrorResponse>);
                console.error("Update template error:", err);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    /**
     * DELETE /api/v1/job-templates/{id}
     */
    const deleteTemplate = useCallback(
        async <TResult = unknown>(
            id: number | string,
            options: RequestOptions<TResult> = {}
        ) => {
            setLoading(true);
            setError(null);
            const { onSuccess, onError, showMessage = true } = options;

            try {
                const response = await api.delete<ApiResponse<TResult>>(`/job-templates/delete/${id}`);
                if (showMessage) {
                    messageApi.success(response.data?.message || "Template deleted successfully");
                }
                onSuccess?.(response.data);
                return response.data;
            } catch (err) {
                const msg = getErrorMessage(err, "Failed to delete template");
                setError(msg);
                if (showMessage) messageApi.error(msg);
                onError?.(err as AxiosError<ApiErrorResponse>);
                console.error("Delete template error:", err);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    /**
     * POST /api/v1/job-templates/clone-from-system/{id}
     */
    const cloneFromSystem = useCallback(
        async <TResult = unknown>(
            systemTemplateId: number | string,
            options: RequestOptions<TResult> = {}
        ) => {
            setLoading(true);
            setError(null);
            const { onSuccess, onError, showMessage = true } = options;

            try {
                const response = await api.post<ApiResponse<TResult>>(
                    `/job-templates/clone-from-system/${systemTemplateId}`
                );
                if (showMessage) {
                    messageApi.success(response.data?.message || "Template cloned successfully");
                }
                onSuccess?.(response.data);
                return response.data;
            } catch (err) {
                const msg = getErrorMessage(err, "Failed to clone template");
                setError(msg);
                if (showMessage) messageApi.error(msg);
                onError?.(err as AxiosError<ApiErrorResponse>);
                console.error("Clone template error:", err);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    // ─── Job Applications Endpoints ─────────────────────────────

    /**
     * GET /api/v1/job-applications/show/{id}
     */
    const showApplication = useCallback(async (applicationId: number | string) => {
        try {
            const response = await api.get<ApiResponse<any>>(`/job-applications/show/${applicationId}`);
            return response.data;
        } catch (err) {
            console.error("Fetch application error:", err);
            return null;
        }
    }, []);

    /**
     * POST /api/v1/job-applications/move-stage
     */
    const bulkMoveStage = useCallback(
        async <TResult = unknown>(
            data: { application_ids: (number | string)[]; stage: string },
            options: RequestOptions<TResult> = {}
        ) => {
            setLoading(true);
            setError(null);
            const { onSuccess, onError, showMessage = true } = options;

            try {
                const response = await api.post<ApiResponse<TResult>>(`/job-applications/move-stage`, data);
                if (showMessage) {
                    messageApi.success(response.data?.message || "Stage moved successfully");
                }
                onSuccess?.(response.data);
                return response.data;
            } catch (err) {
                const msg = getErrorMessage(err, "Failed to move stage");
                setError(msg);
                if (showMessage) messageApi.error(msg);
                onError?.(err as AxiosError<ApiErrorResponse>);
                console.error("Move stage error:", err);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    /**
     * GET /api/v1/job-applications/employer-tags?job_id={jobId}
     */
    const getEmployerTags = useCallback(async (jobId: number | string) => {
        try {
            const response = await api.get<ApiResponse<any[]>>(`/job-applications/employer-tags`, {
                params: { job_id: jobId },
            });
            return response.data;
        } catch (err) {
            console.error("Fetch employer tags error:", err);
            return { data: [] };
        }
    }, []);

    /**
     * POST /api/v1/job-applications/employer-tags
     */
    const createEmployerTag = useCallback(
        async <TResult = unknown>(
            data: { job_id: number | string; name: string; color: string },
            options: RequestOptions<TResult> = {}
        ) => {
            setLoading(true);
            setError(null);
            const { onSuccess, onError, showMessage = true } = options;

            try {
                const response = await api.post<ApiResponse<TResult>>(`/job-applications/employer-tags`, data);
                if (showMessage) {
                    messageApi.success(response.data?.message || "Tag created successfully");
                }
                onSuccess?.(response.data);
                return response.data;
            } catch (err) {
                const msg = getErrorMessage(err, "Failed to create tag");
                setError(msg);
                if (showMessage) messageApi.error(msg);
                onError?.(err as AxiosError<ApiErrorResponse>);
                console.error("Create tag error:", err);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    /**
     * POST /api/v1/job-applications/update-employer-tags/{id}
     */
    const updateEmployerTag = useCallback(
        async <TResult = unknown>(
            id: number | string,
            data: { name: string; color: string },
            options: RequestOptions<TResult> = {}
        ) => {
            setLoading(true);
            setError(null);
            const { onSuccess, onError, showMessage = true } = options;

            try {
                const response = await api.post<ApiResponse<TResult>>(`/job-applications/update-employer-tags/${id}`, data);
                if (showMessage) {
                    messageApi.success(response.data?.message || "Tag updated successfully");
                }
                onSuccess?.(response.data);
                return response.data;
            } catch (err) {
                const msg = getErrorMessage(err, "Failed to update tag");
                setError(msg);
                if (showMessage) messageApi.error(msg);
                onError?.(err as AxiosError<ApiErrorResponse>);
                console.error("Update tag error:", err);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    /**
     * POST /api/v1/job-applications/add-note?job_id={jobId}&application_id={applicationId}
     */
    const addNote = useCallback(
        async <TResult = unknown>(
            jobId: number | string,
            applicationId: number | string,
            data: { candidate_id: string | number; content: string },
            options: RequestOptions<TResult> = {}
        ) => {
            setLoading(true);
            setError(null);
            const { onSuccess, onError, showMessage = true } = options;

            try {
                const response = await api.post<ApiResponse<TResult>>(`/job-applications/add-note`, data, {
                    params: { job_id: jobId, application_id: applicationId },
                });
                if (showMessage) {
                    messageApi.success(response.data?.message || "Note added successfully");
                }
                onSuccess?.(response.data);
                return response.data;
            } catch (err) {
                const msg = getErrorMessage(err, "Failed to add note");
                setError(msg);
                if (showMessage) messageApi.error(msg);
                onError?.(err as AxiosError<ApiErrorResponse>);
                console.error("Add note error:", err);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    /**
     * POST /api/v1/job-applications/attach-tag?application_id={applicationId}&tag_id={tagId}
     */
    const attachTag = useCallback(
        async <TResult = unknown>(
            applicationId: number | string,
            tagId: number | string,
            data: { candidate_id: string | number; tag_id: string | number },
            options: RequestOptions<TResult> = {}
        ) => {
            setLoading(true);
            setError(null);
            const { onSuccess, onError, showMessage = true } = options;

            try {
                const response = await api.post<ApiResponse<TResult>>(`/job-applications/attach-tag`, data, {
                    params: { application_id: applicationId, tag_id: tagId },
                });
                // Optional: success message
                onSuccess?.(response.data);
                return response.data;
            } catch (err) {
                const msg = getErrorMessage(err, "Failed to attach tag");
                setError(msg);
                onError?.(err as AxiosError<ApiErrorResponse>);
                console.error("Attach tag error:", err);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    /**
     * DELETE /api/v1/job-applications/detach-tag?application_id={applicationId}&tag_id={tagId}
     */
    const detachTag = useCallback(
        async <TResult = unknown>(
            applicationId: number | string,
            tagId: number | string,
            options: RequestOptions<TResult> = {}
        ) => {
            setLoading(true);
            setError(null);
            const { onSuccess, onError, showMessage = true } = options;

            try {
                const response = await api.delete<ApiResponse<TResult>>(`/job-applications/detach-tag`, {
                    params: { application_id: applicationId, tag_id: tagId },
                });
                // Optional: success message
                onSuccess?.(response.data);
                return response.data;
            } catch (err) {
                const msg = getErrorMessage(err, "Failed to detach tag");
                setError(msg);
                onError?.(err as AxiosError<ApiErrorResponse>);
                console.error("Detach tag error:", err);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    /**
     * POST /api/v1/job-applications/upload-attachment
     */
    const uploadAttachment = useCallback(
        async <TResult = unknown>(
            formData: FormData,
            options: RequestOptions<TResult> = {}
        ) => {
            setLoading(true);
            setError(null);
            const { onSuccess, onError, showMessage = true } = options;

            try {
                const response = await api.post<ApiResponse<TResult>>(`/job-applications/upload-attachment`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                if (showMessage) {
                    messageApi.success(response.data?.message || "Attachment uploaded successfully");
                }
                onSuccess?.(response.data);
                return response.data;
            } catch (err) {
                const msg = getErrorMessage(err, "Failed to upload attachment");
                setError(msg);
                if (showMessage) messageApi.error(msg);
                onError?.(err as AxiosError<ApiErrorResponse>);
                console.error("Upload attachment error:", err);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    /**
     * GET /api/v1/job-applications/attachments/{attachmentId}/download
     */
    const downloadAttachment = useCallback(async (attachmentId: number | string) => {
        try {
            const response = await api.get(`/job-applications/attachments/${attachmentId}/download`, {
                responseType: 'blob', // Important for downloading files
            });
            // Handle file download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            // Try to extract filename from content-disposition header if available, else generic name
            const contentDisposition = response.headers['content-disposition'];
            let fileName = `attachment_${attachmentId}`;
            if (contentDisposition) {
                const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
                if (fileNameMatch && fileNameMatch.length === 2) {
                    fileName = fileNameMatch[1];
                }
            }
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            return true;
        } catch (err) {
            console.error("Download attachment error:", err);
            const msg = getErrorMessage(err, "Failed to download attachment");
            messageApi.error(msg);
            return false;
        }
    }, [messageApi]);

    /**
     * DELETE /api/v1/job-applications/attachments/{attachmentId}
     */
    const deleteAttachment = useCallback(
        async <TResult = unknown>(
            attachmentId: number | string,
            options: RequestOptions<TResult> = {}
        ) => {
            setLoading(true);
            setError(null);
            const { onSuccess, onError, showMessage = true } = options;

            try {
                const response = await api.delete<ApiResponse<TResult>>(`/job-applications/attachments/${attachmentId}`);
                if (showMessage) {
                    messageApi.success(response.data?.message || "Attachment deleted successfully");
                }
                onSuccess?.(response.data);
                return response.data;
            } catch (err) {
                const msg = getErrorMessage(err, "Failed to delete attachment");
                setError(msg);
                if (showMessage) messageApi.error(msg);
                onError?.(err as AxiosError<ApiErrorResponse>);
                console.error("Delete attachment error:", err);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [messageApi]
    );

    /**
     * PATCH /api/v1/job-applications/rating
     */
    const addRating = useCallback(
        async <TResult = unknown>(
            payload: { application_id: number | string; rating: number; rating_note?: string },
            options: RequestOptions<TResult> = {}
        ) => {
            setLoading(true);
            setError(null);
            const { onSuccess, onError, showMessage = true } = options;

            try {
                const response = await api.patch<ApiResponse<TResult>>(`/job-applications/rating`, payload, {
                    headers: { 'Content-Type': 'application/json' }
                });
                if (showMessage) {
                    messageApi.success(response.data?.message || "Rating added successfully");
                }
                onSuccess?.(response.data);
                return response.data;
            } catch (err) {
                const msg = getErrorMessage(err, "Failed to add rating");
                setError(msg);
                if (showMessage) messageApi.error(msg);
                onError?.(err as AxiosError<ApiErrorResponse>);
                console.error("Add rating error:", err);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [messageApi]
    );

    return {
        loading,
        error,
        statusCode,
        clearStatusCode: () => setStatusCode(null),
        getMyAppliedJobs,
        getMyJobs,
        getJobDetails,
        deleteJob,
        updateJobStatus,
        createJob,
        updateJob,
        getJobCategories,
        getMyTemplates,
        getJobStatistics,
        getAllJobStatistics,
        getKanbanCandidates,
        // Template CRUD
        getSystemTemplates,
        getTemplate,
        createTemplate,
        updateTemplate,
        deleteTemplate,
        cloneFromSystem,
        // Job Applications
        showApplication,
        bulkMoveStage,
        getEmployerTags,
        createEmployerTag,
        updateEmployerTag,
        addNote,
        attachTag,
        detachTag,
        uploadAttachment,
        downloadAttachment,
        getAppliedJobDetails,
        deleteAttachment,
        addRating,
    };
};

export default useJobsApi;
