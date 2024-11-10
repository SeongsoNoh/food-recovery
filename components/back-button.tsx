"use client";

import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { usePathname, useRouter } from "next/navigation";

export default function BackButton() {
  const pathname = usePathname();
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  return (
    <div className="w-full mx-auto max-w-screen-md flex items-center justify-center *:text-neutral-600 bg-main-color h-16">
      <button onClick={handleBack} className="absolute left-3 text-black">
        <ChevronLeftIcon className="size-8" />
      </button>
      <span className="text-2xl font-semibold">
        {pathname.includes("products")
          ? "상품"
          : pathname.includes("chats")
          ? "채팅"
          : pathname === "/login"
          ? "로그인"
          : pathname === "/create-account"
          ? "회원가입"
          : pathname.includes("posts")
          ? "동네생활"
          : pathname.includes("profiles")
          ? pathname === "/profiles/loved"
            ? "관심 목록"
            : pathname === "/profiles/life"
            ? "동네생활 목록"
            : pathname === "/profiles/live"
            ? "라이브 목록"
            : pathname === "/profiles/sold"
            ? "판매 목록"
            : pathname === "/profiles/bought"
            ? "구매 목록"
            : "프로필"
          : ""}
      </span>
    </div>
  );
}
