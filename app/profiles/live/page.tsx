import db from "@/lib/db";
import getSession from "@/lib/session";
import Link from "next/link";
import Image from "next/image";
import BackButton from "@/components/back-button";

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

export default async function Live() {
  const session = await getSession();
  const lives = await getMyLive(Number(session.id));
  return (
    <div>
      <BackButton />
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
