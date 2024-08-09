"use client";

import { useCartStore } from "@/lib/client-store";
import { Button } from "../ui/button";

const Payment = () => {
  const { setCheckoutProgress } = useCartStore();
  return (
    <div className="flex flex-col">
      paymen
      <Button
        onClick={() => {
          setCheckoutProgress("confirmation-page");
        }}
      >
        Pay now
      </Button>
    </div>
  );
};

export default Payment;
