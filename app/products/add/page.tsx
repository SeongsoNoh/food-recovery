"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { setPriority } from "os";
import { useState } from "react";
import { uploadProduct } from "./action";
import { useFormState } from "react-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductType } from "./schema";

const fileSchema = z.object({
  type: z.string().refine((value) => value.includes("image"), {
    message: "이미지 파일만 업로드 가능합니다.",
  }),
  size: z.number().max(1024 * 1024 * 2, {
    message: "이미지 파일은 2MB 이하로 업로드 가능합니다.",
  }),
});

export default function AddProduct() {
  const [state, action] = useFormState(uploadProduct, null);
  const [preview, setPreview] = useState("");
  const { register } = useForm<ProductType>({
    resolver: zodResolver(productSchema),
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
      <form action={action} className="p-5 flex flex-col gap-5">
        <label
          htmlFor="photo"
          className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
          style={{ backgroundImage: `url(${preview})` }}
        >
          {preview === "" ? (
            <>
              <PhotoIcon className="w-20" />
              <div className="text-neutral-400 text-sm">
                사진을 추가해주세요.
                {state?.fieldErrors.photo}
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
        <Input
          required
          placeholder="제목"
          type="text"
          {...register("title")}
          errors={state?.fieldErrors.title}
        />
        <Input
          type="number"
          required
          placeholder="가격"
          {...register("price")}
          errors={state?.fieldErrors.price}
        />
        <Input
          type="text"
          required
          placeholder="자세한 설명"
          {...register("description")}
          errors={state?.fieldErrors.description}
          // className="h-40 border-neutral-500"
          className="bg-transparent rounded-md w-full h-32 focus:outline-none ring-1 focus:ring-2 ring-neutral-200 focus:ring-main-button border-none placeholder:text-neutral-400 px-2"
        />
        <Button text="작성 완료" />
      </form>
    </div>
  );
}
