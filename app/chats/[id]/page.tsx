import ChatMessagesList from "@/components/chat-messages-list";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { Prisma } from "@prisma/client";
import { unstable_cache as nextCache } from "next/cache";

import { notFound } from "next/navigation";
import { updateMessagesAsRead } from "./action";
import TopBar from "@/components/top-bar";

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

export type InitialChatMessages = Prisma.PromiseReturnType<typeof getMessages>;

export default async function ChatRoom({ params }: { params: { id: string } }) {
  const room = await getRoom(params.id);
  if (!room) {
    return notFound();
  }
  const session = await getSession();
  const initialMessages = await getMessages(params.id, session.id!);
  const user = await getUserProfile();
  if (!user) {
    return notFound();
  }

  return (
    <div className="px-4 py-5">
      <TopBar />
      <ChatMessagesList
        chatRoomId={params.id}
        userId={session.id!}
        usernmae={user.username}
        avatar={user.avatar!}
        initialMessages={initialMessages}
      />
    </div>
  );
}
