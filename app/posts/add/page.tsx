"use client";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useFormState } from "react-dom";
import { uploadPost } from "./action";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema, PostType } from "./schema";
import Input from "@/components/input";
import Button from "@/components/button";

const fileSchema = z.object({
  type: z.string().refine((value) => value.includes("image"), {
    message: "이미지 파일만 업로드 가능합니다.",
  }),
  size: z.number().max(1024 * 1024 * 2, {
    message: "이미지 파일은 2MB 이하로 업로드 가능합니다.",
  }),
});

export default function AddPost() {
  const [state, action] = useFormState(uploadPost, null);
  const [preview, setPreview] = useState("");
  const { register } = useForm<PostType>({
    resolver: zodResolver(postSchema),
  });

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    if (!files || files.length == 0) {
      setPreview("");
      return;
    }

    const file = files[0];

    const result = fileSchema.safeParse(file);
    if (!result.success) {
      alert(
        result.error.flatten().fieldErrors.type ||
          result.error.flatten().fieldErrors.size
      );
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
  };
  return (
    <div>
      <div className="fixed top-0 bg-main-color w-full flex items-center py-4 border-b-2 justify-center ">
        <XMarkIcon className="h-8 fixed left-3" />
        <span className="text-xl ">동네생활 글쓰기</span>
      </div>
      <form action={action} className="px-5 py-20 flex flex-col gap-3">
        <Input
          required
          placeholder="제목을 입력하세요"
          type="text"
          {...register("title")}
          //   errors={state?.fieldErrors.title}
        />
        <Input
          type="text"
          required
          placeholder="자유롭게 이야기를 나눠보세요"
          {...register("description")}
          //   errors={state?.fieldErrors.description}
          // className="h-40 border-neutral-500"
          className="bg-transparent rounded-md w-full h-96 focus:outline-none ring-1 focus:ring-2 ring-neutral-200 focus:ring-main-button border-none placeholder:text-neutral-400 px-2"
        />
        <label
          htmlFor="photo"
          className="border-2 h-36 flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
          style={{ backgroundImage: `url(${preview})` }}
        >
          {preview === "" ? (
            <>
              <PhotoIcon className="w-10" />
              <div className="text-neutral-400 text-sm">
                사진을 추가해주세요.
                {/* {state?.fieldErrors.photo} */}
              </div>
            </>
          ) : null}
        </label>
        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
          accept="image/*"
          className="hidden"
        />
        <Button text="작성 완료" />
      </form>
    </div>
  );
}
