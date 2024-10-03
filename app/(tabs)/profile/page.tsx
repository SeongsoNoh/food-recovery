import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  GiftIcon,
  HeartIcon,
  ReceiptPercentIcon,
  RectangleGroupIcon,
} from "@heroicons/react/24/outline";

async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });
    if (user) {
      return user;
    }
  }
  notFound();
}

export default async function Profile() {
  const user = await getUser();
  const logOut = async () => {
    "use server";
    const session = await getSession();
    await session.destroy();
    redirect("/");
  };
  return (
    <div className="py-6 px-3 flex flex-col gap-4">
      <div className="py-5 px-3 rounded-lg bg-white flex flex-col gap-5">
        <div className="flex gap-3 items-center">
          <Image
            src={user.avatar!}
            alt="{message.user.username}"
            width={70}
            height={70}
            className="size-10 rounded-full"
          />
          <div>{user?.username}</div>
        </div>
        <Link
          href={`/products/${user.id}`}
          className="bg-bottom-border-color p-1.5 rounded-md text-black text-center"
        >
          <span>프로필 수정</span>
        </Link>
        <div className="flex flex-col gap-2">
          <h1 className="text-xs">등급</h1>
          <h2>토마토</h2>
          <div className="bg-bottom-border-color p-1.5 rounded-md"></div>
        </div>
      </div>
      <div className="py-7 px-10 rounded-lg bg-white flex gap-8 justify-center text-center">
        <div className="flex flex-col gap-2 items-center justify-center">
          <HeartIcon className="h-6" />
          <h1 className="text-xs">관심목록</h1>
        </div>
        <div className="w-px h-10 bg-gray-300 items-center"></div>
        <div className="flex flex-col gap-2 items-center justify-center">
          <ReceiptPercentIcon className="h-6" />
          <h1 className="text-xs">판매내역</h1>
        </div>
        <div className="w-px h-10 bg-gray-300 items-center"></div>
        <div className="flex flex-col gap-2 items-center justify-center">
          <GiftIcon className="h-6" />
          <h1 className="text-xs">이벤트</h1>
        </div>
      </div>
      <div className="p-5 rounded-lg bg-white flex flex-col gap-2">
        <h1 className="text-xs">나의 활동</h1>
        <Link href={``} className="flex gap-3 items-center text-black">
          <RectangleGroupIcon className="h-6" />
          <span>내 동네생활 글</span>
        </Link>
        <Link href={``} className="flex gap-3 items-center text-black">
          <RectangleGroupIcon className="h-6" />
          <span>구매내역</span>
        </Link>
      </div>
      <form action={logOut}>
        <button className="p-2 rounded-md bg-white text-main-button w-full">
          Log out
        </button>
      </form>
    </div>
  );
}
