"use client";
import { useState, useEffect, useCallback } from 'react';
import { providerOrdersService } from '../../../Provider/services/provider-orders.service';
import { RequestOptions } from '../../../Provider/types/provider.types';
import { useAlert } from '@/lib/context/AlertProvider';

export interface UseDisputesOptions {
  autoFetchList?: boolean;
  disputeId?: string | number;
  initialPage?: number;
}

export const useDisputes = (options: UseDisputesOptions = {}) => {
  const { autoFetchList = false, disputeId } = options;

  const [disputes, setDisputes] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<number>(options.initialPage || 1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [disputeDetails, setDisputeDetails] = useState<any | null>(null);
  
  const [loadingList, setLoadingList] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [isCreatingDispute, setIsCreatingDispute] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  
  const { message } = useAlert();

  const fetchDisputes = useCallback(async (page: number = currentPage, limit: number = rowsPerPage) => {
    setLoadingList(true);
    setError(null);

    try {
      const requestOptions: RequestOptions<any> = {
        onSuccess: (response) => {
          if (response.data) {
            // Handle both typo 'diputes' and correct 'disputes' just in case
            const disputesData = response.data.diputes || response.data.disputes || response.data;
            setDisputes(Array.isArray(disputesData) ? disputesData : []);
            if (response.data.meta) {
              setMeta(response.data.meta);
            }
          }
        },
        onError: (err) => {
          setError(err.message);
          console.error('Failed to fetch disputes:', err);
        }
      };

      await providerOrdersService.getDisputes(page, limit, requestOptions);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch disputes';
      setError(errorMessage);
    } finally {
      setLoadingList(false);
    }
  }, [currentPage]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    fetchDisputes(page, rowsPerPage);
  }, [fetchDisputes, rowsPerPage]);

  const handleRowsPerPageChange = useCallback((newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1); // reset to page 1
    fetchDisputes(1, newRowsPerPage);
  }, [fetchDisputes]);

  const fetchDisputeById = useCallback(async (id: string | number) => {
    if (!id) return;

    setLoadingDetails(true);
    setError(null);

    try {
      const requestOptions: RequestOptions<any> = {
        onSuccess: (response) => {
          if (response.data) {
            setDisputeDetails(response.data);
          }
        },
        onError: (err) => {
          setError(err.message);
          console.error('Failed to fetch dispute details:', err);
        }
      };

      await providerOrdersService.getDisputeById(id, requestOptions);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dispute details';
      setError(errorMessage);
    } finally {
      setLoadingDetails(false);
    }
  }, []);

  const createDispute = useCallback(async (
    orderId: string | number, 
    reason_id: number, 
    description: string
  ): Promise<boolean> => {
    if (!orderId) return false;

    setIsCreatingDispute(true);

    try {
      const requestOptions: RequestOptions<any> = {
        onSuccess: () => {
          message.success('Dispute created successfully.');
        },
        onError: (err) => {
          message.error(err.message);
          console.error('Failed to create dispute:', err);
        }
      };

      const result = await providerOrdersService.createDispute(orderId, { reason_id, description }, requestOptions);
      return result !== null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create dispute';
      message.error(errorMessage);
      return false;
    } finally {
      setIsCreatingDispute(false);
    }
  }, [message]);

  useEffect(() => {
    if (autoFetchList) {
      fetchDisputes(currentPage, rowsPerPage);
    }
  }, [autoFetchList, fetchDisputes, currentPage, rowsPerPage]);

  useEffect(() => {
    if (disputeId) {
      fetchDisputeById(disputeId);
    }
  }, [disputeId, fetchDisputeById]);

  return {
    disputes,
    meta,
    currentPage,
    disputeDetails,
    loadingList,
    loadingDetails,
    isCreatingDispute,
    error,
    fetchDisputes,
    handlePageChange,
    rowsPerPage,
    handleRowsPerPageChange,
    fetchDisputeById,
    createDispute
  };
};
