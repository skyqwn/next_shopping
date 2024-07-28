"use server";

import { actionClient } from "@/lib/actionClient";
import { ResetSchema } from "@/types/reset-schema";
import { eq } from "drizzle-orm";

import { db } from "..";
import { users } from "../schema";
import { generatePasswordResetToken } from "./tokens";
import { sendPasswordResetEmail } from "./email";

export const reset = actionClient
  .schema(ResetSchema)
  .action(async ({ parsedInput: { email } }) => {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!existingUser) {
      return { error: "유저를 찾을 수 없습니다." };
    }

    const passwordResetToken = await generatePasswordResetToken(email);
    if (!passwordResetToken) {
      return { error: "토큰 생성에 실패하였습니다." };
    }
    await sendPasswordResetEmail(
      passwordResetToken[0].email,
      passwordResetToken[0].token
    );
    return { success: "이메일을 전송하였습니다." };
  });
