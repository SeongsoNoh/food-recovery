"use client";

import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BackButton from "./back-button";

export default function TopBar() {
  const pathname = usePathname();
  return (
    <div className="fixed top-0 w-full mx-auto max-w-screen-md flex items-center justify-center *:text-neutral-600 bg-main-color h-16 ">
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
      <BackButton />
      <span className="text-2xl font-semibold">
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
