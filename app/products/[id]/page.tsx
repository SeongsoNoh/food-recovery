import DeleteButton from "@/components/delete-button";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToWon } from "@/lib/utils";
import { HeartIcon } from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}

async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
  console.log(product);
  return product;
}

export default async function ProductDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const product = await getProduct(id);
  if (!product) {
    return notFound();
  }
  const isOwner = await getIsOwner(product.userId);

  const createChatRoom = async () => {
    "use server";
    const session = await getSession();
    const room = await db.chatRoom.create({
      data: {
        users: {
          connect: [
            {
              id: product.userId,
            },
            {
              id: session.id,
            },
          ],
        },
      },
      select: {
        id: true,
      },
    });
    redirect(`/chats/${room.id}`);
  };
  return (
    <div>
      <div className="relative aspect-square border-b border-neutral-300">
        <Image
          fill
          src={product.photo}
          className="object-cover"
          alt={product.title}
        />
      </div>
      <div className="p-5 flex items-center gap-3 border-b border-neutral-300">
        <div className="size-10 overflow-hidden rounded-full">
          {product.user.avatar !== null ? (
            <Image
              src={product.user.avatar}
              width={40}
              height={40}
              alt={product.user.username}
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div>
          <h3>{product.user.username}</h3>
        </div>
        <div>
          <h3>등급(예: 수박게임-블루베리-토마토등)</h3>
        </div>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p className="mt-3">{product.description}</p>
      </div>
      <div className="fixed w-full bottom-0 left-0 py-4 px-5 bg-white flex justify-between items-center border-t border-neutral-300">
        <div className="flex items-center">
          <HeartIcon className="w-7 h-7 stroke-neutral-400" />
          <svg height="50" width="20">
            <line
              x1="10"
              y1="0"
              x2="10"
              y2="50"
              className="stroke-neutral-300"
            />
          </svg>
          <span className="font-semibold text-xl">
            {formatToWon(product.price)}원
          </span>
        </div>
        {isOwner ? (
          <div className="flex gap-2">
            <button className="bg-main-button px-5 py-2.5 rounded-md text-white font-semibold ">
              수정
            </button>

            <DeleteButton productId={id} userId={product.userId} />
          </div>
        ) : (
          <form action={createChatRoom}>
            <button className="bg-main-button px-5 py-2.5 rounded-md text-white font-semibold">
              채팅하기
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
