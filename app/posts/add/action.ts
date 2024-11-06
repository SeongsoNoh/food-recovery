"use server";

import fs from "fs/promises";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { postSchema } from "./schema";

export async function uploadPost(_: any, formData: FormData) {
  const data = {
    photo: formData.get("photo"),
    title: formData.get("title"),
    description: formData.get("description"),
  };

  const results = postSchema.safeParse(data);
  if (!results.success) {
    return results.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const post = await db.post.create({
        data: {
          photo: results.data.photo,
          title: results.data.title,
          description: results.data.description,
          user: {
            connect: {
              id: session.id,
            },
          },
        },
        select: {
          id: true,
        },
      });
      redirect(`/posts/${post.id}`);
    }
  }
}
