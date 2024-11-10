"use client";

import FormButton from "@/components/button";
import FormInput from "@/components/input";
import SocialLogin from "@/components/social-login";
import { useFormState } from "react-dom";
import { logIn } from "./actions";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import BackButton from "@/components/back-button";

export default function LogIn() {
  const [state, dispatch] = useFormState(logIn, null);
  return (
    <div className="flex flex-col gap-10 px-5">
      {/* <div className="fixed top-0 w-full mx-auto max-w-screen-md flex items-center justify-center *:text-neutral-600 bg-main-color h-16 ">
        <span className="text-2xl font-semibold">로그인</span>
        </div> */}
      <BackButton />
      <form
        action={dispatch}
        className="px-6 py-10 flex flex-col gap-5 rounded-xl shadow-md bg-white"
      >
        <FormInput
          name="email"
          type="email"
          placeholder="이메일"
          required
          errors={state?.fieldErrors.email}
        />
        <FormInput
          name="password"
          type="password"
          placeholder="비밀번호"
          required
          minLength={PASSWORD_MIN_LENGTH}
          errors={state?.fieldErrors.password}
        />
        <FormButton text="로그인" />
      </form>
      {/* <SocialLogin /> */}
    </div>
  );
}
