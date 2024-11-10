"use client";

import Input from "@/components/input";
import { useFormState } from "react-dom";
import { updateAcount } from "../app/profiles/[id]/action";
import FormButton from "@/components/button";
import { User } from "@prisma/client";
import Image from "next/image";
import { z } from "zod";
import { useState } from "react";
import { getUploadUrl } from "@/lib/imgUploadUrl";
import { CameraIcon } from "@heroicons/react/24/solid";
import BackButton from "./back-button";

const fileSchema = z.object({
  type: z.string().refine((value) => value.includes("image"), {
    message: "이미지 파일만 업로드 가능합니다.",
  }),
  size: z.number().max(1024 * 1024 * 2, {
    message: "이미지 파일은 2MB 이하로 업로드 가능합니다.",
  }),
});

export default function ProfileDetail({ userDetail }: { userDetail: User }) {
  const [preview, setPreview] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [photoId, setPhotoId] = useState("");
  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    if (!files || files.length == 0) {
      setPreview("");
      return;
    }

    const file = files[0];
    const fileResult = fileSchema.safeParse(file);
    if (!fileResult.success) {
      alert(
        fileResult.error.flatten().fieldErrors.type ||
          fileResult.error.flatten().fieldErrors.size
      );
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    const { success, result } = await getUploadUrl();
    if (success) {
      const { id, uploadURL } = result;
      setUploadUrl(uploadURL);
      setPhotoId(id);
    } else {
      console.log("dksehlskmssrjsirhdbbbnbnbnbnbnbnbn");
    }
  };

  const interceptAction = async (_: any, formData: FormData) => {
    const file = formData.get("avatar");
    if (!file) {
      return;
    }
    // upload image to cloudflare
    const cloudflareForm = new FormData();
    cloudflareForm.append("file", file);
    const response = await fetch(uploadUrl, {
      method: "post",
      body: cloudflareForm,
    });
    if (response.status !== 200) {
      return;
    }
    // replace `photo` in formData
    const photoUrl = `https://imagedelivery.net/Wnox8XZD9gbcAvrlkKfJNw/${photoId}`;
    formData.set("avatar", photoUrl);
    // call upload product.
    return updateAcount(_, formData);
  };
  const [state, dispatch] = useFormState(interceptAction, null);

  return (
    <div>
      <BackButton />
      <form action={dispatch} className="flex flex-col gap-5 p-5 border-t-2">
        <div className="flex flex-col items-center w-full gap-4 p-5 rounded-xl shadow-md bg-white">
          <h2 className="text-2xl font-semibold pb-3 ">회원정보</h2>
          {/* <Image
            src={preview === "" ? userDetail?.avatar! : preview}
            alt="{message.user.username}"
            width={100}
            height={100}
            className="size-20 rounded-full "
          /> */}
          <label
            htmlFor="avatar"
            className="cursor-pointer bg-center bg-cover size-20 rounded-full "
            style={{
              backgroundImage: `url(${
                preview === ""
                  ? userDetail?.avatar
                    ? userDetail?.avatar
                    : "https://imagedelivery.net/Wnox8XZD9gbcAvrlkKfJNw/970f919a-fb0b-4f7c-7dce-88ce7ff44600/avatar"
                  : preview
              })`,
            }}
          >
            <div className="border border-neutral-300 flex items-center justify-center bg-white rounded-full w-8 h-8 ml-12 mt-12">
              <CameraIcon className="size-6 text-neutral-400" />
            </div>
          </label>
          <input
            onChange={onImageChange}
            type="file"
            id="avatar"
            name="avatar"
            accept="image/*"
            className="hidden"
          />

          <div className="flex flex-col gap-5 w-full">
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
              defaultValue={userDetail?.birthday ? userDetail.birthday : ""}
            />
            <span className="text-sm text-neutral-500">휴대폰 번호</span>
            <Input
              name="phone"
              type="tel"
              placeholder="01012345678"
              defaultValue={String(userDetail?.phone)}
              errors={state?.fieldErrors.phone}
            />
          </div>
        </div>
        <FormButton text="수정 완료" />
      </form>
    </div>
  );
}
