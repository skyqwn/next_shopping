"use server";

import { actionClient } from "@/lib/actionClient";
import { RegisterSchema } from "@/types/register-schema";
import bcrypt from "bcrypt";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";

export const emailRegister = actionClient
  .schema(RegisterSchema)
  .action(async ({ parsedInput: { email, name, password } }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      // if(!existingUser.emailVerified) {
      //     const verificationToken =
      // }
      return { error: "Email already in use" };
    }
    return { success: "success!@!@" };
  });
