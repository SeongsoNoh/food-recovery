"use client";

import FormButton from "@/components/button";
import Input from "@/components/input";
import SocialLogin from "@/components/social-login";
import { useFormState } from "react-dom";
import { createAccount } from "./actions";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import { useEffect, useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import TopBar from "@/components/top-bar";
import BackButton from "@/components/back-button";

export default function CreateAccount() {
  const [state, dispatch] = useFormState(createAccount, null);
  const [isChecked, setIsChecked] = useState(false);
  function checkBoxClick() {
    setIsChecked(!isChecked);
  }
  async function handleSubmit(event: any) {
    if (!isChecked) {
      event.preventDefault(); // 체크박스가 선택되지 않았을 때 폼 제출을 막음
      alert("개인정보 활용에 동의해야 계정을 생성할 수 있습니다.");
      return;
    }
  }
  return (
    <div className="flex flex-col gap-10 px-4 ">
      <BackButton />
      {/* <div className="fixed top-0 w-full mx-auto max-w-screen-md flex items-center justify-center *:text-neutral-600 bg-main-color h-16 ">
        <span className="text-2xl font-semibold">회원가입</span>
      </div> */}
      <form
        action={dispatch}
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 "
      >
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
          <Input
            name="phone"
            type="tel"
            placeholder="01012345678"
            errors={state?.fieldErrors.phone}
          />

          <div className="flex gap-2 items-center *:text-neutral-500">
            <button type="button" onClick={checkBoxClick}>
              <CheckCircleIcon
                className={`size-8 ${
                  isChecked ? "text-green-500" : "text-neutral-300"
                }`}
              />
            </button>
            <span>개인정보 활용에 동의하시나요?</span>
          </div>
        </div>
        <FormButton text="계정 생성" />
      </form>

      {/* <SocialLogin /> */}
    </div>
  );
}
