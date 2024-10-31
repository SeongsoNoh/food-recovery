"use client";

import db from "@/lib/db";
import Link from "next/link";
import { usePathname } from "next/navigation";

async function getLive() {
  const lives = await db.liveStream.findMany({
    select: {
      id: true,
      title: true,
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
  const pathname = usePathname();
  let lives = [];
  if (pathname === "/profiles/loved") {
    lives = await getMyLive(userId);
  } else {
    lives = await getLive();
  }
  console.log(lives);
  return (
    <div>
      <div className="p-5 flex flex-col gap-2">
        {/* {lives.map((live) => (
          <Link
            key={live.id}
            href={`/streams/${live.id}`}
            className="px-4 py-3 text-black flex  flex-col gap-2  bg-white rounded-lg shadow-md"
          >
            <h2 className="text-black text-lg font-semibold">{live.title}</h2>
          </Link>
        ))} */}
      </div>
    </div>
  );
}
