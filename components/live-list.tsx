"use client";

import db from "@/lib/db";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

async function getMyLive(userId: number) {
  const lives = await db.liveStream.findMany({
    where: {
      userId,
    },
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

interface LiveListProps {
  userId: number;
}

export default async function LiveList({ userId }: LiveListProps) {
  // export default async function LiveList(userId: number) {
  const pathname = usePathname();
  let lives = [];
  if (pathname === "/profiles/loved") {
    lives = await getMyLive(userId);
  } else {
    lives = await getLive();
  }
  // lives = await getLive();
  return (
    <div>
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
    </div>
  );
}
