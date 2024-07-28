"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import AuthCard from "./auth-card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import FormSuccess from "./form-success";
import FormError from "./form-error";
import { useToast } from "../ui/use-toast";
import { ResetSchema, ResetType } from "@/types/reset-schema";
import { reset } from "@/server/actions/password-reset";

const ResetForm = () => {
  const form = useForm<ResetType>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { toast } = useToast();

  const { execute, status, result } = useAction(reset, {
    onSuccess({ data }) {
      if (data?.error) {
        toast({
          variant: "destructive",
          title: "비밀번호변경 실패",
          description: data.error,
        });
      }
      if (data?.success) {
        toast({
          variant: "default",
          title: "Success! 🎉",
          description: data?.success,
        });
      }
    },
  });

  const onSubmit = async (values: ResetType) => {
    execute(values);
    form.reset(values);
  };

  return (
    <AuthCard
      cardTitle="비밀번호를 잊으셨나요?"
      backButtonHref="/auth/login"
      backButtonLable="로그인하러 가기"
      showSocial
    >
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="test@test.com"
                        type="email"
                        disabled={status === "executing"}
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormSuccess message={success} />
              <FormError message={error} />
              <Button size={"sm"} variant={"link"}>
                <Link href={"/auth/register"}>회원이 아니신가요?</Link>
              </Button>
            </div>
            <Button
              type="submit"
              className={cn(
                "w-full my-2",
                status === "executing" ? "animate-pulse " : ""
              )}
            >
              {"비밀번호변경"}
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
};

export default ResetForm;
