import * as z from "zod";

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: "비밀번호는 최소 8자이상으로 입력해주세요.",
  }),
  name: z.string().min(4, { message: "이름은 최소 4자이상으로 입력해주세요." }),
});

export type RegisterType = z.infer<typeof RegisterSchema>;
