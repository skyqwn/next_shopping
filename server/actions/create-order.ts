"use server";

import { actionClient } from "@/lib/actionClient";
import { CrateOrderSchema } from "@/types/order-schema";
import { auth } from "../auth";
import { db } from "..";
import { orderProduct, orders } from "../schema";

export const createOrder = actionClient
  .schema(CrateOrderSchema)
  .action(async ({ parsedInput: { products, status, total } }) => {
    const user = await auth();
    if (!user) return { error: "로그인후 사용해주세요." };

    const order = await db
      .insert(orders)
      .values({
        status,
        total,
        userId: user.user.id,
      })
      .returning();

    const orderProducts = products.map(
      async ({ productId, quantity, variantId }) => {
        const newOrderProduct = await db
          .insert(orderProduct)
          .values({
            quantity,
            orderId: order[0].id,
            productId: productId,
            productVariantId: variantId,
          })
          .returning();
      }
    );
    return { success: "Order has been added" };
  });
