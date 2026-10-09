"use client";
import { useState, useEffect, useCallback } from 'react';
import { providerOrdersService } from '../../services/provider-orders.service';
import { 
  OrderDetails, 
  ApiResponse,
  RequestOptions 
} from '../../types/provider.types';
import { useAlert } from '@/lib/context/AlertProvider';

interface UseOrderDetailsOptions {
  autoFetch?: boolean;
  orderId?: string | number;
}

interface UseOrderDetailsReturn {
  orderDetails: OrderDetails | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  confirmOrder: () => Promise<boolean>;
  deliverOrder: (deliveryMessage: string, attachments: File[]) => Promise<boolean>;
  deliverRevision: (deliveryMessage: string, attachments: File[]) => Promise<boolean>;
  cancelOrder: (reason?: string) => Promise<boolean>;
  rejectOrder: (reason_id: number, notes: string) => Promise<boolean>;
  rejectRevision: (revisionId: number | string, rejection_reason: string) => Promise<boolean>;
  acceptRevision: (revisionId: number | string) => Promise<boolean>;
  isConfirming: boolean;
  isDelivering: boolean;
  isDeliveringRevision: boolean;
  isCancelling: boolean;
  isRejecting: boolean;
  isRejectingRevision: boolean;
  isAcceptingRevision: boolean;
  requestExtension: (days: number, reason_id: number, description: string) => Promise<boolean>;
  isRequestingExtension: boolean;
  devChangeOrderStatus: (status: string) => Promise<boolean>;
  isChangingStatus: boolean;
}

export const useOrderDetails = (
  options: UseOrderDetailsOptions = {}
): UseOrderDetailsReturn => {
  const { autoFetch = true, orderId } = options;

  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Action loading states
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDelivering, setIsDelivering] = useState(false);
  const [isDeliveringRevision, setIsDeliveringRevision] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isRejectingRevision, setIsRejectingRevision] = useState(false);
  const [isAcceptingRevision, setIsAcceptingRevision] = useState(false);
  const [isRequestingExtension, setIsRequestingExtension] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  const { message } = useAlert();

  const fetchOrderDetails = useCallback(async (id: string | number) => {
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

      await providerOrdersService.getOrderById(id, requestOptions);
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

  const confirmOrder = useCallback(async (): Promise<boolean> => {
    if (!orderId) return false;

    setIsConfirming(true);

    try {
      const requestOptions: RequestOptions<void> = {
        onSuccess: () => {
          message.success('Order started successfully.');
          refetch();
        },
        onError: (error) => {
          message.error(error.message);
          console.error('Failed to start order:', error);
        }
      };

      const result = await providerOrdersService.confirmOrder(orderId, requestOptions);
      return result !== null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start order';
      message.error(errorMessage);
      return false;
    } finally {
      setIsConfirming(false);
    }
  }, [orderId, refetch, message]);

  const deliverOrder = useCallback(async (deliveryMessage: string, attachments: File[]): Promise<boolean> => {
    if (!orderId) return false;

    setIsDelivering(true);

    try {
      const requestOptions: RequestOptions<void> = {
        onSuccess: () => {
          message.success('Order delivered successfully.');
          refetch();
        },
        onError: (error) => {
          message.error(error.message);
          console.error('Failed to deliver order:', error);
        }
      };

      const result = await providerOrdersService.deliverOrder(orderId, deliveryMessage, attachments, requestOptions);
      return result !== null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to deliver order';
      message.error(errorMessage);
      return false;
    } finally {
      setIsDelivering(false);
    }
  }, [orderId, refetch, message]);

  const deliverRevision = useCallback(async (deliveryMessage: string, attachments: File[]): Promise<boolean> => {
    if (!orderId) return false;

    setIsDeliveringRevision(true);

    try {
      const requestOptions: RequestOptions<void> = {
        onSuccess: () => {
          message.success('Revision delivered successfully.');
          refetch();
        },
        onError: (error) => {
          message.error(error.message);
          console.error('Failed to deliver revision:', error);
        }
      };

      const result = await providerOrdersService.deliverRevision(orderId, deliveryMessage, attachments, requestOptions);
      return result !== null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to deliver revision';
      message.error(errorMessage);
      return false;
    } finally {
      setIsDeliveringRevision(false);
    }
  }, [orderId, refetch, message]);

  const cancelOrder = useCallback(async (reason?: string): Promise<boolean> => {
    if (!orderId) return false;

    setIsCancelling(true);

    try {
      const requestOptions: RequestOptions<void> = {
        onSuccess: () => {
          message.success('Order cancelled successfully.');
          refetch();
        },
        onError: (error) => {
          message.error(error.message);
          console.error('Failed to cancel order:', error);
        }
      };

      const result = await providerOrdersService.cancelOrder(orderId, reason, requestOptions);
      return result !== null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel order';
      message.error(errorMessage);
      return false;
    } finally {
      setIsCancelling(false);
    }
  }, [orderId, refetch, message]);

  const rejectOrder = useCallback(async (reason_id: number, notes: string): Promise<boolean> => {
    if (!orderId || !reason_id) return false;

    setIsRejecting(true);

    try {
      const requestOptions: RequestOptions<void> = {
        onSuccess: () => {
          message.success('Order request rejected.');
          refetch();
        },
        onError: (error) => {
          message.error(error.message);
          console.error('Failed to reject order:', error);
        }
      };

      const result = await providerOrdersService.rejectOrder(orderId, reason_id, notes, requestOptions);
      return result !== null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reject order';
      message.error(errorMessage);
      return false;
    } finally {
      setIsRejecting(false);
    }
  }, [orderId, refetch, message]);

  const rejectRevision = useCallback(async (revisionId: number | string, rejection_reason: string): Promise<boolean> => {
    if (!revisionId) return false;

    setIsRejectingRevision(true);

    try {
      const requestOptions: RequestOptions<void> = {
        onSuccess: () => {
          message.success('Revision request rejected successfully.');
          refetch();
        },
        onError: (error) => {
          message.error(error.message);
          console.error('Failed to reject revision:', error);
        }
      };

      const result = await providerOrdersService.rejectRevision(revisionId, rejection_reason, requestOptions);
      return result !== null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reject revision';
      message.error(errorMessage);
      return false;
    } finally {
      setIsRejectingRevision(false);
    }
  }, [refetch, message]);

  const acceptRevision = useCallback(async (revisionId: number | string): Promise<boolean> => {
    if (!revisionId) return false;

    setIsAcceptingRevision(true);

    try {
      const requestOptions: RequestOptions<void> = {
        onSuccess: () => {
          message.success('Revision request accepted successfully.');
          refetch();
        },
        onError: (error) => {
          message.error(error.message);
          console.error('Failed to accept revision:', error);
        }
      };

      const result = await providerOrdersService.acceptRevision(revisionId, requestOptions);
      return result !== null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to accept revision';
      message.error(errorMessage);
      return false;
    } finally {
      setIsAcceptingRevision(false);
    }
  }, [refetch, message]);

  const requestExtension = useCallback(async (days: number, reason_id: number, description: string): Promise<boolean> => {
    if (!orderId) return false;

    setIsRequestingExtension(true);

    try {
      const requestOptions: RequestOptions<void> = {
        onSuccess: () => {
          message.success('Extension request sent successfully.');
          refetch();
        },
        onError: (error) => { 
          console.log("extention Eror",error.message)
          message.error(error.message);
          console.error('Failed to request extension:', error);
        }
      };

      const result = await providerOrdersService.requestExtension(orderId, { days, reason_id, description }, requestOptions);
      return result !== null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to request extension';
      message.error(errorMessage);
      return false;
    } finally {
      setIsRequestingExtension(false);
    }
  }, [orderId, refetch, message]);

  const devChangeOrderStatus = useCallback(async (status: string): Promise<boolean> => {
    if (process.env.NODE_ENV !== 'development') return false;
    if (!orderId) return false;

    setIsChangingStatus(true);

    try {
      const requestOptions: RequestOptions<void> = {
        onSuccess: () => {
          message.success(`Status changed to ${status} successfully.`);
          refetch();
        },
        onError: (error) => {
          message.error(error.message);
          console.error('Failed to change status:', error);
        }
      };

      const result = await providerOrdersService.devChangeOrderStatus(orderId, status, requestOptions);
      return result !== null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to change status';
      message.error(errorMessage);
      return false;
    } finally {
      setIsChangingStatus(false);
    }
  }, [orderId, refetch, message]);

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
    confirmOrder,
    deliverOrder,
    deliverRevision,
    cancelOrder,
    rejectOrder,
    rejectRevision,
    acceptRevision,
    isConfirming,
    isDelivering,
    isDeliveringRevision,
    isCancelling,
    isRejecting,
    isRejectingRevision,
    isAcceptingRevision,
    requestExtension,
    isRequestingExtension,
    devChangeOrderStatus,
    isChangingStatus
  };
};
