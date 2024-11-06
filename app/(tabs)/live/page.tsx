import LiveList from "@/components/live-list";
import db from "@/lib/db";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";

async function getLive() {
  const lives = await db.liveStream.findMany({
    select: {
      id: true,
      title: true,
      thumbnail: true,
      created_at: true,
      user: {
        select: {
          username: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });
  return lives;
}

export const metadata = {
  title: "라이브",
};

export default async function Live() {
  const lives = await getLive();
  return (
    <div className="px-5">
      <Link
        href="/streams/add"
        className=" flex gap-2 items-center justify-center border-main-button bg-sub-button rounded-md w-full p-3"
      >
        <PlusCircleIcon className="size-6 text-black" />
        <span className="text-black font-medium">라이브 시작하기</span>
      </Link>
      <div className="p-5 flex flex-col gap-2">
        {lives.map((live) => (
          <Link
            key={live.id}
            href={`/streams/${live.id}`}
            className="px-4 py-3 text-black flex gap-2 items-center bg-white rounded-lg shadow-md"
          >
            <div className="relative size-28 rounded-md overflow-hidden outline outline-1 outline-neutral-200">
              <Image
                fill
                src={`${live.thumbnail}`}
                className="obejct-cover "
                alt="thumbnail"
              />
            </div>
            <h2 className="text-black text-lg font-semibold">{live.title}</h2>
          </Link>
        ))}
      </div>
      {/* <LiveList /> */}
    </div>
  );
}
