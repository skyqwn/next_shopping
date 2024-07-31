"use client";

import { useForm } from "react-hook-form";
import { ProductSchema, ProductType } from "@/types/product-schema";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
import { DollarSign } from "lucide-react";
import Tiptap from "./tiptap";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { createProduct } from "@/server/actions/create-product";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { getProduct } from "@/server/actions/get-products";
import { useEffect } from "react";

const ProductForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const editMode = searchParams.get("id");

  const checkProduct = async (id: number) => {
    if (editMode) {
      const { error, success, product } = await getProduct(id);
      if (error) {
        toast({
          variant: "destructive",
          title: error,
        });
        router.push("/dashboard/products");
        return;
      }
      if (success) {
        const id = parseInt(editMode);
        form.setValue("title", product.title);
        form.setValue("description", product.description);
        form.setValue("price", product.price);
        form.setValue("id", id);
      }
    }
  };

  useEffect(() => {
    if (editMode) {
      checkProduct(parseInt(editMode));
    }
  }, []);

  const form = useForm<ProductType>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
    mode: "onChange",
  });

  const { execute, status } = useAction(createProduct, {
    onSuccess: ({ data }) => {
      if (data?.error) {
        toast({
          variant: "destructive",
          title: "제품등록 실패!",
          description: data.error,
        });
      }
      if (data?.success) {
        toast({
          variant: "default",
          title: "제품등록 성공! 🎉",
          description: data?.success,
        });
        router.push(`/dashboard/products`);
      }
    },
  });

  const onSubmit = (values: ProductType) => {
    execute(values);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>{editMode ? "제품 수정" : "제품 등록"}</CardTitle>
        <CardDescription>
          {editMode
            ? "등록된 상품의 정보를 수정하세요."
            : "새로운 상품을 등록해주세요."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>상품명</FormLabel>
                  <FormControl>
                    <Input placeholder="상품명을 입력해주세요." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>상품설명</FormLabel>
                  <FormControl>
                    <Tiptap val={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>상품설명</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <DollarSign
                        size={36}
                        className="p-2 bg-muted rounded-md"
                      />
                      <Input
                        {...field}
                        type="number"
                        placeholder="10"
                        min={0}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={
                status === "executing" ||
                !form.formState.isValid ||
                !form.formState.isDirty
              }
              type="submit"
            >
              {editMode ? "수정하기" : "등록하기"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;
