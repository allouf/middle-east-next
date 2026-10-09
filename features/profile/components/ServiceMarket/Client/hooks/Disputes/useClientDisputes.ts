"use client";
import { useState, useEffect, useCallback } from 'react';
import { clientOrderService } from '../../services/client-order.service';
import { RequestOptions } from '../../types/client.types';
import { useAlert } from '@/lib/context/AlertProvider';

export interface UseClientDisputesOptions {
  autoFetchList?: boolean;
  disputeId?: string | number;
}

export const useClientDisputes = (options: UseClientDisputesOptions = {}) => {
  const { autoFetchList = false, disputeId } = options;

  const [disputes, setDisputes] = useState<any[]>([]);
  const [disputeDetails, setDisputeDetails] = useState<any | null>(null);
  
  const [loadingList, setLoadingList] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [isCreatingDispute, setIsCreatingDispute] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  
  const { message } = useAlert();

  const fetchDisputes = useCallback(async () => {
    setLoadingList(true);
    setError(null);

    try {
      const requestOptions: RequestOptions<any> = {
        onSuccess: (response) => {
          if (response.data) {
            setDisputes(response.data);
          }
        },
        onError: (err) => {
          setError(err.message);
          console.error('Failed to fetch disputes:', err);
        }
      };

      await clientOrderService.getDisputes(requestOptions);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch disputes';
      setError(errorMessage);
    } finally {
      setLoadingList(false);
    }
  }, []);

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

      await clientOrderService.getDisputeDetails(id, requestOptions);
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

      const result = await clientOrderService.openDispute(orderId, { reason_id, description }, requestOptions);
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
      fetchDisputes();
    }
  }, [autoFetchList, fetchDisputes]);

  useEffect(() => {
    if (disputeId) {
      fetchDisputeById(disputeId);
    }
  }, [disputeId, fetchDisputeById]);

  return {
    disputes,
    disputeDetails,
    loadingList,
    loadingDetails,
    isCreatingDispute,
    error,
    fetchDisputes,
    fetchDisputeById,
    createDispute
  };
};
