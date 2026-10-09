"use client";
import { useCallback, useState } from "react";
import { App } from "antd";
import { providerProjectsService } from "../../services/provider-projects.service";
import { ProviderProject, RequestOptions } from "../../types/provider.types";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

export const useProviderProjectsApi = () => {
  const { message: messageApi } = App.useApp();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProviderProject[]>([]);

  const executeWithLoading = useCallback(async <T>(
    operation: () => Promise<T>,
    options?: RequestOptions<T>
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await operation();
      return result;
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      options?.onError?.(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const extractProjectsFromResponse = useCallback((response: any): ProviderProject[] => {
    // Extract the projects array from the nested response structure
    let newProjects = response?.data?.projects ?? [];
    
    // Double ensure we have an array
    if (!Array.isArray(newProjects)) {
      console.warn('Response data.projects is not an array:', newProjects);
      newProjects = [];
    }
    
    return newProjects;
  }, []);

  const fetchProjects = useCallback(
    async (params?: { search?: string }, options?: RequestOptions<ProviderProject[]>) => {
      setLoading(true);
      setError(null);

      try {
        const response = await providerProjectsService.getProjects(params, {
          ...options,
          onSuccess: (data) => {
            // Extract and set projects from response
            const extractedProjects = extractProjectsFromResponse(data);
            setProjects(extractedProjects);
            
            if (options?.showMessage) {
              messageApi.success(data.message || "Projects loaded successfully.");
            }
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            const errorMessage = getApiErrorMessage(error, "Failed to fetch projects");
            setError(errorMessage);

            if (options?.showMessage) {
              messageApi.error(errorMessage);
            }
            options?.onError?.(error);
          },
        });

        return response;
      } finally {
        setLoading(false);
      }
    },
    [messageApi, extractProjectsFromResponse]
  );

  const fetchProjectById = useCallback(
    async (
      projectId: number,
      options?: RequestOptions<ProviderProject>
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await providerProjectsService.getProjectById(projectId, {
          ...options,
          onSuccess: (data) => {
            if (options?.showMessage) {
              messageApi.success(data.message || "Project loaded successfully.");
            }
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            const errorMessage = getApiErrorMessage(error, "Failed to fetch project");
            setError(errorMessage);

            if (options?.showMessage) {
              messageApi.error(errorMessage);
            }
            options?.onError?.(error);
          },
        });

        return response;
      } finally {
        setLoading(false);
      }
    },
    [messageApi]
  );

  const createProject = useCallback(
    async (
      data: FormData,
      options?: RequestOptions<ProviderProject>
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await providerProjectsService.createProject(data, {
          ...options,
          onSuccess: (data) => {
            if (options?.showMessage) {
              messageApi.success(data.message || "Project created successfully.");
            }
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            const errorMessage = getApiErrorMessage(error, "Failed to create project");
            setError(errorMessage);
            setLoading(false);
            if (options?.showMessage) {
              messageApi.error(errorMessage);
            }
            options?.onError?.(error);
          },
        });

        return response;
      } finally {
        setLoading(false);
      }
    },
    [messageApi]
  );

  const updateProject = useCallback(
    async (
      projectId: number,
      data: FormData,
      options?: RequestOptions<ProviderProject>
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await providerProjectsService.updateProject(projectId, data, {
          ...options,
          onSuccess: (data) => {
            if (options?.showMessage) {
              messageApi.success(data.message || "Project updated successfully.");
            }
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            const errorMessage = getApiErrorMessage(error, "Failed to update project");
            setError(errorMessage);
            setLoading(false);
            if (options?.showMessage) {
              messageApi.error(errorMessage);
            }
            options?.onError?.(error);
          },
        });

        return response;
      } finally {
        setLoading(false);
      }
    },
    [messageApi]
  );


  const refetch = useCallback(
    async (params?: { search?: string }, options?: RequestOptions<ProviderProject[]>) => {
      return fetchProjects(params, {
        ...options,
        showMessage: options?.showMessage ?? false,
      });
    },
    [fetchProjects]
  );

  return {
    loading,
    error,
    projects,
    fetchProjects,
    fetchProjectById,
    createProject,
    updateProject,
    refetch,
    setError,
  };
};
