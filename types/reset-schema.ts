import { z } from "zod";

export const ResetSchema = z.object({
  email: z.string().email({
    message: "이메일을 입력해주세요",
  }),
});

export type ResetType = z.infer<typeof ResetSchema>;
