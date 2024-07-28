"use client";

import { newVerification } from "@/server/actions/tokens";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import AuthCard from "./auth-card";
import FormSuccess from "./form-success";
import FormError from "./form-error";

const EmailVerificationForm = () => {
  const token = useSearchParams().get("token");
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleVerifictation = useCallback(() => {
    if (success || error) return;
    if (!token) {
      setError("No Token Found");
      return;
    }
    newVerification(token).then((data) => {
      if (data.error) setError(data.error);
      if (data.success) {
        setSuccess(data.success);
        router.push("/auth/login");
      }
    });
  }, []);

  useEffect(() => {
    handleVerifictation();
  }, []);

  return (
    <AuthCard
      backButtonLable="로그인으로 돌아가기"
      backButtonHref="/auth/login"
      cardTitle="계정 인증하기"
    >
      <div className="flex items-center justify-center flex-col w-full">
        <p>{!success && !error ? "Verifying emial..." : null}</p>
        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </AuthCard>
  );
};

export default EmailVerificationForm;
