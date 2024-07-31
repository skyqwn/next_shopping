"use server";

import { actionClient } from "@/lib/actionClient";
import { z } from "zod";
import { db } from "..";
import { products } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const deleteProduct = actionClient
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      const data = await db
        .delete(products)
        .where(eq(products.id, id))
        .returning();

      revalidatePath("/dashboard/products");
      return { success: `${data[0].title} 삭제 성공하였습니다.` };
    } catch (error) {
      return { error: "상품삭제에 실패하였습니다. 다시 시도해주세요" };
    }
  });
