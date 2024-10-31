"use server";
import bcrypt from "bcrypt";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";
import { redirect } from "next/navigation";
import getSession from "@/lib/session";

const checkUsername = (username: String) => !username.includes("potato");

const checkPasswords = ({
  password,
  confirm_password,
}: {
  password: string;
  confirm_password: string;
}) => password === confirm_password;

const checkUniqueUsername = async (username: string) => {
  const user = await db.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });
  return !Boolean(user);
};

const checkUniqueEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  return !Boolean(user);
};
const formSchema = z
  .object({
    email: z.string().email().toLowerCase(),
    // .refine(checkUniqueEmail, "이미 있는 이메일입니다."),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH)
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirm_password: z.string().min(4),
    username: z
      .string({
        invalid_type_error: "이름은 글자여야 합니다.",
        required_error: "이름을 입력해주세요.",
      })
      .min(3, "이름이 너무 짧습니다.")
      .max(10, "이름이 너무 깁니다.")
      .trim()
      .toLowerCase()
      .transform((username) => `${username}`)
      .refine((username) => checkUsername(username), "No potatoes allowed!"),
    // .refine(checkUniqueUsername, "이미 있는 이름입니다."),
    phone: z.string().min(11).max(13),
  })
  // .superRefine(async ({ username }, ctx) => {
  //   const user = await db.user.findUnique({
  //     where: {
  //       username,
  //     },
  //     select: {
  //       id: true,
  //     },
  //   });
  //   if (user) {
  //     ctx.addIssue({
  //       code: "custom",
  //       message: "이미 사용중인 이름입니다.",
  //       path: ["username"],
  //       fatal: true,
  //     });
  //     return z.NEVER;
  //   }
  // })
  .superRefine(async ({ email }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "이미 사용중인 이메일 입니다.",
        path: ["email"],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .refine(checkPasswords, {
    message: "비밀번호는 같아야 합니다.",
    path: ["confirm_password"],
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

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
    phone: formData.get("phone"),
  };

  const result = await formSchema.spa(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    // check if username is taken
    // check if the email is already used
    // has password
    const hashedPassword = await bcrypt.hash(result.data.password, 12);
    // save the user to db
    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
        phone: result.data.phone,
        avatar: "https://buly.kr/EI2QyDt",
      },
      select: {
        id: true,
      },
    });
    // log the user in
    const session = await getSession();
    session.id = user.id;
    await session.save();

    // redirect "/home"
    redirect("/profile");
  }
}
