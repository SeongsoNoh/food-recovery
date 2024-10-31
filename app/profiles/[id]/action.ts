"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { z } from "zod";

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "이름은 글자여야 합니다.",
        required_error: "이름을 입력해주세요.",
      })
      .min(3, "이름이 너무 짧습니다.")
      .max(10, "이름이 너무 깁니다.")
      .trim()
      .toLowerCase()
      .transform((username) => `${username}`),
    phone: z.string().min(11).max(13),
    birthday: z.string(),
  })
  .superRefine(async ({ phone }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        phone,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "이미 사용중인 전화번호 입니다.",
        path: ["phone"],
        fatal: true,
      });
      return z.NEVER;
    }
  });

export async function updateAcount(prevState: any, formData: FormData) {
  // log the user in
  const session = await getSession();
  const data = {
    username: formData.get("username"),
    phone: formData.get("phone"),
    birthday: formData.get("birthday"),
  };
  const result = await formSchema.spa(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    await db.user.update({
      where: {
        id: session.id,
      },
      data: {
        username: result.data.username,
        phone: result.data.phone,
        birthday: result.data.birthday,
        // avatar: "https://buly.kr/EI2QyDt",
      },
    });

    // redirect "/home"
    redirect("/profile");
  }
}
