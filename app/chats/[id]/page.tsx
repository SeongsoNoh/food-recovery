import ChatMessagesList from "@/components/chat-messages-list";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { Prisma } from "@prisma/client";
import { unstable_cache as nextCache } from "next/cache";

import { notFound } from "next/navigation";
import { updateMessagesAsRead } from "./action";
import TopBar from "@/components/top-bar";
import Image from "next/image";
import { useEffect, useState } from "react";
import ProductStateButton from "@/components/product-state-button";

async function getRoom(id: string) {
  const room = await db.chatRoom.findUnique({
    where: {
      id,
    },
    include: {
      users: {
        select: {
          id: true,
        },
      },
    },
  });
  if (room) {
    const session = await getSession();
    const canSee = Boolean(room.users.find((user) => user.id === session.id!));
    if (!canSee) {
      return null;
    }
  }
  return room;
}

async function getBuyerId(id: string) {
  const room = await db.chatRoom.findUnique({
    where: {
      id,
    },
    include: {
      users: {
        select: {
          id: true,
        },
      },
    },
  });
  const session = await getSession();
  let buyerId = session.id;
  if (room) {
    const buyer = room.users.find((user) => user.id !== session.id!);
    buyerId = buyer?.id;
  }
  return buyerId;
}

async function getMessages(chatRoomId: string, userId: number) {
  //   await db.message.updateMany({
  //     where: {
  //       chatRoomId,
  //       userId: {
  //         not: userId,
  //       },
  //       isRead: false,
  //     },
  //     data: {
  //       isRead: true,
  //     },
  //   });

  await updateMessagesAsRead(chatRoomId, userId);

  const messages = await db.message.findMany({
    where: {
      chatRoomId,
    },
    select: {
      id: true,
      payload: true,
      isRead: true,
      created_at: true,
      userId: true,
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });
  return messages;
}
const getCachedMessages = nextCache(getMessages, ["chat-messages"], {
  tags: ["realtime-chat"],
});

async function getUserProfile() {
  const session = await getSession();
  const user = await db.user.findUnique({
    where: {
      id: session.id!,
    },
    select: {
      username: true,
      avatar: true,
    },
  });
  return user;
}

async function getProduct(productId: number) {
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      title: true,
      photo: true,
      price: true,
      id: true,
      userId: true,
      state: true,
      buyerId: true,
    },
  });
  return product;
}

export type InitialChatMessages = Prisma.PromiseReturnType<typeof getMessages>;

export default async function ChatRoom({ params }: { params: { id: string } }) {
  const room = await getRoom(params.id);

  if (!room) {
    return notFound();
  }
  const session = await getSession();
  const initialMessages = await getMessages(params.id, session.id!);
  const user = await getUserProfile();
  const product = await getProduct(room.productId);
  if (!user) {
    return notFound();
  }

  let buyer;
  if (product?.userId === session.id) {
    buyer = await getBuyerId(params.id);
  }
  return (
    <div className="px-5 min-h-screen">
      <TopBar />
      <div className="flex flex-col gap-3">
        <div className="p-4 rounded-3xl shadow-lg bg-white flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <div className="size-12 overflow-hidden rounded-md">
              <Image
                src={product?.photo! + "/avatar"}
                alt={product?.title!}
                width={50}
                height={50}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-normal">{product?.title}</span>
              <span className="font-semibold">{product?.price}원</span>
            </div>
          </div>
          <ProductStateButton
            product={product}
            sessionUserId={session.id!}
            buyerId={buyer}
          />
        </div>
        <ChatMessagesList
          chatRoomId={params.id}
          userId={session.id!}
          usernmae={user.username}
          avatar={user.avatar!}
          initialMessages={initialMessages}
        />
      </div>
    </div>
  );
}
