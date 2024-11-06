"use client";

import { usePathname } from "next/navigation";
import BackButton from "./back-button";

export default function TopBarContainer({ user }: any) {
  const pathname = usePathname();
  return (
    <div className="w-full mx-auto max-w-screen-md flex items-center justify-center *:text-neutral-600 bg-main-color h-16 ">
      {/* {pathname.includes("chats") ? (
        <Link
          href="/chat"
          className="fixed left-3 text-black hover:cursor-pointer"
        >
          <ChevronLeftIcon className="size-8" />
        </Link>
      ) : (
        <Link href="/" className="fixed left-3 text-black hover:cursor-pointer">
          <ChevronLeftIcon className="size-8" />
        </Link>
      )} */}

      {/* <BackButton /> */}

      <span className="text-2xl font-semibold">
        {pathname === "/life"
          ? "동네생활"
          : pathname === "/live"
          ? "라이브"
          : pathname === "/chat"
          ? "채팅"
          : pathname === "/login"
          ? "로그인"
          : pathname === "/profile"
          ? "프로필"
          : pathname.includes("chats")
          ? "채팅"
          : user.detailAddress}
      </span>
    </div>
  );
}
