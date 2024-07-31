"use server";

import { eq } from "drizzle-orm";
import { db } from "..";
import { products } from "../schema";

export async function getProduct(id: number) {
  try {
    const product = await db.query.products.findFirst({
      where: eq(products.id, id),
    });
    if (!product) throw new Error("존재하지 않는 상품입니다.");
    return { success: `${product.title}을 찾았습니다`, product };
  } catch (error) {
    return { error: "상품목록을 가져오는데 실패하였습니다." };
  }
}
