"use server";

import bcrypt from "bcrypt";

import { actionClient } from "@/lib/actionClient";
import { SettingSchema } from "@/types/settings-schema";
import { auth } from "../auth";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { revalidatePath } from "next/cache";

export const settings = actionClient
  .schema(SettingSchema)
  .action(
    async ({
      parsedInput: {
        email,
        image,
        isTwoFactorEnabled,
        name,
        newPassword,
        password,
      },
    }) => {
      const user = await auth();
      if (!user) {
        return { error: "유저를 찾을 수 없습니다." };
      }

      const dbUser = await db.query.users.findFirst({
        where: eq(users.id, user.user.id),
      });

      if (!dbUser) {
        return { error: "유저를 찾을 수 없습니다." };
      }

      if (user.user.isOAuth) {
        email = undefined;
        password = undefined;
        newPassword = undefined;
        isTwoFactorEnabled = undefined;
      }

      if (password && newPassword && dbUser.password) {
        const checkedPassword = await bcrypt.compare(password, dbUser.password);
        if (!checkedPassword) {
          return { error: "비밀번호가 일치하지 않습니다." };
        }
        const samePassword = await bcrypt.compare(newPassword, dbUser.password);
        if (samePassword) {
          return { error: "이전 비밀번호와 다른 비밀번호로 설정해주세요." };
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        password = hashedPassword;
        newPassword = undefined;
      }
      const updatedUser = await db
        .update(users)
        .set({
          twoFactorEnabled: isTwoFactorEnabled,
          name,
          password,
          email,
          image,
        })
        .where(eq(users.id, dbUser.id));
      revalidatePath("/dashboard/settings");
      return { success: "유저정보를 업데이트하였습니다." };
    }
  );
