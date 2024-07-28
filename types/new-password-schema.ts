import { z } from "zod";

export const NewPasswordSchema = z.object({
  password: z.string().min(8, "패스워드는 최소 8자로 입력해주세요."),
  token: z.string().nullable().optional(),
});

export type NewPasswordType = z.infer<typeof NewPasswordSchema>;
