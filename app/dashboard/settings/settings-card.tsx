"use client";

import { Session } from "next-auth";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SettingSchema, SettingType } from "@/types/settings-schema";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface SettingProps {
  session: Session;
}

const SettingsCard = (session: SettingProps) => {
  const [avatarUploading, setAvatarUploading] = useState(false);

  const { toast } = useToast();
  const form = useForm<SettingType>({
    resolver: zodResolver(SettingSchema),
    defaultValues: {
      password: "",
      newPassword: "",
      name: session.session.user?.name || undefined,
      email: session.session.user?.email || undefined,
      // isTwoFactorEnabled: session.session.user?.isTwoFactorEnable || undefined
    },
  });

  const onSubmit = (values: SettingType) => {
    // execute(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Settings</CardTitle>
        <CardDescription>계정 업데이트</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      disabled={status === "executing"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <div className="flex items-center gap-4">
                    {!form.getValues("image") && (
                      <div className="font-bold">
                        {session.session.user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {form.getValues("image") && (
                      <Image
                        className="rouded-full"
                        width={40}
                        height={40}
                        alt="User Image"
                        src={form.getValues("image")!}
                      />
                    )}
                  </div>
                  <FormControl>
                    <Input
                      placeholder="User Iamge"
                      type="hidden"
                      disabled={status === "executing"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비밀번호</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="********"
                      disabled={status === "executing"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>새 비밀번호</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="********"
                      disabled={status === "executing"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isTwoFactorEnabled"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이중 인증</FormLabel>
                  <FormDescription>
                    계정에 대해 2가지 요소 인증 사용
                  </FormDescription>
                  <FormControl>
                    <Switch disabled={status === "executing"} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={status === "executing" || avatarUploading}
              type="submit"
            >
              계정 업데이트
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SettingsCard;
