"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { useFormState } from "react-dom";
import { startStream } from "./action";

export default function AddStream() {
  const [state, action] = useFormState(startStream, null);
  return (
    <form className="p-5 flex flex-col gap-2" action={action}>
      <Input
        name="title"
        required
        placeholder="라이브 제목을 입력하세요."
        errors={state?.formErrors}
      />
      <Button text="라이브 시작하기" />
    </form>
  );
}
