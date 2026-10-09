"use client";
import { useState, useEffect, useCallback } from 'react';
import { clientOrderService } from '../services/client-order.service';
import { 
  OrderDetails, 
  OrderAttachment,
  ApiResponse,
  RequestOptions 
} from '../types/client.types';
import { useAlert } from '@/lib/context/AlertProvider';

interface UseOrderDetailsOptions {
  autoFetch?: boolean;
  orderId?: string;
}

interface UseOrderDetailsReturn {
  orderDetails: OrderDetails | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  cancelOrder: () => Promise<boolean>;
  acceptOrder: () => Promise<boolean>;
  rejectOrder: (reason: string) => Promise<boolean>;
  requestRevision: (revisionDetails: { 
    delivery_version: string | number; 
    notes: string; 
    request_type: string; 
    attachments?: File[]; 
  }) => Promise<boolean>;
  submitDispute: (disputeDetails: { reason: string; description: string; attachments?: any[] }) => Promise<boolean>;
  uploadAttachment: (file: File) => Promise<{ url: string; name: string } | null>;
  isCancelling: boolean;
  isAccepting: boolean;
  isRejecting: boolean;
  isRequestingRevision: boolean;
  isSubmittingDispute: boolean;
  isUploading: boolean;
  approveExtension: (extensionId: string | number) => Promise<boolean>;
  rejectExtension: (extensionId: string | number) => Promise<boolean>;
  isApprovingExtension: boolean;
  isRejectingExtension: boolean;
}

export const useOrderDetails = (
  options: UseOrderDetailsOptions = {}
): UseOrderDetailsReturn => {
  const { autoFetch = true, orderId } = options;

  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Action loading states
  const [isCancelling, setIsCancelling] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isRequestingRevision, setIsRequestingRevision] = useState(false);
  const [isSubmittingDispute, setIsSubmittingDispute] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isApprovingExtension, setIsApprovingExtension] = useState(false);
  const [isRejectingExtension, setIsRejectingExtension] = useState(false);
  const {message} = useAlert()

  const fetchOrderDetails = useCallback(async (id: string) => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const requestOptions: RequestOptions<OrderDetails> = {
        onSuccess: (response) => {
          if (response.data) {
            setOrderDetails(response.data);
          }
        },
        onError: (error) => {
          setError(error.message);
          console.error('Failed to fetch order details:', error);
        }
      };

      await clientOrderService.getOrderById(id, requestOptions);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch order details';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    if (orderId) {
      await fetchOrderDetails(orderId);
    }
  }, [fetchOrderDetails, orderId]);

  const cancelOrder = useCallback(async (): Promise<boolean> => {
    if (!orderId ) return false;

    setIsCancelling(true);
    setError(null);

    try {
      const requestOptions: RequestOptions<void> = {
        onSuccess: () => {
          message.success('Order cancelled successfully.');
          refetch();
        },
        onError: (error) => {
          setError(error.message);
          console.error('Failed to cancel order:', error);
        }
      };

      const result = await clientOrderService.cancelOrder(orderId, requestOptions);
      return result !== null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel order';
      setError(errorMessage);
      return false;
    } finally {
      setIsCancelling(false);
    }
  }, [orderId, refetch]);

  const acceptOrder = useCallback(async (): Promise<boolean> => {
    if (!orderId) return false;

    setIsAccepting(true);
    setError(null);

    try {
      const requestOptions: RequestOptions<void> = {
        onSuccess: () => {
          // Refresh order details after successful acceptance
          refetch();
        },
        onError: (error) => {
          setError(error.message);
          console.error('Failed to accept order:', error);
        }
      };

      const result = await clientOrderService.acceptOrder(orderId, requestOptions);
      return result !== null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to accept order';
      setError(errorMessage);
      return false;
    } finally {
      setIsAccepting(false);
    }
  }, [orderId, refetch]);

  const rejectOrder = useCallback(async (reason: string): Promise<boolean> => {
    if (!orderId || !reason.trim()) return false;

    setIsRejecting(true);
    setError(null);

    try {
      const requestOptions: RequestOptions<void> = {
        onSuccess: () => {
          // Refresh order details after successful rejection
          refetch();
        },
        onError: (error) => {
          setError(error.message);
          console.error('Failed to reject order:', error);
        }
      };

      const result = await clientOrderService.rejectOrder(orderId, reason, requestOptions);
      return result !== null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reject order';
      setError(errorMessage);
      return false;
    } finally {
      setIsRejecting(false);
    }
  }, [orderId, refetch]);

  const requestRevision = useCallback(async (revisionDetails: { delivery_version: string | number; notes: string; request_type: string; attachments?: File[] }): Promise<boolean> => {
    if (!orderId || !revisionDetails.notes.trim()) return false;

    setIsRequestingRevision(true);

    try {
      const requestOptions: RequestOptions<void> = {
        onSuccess: () => {
          // Refresh order details after successful revision request
          refetch();
        },
        onError: (error) => {
          message.error(error.message);
          console.error('Failed to request revision:', error);
        }
      };

      const result = await clientOrderService.requestRevision(orderId, revisionDetails, requestOptions);
      return result !== null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to request revision';
      message.error(errorMessage);
      return false;
    } finally {
      setIsRequestingRevision(false);
    }
  }, [orderId, refetch, message]);

  const submitDispute = useCallback(async (disputeDetails: { reason: string; description: string; attachments?: any[] }): Promise<boolean> => {
    if (!orderId || !disputeDetails.reason.trim() || !disputeDetails.description.trim()) return false;

    setIsSubmittingDispute(true);
    setError(null);

    try {
      const requestOptions: RequestOptions<void> = {
        onSuccess: () => {
          // Refresh order details after successful dispute submission
          refetch();
        },
        onError: (error) => {
          setError(error.message);
          console.error('Failed to submit dispute:', error);
        }
      };

      const result = await clientOrderService.submitDispute(orderId, disputeDetails, requestOptions);
      return result !== null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit dispute';
      setError(errorMessage);
      return false;
    } finally {
      setIsSubmittingDispute(false);
    }
  }, [orderId, refetch]);

  const uploadAttachment = useCallback(async (file: File): Promise<{ url: string; name: string } | null> => {
    if (!orderId) return null;

    setIsUploading(true);
    setError(null);

    try {
      const requestOptions: RequestOptions<{ url: string; name: string }> = {
        onError: (error) => {
          setError(error.message);
          console.error('Failed to upload attachment:', error);
        }
      };

      const result = await clientOrderService.uploadAttachment(orderId, file, requestOptions);
      return result?.data || null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload attachment';
      setError(errorMessage);
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [orderId]);

  const approveExtension = useCallback(async (extensionId: string | number): Promise<boolean> => {
    if (!extensionId) return false;

    setIsApprovingExtension(true);
    setError(null);

    try {
      const requestOptions: RequestOptions<void> = {
        onSuccess: () => {
          message.success('Extension approved successfully.');
          refetch();
        },
        onError: (error) => {
          setError(error.message);
          console.error('Failed to approve extension:', error);
        }
      };

      const result = await clientOrderService.approveExtension(extensionId, requestOptions);
      return result !== null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to approve extension';
      setError(errorMessage);
      return false;
    } finally {
      setIsApprovingExtension(false);
    }
  }, [refetch, message]);

  const rejectExtension = useCallback(async (extensionId: string | number): Promise<boolean> => {
    if (!extensionId) return false;

    setIsRejectingExtension(true);
    setError(null);

    try {
      const requestOptions: RequestOptions<void> = {
        onSuccess: () => {
          message.success('Extension rejected successfully.');
          refetch();
        },
        onError: (error) => {
          setError(error.message);
          console.error('Failed to reject extension:', error);
        }
      };

      const result = await clientOrderService.rejectExtension(extensionId, requestOptions);
      return result !== null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reject extension';
      setError(errorMessage);
      return false;
    } finally {
      setIsRejectingExtension(false);
    }
  }, [refetch, message]);

  useEffect(() => {
    if (autoFetch && orderId) {
      fetchOrderDetails(orderId);
    }
  }, [autoFetch, orderId, fetchOrderDetails]);

  return {
    orderDetails,
    loading,
    error,
    refetch,
    cancelOrder,
    acceptOrder,
    rejectOrder,
    requestRevision,
    submitDispute,
    uploadAttachment,
    isCancelling,
    isAccepting,
    isRejecting,
    isRequestingRevision,
    isSubmittingDispute,
    isUploading,
    approveExtension,
    rejectExtension,
    isApprovingExtension,
    isRejectingExtension
  };
};
