import React from "react";
import { ShoppingCart } from "lucide-react";
import Button from "@/components/ui/Button";
import useCartStore from "@/lib/store/useCartStore";

const CartIcon = () => {
  const itemsCount = useCartStore((s) => s.getCount());

  return (
    <div className="relative inline-block">
      <Button
        to="/cart"
        unstyled
        className="sm:p-2 p-1 rounded-md transition"
        aria-label="Open cart page"
      >
        <ShoppingCart className="w-5 h-5 text-textWhiteColor" />
        {itemsCount > 0 && (
          <span className="absolute -top-0 right-0 bg-purple-500 text-textWhiteColor text-[10px] font-bold leading-none w-5 h-5 rounded-full flex items-center justify-center z-10">
            {itemsCount}
          </span>
        )}
      </Button>
    </div>
  );
};

export default CartIcon;

