import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string().min(1, { message: "Password is requried" }),
  code: z.optional(z.string()),
});

export type LoginType = z.infer<typeof LoginSchema>;
