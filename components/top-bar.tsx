"use client";

import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopBar() {
  const pathname = usePathname();
  console.log(pathname);
  return (
    <div className="fixed top-0 w-full mx-auto max-w-screen-md flex items-center gap-44 *:text-neutral-600 bg-main-color h-16 ">
      {pathname.includes("chats") ? (
        <Link href="/chat">
          <ChevronLeftIcon className="size-8" />
        </Link>
      ) : (
        <Link href="/">
          <ChevronLeftIcon className="size-8" />
        </Link>
      )}
      <span className="text-2xl text-center font-semibold">
        {pathname === "/create-account"
          ? "회원가입"
          : pathname === "/login"
          ? "로그인"
          : pathname.includes("chats")
          ? "채팅"
          : null}
      </span>
    </div>
  );
}
