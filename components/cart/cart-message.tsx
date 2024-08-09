"use client";

import { useCartStore } from "@/lib/client-store";
import { motion } from "framer-motion";
import { DrawerDescription, DrawerTitle } from "../ui/drawer";
import { ArrowLeft } from "lucide-react";

const CartMessage = () => {
  const { checkoutProgress, setCheckoutProgress } = useCartStore();
  return (
    <motion.div
      className="text-center"
      animate={{ opacity: 1, x: 0 }}
      initial={{ opacity: 0, x: 10 }}
    >
      <DrawerTitle>
        {checkoutProgress === "cart-page" ? "장바구니 아이템목록" : null}
        {checkoutProgress === "payment-page" ? "결제단계" : null}
        {checkoutProgress === "confirmation-page" ? "확정단계" : null}
      </DrawerTitle>
      <DrawerDescription className="py-1">
        {checkoutProgress === "cart-page" ? "장바구니 확인 또는 수정" : null}
        {checkoutProgress === "payment-page" ? (
          <span
            onClick={() => setCheckoutProgress("cart-page")}
            className="flex items-center justify-center gap-1 cursor-pointer hover:text-primary"
          >
            <ArrowLeft size={14} />
            이전 단계로 넘어가기
          </span>
        ) : null}
        {checkoutProgress === "confirmation-page" ? "확정단계" : null}
      </DrawerDescription>
    </motion.div>
  );
};

export default CartMessage;
