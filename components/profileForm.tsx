"use client";

import Input from "@/components/input";
import { useFormState } from "react-dom";
import { updateAcount } from "../app/profiles/[id]/action";
import FormButton from "@/components/button";
import { User } from "@prisma/client";

interface IUserDetailProps {}

export default function ProfileDetail({ userDetail }: { userDetail: User }) {
  const [state, dispatch] = useFormState(updateAcount, null);

  return (
    <div>
      <form action={dispatch} className="flex flex-col gap-5 mt-14 p-5">
        <div className="flex flex-col gap-4 p-5 rounded-xl shadow-md bg-white">
          <h2 className="text-xl pb-3">회원정보</h2>
          <Input
            name="username"
            type="text"
            placeholder="이름"
            required
            defaultValue={String(userDetail?.username)}
            // errors={state?.fieldErrors.username}
            minLength={3}
            maxLength={10}
          />
          <Input
            name="birthday"
            type="date"
            placeholder="생년월일"
            defaultValue={String(userDetail?.birthday)}
          />
          <span className="text-sm text-neutral-500">휴대폰 번호</span>
          <Input
            name="phoneNumber"
            type="tel"
            placeholder="01012345678"
            defaultValue={String(userDetail?.phone)}
          />
        </div>
        <FormButton text="수정 완료" />
      </form>
    </div>
  );
}
