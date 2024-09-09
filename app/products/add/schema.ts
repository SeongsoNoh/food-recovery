import { z } from "zod";

export const productSchema = z.object({
  photo: z.string({
    required_error: "사진은 필수항목입니다.",
  }),
  title: z.string(),
  description: z.string(),
  price: z.coerce.number(),
});

export type ProductType = z.infer<typeof productSchema>;
