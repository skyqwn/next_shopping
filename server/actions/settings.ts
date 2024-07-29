"use server";

import { actionClient } from "@/lib/actionClient";
import { SettingSchema } from "@/types/settings-schema";
import { auth } from "../auth";

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
    }
  );
