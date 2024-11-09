"use client";
import { StarIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import Image from "next/image";
import { Product } from "@prisma/client";
import { addAssessment } from "@/app/products/assessment/[id]/action";

export default function AssessmentButton({
  product,
  user,
}: {
  product: Product & { user: { id: number; username: string } };
  user: { id: number; username: string };
}) {
  const [rating, setRating] = useState(0);
  const handleClick = async (value: number) => {
    setRating(value);
  };
  const clickAction = async () => {
    try {
      await addAssessment(product.id, product.userId, rating);
    } catch (error) {
      console.error("평가 실패!");
    }
  };
  return (
    <div className="px-5">
      <div className="flex flex-col gap-5">
        <div className="flex gap-3 items-center p-4 rounded-3xl shadow-lg bg-white">
          <div className="size-12 overflow-hidden rounded-md">
            <Image
              src={product?.photo! + "/avatar"}
              alt={product?.title!}
              width={50}
              height={50}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-normal">{product?.title}</span>
            <span className="font-semibold">{product?.price}원</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-3xl shadow-lg flex flex-col gap-3">
          <div className="flex flex-col">
            <span>{user.username}님,</span>
            <span>{product.user.username}님과 거래가 어떠셨나요?</span>
          </div>
          <div className="flex gap-2 justify-center p-5">
            {[...Array(5)].map((_, index) => (
              <button
                key={index}
                onClick={() => handleClick(index + 1)}
                style={{
                  color: index < rating ? "gold" : "gray",
                  cursor: "pointer",
                }}
              >
                {index < rating ? (
                  <StarSolidIcon className="size-11" />
                ) : (
                  <StarIcon className="size-11" />
                )}
              </button>
            ))}
          </div>
        </div>
        <button
          className="w-full bg-main-button p-3 rounded-md text-white"
          onClick={clickAction}
        >
          선택완료
        </button>
      </div>
    </div>
  );
}
