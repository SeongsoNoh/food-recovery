"use server";

import bcrypt from "bcrypt";

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

const checkEmailExists = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  return Boolean(user);
};

const formSchema = z.object({
  email: z
    .string()
    .email()
    .toLowerCase()
    .refine(checkEmailExists, "존재하지 않는 계정입니다."),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(PASSWORD_MIN_LENGTH)
    .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
});

export async function logIn(prevState: any, formData: FormData) {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const result = await formSchema.spa(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    // find a user with the email
    // if the user is found, check password hash
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
      select: {
        id: true,
        password: true,
        address: true,
      },
    });
    const ok = await bcrypt.compare(result.data.password, user?.password ?? "");
    // log the user in
    if (ok) {
      const session = await getSession();
      session.id = user!.id;
      await session.save();
      // 로그인시 저장된 주소가 있으면 home으로 아니면 위치 선택 화면으로 넘어가기
      if (!user!.address) {
        redirect("/map");
      }
      redirect("/home");
    } else {
      return {
        fieldErrors: {
          password: ["잘못된 비밀번호 입니다."],
          email: [],
        },
      };
    }
    // redirect "/profile"
  }
}
