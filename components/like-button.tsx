"use client";
import { HandThumbUpIcon } from "@heroicons/react/20/solid";
// import { HandThumbUpIcon as OutlineHandThumbUpIcon } from "@heroicons/react/24/outline";
import { useOptimistic } from "react";
import { dislikePost, likePost } from "@/app/posts/[id]/action";

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  postId: number;
}

export default function LikeButton({
  isLiked,
  likeCount,
  postId,
}: LikeButtonProps) {
  const [state, reducerFn] = useOptimistic(
    { isLiked, likeCount },
    (previousState, payload) => ({
      isLiked: !previousState.isLiked,
      likeCount: previousState.isLiked
        ? previousState.likeCount - 1
        : previousState.likeCount + 1,
    })
  );
  const onClick = async () => {
    reducerFn(undefined);
    if (isLiked) {
      await dislikePost(postId);
    } else {
      await likePost(postId);
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
        <HandThumbUpIcon className="size-4" />
      ) : (
        <HandThumbUpIcon className="size-4" />
      )}
      <span>{state.likeCount}</span>
    </button>
  );
}
