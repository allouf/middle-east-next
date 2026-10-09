
"use client";

import { useCallback, useState } from "react";
import { useAlert } from "@/lib/context/AlertProvider";
import type { AxiosError } from "axios";
import api from "@/lib/api/index";

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

type Id = string | number;
type JsonRecord = Record<string, unknown>;

const JSON_HEADERS = { "Content-Type": "application/json" };

/**
 * Job profile endpoints (per backend contract)
 * - list:   GET    /{resource}
 * - add:    POST   /{resource}/add
 * - update: PUT    /{resource}/update/:id
 * - remove: DELETE /{resource}/remove/:id
 */
const useJobProfileApi = () => {
  const { message: messageApi } = useAlert();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getErrorMessage = (err: unknown, fallback: string) => {
    const axiosErr = err as AxiosError<ApiErrorResponse>;
    return (
      axiosErr?.response?.data?.message ||
      (axiosErr?.message as string) ||
      fallback
    );
  };

  const getResource = useCallback(async <TResult = unknown>(resource: string) => {
    setLoading(true);
    setError(null);
    try {
      const [response] = await Promise.all([
        api.get<ApiResponse<TResult>>(`/${resource}`, { headers: JSON_HEADERS }),
        new Promise((resolve) => setTimeout(resolve, 800)),
      ]);
      return response.data;
    } catch (err) {
      const msg = getErrorMessage(err, `Failed to fetch ${resource}`);
      setError(msg);
      console.error(`Fetch ${resource} error:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addResource = useCallback(
    async <TResult = unknown>(
      resource: string,
      data: JsonRecord,
      options: RequestOptions<TResult> = {},
    ) => {
      setLoading(true);
      setError(null);
      const { onSuccess, onError, showMessage = true } = options;
      try {
        const response = await api.post<ApiResponse<TResult>>(
          `/${resource}/add`,
          data,
          { headers: JSON_HEADERS },
        );
        if (showMessage) {
          messageApi.success(
            response.data?.message || `${resource} created successfully`,
          );
        }
        onSuccess?.(response.data);
        return response.data;
      } catch (err) {
        const msg = getErrorMessage(err, `Failed to create ${resource}`);
        setError(msg);
        if (showMessage) messageApi.error(msg);
        onError?.(err as AxiosError<ApiErrorResponse>);
        console.error(`Create ${resource} error:`, err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [messageApi],
  );

  const updateResource = useCallback(
    async <TResult = unknown>(
      resource: string,
      id: Id,
      data: JsonRecord,
      options: RequestOptions<TResult> = {},
    ) => {
      setLoading(true);
      setError(null);
      const { onSuccess, onError, showMessage = true } = options;
      try {
        const response = await api.put<ApiResponse<TResult>>(
          `/${resource}/update/${id}`,
          data,
          { headers: JSON_HEADERS },
        );
        if (showMessage) {
          messageApi.success(
            response.data?.message || `${resource} updated successfully`,
          );
        }
        onSuccess?.(response.data);
        return response.data;
      } catch (err) {
        const msg = getErrorMessage(err, `Failed to update ${resource}`);
        setError(msg);
        if (showMessage) messageApi.error(msg);
        onError?.(err as AxiosError<ApiErrorResponse>);
        console.error(`Update ${resource} error:`, err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [messageApi],
  );

  const removeResource = useCallback(
    async <TResult = unknown>(
      resource: string,
      id: Id,
      options: RequestOptions<TResult> = {},
    ) => {
      setLoading(true);
      setError(null);
      const { onSuccess, onError, showMessage = true } = options;
      try {
        const response = await api.delete<ApiResponse<TResult>>(
          `/${resource}/remove/${id}`,
          { headers: JSON_HEADERS },
        );
        if (showMessage) {
          messageApi.success(
            response.data?.message || `${resource} removed successfully`,
          );
        }
        onSuccess?.(response.data);
        return response.data;
      } catch (err) {
        const msg = getErrorMessage(err, `Failed to remove ${resource}`);
        setError(msg);
        if (showMessage) messageApi.error(msg);
        onError?.(err as AxiosError<ApiErrorResponse>);
        console.error(`Remove ${resource} error:`, err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [messageApi],
  );

  // Work experiences
  const getWorkExperiences = useCallback(
    async <TResult = unknown>() => getResource<TResult>("work-experiences"),
    [getResource],
  );
  const addWorkExperience = useCallback(
    async <TResult = unknown>(
      data: JsonRecord,
      options: RequestOptions<TResult> = {},
    ) => addResource<TResult>("work-experiences", data, options),
    [addResource],
  );
  const updateWorkExperience = useCallback(
    async <TResult = unknown>(
      id: Id,
      data: JsonRecord,
      options: RequestOptions<TResult> = {},
    ) => updateResource<TResult>("work-experiences", id, data, options),
    [updateResource],
  );
  const removeWorkExperience = useCallback(
    async <TResult = unknown>(id: Id, options: RequestOptions<TResult> = {}) =>
      removeResource<TResult>("work-experiences", id, options),
    [removeResource],
  );

  // Certifications
  const getCertifications = useCallback(
    async <TResult = unknown>() => getResource<TResult>("certifications"),
    [getResource],
  );
  const addCertification = useCallback(
    async <TResult = unknown>(
      data: JsonRecord,
      options: RequestOptions<TResult> = {},
    ) => addResource<TResult>("certifications", data, options),
    [addResource],
  );
  const updateCertification = useCallback(
    async <TResult = unknown>(
      id: Id,
      data: JsonRecord,
      options: RequestOptions<TResult> = {},
    ) => updateResource<TResult>("certifications", id, data, options),
    [updateResource],
  );
  const removeCertification = useCallback(
    async <TResult = unknown>(id: Id, options: RequestOptions<TResult> = {}) =>
      removeResource<TResult>("certifications", id, options),
    [removeResource],
  );

  // Skills
  const getSkills = useCallback(
    async <TResult = unknown>() => getResource<TResult>("skills"),
    [getResource],
  );
  const addSkill = useCallback(
    async <TResult = unknown>(
      data: JsonRecord,
      options: RequestOptions<TResult> = {},
    ) => addResource<TResult>("skills", data, options),
    [addResource],
  );
  const updateSkill = useCallback(
    async <TResult = unknown>(
      data: JsonRecord,
      options: RequestOptions<TResult> = {},
    ) => {
      setLoading(true);
      setError(null);
      const { onSuccess, onError, showMessage = true } = options;
      try {
        const response = await api.put<ApiResponse<TResult>>(
          `/skills/update`,
          data,
          { headers: JSON_HEADERS },
        );
        if (showMessage) {
          messageApi.success(
            response.data?.message || `skills updated successfully`,
          );
        }
        onSuccess?.(response.data);
        return response.data;
      } catch (err) {
        const msg = getErrorMessage(err, `Failed to update skills`);
        setError(msg);
        if (showMessage) messageApi.error(msg);
        onError?.(err as AxiosError<ApiErrorResponse>);
        console.error(`Update skills error:`, err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [messageApi],
  );
  const removeSkill = useCallback(
    async <TResult = unknown>(id: Id, options: RequestOptions<TResult> = {}) =>
      removeResource<TResult>("skills", id, options),
    [removeResource],
  );

  // Languages
  const getLanguages = useCallback(
    async <TResult = unknown>() => getResource<TResult>("languages"),
    [getResource],
  );
  const addLanguage = useCallback(
    async <TResult = unknown>(
      data: JsonRecord,
      options: RequestOptions<TResult> = {},
    ) => addResource<TResult>("languages", data, options),
    [addResource],
  );
  const updateLanguage = useCallback(
    async <TResult = unknown>(
      id: Id,
      data: JsonRecord,
      options: RequestOptions<TResult> = {},
    ) => updateResource<TResult>("languages", id, data, options),
    [updateResource],
  );
  const removeLanguage = useCallback(
    async <TResult = unknown>(id: Id, options: RequestOptions<TResult> = {}) =>
      removeResource<TResult>("languages", id, options),
    [removeResource],
  );

  // Projects
  const getProjects = useCallback(
    async <TResult = unknown>() => getResource<TResult>("projects"),
    [getResource],
  );
  const addProject = useCallback(
    async <TResult = unknown>(
      data: JsonRecord,
      options: RequestOptions<TResult> = {},
    ) => addResource<TResult>("projects", data, options),
    [addResource],
  );
  const updateProject = useCallback(
    async <TResult = unknown>(
      id: Id,
      data: JsonRecord,
      options: RequestOptions<TResult> = {},
    ) => updateResource<TResult>("projects", id, data, options),
    [updateResource],
  );
  const removeProject = useCallback(
    async <TResult = unknown>(id: Id, options: RequestOptions<TResult> = {}) =>
      removeResource<TResult>("projects", id, options),
    [removeResource],
  );

  // Links
  const getLinks = useCallback(
    async <TResult = unknown>() => getResource<TResult>("links"),
    [getResource],
  );
  const addLink = useCallback(
    async <TResult = unknown>(
      data: JsonRecord,
      options: RequestOptions<TResult> = {},
    ) => addResource<TResult>("links", data, options),
    [addResource],
  );
  const updateLink = useCallback(
    async <TResult = unknown>(
      id: Id,
      data: JsonRecord,
      options: RequestOptions<TResult> = {},
    ) => updateResource<TResult>("links", id, data, options),
    [updateResource],
  );
  const removeLink = useCallback(
    async <TResult = unknown>(id: Id, options: RequestOptions<TResult> = {}) =>
      removeResource<TResult>("links", id, options),
    [removeResource],
  );

  // Educations
  const getEducations = useCallback(
    async <TResult = unknown>() => getResource<TResult>("educations"),
    [getResource],
  );
  const addEducation = useCallback(
    async <TResult = unknown>(
      data: JsonRecord,
      options: RequestOptions<TResult> = {},
    ) => addResource<TResult>("educations", data, options),
    [addResource],
  );
  const updateEducation = useCallback(
    async <TResult = unknown>(
      id: Id,
      data: JsonRecord,
      options: RequestOptions<TResult> = {},
    ) => updateResource<TResult>("educations", id, data, options),
    [updateResource],
  );
  const removeEducation = useCallback(
    async <TResult = unknown>(id: Id, options: RequestOptions<TResult> = {}) =>
      removeResource<TResult>("educations", id, options),
    [removeResource],
  );

  return {
    loading,
    error,
    // Work experiences
    getWorkExperiences,
    addWorkExperience,
    updateWorkExperience,
    removeWorkExperience,

    // Certifications
    getCertifications,
    addCertification,
    updateCertification,
    removeCertification,

    // Skills
    getSkills,
    addSkill,
    updateSkill,
    removeSkill,

    // Languages
    getLanguages,
    addLanguage,
    updateLanguage,
    removeLanguage,

    // Projects
    getProjects,
    addProject,
    updateProject,
    removeProject,

    // Links
    getLinks,
    addLink,
    updateLink,
    removeLink,

    // Educations
    getEducations,
    addEducation,
    updateEducation,
    removeEducation,
  };
};

export default useJobProfileApi;