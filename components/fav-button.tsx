"use client";
import { HandThumbUpIcon } from "@heroicons/react/20/solid";
// import { HandThumbUpIcon as OutlineHandThumbUpIcon } from "@heroicons/react/24/outline";
import { useOptimistic } from "react";
import { disfavProduct, favProduct } from "@/app/products/[id]/fav";
import { HeartIcon } from "@heroicons/react/24/outline";

interface FavButtonProps {
  isLiked: boolean;
  productId: number;
}

export default function FavButton({ isLiked, productId }: FavButtonProps) {
  const [state, reducerFn] = useOptimistic(
    { isLiked },
    (previousState, payload) => ({
      isLiked: !previousState.isLiked,
    })
  );
  const onClick = async () => {
    reducerFn(undefined);
    if (isLiked) {
      await disfavProduct(productId);
    } else {
      await favProduct(productId);
    }
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 text-black text-sm border border-main-button rounded-full px-3 py-1.5  transition-colors ${
        isLiked
          ? "bg-main-button text-main-color border-main-button"
          : "hover:bg-sub-color"
      }`}
    >
      {state.isLiked ? (
        <HeartIcon className="size-4" />
      ) : (
        <HeartIcon className="size-4" />
      )}
    </button>
  );
}
