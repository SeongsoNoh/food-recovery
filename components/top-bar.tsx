"use client";

import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopBar() {
  const pathname = usePathname();
  return (
    <div className="top-0 w-full mx-auto max-w-screen-md flex items-center gap-40 *:text-neutral-600">
      <Link href="/">
        <ChevronLeftIcon className="size-8" />
      </Link>
      <span className="text-2xl text-center font-semibold">
        {pathname === "/create-account"
          ? "회원가입"
          : pathname === "/login"
          ? "로그인"
          : null}
      </span>
    </div>
  );
}
