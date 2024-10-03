"use client";

import FormButton from "@/components/button";
import Input from "@/components/input";
import SocialLogin from "@/components/social-login";
import { useFormState } from "react-dom";
import { createAccount } from "./actions";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import TopBar from "@/components/top-bar";
import { useEffect, useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

export default function CreateAccount() {
  const [state, dispatch] = useFormState(createAccount, null);
  function checkBoxClick() {}
  return (
    <div className="flex flex-col gap-10 py-6 px-4 ">
      <TopBar />

      <form action={dispatch} className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 p-5 rounded-xl shadow-md bg-white">
          <h2 className="text-xl pb-3">계정정보</h2>
          <Input
            name="email"
            type="email"
            placeholder="이메일"
            required
            errors={state?.fieldErrors.email}
          />
          <Input
            name="password"
            type="password"
            placeholder="비밀번호"
            required
            errors={state?.fieldErrors.password}
            minLength={PASSWORD_MIN_LENGTH}
          />
          <Input
            name="confirm_password"
            type="password"
            placeholder="비밀번호 확인"
            required
            errors={state?.fieldErrors.confirm_password}
            minLength={PASSWORD_MIN_LENGTH}
          />
        </div>
        <div className="flex flex-col gap-4 p-5 rounded-xl shadow-md bg-white">
          <h2 className="text-xl pb-3">회원정보</h2>
          <Input
            name="username"
            type="text"
            placeholder="이름"
            required
            errors={state?.fieldErrors.username}
            minLength={3}
            maxLength={10}
          />
          <Input name="birthday" type="date" placeholder="생년월일" />
          <span className="text-sm text-neutral-500">휴대폰 번호</span>
          <Input name="phoneNumber" type="tel" placeholder="01012345678" />
          <div className="flex gap-2 items-center *:text-neutral-500">
            <button onClick={checkBoxClick}>
              <CheckCircleIcon className="size-8 text-neutral-300" />
            </button>
            <span>개인정보 활용에 동의하시나요?</span>
          </div>
        </div>
        <FormButton text="계정 생성" />
      </form>
      <SocialLogin />
    </div>
  );
}
