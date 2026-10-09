import { useEffect } from "react";
import useCartApi from "../../features/cart/hook/useCartApi";
import useCartStore from "../store/useCartStore";

type CartResponse<T = unknown> = {
  status?: boolean;
  data?: T;
};

/**
 * Hook to initialize cart data on app mount
 * Fetches cart data from API if user is logged in
 */
const useCartInit = <T = unknown>() => {
  const { fetchCart } = useCartApi();
  const setCart = useCartStore((s) => s.setCart as (data: T) => void);
  const setLoading = useCartStore((s) => s.setLoading as (state: boolean) => void);

  useEffect(() => {
    const initCart = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        return;
      }

      setLoading(true);
      try {
        const response: CartResponse<T> = await fetchCart();
        if (response.status && response.data) {
          setCart(response.data);
        }
      } catch (err) {
        const error = err as Error;
        console.log("Cart initialization:", error.message);
      } finally {
        setLoading(false);
      }
    };

    void initCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount
};

export default useCartInit;


