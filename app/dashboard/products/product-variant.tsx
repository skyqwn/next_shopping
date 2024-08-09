"use client";

import { VariantsWithImagesTags } from "@/lib/infer-type";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VariantSchema, zVariantSchema } from "@/types/variant-schema";
import VariantImages from "./variants-images";
import { useAction } from "next-safe-action/hooks";
import { createVariant } from "@/server/actions/create-variant";
import { useToast } from "@/components/ui/use-toast";
import { forwardRef, useEffect, useState } from "react";
import InputTags from "./input-tags";
import { deleteVariant } from "@/server/actions/delete-variant";

interface ProductVariantProps {
  children: React.ReactNode;
  editMode: boolean;
  productId?: number;
  variant?: VariantsWithImagesTags;
}

const ProductVariant = forwardRef<HTMLDivElement, ProductVariantProps>(
  ({ editMode, productId, children, variant }, ref) => {
    const { toast } = useToast();
    const [open, setOpen] = useState(false);

    const form = useForm<zVariantSchema>({
      resolver: zodResolver(VariantSchema),
      defaultValues: {
        tags: [],
        variantImages: [],
        color: "#000000",
        editMode,
        id: undefined,
        productId,
        productType: "Black Notebook",
      },
    });

    const setEdit = () => {
      if (!editMode) {
        form.reset();
        return;
      }
      if (editMode && variant) {
        form.setValue("editMode", true);
        form.setValue("id", variant.id);
        form.setValue("productId", variant.productId);
        form.setValue("productType", variant.productType);
        form.setValue("color", variant.color);
        form.setValue(
          "tags",
          variant.variantTags.map((tag) => tag.tag)
        );
        form.setValue(
          "variantImages",
          variant.variantImages.map((img) => ({
            name: img.name,
            size: img.size,
            url: img.url,
          }))
        );
      }
    };

    useEffect(() => {
      setEdit();
    }, []);

    const { execute, status } = useAction(createVariant, {
      onSuccess: ({ data }) => {
        if (data?.success) {
          toast({
            variant: "default",
            title: "제품 세부사항 생성 성공! 🎉",
            description: data?.success,
          });
          setOpen(false);
        }
        if (data?.error) {
          toast({
            variant: "destructive",
            title: "제품 세부사항 생성 실패!",
            description: data.error,
          });
        }
      },
    });

    const variantAction = useAction(deleteVariant, {
      onSuccess: ({ data }) => {
        if (data?.success) {
          toast({
            variant: "default",
            title: "제품 세부사항 삭제 성공! 🎉",
            description: data?.success,
          });
          setOpen(false);
        }
        if (data?.error) {
          toast({
            variant: "destructive",
            title: "제품 세부사항 삭제 실패!",
            description: data.error,
          });
        }
      },
    });

    const onSubmit = (values: zVariantSchema) => {
      execute(values);
    };

    return (
      <Dialog open={open} onOpenChange={() => setOpen((prev) => !prev)}>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent className="lg:max-w-screen-lg overflow-y-scroll max-h-[860px] rouded-md">
          <DialogHeader>
            <DialogTitle>{editMode ? "수정" : "등록"}</DialogTitle>
            <DialogDescription>제품의 특성을 등록해주세요</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="productType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variant Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Prick a title for your variant"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variant Color</FormLabel>
                    <FormControl>
                      <Input type="color" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variant Tags</FormLabel>
                    <FormControl>
                      <InputTags
                        {...field}
                        onChange={(e) => field.onChange(e)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <VariantImages />
              <div className="flex gap-4 items-center justify-center">
                {editMode && variant && (
                  <Button
                    variant={"destructive"}
                    disabled={variantAction.status === "executing"}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      variantAction.execute({ id: variant.id });
                    }}
                  >
                    Delete Variant
                  </Button>
                )}
                <Button
                  disabled={
                    status === "executing" ||
                    !form.formState.isValid ||
                    !form.formState.isDirty
                  }
                  type="submit"
                >
                  {editMode ? "Update Variant" : "Create Variant"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }
);
ProductVariant.displayName = "ProductVariant";

export default ProductVariant;
