"use client";
import { HandThumbUpIcon } from "@heroicons/react/20/solid";
// import { HandThumbUpIcon as OutlineHandThumbUpIcon } from "@heroicons/react/24/outline";
import { useOptimistic } from "react";
import { disfavProduct, favProduct } from "@/app/products/[id]/fav";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

interface FavButtonProps {
  isLiked: boolean;
  productId: number;
}

export default function FavButton({ isLiked, productId }: FavButtonProps) {
  const [state, reducerFn] = useOptimistic({ isLiked }, (previousState) => ({
    isLiked: !previousState.isLiked,
  }));
  const onClick = async () => {
    reducerFn(undefined);
    try {
      if (isLiked) {
        await disfavProduct(productId);
      } else {
        await favProduct(productId);
      }
    } catch (error) {
      reducerFn(undefined);
    }
  };

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-main-button text-sm transition-colors"
    >
      {isLiked ? (
        <HeartSolidIcon className="size-8 text-main-button" />
      ) : (
        <HeartIcon className="size-8" />
      )}
    </button>
  );
}
