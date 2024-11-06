import { z } from "zod";

export const postSchema = z.object({
  photo: z.string(),
  title: z.string(),
  description: z.string(),
});

export type PostType = z.infer<typeof postSchema>;
