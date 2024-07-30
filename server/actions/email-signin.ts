"use server";

import { eq } from "drizzle-orm";

import { db } from "..";
import { actionClient } from "@/lib/actionClient";
import { LoginSchema } from "@/types/login-schema";
import { twoFactorTokens, users } from "../schema";
import {
  generateEmailVerificationToken,
  generateTwoFactorToken,
  getTwoFactorTokenByEmail,
} from "./tokens";
import { sendTwoFactorTokenByEmail, sendVerificationEmail } from "./email";
import { signIn } from "../auth";
import { AuthError } from "next-auth";

export const emailSignIn = actionClient
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password, code } }) => {
    try {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (existingUser?.email !== email) {
        return { error: "이메일을 찾을 수 없습니다." };
      }

      if (!existingUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(
          existingUser.email
        );
        await sendVerificationEmail(
          verificationToken[0].email,
          verificationToken[0].token
        );
        return {
          success:
            "이메일을 전송하였습니다. 가입한 이메일을 먼저 인증 해주세요!",
        };
      }

      if (existingUser.twoFactorEnabled && existingUser.email) {
        if (code) {
          const twoFactorToken = await getTwoFactorTokenByEmail(
            existingUser.email
          );
          if (!twoFactorToken) {
            return { error: "토큰이 존재하지 않습니다." };
          }
          if (twoFactorToken.token !== code) {
            return { error: "토큰이 존재하지 않습니다." };
          }
          const hasExpired = new Date(twoFactorToken.expires) < new Date();
          if (hasExpired) {
            return {
              error: "토큰 유효기간이 완료되었습니다. 다시 시도해주세요.",
            };
          }
          await db
            .delete(twoFactorTokens)
            .where(eq(twoFactorTokens.id, twoFactorToken.id));

          const existingConfirmation = await getTwoFactorTokenByEmail(
            existingUser.email
          );

          if (existingConfirmation) {
            await db
              .delete(twoFactorTokens)
              .where(eq(twoFactorTokens.email, existingUser.email));
          }
        } else {
          const token = await generateTwoFactorToken(existingUser.email);
          if (!token) {
            return { error: "토큰을 생성하지 못하였습니다 다시 시도해주세요." };
          }

          await sendTwoFactorTokenByEmail(token[0].email, token[0].token);
          return {
            twoFactor: "이중보안 토큰을 가입된 이메일로 전송하였습니다.",
          };
        }
      }

      await signIn("credentials", {
        email,
        password,
        redirectTo: "/",
      });

      return { success: email };
    } catch (error) {
      console.log(error);
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return { error: "이메일 또는 비밀번호를 확인해주세요." };
          case "AccessDenied":
            return { error: error.message };
          case "OAuthSignInError":
            return { error: error.message };
          default:
            return { error: "Something Wrong Error" };
        }
      }
      throw error;
    }
  });
