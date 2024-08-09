"use server";

import { actionClient } from "@/lib/actionClient";
import { VariantSchema } from "@/types/variant-schema";
import { db } from "..";
import {
  products,
  productVariants,
  variantImages,
  variantTags,
} from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { algoliaClient } from "@/lib/algoliaIndex";

const algoliaIndex = algoliaClient.initIndex("products");

export const createVariant = actionClient
  .schema(VariantSchema)
  .action(
    async ({
      parsedInput: {
        color,
        editMode,
        id,
        productId,
        productType,
        tags,
        variantImages: newImgs,
      },
    }) => {
      try {
        if (editMode && id) {
          const editVariant = await db
            .update(productVariants)
            .set({
              color,
              productType,
              updated: new Date(),
            })
            .where(eq(productVariants.id, id))
            .returning();

          if (editVariant.length > 0) {
            await db
              .delete(variantTags)
              .where(eq(variantTags.variantId, editVariant[0].id));

            await db.insert(variantTags).values(
              tags.map((tag) => ({
                tag,
                variantId: editVariant[0].id,
              }))
            );

            await db
              .delete(variantImages)
              .where(eq(variantImages.variantId, editVariant[0].id));

            await db.insert(variantImages).values(
              newImgs.map((img, idx) => ({
                name: img.name,
                size: img.size,
                url: img.url,
                variantId: editVariant[0].id,
                order: idx,
              }))
            );
          }

          algoliaIndex.partialUpdateObject({
            objectID: editVariant[0].id.toString(),
            id: editVariant[0].productId,
            productType: editVariant[0].productType,
            variantImages: newImgs[0].url,
          });

          revalidatePath(`/dashboard/products`);
          return { success: `Edited ${productType}` };
        }

        if (!editMode) {
          const newVariant = await db
            .insert(productVariants)
            .values({
              color,
              productType,
              productId,
            })
            .returning();

          const product = await db.query.products.findFirst({
            where: eq(products.id, productId),
          });

          await db.insert(variantTags).values(
            tags.map((tag) => ({
              tag,
              variantId: newVariant[0].id,
            }))
          );
          await db.insert(variantImages).values(
            newImgs.map((img, idx) => ({
              name: img.name,
              size: img.size,
              url: img.url,
              variantId: newVariant[0].id,
              order: idx,
            }))
          );

          if (product) {
            algoliaIndex.saveObject({
              objectID: newVariant[0].id.toString(),
              id: newVariant[0].productId,
              title: product.title,
              price: product.price,
              productType: newVariant[0].productType,
              variantImages: newImgs[0].url,
            });
          }

          revalidatePath("/dashboard/products");
          return { success: `Added ${productType}` };
        }
      } catch (error) {
        console.log(error);
        return { error: "Failed to create variant" };
      }
    }
  );
