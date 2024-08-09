"use client";

import { useCartStore } from "@/lib/client-store";
import { useState } from "react";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { redirect, useSearchParams } from "next/navigation";

const AddCart = () => {
  const { addToCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  const params = useSearchParams();

  const id = Number(params.get("id"));
  const productId = Number(params.get("productId"));
  const title = params.get("title");
  const type = params.get("type");
  const price = Number(params.get("price"));
  const image = params.get("image");

  if (!id || !productId || !title || !type || !price || !image) {
    toast({
      variant: "destructive",
      title: "오류 발생",
      description: "해당 제품을 찾을 수 없습니다,",
    });
    return redirect("/");
  }

  return (
    <>
      <div className="flex items-center justify-stretch my-4">
        <Button
          onClick={() => {
            if (quantity > 1) {
              setQuantity(quantity - 1);
            }
          }}
          variant={"secondary"}
          className="text-primary"
        >
          <Minus size={18} strokeWidth={3} />
        </Button>
        <Button className="flex-1">수량: {quantity}</Button>
        <Button
          onClick={() => {
            setQuantity(quantity + 1);
          }}
          variant={"secondary"}
          className="text-primary"
        >
          <Plus size={18} strokeWidth={3} />
        </Button>
      </div>
      <Button
        onClick={() => {
          toast({
            variant: "default",
            title: `${title + " " + type}이 카트에 추가되었습니다.`,
          });
          addToCart({
            id: productId,
            variant: { variantId: id, quantity },
            name: title + " " + type,
            price,
            image,
          });
        }}
      >
        장바구니에 추가
      </Button>
    </>
  );
};

export default AddCart;
