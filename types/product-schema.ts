import * as z from "zod";

export const ProductSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(2, { message: "최소 2글자를 입력해주세요" }),
  description: z
    .string()
    .min(40, { message: "상품 설명을 최소 40글자 입력해주세요" }),
  price: z.coerce
    .number({ message: "가격은 숫자로만 입력해주세요." })
    .positive({ message: "가격은 양수여야합니다." }),
});

export type ProductType = z.infer<typeof ProductSchema>;
