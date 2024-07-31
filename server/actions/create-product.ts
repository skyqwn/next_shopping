"use server";

import { actionClient } from "@/lib/actionClient";
import { ProductSchema } from "@/types/product-schema";
import { db } from "..";
import { eq } from "drizzle-orm";
import { products } from "../schema";
import { revalidatePath } from "next/cache";

export const createProduct = actionClient
  .schema(ProductSchema)
  .action(async ({ parsedInput: { description, price, title, id } }) => {
    try {
      //Edit Mode
      if (id) {
        const currentProduct = await db.query.products.findFirst({
          where: eq(products.id, id),
        });
        if (!currentProduct) return { error: "제품이 존재하지 않습니다." };
        const editedProduct = await db
          .update(products)
          .set({ description, price, title })
          .where(eq(products.id, id))
          .returning();
        revalidatePath("/dashboard/products");
        return {
          success: `제품 ${editedProduct[0].title} 정보를 수정하였습니다.`,
        };
      }
      //new Create
      if (!id) {
        const newProduct = await db
          .insert(products)
          .values({ description, price, title })
          .returning({ id: products.id, title: products.title });
        revalidatePath("/dashboard/products");
        return {
          success: `제품 ${newProduct[0].title} 추가하였습니다.`,
          product: newProduct[0],
        };
      }
    } catch (error) {
      return { error: JSON.stringify(error) };
    }
  });
