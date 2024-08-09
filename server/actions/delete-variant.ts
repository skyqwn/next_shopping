"use server";

import { actionClient } from "@/lib/actionClient";
import { z } from "zod";
import { db } from "..";
import { productVariants } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { algoliaClient } from "@/lib/algoliaIndex";

const algoliaIndex = algoliaClient.initIndex("products");

export const deleteVariant = actionClient
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      const deleteVariant = await db
        .delete(productVariants)
        .where(eq(productVariants.id, id))
        .returning();
      revalidatePath("/dashboard/products");

      algoliaIndex.deleteObject(deleteVariant[0].id.toString());
      return { success: `Delete ${deleteVariant[0].productType}` };
    } catch (error) {
      return { error: "Failed to delete variant" };
    }
  });
