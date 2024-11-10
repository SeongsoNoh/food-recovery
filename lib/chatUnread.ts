"use server";

import db from "./db";
import getSession from "./session";

async function getChat(userId: number) {
  const chatRooms = await db.chatRoom.findMany({
    where: {
      product: {
        userId: userId,
      },
    },
  });
  const chatRoomIds = chatRooms.map((chat) => chat.id);
  const chats = await db.message.findMany({
    where: {
      chatRoomId: {
        in: chatRoomIds,
      },
      NOT: {
        userId: userId,
      },
      isRead: false,
    },
  });
  return chats.length;
}

export async function chatUnread() {
  const session = await getSession();
  const chatLength = await getChat(Number(session.id)); // await 추가
  return chatLength;
}
