"use client";
import DeleteProduct from "@/app/products/delete/action";
import { redirect } from "next/navigation";

interface DeleteButtonProps {
  productId: number;
  userId: number;
}

export default function DeleteButton({ productId, userId }: DeleteButtonProps) {
  const onClick = async () => {
    const confirmed = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmed) return;
    try {
      console.log(productId);
      await DeleteProduct({ productId, userId });
      alert("삭제되었습니다.");
    } catch (error) {
      console.error("실패!!!!!!!:", error);
    }
  };
  return (
    <button
      onClick={onClick}
      className="bg-sub-button px-5 py-2.5 rounded-md text-neutral-600 font-semibold"
    >
      삭제
    </button>
  );
}
