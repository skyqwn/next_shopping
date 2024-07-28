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
import {
  NewPasswordSchema,
  NewPasswordType,
} from "@/types/new-password-schema";
import { newPassword } from "@/server/actions/new-password";
import { useSearchParams } from "next/navigation";

const NewPasswordForm = () => {
  const form = useForm<NewPasswordType>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
      token: "",
    },
  });

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { toast } = useToast();

  const { execute, status, result } = useAction(newPassword, {
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

  const onSubmit = async (values: NewPasswordType) => {
    execute({ password: values.password, token });
    form.reset(values);
  };

  return (
    <AuthCard
      cardTitle="비밀번호 변경"
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="********"
                        type="password"
                        disabled={status === "executing"}
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
                <Link href={"/auth/reset"}>Forgot your password?</Link>
              </Button>
            </div>
            <Button
              type="submit"
              className={cn(
                "w-full my-2",
                status === "executing" ? "animate-pulse " : ""
              )}
            >
              {"비밀번호 변경"}
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
};

export default NewPasswordForm;
