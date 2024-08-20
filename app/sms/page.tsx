"use client";

import Button from "@/components/button";
import FormInput from "@/components/input";
import { useFormState } from "react-dom";
import { smsLogin } from "./action";

export default function SMSLogin() {
  const [state, dispatch] = useFormState(smsLogin, null);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS Login</h1>
        <h2 className="text-xl">Verify your phone number.</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        <FormInput
          name="phone"
          type="number"
          placeholder="Phone number"
          required
        />
        <FormInput
          name="token"
          type="number"
          placeholder="Verification code"
          required
          minLength={100000}
          maxLength={999999}
        />
        <Button text="Verify" />
      </form>
    </div>
  );
}
